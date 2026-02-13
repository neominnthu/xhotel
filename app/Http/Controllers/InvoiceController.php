<?php

namespace App\Http\Controllers;

use App\Models\Folio;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class InvoiceController extends Controller
{
    public function show(Folio $folio): Response
    {
        Gate::authorize('view', $folio->reservation);

        if (! $folio->reservation) {
            abort(404);
        }

        $folio->load([
            'reservation.guest',
            'charges.createdBy',
            'payments.createdBy'
        ]);

        return Inertia::render('invoices/show', [
            'folio' => [
                'id' => $folio->id,
                'currency' => $folio->currency,
                'total' => $folio->total,
                'balance' => $folio->balance,
                'status' => $folio->status,
                'closed_at' => $folio->closed_at?->toDateTimeString(),
            ],
            'reservation' => [
                'id' => $folio->reservation->id,
                'code' => $folio->reservation->code,
                'check_in_date' => $folio->reservation->check_in?->toDateString(),
                'check_out_date' => $folio->reservation->check_out?->toDateString(),
                'guest' => $folio->reservation->guest
                    ? [
                        'id' => $folio->reservation->guest->id,
                        'name' => $folio->reservation->guest->name,
                        'email' => $folio->reservation->guest->email,
                        'phone' => $folio->reservation->guest->phone,
                        'address' => $folio->reservation->guest->address,
                    ]
                    : null,
            ],
            'charges' => $folio->charges->map(fn ($charge) => [
                'id' => $charge->id,
                'type' => $charge->type,
                'description' => $charge->description,
                'amount' => $charge->amount,
                'tax_amount' => $charge->tax_amount,
                'currency' => $charge->currency,
                'posted_at' => $charge->posted_at?->toDateString(),
                'created_by' => $charge->createdBy
                    ? [
                        'id' => $charge->createdBy->id,
                        'name' => $charge->createdBy->name,
                    ]
                    : null,
            ]),
            'payments' => $folio->payments->map(fn ($payment) => [
                'id' => $payment->id,
                'method' => $payment->method,
                'amount' => $payment->amount,
                'currency' => $payment->currency,
                'reference' => $payment->reference,
                'card_last_four' => $payment->card_last_four,
                'card_type' => $payment->card_type,
                'bank_details' => $payment->bank_details,
                'wallet_type' => $payment->wallet_type,
                'check_number' => $payment->check_number,
                'received_at' => $payment->received_at?->toDateString(),
                'created_by' => $payment->createdBy
                    ? [
                        'id' => $payment->createdBy->id,
                        'name' => $payment->createdBy->name,
                    ]
                    : null,
            ]),
        ]);
    }
}
