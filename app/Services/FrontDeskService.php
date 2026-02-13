<?php

namespace App\Services;

use App\Models\Folio;
use App\Models\Guest;
use App\Models\Reservation;
use App\Models\Room;
use App\Models\RoomStatusLog;
use App\Models\Stay;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Validation\ValidationException;

class FrontDeskService
{
    public function __construct(
        public StayService $stayService,
        public AuditLogService $auditLogService
    ) {}

    /**
     * Check in a guest for a reservation.
     */
    public function checkIn(Reservation $reservation, array $checkInData, User $user): Stay
    {
        $stay = $reservation->stay ?? $this->createStay($reservation);

        return $this->stayService->checkIn($stay, $checkInData, $user);
    }

    /**
     * Check out a guest.
     */
    public function checkOut(Stay $stay, array $checkOutData, User $user): Stay
    {
        return $this->stayService->checkOut($stay, $checkOutData, $user);
    }

    /**
     * Assign a room to a stay.
     */
    public function assignRoom(Stay $stay, int $roomId): Stay
    {
        $room = Room::findOrFail($roomId);

        if ($room->status !== 'available') {
            throw ValidationException::withMessages([
                'room_id' => ['Room is not available for assignment.'],
            ]);
        }

        if (! $this->isRoomAvailable($room, $stay->reservation->check_in, $stay->reservation->check_out)) {
            throw ValidationException::withMessages([
                'room_id' => ['Room is not available for the selected dates.'],
            ]);
        }

        $previousRoom = $stay->assignedRoom;

        $assignments = $stay->room_assignments ?? [];
        $assignments[] = [
            'room_id' => $roomId,
            'assigned_at' => now()->toISOString(),
            'assigned_by' => auth()->id(),
        ];

        $stay->update([
            'assigned_room_id' => $roomId,
            'room_assignments' => $assignments,
        ]);

        if ($stay->status === 'checked_in') {
            $this->updateRoomStatusOnMove($previousRoom, $room);
        }

        $stay->reservation()->update([
            'room_id' => $roomId,
        ]);

        if ($actor = auth()->user()) {
            $this->auditLogService->record($actor, 'stay.room.assigned', 'stay', [
                'stay_id' => $stay->id,
                'reservation_id' => $stay->reservation_id,
                'from_room_id' => $previousRoom?->id,
                'to_room_id' => $room->id,
            ]);
        }

        return $stay->fresh();
    }

    /**
     * Find or create a guest.
     */
    public function findOrCreateGuest(array $guestData): Guest
    {
        $fullName = trim(($guestData['first_name'] ?? '').' '.($guestData['last_name'] ?? ''));
        $email = $guestData['email'] ?? null;
        $phone = $guestData['phone'] ?? null;

        $guest = null;

        if ($email || $phone) {
            $guest = Guest::query()
                ->when($email, fn ($query) => $query->where('email', $email))
                ->when($phone, fn ($query) => $query->orWhere('phone', $phone))
                ->first();
        }

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

    /**
     * Search for guests.
     */
    public function searchGuests(string $query): Collection
    {
        return Guest::search($query)
            ->orderBy('last_visit_at', 'desc')
            ->limit(20)
            ->get();
    }

    /**
     * Get expected arrivals for today.
     */
    public function getExpectedArrivals(): Collection
    {
        return Stay::with(['reservation', 'primaryGuest'])
            ->expectedToday()
            ->orderBy('created_at')
            ->get();
    }

    /**
     * Get expected departures for today.
     */
    public function getExpectedDepartures(): Collection
    {
        return Stay::with(['reservation', 'primaryGuest', 'assignedRoom'])
            ->departingToday()
            ->orderBy('created_at')
            ->get();
    }

    /**
     * Get current in-house guests.
     */
    public function getInHouseGuests(): Collection
    {
        return Stay::with(['reservation', 'primaryGuest', 'assignedRoom'])
            ->checkedIn()
            ->orderBy('actual_check_in')
            ->get();
    }

    /**
     * Check if a room is available for the given dates.
     */
    private function isRoomAvailable(Room $room, string $checkIn, string $checkOut): bool
    {
        return ! Stay::where('assigned_room_id', $room->id)
            ->where('status', '!=', 'checked_out')
            ->whereHas('reservation', function ($query) use ($checkIn, $checkOut) {
                $query->where('check_in', '<', $checkOut)
                    ->where('check_out', '>', $checkIn);
            })
            ->exists();
    }

    private function updateRoomStatusOnMove(?Room $fromRoom, Room $toRoom): void
    {
        if ($fromRoom && $fromRoom->id !== $toRoom->id) {
            $fromStatus = $fromRoom->status;
            if ($fromStatus !== 'available') {
                $fromRoom->update([
                    'status' => 'available',
                    'housekeeping_status' => 'dirty',
                ]);

                RoomStatusLog::create([
                    'room_id' => $fromRoom->id,
                    'from_status' => $fromStatus,
                    'to_status' => 'available',
                    'changed_by' => auth()->id(),
                    'changed_at' => now(),
                ]);
            }
        }

        $toStatus = $toRoom->status;
        if ($toStatus !== 'occupied') {
            $toRoom->update([
                'status' => 'occupied',
                'housekeeping_status' => $toRoom->housekeeping_status ?? 'dirty',
            ]);

            RoomStatusLog::create([
                'room_id' => $toRoom->id,
                'from_status' => $toStatus,
                'to_status' => 'occupied',
                'changed_by' => auth()->id(),
                'changed_at' => now(),
            ]);
        }
    }

    /**
     * Create a stay record for a reservation.
     */
    private function createStay(Reservation $reservation): Stay
    {
        return Stay::create([
            'reservation_id' => $reservation->id,
            'status' => 'expected',
        ]);
    }

    /**
     * Create a folio for the stay.
     */
    private function createStayFolio(Stay $stay, Guest $guest): Folio
    {
        return Folio::create([
            'reservation_id' => $stay->reservation_id,
            'currency' => $stay->reservation->property?->default_currency ?? 'MMK',
            'total' => 0,
            'balance' => 0,
            'status' => 'open',
        ]);
    }

    /**
     * Finalize folio with final charges.
     */
    private function finalizeFolio(Folio $folio): void
    {
        $totalCharges = $folio->charges()->sum('amount');
        $totalPayments = $folio->payments()->sum('amount');

        $folio->update([
            'total' => $totalCharges,
            'balance' => $totalCharges - $totalPayments,
            'closed_at' => now(),
        ]);
    }
}
