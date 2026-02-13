<?php

namespace App\Http\Controllers\FrontDesk;

use App\Http\Controllers\Controller;
use App\Models\Stay;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CheckOutPageController extends Controller
{
    public function show(Stay $stay)
    {
        $this->authorize('update', $stay->reservation);

        // Ensure the stay is checked in
        if ($stay->status !== 'checked_in') {
            abort(403, 'Stay is not eligible for check-out');
        }

        $stay->load([
            'reservation.guest',
            'reservation.room',
            'reservation.roomType',
            'reservation.folios.charges',
            'reservation.folios.payments'
        ]);

        $folio = $stay->reservation->folios->first();

        return Inertia::render('front-desk/check-out/show', [
            'stay' => [
                'id' => $stay->id,
                'status' => $stay->status,
                'actual_check_in' => $stay->actual_check_in?->toDateTimeString(),
                'reservation' => [
                    'id' => $stay->reservation->id,
                    'code' => $stay->reservation->code,
                    'check_in' => $stay->reservation->check_in->toDateString(),
                    'check_out' => $stay->reservation->check_out->toDateString(),
                    'guest' => $stay->reservation->guest ? [
                        'id' => $stay->reservation->guest->id,
                        'name' => $stay->reservation->guest->name,
                        'email' => $stay->reservation->guest->email,
                        'phone' => $stay->reservation->guest->phone,
                    ] : null,
                    'room' => $stay->reservation->room ? [
                        'id' => $stay->reservation->room->id,
                        'number' => $stay->reservation->room->number,
                    ] : null,
                    'room_type' => $stay->reservation->roomType ? [
                        'name' => $stay->reservation->roomType->name,
                    ] : null,
                ],
            ],
            'folio' => $folio ? [
                'id' => $folio->id,
                'balance' => $folio->balance,
                'total' => $folio->total,
                'charges' => $folio->charges->map(fn($charge) => [
                    'id' => $charge->id,
                    'type' => $charge->type,
                    'description' => $charge->description,
                    'amount' => $charge->amount,
                    'currency' => $charge->currency,
                    'posted_at' => $charge->posted_at?->toDateTimeString(),
                ]),
                'payments' => $folio->payments->map(fn($payment) => [
                    'id' => $payment->id,
                    'method' => $payment->method,
                    'amount' => $payment->amount,
                    'currency' => $payment->currency,
                    'reference' => $payment->reference,
                    'received_at' => $payment->received_at?->toDateTimeString(),
                ]),
            ] : null,
        ]);
    }
}
