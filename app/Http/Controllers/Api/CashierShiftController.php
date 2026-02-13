<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CashierShifts\CloseCashierShiftRequest;
use App\Http\Requests\CashierShifts\OpenCashierShiftRequest;
use App\Models\CashierShift;
use App\Services\CashierShiftService;
use Illuminate\Http\JsonResponse;

class CashierShiftController extends Controller
{
    public function open(OpenCashierShiftRequest $request, CashierShiftService $service): JsonResponse
    {
        $this->authorize('create', CashierShift::class);

        $shift = $service->openShift($request->user(), $request->validated());

        return response()->json($this->mapShift($shift));
    }

    public function close(
        CloseCashierShiftRequest $request,
        CashierShift $cashierShift,
        CashierShiftService $service
    ): JsonResponse {
        $this->authorize('update', $cashierShift);

        $shift = $service->closeShift($cashierShift, $request->user(), $request->validated());

        return response()->json($this->mapShift($shift));
    }

    public function current(CashierShiftService $service): JsonResponse
    {
        $this->authorize('viewAny', CashierShift::class);

        $shift = $service->currentShift(request()->user());

        return response()->json([
            'data' => $shift ? $this->mapShift($shift) : null,
        ]);
    }

    private function mapShift(CashierShift $shift): array
    {
        return [
            'id' => $shift->id,
            'cashier_id' => $shift->cashier_id,
            'status' => $shift->status,
            'currency' => $shift->currency,
            'opening_cash' => $shift->opening_cash,
            'closing_cash' => $shift->closing_cash,
            'expected_cash' => $shift->expected_cash,
            'variance' => $shift->variance,
            'total_cash' => $shift->total_cash,
            'total_card' => $shift->total_card,
            'opened_at' => $shift->opened_at?->toDateTimeString(),
            'closed_at' => $shift->closed_at?->toDateTimeString(),
            'notes' => $shift->notes,
        ];
    }
}
