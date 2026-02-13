<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Folios\StoreFolioChargeRequest;
use App\Http\Requests\Folios\StoreFolioPaymentRequest;
use App\Models\Folio;
use App\Services\FolioService;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\JsonResponse;

class FolioController extends Controller
{
    public function show(Folio $folio): JsonResponse
    {
        $this->guardFolioHasReservation($folio);
        $this->authorize('view', $folio->reservation);

        $folio->load(['charges', 'payments']);

        return response()->json([
            'id' => $folio->id,
            'reservation_id' => $folio->reservation_id,
            'currency' => $folio->currency,
            'total' => $folio->total,
            'balance' => $folio->balance,
            'charges' => $folio->charges->map(fn ($charge) => [
                'id' => $charge->id,
                'type' => $charge->type,
                'amount' => $charge->amount,
                'tax_amount' => $charge->tax_amount,
                'currency' => $charge->currency,
                'description' => $charge->description,
                'posted_at' => $charge->posted_at?->toDateTimeString(),
            ])->values(),
            'payments' => $folio->payments->map(fn ($payment) => [
                'id' => $payment->id,
                'method' => $payment->method,
                'amount' => $payment->amount,
                'currency' => $payment->currency,
                'received_at' => $payment->received_at?->toDateTimeString(),
            ])->values(),
        ]);
    }

    public function storeCharge(
        StoreFolioChargeRequest $request,
        Folio $folio,
        FolioService $service
    ): JsonResponse {
        $this->guardFolioHasReservation($folio);
        $this->authorize('view', $folio->reservation);

        $charge = $service->addCharge($folio, $request->validated(), $request->user());

        return response()->json([
            'id' => $charge->id,
            'type' => $charge->type,
            'amount' => $charge->amount,
            'currency' => $charge->currency,
        ]);
    }

    public function storePayment(
        StoreFolioPaymentRequest $request,
        Folio $folio,
        FolioService $service
    ): JsonResponse {
        $this->guardFolioHasReservation($folio);
        $this->authorize('view', $folio->reservation);

        $payment = $service->addPayment($folio, $request->validated(), $request->user());

        return response()->json([
            'id' => $payment->id,
            'method' => $payment->method,
            'amount' => $payment->amount,
            'currency' => $payment->currency,
        ]);
    }

    private function guardFolioHasReservation(Folio $folio): void
    {
        if (! $folio->reservation) {
            throw new HttpResponseException(response()->json([
                'code' => 'FOLIO_NOT_FOUND',
                'message' => 'Folio not found for reservation.',
            ], 404));
        }
    }
}
