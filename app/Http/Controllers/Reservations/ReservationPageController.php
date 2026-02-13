<?php

namespace App\Http\Controllers\Reservations;

use App\Http\Controllers\Controller;
use App\Http\Requests\Reservations\CancelReservationRequest;
use App\Http\Requests\Reservations\StoreReservationRequest;
use App\Http\Requests\Reservations\UpdateReservationRequest;
use App\Models\Reservation;
use App\Services\ReservationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;

class ReservationPageController extends Controller
{
    public function store(
        StoreReservationRequest $request,
        ReservationService $service
    ): RedirectResponse {
        Gate::authorize('create', Reservation::class);

        $reservation = $service->create($request->validated(), $request->user());

        return redirect()->route('reservations.show', $reservation);
    }

    public function update(
        UpdateReservationRequest $request,
        Reservation $reservation,
        ReservationService $service
    ): RedirectResponse {
        Gate::authorize('update', $reservation);

        $reservation = $service->update($reservation, $request->validated(), $request->user());

        return redirect()->route('reservations.show', $reservation);
    }

    public function cancel(
        CancelReservationRequest $request,
        Reservation $reservation,
        ReservationService $service
    ): RedirectResponse {
        Gate::authorize('cancel', $reservation);

        $reservation = $service->cancel($reservation, $request->validated(), $request->user());

        return redirect()->route('reservations.show', $reservation);
    }
}
