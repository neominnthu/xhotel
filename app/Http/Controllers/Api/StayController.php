<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Stays\CheckInRequest;
use App\Http\Requests\Stays\CheckOutRequest;
use App\Models\Stay;
use App\Services\StayService;
use Illuminate\Http\JsonResponse;

class StayController extends Controller
{
    public function checkIn(
        CheckInRequest $request,
        Stay $stay,
        StayService $service
    ): JsonResponse {
        $this->authorize('update', $stay->reservation);

        $stay = $service->checkIn($stay, $request->validated(), $request->user());

        return response()->json([
            'id' => $stay->id,
            'status' => $stay->status,
            'actual_check_in' => $stay->actual_check_in?->toDateTimeString(),
        ]);
    }

    public function checkOut(
        CheckOutRequest $request,
        Stay $stay,
        StayService $service
    ): JsonResponse {
        $this->authorize('update', $stay->reservation);

        $stay = $service->checkOut($stay, $request->validated(), $request->user());

        return response()->json([
            'id' => $stay->id,
            'status' => $stay->status,
            'actual_check_out' => $stay->actual_check_out?->toDateTimeString(),
        ]);
    }
}
