<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PerformanceMonitoringService
{
    /**
     * Record API response time.
     */
    public function recordApiResponseTime(string $endpoint, float $responseTime): void
    {
        $this->incrementCounter('total_api_requests');
        $this->recordResponseTime('api_response_times', $responseTime);

        // Record endpoint-specific metrics
        $this->incrementCounter("endpoint_requests:{$endpoint}");

        // Update top endpoints
        $this->updateTopEndpoints($endpoint);
    }

    /**
     * Record cache hit/miss.
     */
    public function recordCacheAccess(bool $hit): void
    {
        if ($hit) {
            $this->incrementCounter('cache_hits');
        } else {
            $this->incrementCounter('cache_misses');
        }
    }

    /**
     * Record database query time.
     */
    public function recordDatabaseQuery(float $queryTime, string $sql = null): void
    {
        $this->recordResponseTime('db_query_times', $queryTime);

        // Check for slow queries
        if ($queryTime > 1000) { // 1 second
            $this->incrementCounter('slow_queries_count');
            Log::warning('Slow query detected', [
                'query_time' => $queryTime,
                'sql' => $sql,
            ]);
        }
    }

    /**
     * Record error occurrence.
     */
    public function recordError(string $type = 'general'): void
    {
        $this->incrementCounter('total_errors');
        $this->incrementCounter("errors:{$type}");
    }

    /**
     * Get current metrics.
     */
    public function getMetrics(): array
    {
        return [
            'api' => [
                'total_requests' => $this->getCounter('total_api_requests'),
                'avg_response_time' => $this->getAverageResponseTime('api_response_times'),
                'p95_response_time' => $this->getPercentileResponseTime('api_response_times', 95),
                'error_rate' => $this->calculateErrorRate(),
            ],
            'cache' => [
                'hit_rate' => $this->calculateCacheHitRate(),
                'total_hits' => $this->getCounter('cache_hits'),
                'total_misses' => $this->getCounter('cache_misses'),
            ],
            'database' => [
                'avg_query_time' => $this->getAverageResponseTime('db_query_times'),
                'slow_queries' => $this->getCounter('slow_queries_count'),
                'connection_count' => $this->getDatabaseConnectionCount(),
            ],
            'system' => [
                'memory_usage' => $this->getMemoryUsage(),
                'uptime' => $this->getSystemUptime(),
            ],
        ];
    }

    /**
     * Reset daily counters.
     */
    public function resetDailyCounters(): void
    {
        $counters = [
            'total_api_requests',
            'cache_hits',
            'cache_misses',
            'total_errors',
            'slow_queries_count',
        ];

        foreach ($counters as $counter) {
            Cache::forget($counter);
        }

        // Reset error counters by type
        $errorKeys = Cache::get('error_keys', []);
        foreach ($errorKeys as $key) {
            Cache::forget($key);
        }
        Cache::forget('error_keys');
    }

    /**
     * Increment a counter.
     */
    private function incrementCounter(string $key): void
    {
        $current = Cache::get($key, 0);
        Cache::put($key, $current + 1, now()->addDay());
    }

    /**
     * Get a counter value.
     */
    private function getCounter(string $key): int
    {
        return Cache::get($key, 0);
    }

    /**
     * Record response time in a rolling window.
     */
    private function recordResponseTime(string $key, float $time): void
    {
        $times = Cache::get($key, []);
        $times[] = $time;

        // Keep only last 1000 measurements
        if (count($times) > 1000) {
            array_shift($times);
        }

        Cache::put($key, $times, now()->addHours(1));
    }

    /**
     * Get average response time.
     */
    private function getAverageResponseTime(string $key): float
    {
        $times = Cache::get($key, []);
        return empty($times) ? 0 : round(array_sum($times) / count($times), 2);
    }

    /**
     * Get percentile response time.
     */
    private function getPercentileResponseTime(string $key, int $percentile): float
    {
        $times = Cache::get($key, []);
        if (empty($times)) {
            return 0;
        }

        sort($times);
        $index = (int) ceil(($percentile / 100) * count($times)) - 1;
        return round($times[max(0, $index)], 2);
    }

    /**
     * Calculate error rate.
     */
    private function calculateErrorRate(): float
    {
        $totalRequests = $this->getCounter('total_api_requests');
        $totalErrors = $this->getCounter('total_errors');

        return $totalRequests > 0 ? round(($totalErrors / $totalRequests) * 100, 2) : 0;
    }

    /**
     * Calculate cache hit rate.
     */
    private function calculateCacheHitRate(): float
    {
        $hits = $this->getCounter('cache_hits');
        $misses = $this->getCounter('cache_misses');
        $total = $hits + $misses;

        return $total > 0 ? round(($hits / $total) * 100, 2) : 0;
    }

    /**
     * Get database connection count.
     */
    private function getDatabaseConnectionCount(): int
    {
        try {
            $connections = DB::select('SHOW PROCESSLIST');
            return count($connections);
        } catch (\Exception $e) {
            return 0;
        }
    }

    /**
     * Get memory usage.
     */
    private function getMemoryUsage(): array
    {
        $usage = memory_get_usage(true);
        $peak = memory_get_peak_usage(true);

        return [
            'current' => round($usage / 1024 / 1024, 2), // MB
            'peak' => round($peak / 1024 / 1024, 2), // MB
            'limit' => ini_get('memory_limit'),
        ];
    }

    /**
     * Get system uptime.
     */
    private function getSystemUptime(): string
    {
        if (function_exists('posix_times')) {
            $times = posix_times();
            $uptime = $times['uptime'] ?? 0;
            return $this->formatUptime($uptime);
        }

        return 'Unknown';
    }

    /**
     * Format uptime seconds to human readable.
     */
    private function formatUptime(int $seconds): string
    {
        $days = floor($seconds / 86400);
        $hours = floor(($seconds % 86400) / 3600);
        $minutes = floor(($seconds % 3600) / 60);

        $parts = [];
        if ($days > 0) {
            $parts[] = "{$days}d";
        }
        if ($hours > 0) {
            $parts[] = "{$hours}h";
        }
        if ($minutes > 0) {
            $parts[] = "{$minutes}m";
        }

        return implode(' ', $parts) ?: '0m';
    }

    /**
     * Update top endpoints list.
     */
    private function updateTopEndpoints(string $endpoint): void
    {
        $topEndpoints = Cache::get('top_api_endpoints', []);
        $topEndpoints[$endpoint] = ($topEndpoints[$endpoint] ?? 0) + 1;

        // Keep only top 10
        arsort($topEndpoints);
        $topEndpoints = array_slice($topEndpoints, 0, 10, true);

        Cache::put('top_api_endpoints', $topEndpoints, now()->addDay());
    }
}
