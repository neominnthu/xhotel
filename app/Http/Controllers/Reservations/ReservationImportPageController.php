<?php

namespace App\Http\Controllers\Reservations;

use App\Http\Controllers\Controller;
use App\Http\Requests\Reservations\ImportReservationsRequest;
use App\Services\ReservationImportService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ReservationImportPageController extends Controller
{
    public function index(): Response
    {
        $this->authorize('create', \App\Models\Reservation::class);

        return Inertia::render('reservations/import', [
            'results' => session('results'),
        ]);
    }

    public function store(ImportReservationsRequest $request, ReservationImportService $service): RedirectResponse
    {
        $this->authorize('create', \App\Models\Reservation::class);

        $file = $request->file('file');
        $results = $service->import($file->openFile(), $request->user());

        $flashKey = $results['failed'] > 0 ? 'error' : 'success';
        $flashMessage = $results['failed'] > 0
            ? 'တင်သွင်းမှု မအောင်မြင်မှုများ ရှိနေပါသည်။'
            : 'တင်သွင်းမှု အောင်မြင်ပါသည်။';

        return back()
            ->with('results', $results)
            ->with($flashKey, $flashMessage);
    }
}
