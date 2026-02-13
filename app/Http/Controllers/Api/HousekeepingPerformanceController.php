<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HousekeepingPerformance;
use App\Models\User;
use App\Services\HousekeepingPerformanceService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class HousekeepingPerformanceController extends Controller
{
    public function __construct(
        private HousekeepingPerformanceService $performanceService
    ) {}

    /**
     * Get performance summary for a specific staff member
     */
    public function getStaffPerformance(Request $request, User $user): JsonResponse
    {
        $request->validate([
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
        ]);

        $startDate = $request->get('start_date', now()->startOfMonth()->toDateString());
        $endDate = $request->get('end_date', now()->toDateString());

        $performance = $this->performanceService->getStaffPerformanceSummary(
            $user,
            $startDate,
            $endDate
        );

        return response()->json($performance);
    }

    /**
     * Get performance trends for a staff member
     */
    public function getPerformanceTrends(Request $request, User $user): JsonResponse
    {
        $request->validate([
            'days' => 'nullable|integer|min:1|max:90',
        ]);

        $days = $request->get('days', 30);

        $trends = $this->performanceService->getPerformanceTrends($user, $days);

        return response()->json($trends);
    }

    /**
     * Get top performers for the current period
     */
    public function getTopPerformers(Request $request): JsonResponse
    {
        $request->validate([
            'limit' => 'nullable|integer|min:1|max:20',
            'period' => 'nullable|in:week,month,quarter',
        ]);

        $limit = $request->get('limit', 10);
        $period = $request->get('period', 'month');

        $topPerformers = $this->performanceService->getTopPerformersForPeriod($limit, $period);

        return response()->json($topPerformers);
    }

    /**
     * Get overall housekeeping performance metrics
     */
    public function getOverallMetrics(Request $request): JsonResponse
    {
        $request->validate([
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
        ]);

        $startDate = $request->get('start_date', now()->startOfMonth()->toDateString());
        $endDate = $request->get('end_date', now()->toDateString());

        $metrics = $this->performanceService->getOverallMetrics($startDate, $endDate);

        return response()->json($metrics);
    }

    /**
     * Get performance comparison between staff members
     */
    public function getPerformanceComparison(Request $request): JsonResponse
    {
        $request->validate([
            'user_ids' => 'required|array|min:1|max:10',
            'user_ids.*' => 'integer|exists:users,id',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
        ]);

        $userIds = $request->get('user_ids');
        $startDate = $request->get('start_date', now()->startOfMonth()->toDateString());
        $endDate = $request->get('end_date', now()->toDateString());

        $comparison = $this->performanceService->getPerformanceComparison(
            $userIds,
            $startDate,
            $endDate
        );

        return response()->json($comparison);
    }
}
