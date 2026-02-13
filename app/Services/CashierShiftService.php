<?php

namespace App\Services;

use App\Models\CashierShift;
use App\Models\Payment;
use App\Models\Refund;
use App\Models\User;
use Carbon\CarbonInterface;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\DB;

class CashierShiftService
{
    public function __construct(public AuditLogService $auditLogService) {}

    public function openShift(User $actor, array $data): CashierShift
    {
        $propertyId = $actor->property_id;

        $existing = CashierShift::query()
            ->where('cashier_id', $actor->id)
            ->when($propertyId, fn ($query) => $query->where('property_id', $propertyId))
            ->where('status', 'open')
            ->first();

        if ($existing) {
            throw new HttpResponseException(response()->json([
                'code' => 'CASHIER_SHIFT_ALREADY_OPEN',
                'message' => 'Cashier already has an open shift.',
            ], 409));
        }

        $currency = $data['currency'] ?? 'MMK';

        $shift = CashierShift::create([
            'property_id' => $propertyId,
            'cashier_id' => $actor->id,
            'opened_at' => now(),
            'currency' => strtoupper($currency),
            'opening_cash' => (int) $data['opening_cash'],
            'status' => 'open',
            'notes' => $data['notes'] ?? null,
        ]);

        $this->auditLogService->record($actor, 'cashier.shift.opened', 'cashier_shift', [
            'cashier_shift_id' => $shift->id,
            'opening_cash' => $shift->opening_cash,
            'currency' => $shift->currency,
        ]);

        return $shift->fresh();
    }

    public function closeShift(CashierShift $shift, User $actor, array $data): CashierShift
    {
        if ($shift->status !== 'open') {
            throw new HttpResponseException(response()->json([
                'code' => 'CASHIER_SHIFT_NOT_OPEN',
                'message' => 'Cashier shift is not open.',
            ], 409));
        }

        $closedAt = now();

        return DB::transaction(function () use ($shift, $actor, $data, $closedAt) {
            $totalCash = $this->totalByMethod($shift, $shift->opened_at, $closedAt, 'cash');
            $totalCard = $this->totalByMethod($shift, $shift->opened_at, $closedAt, 'card');
            $expectedCash = $shift->opening_cash + $totalCash;
            $closingCash = (int) $data['closing_cash'];
            $variance = $closingCash - $expectedCash;

            $shift->fill([
                'closed_at' => $closedAt,
                'closing_cash' => $closingCash,
                'expected_cash' => $expectedCash,
                'variance' => $variance,
                'total_cash' => $totalCash,
                'total_card' => $totalCard,
                'status' => 'closed',
                'notes' => $data['notes'] ?? $shift->notes,
            ]);
            $shift->save();

            $this->auditLogService->record($actor, 'cashier.shift.closed', 'cashier_shift', [
                'cashier_shift_id' => $shift->id,
                'total_cash' => $totalCash,
                'total_card' => $totalCard,
                'expected_cash' => $expectedCash,
                'closing_cash' => $closingCash,
                'variance' => $variance,
                'currency' => $shift->currency,
            ]);

            return $shift->fresh();
        });
    }

    public function currentShift(User $actor): ?CashierShift
    {
        return CashierShift::query()
            ->where('cashier_id', $actor->id)
            ->when($actor->property_id, fn ($query) => $query->where('property_id', $actor->property_id))
            ->where('status', 'open')
            ->latest('opened_at')
            ->first();
    }

    private function totalByMethod(CashierShift $shift, CarbonInterface $from, CarbonInterface $to, string $method): int
    {
        $cashier = $shift->cashier;

        if (! $cashier) {
            return 0;
        }

        return $this->totalByMethodForWindow($cashier, $from, $to, $method);
    }

    private function totalByMethodForWindow(User $cashier, CarbonInterface $from, CarbonInterface $to, string $method): int
    {
        $propertyId = $cashier->property_id;

        $paymentTotal = (int) Payment::query()
            ->when($propertyId, fn ($query) => $query->whereHas('folio.reservation', fn ($reservationQuery) => $reservationQuery->where('property_id', $propertyId)))
            ->where('created_by', $cashier->id)
            ->where('method', $method)
            ->whereBetween('received_at', [$from, $to])
            ->sum('amount');

        $refundTotal = (int) Refund::query()
            ->when($propertyId, fn ($query) => $query->whereHas('folio.reservation', fn ($reservationQuery) => $reservationQuery->where('property_id', $propertyId)))
            ->where('approved_by', $cashier->id)
            ->where('method', $method)
            ->where('status', 'approved')
            ->whereBetween('refunded_at', [$from, $to])
            ->sum('amount');

        return $paymentTotal - $refundTotal;
    }
}
