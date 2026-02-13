<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Folio;
use App\Models\Reservation;
use App\Models\Room;
use App\Models\Stay;
use App\Models\User;
use App\Services\ApiOptimizationService;
use App\Services\SystemHealthService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class DashboardController extends Controller
{
    public function __construct(
        private ApiOptimizationService $apiOptimization,
        private SystemHealthService $systemHealthService
    ) {}

    /**
     * Get dashboard overview metrics.
     */
    public function overview(Request $request): JsonResponse
    {
        $cacheKey = $this->apiOptimization->generateCacheKey($request, ['type' => 'overview']);

        $data = Cache::remember($cacheKey, now()->addMinutes(5), function () {
            $today = Carbon::today();
            $thisMonth = Carbon::now()->startOfMonth();
            $lastMonth = Carbon::now()->subMonth()->startOfMonth();

            return [
                'occupancy' => $this->getOccupancyMetrics($today),
                'revenue' => $this->getRevenueMetrics($thisMonth, $lastMonth),
                'reservations' => $this->getReservationMetrics($today, $thisMonth),
                'performance' => $this->getPerformanceMetrics(),
            ];
        });

        return $this->apiOptimization->formatResponse(
            $data,
            'Dashboard overview retrieved successfully'
        );
    }

    /**
     * Get real-time metrics for live dashboard updates.
     */
    public function realtime(Request $request): JsonResponse
    {
        $data = [
            'current_occupancy' => $this->getCurrentOccupancy(),
            'today_checkins' => $this->getTodayCheckins(),
            'today_checkouts' => $this->getTodayCheckouts(),
            'pending_tasks' => $this->getPendingTasks(),
            'system_health' => $this->getSystemHealth(),
        ];

        return $this->apiOptimization->formatResponse(
            $data,
            'Real-time metrics retrieved successfully'
        );
    }

    /**
     * Get advanced analytics data.
     */
    public function analytics(Request $request): JsonResponse
    {
        $period = $request->get('period', '30d');
        $cacheKey = $this->apiOptimization->generateCacheKey($request, ['period' => $period]);

        $data = Cache::remember($cacheKey, now()->addMinutes(15), function () use ($period) {
            $startDate = $this->parsePeriod($period);

            return [
                'revenue_trends' => $this->getRevenueTrends($startDate),
                'occupancy_trends' => $this->getOccupancyTrends($startDate),
                'booking_sources' => $this->getBookingSources($startDate),
                'room_performance' => $this->getRoomPerformance($startDate),
                'guest_demographics' => $this->getGuestDemographics($startDate),
            ];
        });

        return $this->apiOptimization->formatResponse(
            $data,
            'Analytics data retrieved successfully'
        );
    }

    /**
     * Get performance monitoring metrics.
     */
    public function performance(Request $request): JsonResponse
    {
        $data = [
            'response_times' => $this->getResponseTimes(),
            'cache_hit_rate' => $this->getCacheHitRate(),
            'database_performance' => $this->getDatabasePerformance(),
            'api_usage' => $this->getApiUsage(),
        ];

        return $this->apiOptimization->formatResponse(
            $data,
            'Performance metrics retrieved successfully'
        );
    }

    /**
     * Get occupancy metrics.
     */
    private function getOccupancyMetrics(Carbon $date): array
    {
        $totalRooms = Room::where('is_active', true)->count();
        $occupiedRooms = Stay::where('status', 'active')
            ->whereDate('check_in', '<=', $date)
            ->whereDate('check_out', '>', $date)
            ->count();

        $occupancyRate = $totalRooms > 0 ? round(($occupiedRooms / $totalRooms) * 100, 2) : 0;

        // Monthly trend
        $lastMonth = $date->copy()->subMonth();
        $lastMonthOccupied = Stay::where('status', 'active')
            ->whereDate('check_in', '<=', $lastMonth)
            ->whereDate('check_out', '>', $lastMonth)
            ->count();
        $lastMonthRate = $totalRooms > 0 ? round(($lastMonthOccupied / $totalRooms) * 100, 2) : 0;

        return [
            'current_rate' => $occupancyRate,
            'occupied_rooms' => $occupiedRooms,
            'total_rooms' => $totalRooms,
            'change_from_last_month' => $occupancyRate - $lastMonthRate,
        ];
    }

    /**
     * Get revenue metrics.
     */
    private function getRevenueMetrics(Carbon $thisMonth, Carbon $lastMonth): array
    {
        $thisMonthRevenue = Folio::where('status', 'closed')
            ->whereBetween('closed_at', [$thisMonth, $thisMonth->copy()->endOfMonth()])
            ->sum('total');

        $lastMonthRevenue = Folio::where('status', 'closed')
            ->whereBetween('closed_at', [$lastMonth, $lastMonth->copy()->endOfMonth()])
            ->sum('total');

        $revenueChange = $lastMonthRevenue > 0
            ? round((($thisMonthRevenue - $lastMonthRevenue) / $lastMonthRevenue) * 100, 2)
            : 0;

        return [
            'this_month' => $thisMonthRevenue,
            'last_month' => $lastMonthRevenue,
            'change_percentage' => $revenueChange,
            'average_daily' => round($thisMonthRevenue / Carbon::now()->day, 2),
        ];
    }

    /**
     * Get reservation metrics.
     */
    private function getReservationMetrics(Carbon $today, Carbon $thisMonth): array
    {
        $todayReservations = Reservation::whereDate('created_at', $today)->count();
        $thisMonthReservations = Reservation::whereBetween('created_at', [$thisMonth, $thisMonth->copy()->endOfMonth()])->count();

        $confirmedToday = Reservation::whereDate('created_at', $today)
            ->where('status', 'confirmed')
            ->count();

        return [
            'today' => $todayReservations,
            'this_month' => $thisMonthReservations,
            'confirmed_today' => $confirmedToday,
            'confirmation_rate' => $todayReservations > 0 ? round(($confirmedToday / $todayReservations) * 100, 2) : 0,
        ];
    }

    /**
     * Get performance metrics.
     */
    private function getPerformanceMetrics(): array
    {
        $avgResponseTime = Cache::get('avg_response_time', 0);
        $totalRequests = Cache::get('total_requests_today', 0);
        $errorRate = Cache::get('error_rate_today', 0);

        return [
            'avg_response_time' => round($avgResponseTime, 2),
            'total_requests' => $totalRequests,
            'error_rate' => round($errorRate, 2),
            'uptime_percentage' => 99.9, // This would be calculated from monitoring
        ];
    }

    /**
     * Get current occupancy.
     */
    private function getCurrentOccupancy(): array
    {
        $totalRooms = Room::where('is_active', true)->count();
        $occupiedRooms = Stay::where('status', 'active')
            ->whereDate('check_in', '<=', now())
            ->whereDate('check_out', '>', now())
            ->count();

        return [
            'occupied' => $occupiedRooms,
            'total' => $totalRooms,
            'percentage' => $totalRooms > 0 ? round(($occupiedRooms / $totalRooms) * 100, 2) : 0,
        ];
    }

    /**
     * Get today's check-ins.
     */
    private function getTodayCheckins(): int
    {
        return Stay::whereDate('check_in', today())
            ->where('status', 'active')
            ->count();
    }

    /**
     * Get today's check-outs.
     */
    private function getTodayCheckouts(): int
    {
        return Stay::whereDate('check_out', today())
            ->where('status', 'active')
            ->count();
    }

    /**
     * Get pending tasks.
     */
    private function getPendingTasks(): int
    {
        return DB::table('housekeeping_tasks')
            ->where('status', 'pending')
            ->count();
    }

    /**
     * Get system health metrics.
     */
    private function getSystemHealth(): array
    {
        return $this->systemHealthService->checks();
    }

    /**
     * Parse period string to Carbon date.
     */
    private function parsePeriod(string $period): Carbon
    {
        return match ($period) {
            '7d' => now()->subDays(7),
            '30d' => now()->subDays(30),
            '90d' => now()->subDays(90),
            '1y' => now()->subYear(),
            default => now()->subDays(30),
        };
    }

    /**
     * Get revenue trends.
     */
    private function getRevenueTrends(Carbon $startDate): array
    {
        return Folio::selectRaw('DATE(closed_at) as date, SUM(total) as revenue')
            ->where('status', 'closed')
            ->where('closed_at', '>=', $startDate)
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(fn ($item) => [
                'date' => $item->date,
                'revenue' => (float) $item->revenue,
            ])
            ->toArray();
    }

    /**
     * Get occupancy trends.
     */
    private function getOccupancyTrends(Carbon $startDate): array
    {
        $trends = [];
        $current = $startDate->copy();

        while ($current <= now()) {
            $occupied = Stay::where('status', 'active')
                ->whereDate('check_in', '<=', $current)
                ->whereDate('check_out', '>', $current)
                ->count();

            $total = Room::where('is_active', true)->count();
            $rate = $total > 0 ? round(($occupied / $total) * 100, 2) : 0;

            $trends[] = [
                'date' => $current->format('Y-m-d'),
                'occupancy_rate' => $rate,
            ];

            $current->addDay();
        }

        return $trends;
    }

    /**
     * Get booking sources.
     */
    private function getBookingSources(Carbon $startDate): array
    {
        return Reservation::selectRaw('booking_source, COUNT(*) as count')
            ->where('created_at', '>=', $startDate)
            ->groupBy('booking_source')
            ->orderBy('count', 'desc')
            ->get()
            ->map(fn ($item) => [
                'source' => $item->booking_source ?? 'Direct',
                'count' => (int) $item->count,
            ])
            ->toArray();
    }

    /**
     * Get room performance.
     */
    private function getRoomPerformance(Carbon $startDate): array
    {
        return Room::select('rooms.*')
            ->selectRaw('COUNT(stays.id) as total_stays')
            ->leftJoin('stays', function ($join) use ($startDate) {
                $join->on('rooms.id', '=', 'stays.room_id')
                    ->where('stays.created_at', '>=', $startDate);
            })
            ->groupBy('rooms.id')
            ->orderBy('total_stays', 'desc')
            ->take(10)
            ->get()
            ->map(fn ($room) => [
                'room_number' => $room->number,
                'total_stays' => (int) $room->total_stays,
                'room_type' => $room->roomType->name ?? 'Unknown',
            ])
            ->toArray();
    }

    /**
     * Get guest demographics.
     */
    private function getGuestDemographics(Carbon $startDate): array
    {
        return Reservation::selectRaw('COUNT(*) as count, AVG(adults + children) as avg_guests')
            ->where('created_at', '>=', $startDate)
            ->first();
    }

    /**
     * Get response times.
     */
    private function getResponseTimes(): array
    {
        return [
            'avg_api_response' => Cache::get('avg_api_response_time', 0),
            'avg_page_load' => Cache::get('avg_page_load_time', 0),
            'p95_response' => Cache::get('p95_response_time', 0),
        ];
    }

    /**
     * Get cache hit rate.
     */
    private function getCacheHitRate(): float
    {
        $hits = Cache::get('cache_hits', 0);
        $misses = Cache::get('cache_misses', 0);
        $total = $hits + $misses;

        return $total > 0 ? round(($hits / $total) * 100, 2) : 0;
    }

    /**
     * Get database performance.
     */
    private function getDatabasePerformance(): array
    {
        return [
            'slow_queries' => Cache::get('slow_queries_count', 0),
            'avg_query_time' => Cache::get('avg_query_time', 0),
            'connection_pool_usage' => Cache::get('db_connection_usage', 0),
        ];
    }

    /**
     * Get API usage statistics.
     */
    private function getApiUsage(): array
    {
        return [
            'total_requests' => Cache::get('total_api_requests', 0),
            'requests_per_minute' => Cache::get('api_requests_per_minute', 0),
            'top_endpoints' => Cache::get('top_api_endpoints', []),
        ];
    }

    /**
     * Check database health.
     */
    private function checkDatabaseHealth(): string
    {
        return $this->systemHealthService->checkDatabase() ? 'healthy' : 'unhealthy';
    }

    /**
     * Check cache health.
     */
    private function checkCacheHealth(): string
    {
        return $this->systemHealthService->checkCache() ? 'healthy' : 'unhealthy';
    }

    /**
     * Check storage health.
     */
    private function checkStorageHealth(): string
    {
        return $this->systemHealthService->checkStorage() ? 'healthy' : 'unhealthy';
    }
}
