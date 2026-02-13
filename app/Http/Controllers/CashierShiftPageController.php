<?php

namespace App\Http\Controllers;

use App\Http\Requests\CashierShifts\CloseCashierShiftRequest;
use App\Http\Requests\CashierShifts\OpenCashierShiftRequest;
use App\Models\CashierShift;
use App\Models\User;
use App\Services\CashierShiftService;
use App\Services\ReportsService;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CashierShiftPageController extends Controller
{
    public function index(Request $request, ReportsService $reports): Response
    {
        $this->authorize('viewAny', CashierShift::class);

        $user = $request->user();
        $propertyId = $user?->property_id;

        $cashiersQuery = User::query()
            ->where('role', 'cashier')
            ->where('is_active', true);

        if ($propertyId) {
            $cashiersQuery->where('property_id', $propertyId);
        }

        if ($user?->role === 'cashier') {
            $cashiersQuery->where('id', $user->id);
        }

        $cashiers = $cashiersQuery->orderBy('name')->get(['id', 'name']);

        $selectedCashierId = $request->input('cashier_id')
            ? (int) $request->input('cashier_id')
            : ($user?->role === 'cashier' ? $user->id : $cashiers->first()?->id);

        if ($user?->role === 'cashier' && $selectedCashierId && (int) $selectedCashierId !== (int) $user->id) {
            abort(403);
        }

        $selectedCashier = $selectedCashierId
            ? $cashiers->firstWhere('id', $selectedCashierId)
            : null;

        $reportDate = $request->input('date')
            ? Carbon::parse($request->input('date'))
            : now();

        $currentShift = null;
        $recentShifts = collect();
        $reportTotals = ['total_cash' => 0, 'total_card' => 0];

        if ($selectedCashier) {
            $currentShift = CashierShift::query()
                ->when($propertyId, fn ($query) => $query->where('property_id', $propertyId))
                ->where('cashier_id', $selectedCashier->id)
                ->where('status', 'open')
                ->latest('opened_at')
                ->first();

            $recentShifts = CashierShift::query()
                ->when($propertyId, fn ($query) => $query->where('property_id', $propertyId))
                ->where('cashier_id', $selectedCashier->id)
                ->latest('opened_at')
                ->take(10)
                ->get();

            $reportTotals = $reports->cashierShiftReport($reportDate, $selectedCashier);
        }

        return Inertia::render('cashier-shifts/index', [
            'filters' => [
                'date' => $reportDate->toDateString(),
                'cashier_id' => $selectedCashier?->id,
            ],
            'cashiers' => $cashiers->map(fn (User $cashier) => [
                'id' => $cashier->id,
                'name' => $cashier->name,
            ]),
            'current_shift' => $currentShift
                ? [
                    'id' => $currentShift->id,
                    'status' => $currentShift->status,
                    'currency' => $currentShift->currency,
                    'opening_cash' => $currentShift->opening_cash,
                    'closing_cash' => $currentShift->closing_cash,
                    'expected_cash' => $currentShift->expected_cash,
                    'variance' => $currentShift->variance,
                    'total_cash' => $currentShift->total_cash,
                    'total_card' => $currentShift->total_card,
                    'opened_at' => $currentShift->opened_at?->toDateTimeString(),
                    'closed_at' => $currentShift->closed_at?->toDateTimeString(),
                    'notes' => $currentShift->notes,
                ]
                : null,
            'recent_shifts' => $recentShifts->map(fn (CashierShift $shift) => [
                'id' => $shift->id,
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
            ]),
            'report' => [
                'date' => $reportDate->toDateString(),
                'total_cash' => $reportTotals['total_cash'],
                'total_card' => $reportTotals['total_card'],
            ],
        ]);
    }

    public function open(OpenCashierShiftRequest $request, CashierShiftService $service): RedirectResponse
    {
        $this->authorize('create', CashierShift::class);

        $service->openShift($request->user(), $request->validated());

        return redirect()->route('cashier-shifts.index');
    }

    public function close(
        CloseCashierShiftRequest $request,
        CashierShift $cashierShift,
        CashierShiftService $service
    ): RedirectResponse {
        $this->authorize('update', $cashierShift);

        $service->closeShift($cashierShift, $request->user(), $request->validated());

        return redirect()->route('cashier-shifts.index');
    }
}
