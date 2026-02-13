<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Folios\ApproveFolioRefundRequest;
use App\Models\Refund;
use App\Services\RefundService;
use Illuminate\Http\JsonResponse;

class RefundController extends Controller
{
    public function approve(
        ApproveFolioRefundRequest $request,
        Refund $refund,
        RefundService $service
    ): JsonResponse {
        $this->authorize('approve', $refund);

        $refund = $service->approveRefund($refund, $request->validated(), $request->user());

        return response()->json([
            'id' => $refund->id,
            'status' => $refund->status,
            'approved_at' => $refund->approved_at?->toDateTimeString(),
            'refunded_at' => $refund->refunded_at?->toDateTimeString(),
        ]);
    }
}
