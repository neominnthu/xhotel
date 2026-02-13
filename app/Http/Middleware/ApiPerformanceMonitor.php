<?php

namespace App\Http\Middleware;

use App\Services\PerformanceMonitoringService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ApiPerformanceMonitor
{
    public function __construct(
        private PerformanceMonitoringService $performanceMonitor
    ) {}

    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $startTime = microtime(true);

        $response = $next($request);

        $endTime = microtime(true);
        $responseTime = ($endTime - $startTime) * 1000; // Convert to milliseconds

        // Record API response time
        $this->performanceMonitor->recordApiResponseTime(
            $request->route()?->getName() ?? $request->path(),
            $responseTime
        );

        // Record errors
        if ($response->getStatusCode() >= 400) {
            $this->performanceMonitor->recordError(
                $response->getStatusCode() >= 500 ? 'server' : 'client'
            );
        }

        // Add performance headers
        $response->headers->set('X-Response-Time', round($responseTime, 2) . 'ms');

        return $response;
    }
}
