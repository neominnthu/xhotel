<?php

namespace App\Services;

use App\Models\AvailabilityHold;
use App\Models\CancellationPolicy;
use App\Models\Folio;
use App\Models\Guest;
use App\Models\Reservation;
use App\Models\ReservationStatusLog;
use App\Models\Room;
use App\Models\RoomType;
use App\Models\Stay;
use Carbon\Carbon;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class ReservationService
{
    public function __construct(
        public AuditLogService $auditLogService,
        public RateService $rateService,
        public FolioService $folioService
    )
    {
    }

    public function create(array $data, $actor = null): Reservation
    {
        return DB::transaction(function () use ($data, $actor) {
            $propertyId = $data['property_id'] ?? $actor?->property_id ?? 1;

            $this->assertAvailability($propertyId, $data);

            $guest = Guest::create($data['guest']);

            $reservation = Reservation::create([
                'property_id' => $propertyId,
                'guest_id' => $guest->id,
                'code' => $this->generateCode(),
                'status' => 'confirmed',
                'source' => $data['source'],
                'check_in' => $data['check_in'],
                'check_out' => $data['check_out'],
                'room_type_id' => $data['room_type_id'],
                'room_id' => $data['room_id'] ?? null,
                'adults' => $data['adults'],
                'children' => $data['children'] ?? 0,
                'special_requests' => $data['special_requests'] ?? null,
            ]);

            Stay::create([
                'reservation_id' => $reservation->id,
                'status' => 'expected',
            ]);

            $folio = Folio::create([
                'reservation_id' => $reservation->id,
                'currency' => $data['currency'] ?? 'MMK',
                'total' => 0,
                'balance' => 0,
                'status' => 'open',
            ]);

            // Generate accommodation charges
            $this->rateService->generateFolioCharges($reservation, $folio, $actor);

            if (! empty($data['hold_id'])) {
                $this->consumeHold((int) $data['hold_id'], $reservation, $propertyId);
            }

            $this->recordStatusChange(
                $reservation,
                null,
                'confirmed',
                $actor,
                null,
                ['source' => $data['source']]
            );

            if ($actor) {
                $this->auditLogService->record($actor, 'reservation.created', 'reservation', [
                    'reservation_id' => $reservation->id,
                    'guest_id' => $guest->id,
                    'check_in' => $data['check_in'],
                    'check_out' => $data['check_out'],
                    'room_type_id' => $data['room_type_id'],
                ]);
            }

            return $reservation->load(['guest', 'roomType', 'room']);
        });
    }

    public function update(Reservation $reservation, array $data, $actor = null): Reservation
    {
        $oldData = $reservation->only(['check_in', 'check_out', 'adults', 'children', 'room_id']);

        $reservation->fill($data);
        $reservation->save();

        if ($actor) {
            $this->auditLogService->record($actor, 'reservation.updated', 'reservation', [
                'reservation_id' => $reservation->id,
                'old_data' => $oldData,
                'new_data' => $data,
            ]);
        }

        return $reservation->load(['guest', 'roomType', 'room']);
    }

    public function cancel(Reservation $reservation, array $data, $actor = null): Reservation
    {
        if (in_array($reservation->status, ['canceled', 'checked_out'], true)) {
            throw new HttpResponseException(response()->json([
                'code' => 'RESERVATION_STATUS_INVALID',
                'message' => 'Reservation status does not allow cancel.',
            ], 409));
        }

        $this->applyCancellationPenalty($reservation, $actor, $data['reason'] ?? null);

        $reservation->status = 'canceled';
        $reservation->canceled_reason = $data['reason'] ?? null;
        $reservation->save();

        $this->recordStatusChange(
            $reservation,
            $reservation->getOriginal('status'),
            'canceled',
            $actor,
            $data['reason'] ?? null
        );

        if ($actor) {
            $this->auditLogService->record($actor, 'reservation.canceled', 'reservation', [
                'reservation_id' => $reservation->id,
                'reason' => $data['reason'] ?? null,
            ]);
        }

        return $reservation->load(['guest', 'roomType', 'room']);
    }

    public function cancellationPreview(Reservation $reservation): array
    {
        $policy = $this->resolveCancellationPolicy($reservation);
        $folio = $reservation->folios()->first();
        $currency = $folio?->currency ?? 'MMK';

        if (! $policy || ! $reservation->check_in) {
            return [
                'policy' => null,
                'deadline' => null,
                'applies' => false,
                'amount' => 0,
                'currency' => $currency,
            ];
        }

        $deadline = $this->cancellationDeadline($reservation, $policy);
        $isDue = $deadline && now()->greaterThanOrEqualTo($deadline);
        $amount = $isDue ? $this->calculateCancellationPenalty($policy, $reservation) : 0;

        return [
            'policy' => [
                'id' => $policy->id,
                'name' => $policy->name,
                'deadline_hours' => $policy->deadline_hours,
                'penalty_type' => $policy->penalty_type,
                'penalty_amount' => $policy->penalty_amount,
                'penalty_percent' => $policy->penalty_percent,
            ],
            'deadline' => $deadline?->toDateTimeString(),
            'applies' => $isDue && $amount > 0,
            'amount' => max($amount, 0),
            'currency' => $currency,
        ];
    }

    private function generateCode(): string
    {
        return 'RSV-'.now()->format('Ymd').'-'.Str::upper(Str::random(4));
    }

    private function assertAvailability(int $propertyId, array $data): void
    {
        $roomTypeId = (int) $data['room_type_id'];
        $checkIn = $data['check_in'];
        $checkOut = $data['check_out'];

        $roomType = RoomType::query()->where('id', $roomTypeId)->first();

        if (! $roomType) {
            throw new HttpResponseException(response()->json([
                'code' => 'ROOM_TYPE_NOT_FOUND',
                'message' => 'Room type not found.',
            ], 404));
        }

        if (! empty($data['room_id'])) {
            $room = Room::query()
                ->where('id', (int) $data['room_id'])
                ->where('room_type_id', $roomTypeId)
                ->where('is_active', true)
                ->where('status', 'available')
                ->first();

            if (! $room) {
                throw new HttpResponseException(response()->json([
                    'code' => 'ROOM_NOT_AVAILABLE',
                    'message' => 'Selected room is not available.',
                ], 409));
            }
        }

        $roomInventory = Room::query()
            ->where('room_type_id', $roomTypeId)
            ->where('property_id', $propertyId)
            ->where('is_active', true)
            ->count();

        $bookedRooms = Reservation::query()
            ->where('room_type_id', $roomTypeId)
            ->where('property_id', $propertyId)
            ->whereIn('status', ['confirmed', 'checked_in'])
            ->where(function ($query) use ($checkIn, $checkOut) {
                $query->where('check_in', '<', $checkOut)
                    ->where('check_out', '>', $checkIn);
            })
            ->count();

        $holdsCount = AvailabilityHold::query()
            ->active()
            ->where('room_type_id', $roomTypeId)
            ->where('property_id', $propertyId)
            ->where(function ($query) use ($checkIn, $checkOut) {
                $query->where('check_in', '<', $checkOut)
                    ->where('check_out', '>', $checkIn);
            })
            ->sum('quantity');

        if (! empty($data['hold_id'])) {
            $hold = AvailabilityHold::query()
                ->active()
                ->where('id', (int) $data['hold_id'])
                ->first();

            if ($hold) {
                $holdsCount = max($holdsCount - $hold->quantity, 0);
            }
        }

        $availableCount = $roomInventory + (int) ($roomType->overbooking_limit ?? 0) - $bookedRooms - $holdsCount;

        if ($availableCount < 1) {
            throw new HttpResponseException(response()->json([
                'code' => 'AVAILABILITY_UNAVAILABLE',
                'message' => 'No availability for the selected dates.',
            ], 409));
        }
    }

    private function consumeHold(int $holdId, Reservation $reservation, int $propertyId): void
    {
        $hold = AvailabilityHold::query()
            ->active()
            ->where('id', $holdId)
            ->where('property_id', $propertyId)
            ->lockForUpdate()
            ->first();

        if (! $hold) {
            Log::warning('availability_hold.expired', [
                'hold_id' => $holdId,
                'reservation_id' => $reservation->id,
                'property_id' => $propertyId,
            ]);
            throw new HttpResponseException(response()->json([
                'code' => 'HOLD_NOT_FOUND',
                'message' => 'Availability hold has expired or was not found.',
            ], 409));
        }

        if ((int) $hold->room_type_id !== (int) $reservation->room_type_id) {
            Log::warning('availability_hold.mismatch', [
                'hold_id' => $holdId,
                'reservation_id' => $reservation->id,
                'property_id' => $propertyId,
            ]);
            throw new HttpResponseException(response()->json([
                'code' => 'HOLD_MISMATCH',
                'message' => 'Availability hold does not match reservation room type.',
            ], 409));
        }

        $hold->delete();
    }

    private function applyCancellationPenalty(Reservation $reservation, $actor, ?string $reason): void
    {
        $preview = $this->cancellationPreview($reservation);

        if (! $preview['applies'] || $preview['amount'] <= 0) {
            return;
        }

        $folio = $reservation->folios()->first();

        if (! $folio || ! $actor) {
            return;
        }

        $this->folioService->addCharge($folio, [
            'type' => 'cancellation_penalty',
            'description' => $reason ? "Cancellation penalty: {$reason}" : 'Cancellation penalty',
            'amount' => $preview['amount'],
            'currency' => $folio->currency,
        ], $actor);
    }

    private function resolveCancellationPolicy(Reservation $reservation): ?CancellationPolicy
    {
        return CancellationPolicy::query()
            ->where('property_id', $reservation->property_id)
            ->where('is_active', true)
            ->where(function ($query) use ($reservation) {
                $query->where('room_type_id', $reservation->room_type_id)
                    ->orWhereNull('room_type_id');
            })
            ->orderByRaw('CASE WHEN room_type_id IS NULL THEN 2 ELSE 1 END')
            ->first();
    }

    private function cancellationDeadline(Reservation $reservation, CancellationPolicy $policy): ?Carbon
    {
        if (! $reservation->check_in) {
            return null;
        }

        return Carbon::parse($reservation->check_in)->subHours($policy->deadline_hours);
    }

    private function calculateCancellationPenalty(CancellationPolicy $policy, Reservation $reservation): int
    {
        if ($policy->penalty_type === 'flat') {
            return (int) $policy->penalty_amount;
        }

        $calculation = $this->rateService->calculateRate($reservation);

        if ($policy->penalty_type === 'percent') {
            $percent = max(min((int) $policy->penalty_percent, 100), 0);

            return (int) round($calculation['subtotal'] * $percent / 100);
        }

        if ($policy->penalty_type === 'first_night') {
            if ($calculation['nights'] === 0) {
                return 0;
            }

            return (int) round($calculation['subtotal'] / $calculation['nights']);
        }

        return 0;
    }

    private function recordStatusChange(
        Reservation $reservation,
        ?string $from,
        string $to,
        $actor,
        ?string $reason = null,
        array $metadata = []
    ): void {
        ReservationStatusLog::create([
            'reservation_id' => $reservation->id,
            'status_from' => $from,
            'status_to' => $to,
            'changed_at' => now(),
            'changed_by' => $actor?->id,
            'reason' => $reason,
            'metadata' => $metadata,
        ]);
    }
}
