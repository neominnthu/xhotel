<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\FrontDesk\AssignRoomRequest;
use App\Http\Requests\FrontDesk\AvailableRoomsRequest;
use App\Http\Requests\FrontDesk\SearchGuestsRequest;
use App\Http\Requests\Stays\CheckInRequest;
use App\Http\Requests\Stays\CheckOutRequest;
use App\Models\Guest;
use App\Models\Reservation;
use App\Models\Room;
use App\Models\Stay;
use App\Services\FrontDeskService;
use App\Services\StayService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class FrontDeskController extends Controller
{
    public function __construct(
        private FrontDeskService $frontDeskService
    ) {}

    /**
     * Get front desk dashboard data.
     */
    public function dashboard(Request $request): JsonResponse
    {
        $expectedArrivals = $this->frontDeskService->getExpectedArrivals();
        $expectedDepartures = $this->frontDeskService->getExpectedDepartures();
        $inHouseGuests = $this->frontDeskService->getInHouseGuests();

        // Get room status summary
        $roomSummary = Room::selectRaw('status as room_status, housekeeping_status, COUNT(*) as count')
                  ->groupBy('status', 'housekeeping_status')
                          ->get()
                          ->groupBy('room_status');

        return response()->json([
            'expected_arrivals' => $expectedArrivals->map(function ($stay) {
                return [
                    'id' => $stay->id,
                    'reservation_id' => $stay->reservation_id,
                    'guest_name' => $stay->primaryGuest?->full_name ?? $stay->reservation->guest?->name,
                    'room_number' => $stay->assignedRoom?->number ?? 'Unassigned',
                    'check_in_date' => $stay->reservation->check_in,
                    'check_out_date' => $stay->reservation->check_out,
                    'status' => $stay->status,
                ];
            }),
            'expected_departures' => $expectedDepartures->map(function ($stay) {
                return [
                    'id' => $stay->id,
                    'reservation_id' => $stay->reservation_id,
                    'guest_name' => $stay->primaryGuest?->full_name ?? $stay->reservation->guest?->name,
                    'room_number' => $stay->assignedRoom?->number,
                    'check_out_date' => $stay->reservation->check_out,
                    'status' => $stay->status,
                ];
            }),
            'in_house_guests' => $inHouseGuests->map(function ($stay) {
                return [
                    'id' => $stay->id,
                    'reservation_id' => $stay->reservation_id,
                    'guest_name' => $stay->primaryGuest?->full_name ?? $stay->reservation->guest?->name,
                    'room_number' => $stay->assignedRoom?->number,
                    'check_in_date' => $stay->actual_check_in,
                    'check_out_date' => $stay->reservation->check_out,
                    'total_guests' => $stay->total_guests,
                ];
            }),
            'room_summary' => $roomSummary,
        ]);
    }

    /**
     * Check in a guest.
     */
    public function checkIn(
        CheckInRequest $request,
        Reservation $reservation,
        StayService $stayService
    ): JsonResponse
    {
        $this->authorize('update', $reservation);

        $stay = $reservation->stay ?? Stay::create([
            'reservation_id' => $reservation->id,
            'status' => 'expected',
        ]);

        $stay = $stayService->checkIn($stay, $request->validated(), $request->user());

        return response()->json([
            'message' => 'Guest checked in successfully',
            'stay' => $stay->load(['primaryGuest', 'assignedRoom', 'reservation']),
        ], 201);
    }

    /**
     * Check out a guest.
     */
    public function checkOut(
        CheckOutRequest $request,
        Stay $stay,
        StayService $stayService
    ): JsonResponse
    {
        $this->authorize('update', $stay->reservation);

        $stay = $stayService->checkOut($stay, $request->validated(), $request->user());

        return response()->json([
            'message' => 'Guest checked out successfully',
            'stay' => $stay->load(['primaryGuest', 'assignedRoom', 'reservation']),
        ]);
    }

    /**
     * Search for guests.
     */
    public function searchGuests(SearchGuestsRequest $request): JsonResponse
    {
        $guests = $this->frontDeskService->searchGuests($request->query('query'));

        return response()->json([
            'guests' => $guests->map(function ($guest) {
                return [
                    'id' => $guest->id,
                    'full_name' => $guest->full_name,
                    'email' => $guest->email,
                    'phone' => $guest->phone,
                    'formatted_phone' => $guest->formatted_phone,
                    'nationality' => $guest->nationality,
                    'passport_number' => $guest->passport_number,
                    'vip_status' => $guest->vip_status,
                    'is_blacklisted' => $guest->is_blacklisted,
                    'last_visit_at' => $guest->last_visit_at,
                    'total_stays' => $guest->total_stays,
                    'total_spent' => $guest->total_spent,
                ];
            }),
        ]);
    }

    /**
     * Get guest details.
     */
    public function getGuest(Guest $guest): JsonResponse
    {
        return response()->json([
            'guest' => array_merge($guest->toArray(), [
                'full_name' => $guest->full_name,
                'formatted_phone' => $guest->formatted_phone,
                'is_vip' => $guest->isVip(),
                'is_blacklisted' => $guest->isBlacklisted(),
            ]),
            'recent_stays' => $guest->stays()
                ->with(['reservation', 'assignedRoom'])
                ->latest('created_at')
                ->limit(5)
                ->get()
                ->map(function ($stay) {
                    return [
                        'id' => $stay->id,
                        'reservation_id' => $stay->reservation_id,
                        'room_number' => $stay->assignedRoom?->number,
                        'check_in_date' => $stay->reservation->check_in,
                        'check_out_date' => $stay->reservation->check_out,
                        'status' => $stay->status,
                        'actual_check_in' => $stay->actual_check_in,
                        'actual_check_out' => $stay->actual_check_out,
                    ];
                }),
        ]);
    }

    /**
     * Assign a room to a stay.
     */
    public function assignRoom(AssignRoomRequest $request, Stay $stay): JsonResponse
    {
        $this->authorize('update', $stay->reservation);

        try {
            $stay = $this->frontDeskService->assignRoom($stay, $request->room_id);

            return response()->json([
                'message' => 'Room assigned successfully',
                'stay' => $stay->load(['assignedRoom', 'reservation']),
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Room assignment failed',
                'errors' => $e->errors(),
            ], 422);
        }
    }

    /**
     * Get available rooms for a date range.
     */
    public function getAvailableRooms(AvailableRoomsRequest $request): JsonResponse
    {
        $query = Room::where('is_active', true);

        // Filter by room type if specified
        if ($request->room_type_id) {
            $query->where('room_type_id', $request->room_type_id);
        }

        // Get rooms not occupied during the date range
        $checkIn = $request->check_in_date;
        $checkOut = $request->check_out_date;

        $occupiedRoomIds = Stay::where('status', '!=', 'checked_out')
            ->whereHas('reservation', function ($reservationQuery) use ($checkIn, $checkOut) {
                $reservationQuery->where('check_in', '<', $checkOut)
                    ->where('check_out', '>', $checkIn);
            })
            ->pluck('assigned_room_id')
            ->filter();

        $query->whereNotIn('id', $occupiedRoomIds);

        $availableRooms = $query->with('roomType')->get();

        return response()->json([
            'available_rooms' => $availableRooms->map(function ($room) {
                return [
                    'id' => $room->id,
                    'number' => $room->number,
                    'room_type' => $room->roomType?->name,
                    'floor' => $room->floor,
                    'room_status' => $room->status,
                    'housekeeping_status' => $room->housekeeping_status,
                ];
            }),
        ]);
    }
}
