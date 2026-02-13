<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\Room;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RoomInventoryPageController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Reservation::class);

        $user = $request->user();
        $propertyId = $user?->property_id;
        $from = $request->input('from')
            ? Carbon::parse($request->input('from'))->startOfDay()
            : now()->startOfDay();
        $days = (int) ($request->input('days', 14) ?? 14);
        $days = in_array($days, [7, 14, 30], true) ? $days : 14;
        $to = $from->copy()->addDays($days - 1);

        $dates = collect(range(0, $days - 1))
            ->map(fn (int $offset) => $from->copy()->addDays($offset)->toDateString());

        $rooms = Room::query()
            ->when($propertyId, fn ($query) => $query->where('property_id', $propertyId))
            ->where('is_active', true)
            ->with('roomType:id,name')
            ->orderBy('number')
            ->get(['id', 'room_type_id', 'number', 'floor', 'status', 'housekeeping_status']);

        $reservations = Reservation::query()
            ->when($propertyId, fn ($query) => $query->where('property_id', $propertyId))
            ->whereIn('status', ['confirmed', 'checked_in'])
            ->whereNotNull('room_id')
            ->where('check_in', '<', $to->copy()->addDay()->toDateString())
            ->where('check_out', '>', $from->toDateString())
            ->with('guest:id,name')
            ->orderBy('check_in')
            ->get(['id', 'room_id', 'guest_id', 'status', 'check_in', 'check_out']);

        return Inertia::render('room-inventory/index', [
            'filters' => [
                'from' => $from->toDateString(),
                'days' => $days,
            ],
            'dates' => $dates,
            'rooms' => $rooms->map(fn (Room $room) => [
                'id' => $room->id,
                'number' => $room->number,
                'floor' => $room->floor,
                'status' => $room->status,
                'housekeeping_status' => $room->housekeeping_status,
                'room_type' => $room->roomType
                    ? [
                        'id' => $room->roomType->id,
                        'name' => $room->roomType->name,
                    ]
                    : null,
            ]),
            'reservations' => $reservations->map(fn (Reservation $reservation) => [
                'id' => $reservation->id,
                'room_id' => $reservation->room_id,
                'status' => $reservation->status,
                'guest_name' => $reservation->guest?->name,
                'check_in' => $reservation->check_in?->toDateString(),
                'check_out' => $reservation->check_out?->toDateString(),
            ]),
        ]);
    }
}
