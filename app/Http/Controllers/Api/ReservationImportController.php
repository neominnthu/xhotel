<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Reservations\ImportReservationsRequest;
use App\Services\ReservationImportService;
use Illuminate\Http\JsonResponse;

class ReservationImportController extends Controller
{
    public function store(ImportReservationsRequest $request, ReservationImportService $service): JsonResponse
    {
        $this->authorize('create', \App\Models\Reservation::class);

        $file = $request->file('file');
        $results = $service->import($file->openFile(), $request->user());

        return response()->json($results);
    }
}
