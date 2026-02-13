<?php

namespace App\Http\Controllers\FrontDesk;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use App\Models\Room;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CheckInPageController extends Controller
{
    public function show(Reservation $reservation)
    {
        $this->authorize('update', $reservation);

        // Ensure the reservation is eligible for check-in
        if (!in_array($reservation->status, ['confirmed', 'pending'])) {
            abort(403, 'Reservation is not eligible for check-in');
        }

        $reservation->load([
            'guest',
            'roomType',
            'room',
            'stays',
            'folios.charges',
            'folios.payments'
        ]);

        // Get available rooms for this room type
        $availableRooms = Room::query()
            ->where('room_type_id', $reservation->room_type_id)
            ->where('is_active', true)
            ->where('status', 'available')
            ->orderBy('number')
            ->get();

        return Inertia::render('front-desk/check-in/show', [
            'reservation' => [
                'id' => $reservation->id,
                'code' => $reservation->code,
                'status' => $reservation->status,
                'check_in' => $reservation->check_in->toDateString(),
                'check_out' => $reservation->check_out->toDateString(),
                'guests' => $reservation->guests,
                'special_requests' => $reservation->special_requests,
                'guest' => $reservation->guest ? [
                    'id' => $reservation->guest->id,
                    'name' => $reservation->guest->name,
                    'email' => $reservation->guest->email,
                    'phone' => $reservation->guest->phone,
                    'identification_type' => $reservation->guest->identification_type,
                    'identification_number' => $reservation->guest->identification_number,
                    'address' => $reservation->guest->address,
                ] : null,
                'room_type' => $reservation->roomType ? [
                    'id' => $reservation->roomType->id,
                    'name' => $reservation->roomType->name,
                    'capacity' => $reservation->roomType->capacity,
                ] : null,
                'assigned_room' => $reservation->room ? [
                    'id' => $reservation->room->id,
                    'number' => $reservation->room->number,
                    'status' => $reservation->room->status,
                ] : null,
                'folio' => $reservation->folios->first() ? [
                    'id' => $reservation->folios->first()->id,
                    'balance' => $reservation->folios->first()->balance,
                    'total' => $reservation->folios->first()->total,
                    'charges' => $reservation->folios->first()->charges->map(fn($charge) => [
                        'id' => $charge->id,
                        'type' => $charge->type,
                        'description' => $charge->description,
                        'amount' => $charge->amount,
                        'posted_at' => $charge->posted_at?->toDateTimeString(),
                    ]),
                ] : null,
            ],
            'availableRooms' => $availableRooms->map(fn($room) => [
                'id' => $room->id,
                'number' => $room->number,
                'status' => $room->status,
                'housekeeping_status' => $room->housekeeping_status,
            ]),
        ]);
    }
}
