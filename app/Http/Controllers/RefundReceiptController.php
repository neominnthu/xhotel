<?php

namespace App\Http\Controllers;

use App\Models\Refund;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class RefundReceiptController extends Controller
{
    public function show(Refund $refund): Response
    {
        Gate::authorize('view', $refund);

        $refund->load([
            'folio.reservation.guest',
            'requestedBy',
            'approvedBy',
        ]);

        if (! $refund->folio || ! $refund->folio->reservation) {
            abort(404);
        }

        $reservation = $refund->folio->reservation;

        return Inertia::render('refunds/receipt', [
            'refund' => [
                'id' => $refund->id,
                'method' => $refund->method,
                'amount' => $refund->amount,
                'currency' => $refund->currency,
                'status' => $refund->status,
                'reference' => $refund->reference,
                'reason' => $refund->reason,
                'approved_at' => $refund->approved_at?->toDateTimeString(),
                'refunded_at' => $refund->refunded_at?->toDateTimeString(),
                'requested_by' => $refund->requestedBy
                    ? [
                        'id' => $refund->requestedBy->id,
                        'name' => $refund->requestedBy->name,
                    ]
                    : null,
                'approved_by' => $refund->approvedBy
                    ? [
                        'id' => $refund->approvedBy->id,
                        'name' => $refund->approvedBy->name,
                    ]
                    : null,
            ],
            'folio' => [
                'id' => $refund->folio->id,
                'currency' => $refund->folio->currency,
                'status' => $refund->folio->status,
                'closed_at' => $refund->folio->closed_at?->toDateTimeString(),
            ],
            'reservation' => [
                'id' => $reservation->id,
                'code' => $reservation->code,
                'check_in_date' => $reservation->check_in?->toDateString(),
                'check_out_date' => $reservation->check_out?->toDateString(),
                'guest' => $reservation->guest
                    ? [
                        'id' => $reservation->guest->id,
                        'name' => $reservation->guest->name,
                        'email' => $reservation->guest->email,
                        'phone' => $reservation->guest->phone,
                    ]
                    : null,
            ],
        ]);
    }
}
