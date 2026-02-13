<?php

namespace App\Http\Controllers\Folios;

use App\Http\Controllers\Controller;
use App\Http\Requests\Folios\StoreFolioChargeRequest;
use App\Http\Requests\Folios\StoreFolioPaymentRequest;
use App\Models\Folio;
use App\Services\FolioService;
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

    private function guardFolioHasReservation(Folio $folio): void
    {
        if (! $folio->reservation) {
            abort(404);
        }
    }
}
