<?php

namespace App\Http\Controllers\Housekeeping;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\HousekeepingPerformanceService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HousekeepingPerformancePageController extends Controller
{
    public function __construct(
        private HousekeepingPerformanceService $performanceService
    ) {}

    /**
     * Display the housekeeping performance dashboard.
     */
    public function index(Request $request): Response
    {
        // Get housekeeping staff
        $housekeepingStaff = User::whereHas('roles', function ($query) {
            $query->whereIn('name', ['housekeeping-supervisor', 'housekeeper']);
        })->select('id', 'name', 'email')->get();

        // Get overall metrics for current month
        $currentMonthMetrics = $this->performanceService->getOverallMetrics(
            now()->startOfMonth()->toDateString(),
            now()->toDateString()
        );

        // Get top performers for current month
        $topPerformers = $this->performanceService->getTopPerformersForPeriod(10, 'month');

        return Inertia::render('housekeeping/performance', [
            'housekeepingStaff' => $housekeepingStaff,
            'currentMonthMetrics' => $currentMonthMetrics,
            'topPerformers' => $topPerformers,
        ]);
    }
}
