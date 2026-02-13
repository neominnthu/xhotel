<?php

namespace App\Services;

use App\Models\Charge;
use App\Models\Folio;
use App\Models\Guest;
use App\Models\Payment;
use App\Models\ReservationStatusLog;
use App\Models\Room;
use App\Models\Stay;
use App\Models\User;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\DB;

class StayService
{
    public function __construct(public AuditLogService $auditLogService)
    {
    }

    public function checkIn(Stay $stay, array $data, ?User $actor = null): Stay
    {
        if ($stay->status !== 'expected') {
            throw new HttpResponseException(response()->json([
                'code' => 'STAY_STATUS_INVALID',
                'message' => 'Stay is not eligible for check-in.',
            ], 409));
        }
        $roomId = $data['room_id'] ?? $stay->assigned_room_id;

        if (! $roomId) {
            throw new HttpResponseException(response()->json([
                'code' => 'ROOM_REQUIRED',
                'message' => 'Room assignment is required for check-in.',
            ], 422));
        }

        $room = Room::findOrFail($roomId);

        if ($room->status !== 'available') {
            throw new HttpResponseException(response()->json([
                'code' => 'ROOM_STATUS_INVALID',
                'message' => 'Room is not available for check-in.',
            ], 409));
        }

        return DB::transaction(function () use ($stay, $data, $room, $actor) {
            $guest = $this->resolveGuest($data['guest'] ?? null);

            $stay->fill([
                'status' => 'checked_in',
                'assigned_room_id' => $room->id,
                'actual_check_in' => now(),
                'checked_in_by' => $actor?->id,
                'checked_in_at' => now(),
                'check_in_notes' => $data['notes'] ?? null,
                'adult_count' => $data['adult_count'] ?? $stay->adult_count ?? 1,
                'child_count' => $data['child_count'] ?? $stay->child_count ?? 0,
                'id_document_type' => $data['id_document_type'] ?? null,
                'id_document_number' => $data['id_document_number'] ?? null,
                'id_document_issued_by' => $data['id_document_issued_by'] ?? null,
                'id_document_expiry' => $data['id_document_expiry'] ?? null,
                'security_deposit_amount' => $data['security_deposit_amount'] ?? ($data['deposit']['amount'] ?? 0),
                'security_deposit_currency' => $data['security_deposit_currency'] ?? ($data['deposit']['currency'] ?? 'MMK'),
                'security_deposit_status' => ($data['security_deposit_amount'] ?? ($data['deposit']['amount'] ?? 0)) > 0
                    ? 'collected'
                    : 'pending',
                'key_card_number' => $data['key_card_number'] ?? null,
                'key_card_issued_at' => ! empty($data['key_card_number']) ? now() : null,
                'special_requests' => $data['special_requests'] ?? null,
                'guest_preferences' => $data['guest_preferences'] ?? null,
                'primary_guest_id' => $guest?->id,
            ]);
            $stay->save();

            if ($guest) {
                $guest->update([
                    'last_visit_at' => now(),
                    'total_stays' => ($guest->total_stays ?? 0) + 1,
                ]);
            }

            $previousStatus = $stay->reservation->status;

            $stay->reservation->update([
                'status' => 'checked_in',
                'room_id' => $room->id,
            ]);

            $this->recordStatusChange($stay->reservation, $previousStatus, 'checked_in');

            $room->update([
                'status' => 'occupied',
                'housekeeping_status' => 'dirty',
            ]);

            $folio = $stay->reservation->folios()->first();

            if (! $folio) {
                throw new HttpResponseException(response()->json([
                    'code' => 'FOLIO_NOT_FOUND',
                    'message' => 'Folio not found for stay.',
                ], 404));
            }

            $depositAmount = (int) ($data['security_deposit_amount'] ?? ($data['deposit']['amount'] ?? 0));

            if ($depositAmount > 0) {
                $depositCurrency = $data['security_deposit_currency']
                    ?? ($data['deposit']['currency'] ?? $folio->currency);

                $charge = Charge::create([
                    'folio_id' => $folio->id,
                    'type' => 'deposit',
                    'amount' => $depositAmount,
                    'currency' => $depositCurrency,
                    'tax_amount' => 0,
                    'description' => 'Check-in deposit',
                    'posted_at' => now(),
                    'created_by' => $actor?->id,
                ]);

                $folio->increment('total', $depositAmount);
                $folio->increment('balance', $depositAmount);

                if ($actor) {
                    $this->auditLogService->record($actor, 'folio.deposit.created', 'folio', [
                        'folio_id' => $folio->id,
                        'charge_id' => $charge->id,
                        'amount' => $depositAmount,
                        'currency' => $depositCurrency,
                    ]);
                }
            }

            return $stay->fresh();
        });
    }

    public function checkOut(Stay $stay, array $data, ?User $actor = null): Stay
    {
        if ($stay->status !== 'checked_in') {
            throw new HttpResponseException(response()->json([
                'code' => 'STAY_STATUS_INVALID',
                'message' => 'Stay is not eligible for check-out.',
            ], 409));
        }

        return DB::transaction(function () use ($stay, $data, $actor) {
            $folio = $stay->reservation->folios()->first();

            if (! $folio) {
                throw new HttpResponseException(response()->json([
                    'code' => 'FOLIO_NOT_FOUND',
                    'message' => 'Folio not found for stay.',
                ], 404));
            }

            $paymentData = $data['payment'] ?? null;

            if ($paymentData) {
                $paymentAmount = (int) $paymentData['amount'];
                $paymentCurrency = $paymentData['currency'] ?? $folio->currency;

                Payment::create([
                    'folio_id' => $folio->id,
                    'method' => $paymentData['method'],
                    'amount' => $paymentAmount,
                    'currency' => $paymentCurrency,
                    'exchange_rate' => $paymentData['exchange_rate'] ?? 1,
                    'reference' => $paymentData['reference'] ?? null,
                    'received_at' => now(),
                    'created_by' => $actor?->id,
                ]);

                $folio->decrement('balance', $paymentAmount);

                if ($actor) {
                    $this->auditLogService->record($actor, 'folio.checkout.payment', 'folio', [
                        'folio_id' => $folio->id,
                        'amount' => $paymentAmount,
                        'currency' => $paymentCurrency,
                    ]);
                }
            }

            if ($folio->balance > 0) {
                throw new HttpResponseException(response()->json([
                    'code' => 'FOLIO_BALANCE_MISMATCH',
                    'message' => 'Folio balance must be zero to check out.',
                ], 409));
            }

            $stay->fill([
                'status' => 'checked_out',
                'actual_check_out' => now(),
                'checked_out_by' => $actor?->id,
                'checked_out_at' => now(),
                'check_out_notes' => $data['notes'] ?? null,
                'key_card_returned_at' => ! empty($data['key_returned']) ? now() : null,
                'security_deposit_status' => ! empty($data['refund_deposit'])
                    && $stay->security_deposit_status === 'collected'
                        ? 'refunded'
                        : $stay->security_deposit_status,
            ]);
            $stay->save();

            $previousStatus = $stay->reservation->status;

            $stay->reservation->update(['status' => 'checked_out']);

            $this->recordStatusChange($stay->reservation, $previousStatus, 'checked_out');

            $room = $stay->reservation->room;
            if ($room) {
                $room->update([
                    'status' => 'available',
                    'housekeeping_status' => 'dirty',
                ]);
            }

            $folio->update([
                'status' => 'closed',
                'closed_at' => now(),
            ]);

            return $stay->fresh();
        });
    }

    private function resolveGuest(?array $guestData): ?Guest
    {
        if (! $guestData) {
            return null;
        }

        $fullName = trim(($guestData['first_name'] ?? '').' '.($guestData['last_name'] ?? ''));
        $email = $guestData['email'] ?? null;
        $phone = $guestData['phone'] ?? null;

        $query = Guest::query();

        if ($email) {
            $query->where('email', $email);
        }

        if ($phone) {
            $query->orWhere('phone', $phone);
        }

        $guest = $email || $phone ? $query->first() : null;

        if ($guest) {
            $guest->update(array_filter([
                'name' => $fullName !== '' ? $fullName : $guest->name,
                'email' => $email ?? $guest->email,
                'phone' => $phone ?? $guest->phone,
                'phone_country_code' => $guestData['phone_country_code'] ?? $guest->phone_country_code,
                'date_of_birth' => $guestData['date_of_birth'] ?? $guest->date_of_birth,
                'nationality' => $guestData['nationality'] ?? $guest->nationality,
                'passport_number' => $guestData['passport_number'] ?? $guest->passport_number,
                'id_card_number' => $guestData['id_card_number'] ?? $guest->id_card_number,
                'address' => $guestData['address'] ?? $guest->address,
                'city' => $guestData['city'] ?? $guest->city,
                'country' => $guestData['country'] ?? $guest->country,
            ]));

            return $guest;
        }

        return Guest::create([
            'name' => $fullName !== '' ? $fullName : 'Guest',
            'email' => $email,
            'phone' => $phone,
            'phone_country_code' => $guestData['phone_country_code'] ?? '95',
            'date_of_birth' => $guestData['date_of_birth'] ?? null,
            'nationality' => $guestData['nationality'] ?? null,
            'passport_number' => $guestData['passport_number'] ?? null,
            'id_card_number' => $guestData['id_card_number'] ?? null,
            'address' => $guestData['address'] ?? null,
            'city' => $guestData['city'] ?? null,
            'country' => $guestData['country'] ?? null,
            'total_stays' => 1,
        ]);
    }

    private function recordStatusChange(\App\Models\Reservation $reservation, ?string $from, string $to): void
    {
        ReservationStatusLog::create([
            'reservation_id' => $reservation->id,
            'status_from' => $from,
            'status_to' => $to,
            'changed_at' => now(),
            'changed_by' => auth()->id(),
        ]);
    }
}
