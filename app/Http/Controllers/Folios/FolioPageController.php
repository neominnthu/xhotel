<?php

namespace App\Http\Controllers\Folios;

use App\Http\Controllers\Controller;
use App\Http\Requests\Folios\ApproveFolioRefundRequest;
use App\Http\Requests\Folios\StoreFolioChargeRequest;
use App\Http\Requests\Folios\StoreFolioPaymentRequest;
use App\Http\Requests\Folios\StoreFolioRefundRequest;
use App\Models\Folio;
use App\Models\Refund;
use App\Services\FolioService;
use App\Services\RefundService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;

class FolioPageController extends Controller
{
    public function storeCharge(
        StoreFolioChargeRequest $request,
        Folio $folio,
        FolioService $service
    ): RedirectResponse {
        $this->guardFolioHasReservation($folio);
        Gate::authorize('view', $folio->reservation);

        $service->addCharge($folio, $request->validated(), $request->user());

        return redirect()->route('folios.show', $folio);
    }

    public function storePayment(
        StoreFolioPaymentRequest $request,
        Folio $folio,
        FolioService $service
    ): RedirectResponse {
        $this->guardFolioHasReservation($folio);
        Gate::authorize('view', $folio->reservation);

        $service->addPayment($folio, $request->validated(), $request->user());

        return redirect()->route('folios.show', $folio);
    }

    public function storeRefund(
        StoreFolioRefundRequest $request,
        Folio $folio,
        RefundService $service
    ): RedirectResponse {
        $this->guardFolioHasReservation($folio);
        Gate::authorize('addRefund', $folio);

        $service->requestRefund($folio, $request->validated(), $request->user());

        return redirect()->route('folios.show', $folio);
    }

    public function approveRefund(
        ApproveFolioRefundRequest $request,
        Refund $refund,
        RefundService $service
    ): RedirectResponse {
        $this->guardRefundHasReservation($refund);
        Gate::authorize('approve', $refund);

        $service->approveRefund($refund, $request->validated(), $request->user());

        return redirect()->route('folios.show', $refund->folio);
    }

    private function guardFolioHasReservation(Folio $folio): void
    {
        if (! $folio->reservation) {
            abort(404);
        }
    }

    private function guardRefundHasReservation(Refund $refund): void
    {
        if (! $refund->folio || ! $refund->folio->reservation) {
            abort(404);
        }
    }
}
