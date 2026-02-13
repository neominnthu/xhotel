<?php

namespace App\Http\Controllers\FrontDesk;

use App\Http\Controllers\Controller;
use App\Services\FrontDeskService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FrontDeskPageController extends Controller
{
    public function __construct(
        private FrontDeskService $frontDeskService
    ) {}

    public function index(Request $request): Response
    {
        $expectedArrivals = $this->frontDeskService->getExpectedArrivals();
        $expectedDepartures = $this->frontDeskService->getExpectedDepartures();
        $inHouseGuests = $this->frontDeskService->getInHouseGuests();

        return Inertia::render('front-desk/index', [
            'expectedArrivals' => $expectedArrivals->map(function ($stay) {
                return [
                    'id' => $stay->id,
                    'stay_id' => $stay->id,
                    'reservation_id' => $stay->reservation_id,
                    'guest_name' => $stay->primaryGuest?->full_name ?? $stay->reservation->guest?->name,
                    'room_type' => $stay->reservation->roomType->name,
                    'check_in' => $stay->reservation->check_in,
                    'check_out' => $stay->reservation->check_out,
                    'status' => $stay->status,
                    'room_number' => $stay->assignedRoom?->number ?? 'Unassigned',
                    'folio_balance' => $stay->folios->first()?->balance ?? 0,
                ];
            }),
            'inHouseGuests' => $inHouseGuests->map(function ($stay) {
                return [
                    'id' => $stay->id,
                    'stay_id' => $stay->id,
                    'reservation_id' => $stay->reservation_id,
                    'guest_name' => $stay->primaryGuest?->full_name ?? $stay->reservation->guest?->name,
                    'room_number' => $stay->assignedRoom?->number,
                    'room_type' => $stay->reservation->roomType->name,
                    'room_type_id' => $stay->reservation->room_type_id,
                    'reservation_check_in' => $stay->reservation->check_in,
                    'check_in' => $stay->actual_check_in?->format('M j, Y H:i'),
                    'check_out' => $stay->reservation->check_out,
                    'folio_balance' => $stay->folios->first()?->balance ?? 0,
                    'total_guests' => $stay->total_guests,
                ];
            }),
            'expectedDepartures' => $expectedDepartures->map(function ($stay) {
                return [
                    'id' => $stay->id,
                    'stay_id' => $stay->id,
                    'reservation_id' => $stay->reservation_id,
                    'guest_name' => $stay->primaryGuest?->full_name ?? $stay->reservation->guest?->name,
                    'room_number' => $stay->assignedRoom?->number,
                    'room_type' => $stay->reservation->roomType->name,
                    'check_out' => $stay->reservation->check_out,
                    'folio_balance' => $stay->folios->first()?->balance ?? 0,
                ];
            }),
        ]);
    }
}
