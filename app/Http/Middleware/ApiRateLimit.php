<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Symfony\Component\HttpFoundation\Response;

class ApiRateLimit
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $limiter = 'api'): Response
    {
        $key = $this->resolveRequestKey($request);

        // Check if request is rate limited
        if (RateLimiter::tooManyAttempts($key, $this->getMaxAttempts($limiter))) {
            return $this->buildRateLimitResponse($request, $key, $limiter);
        }

        // Increment the counter
        RateLimiter::hit($key, $this->getDecaySeconds($limiter));

        $response = $next($request);

        // Add rate limit headers to response
        return $this->addHeaders(
            $response,
            $this->getMaxAttempts($limiter),
            RateLimiter::remaining($key, $this->getMaxAttempts($limiter)),
            RateLimiter::availableIn($key)
        );
    }

    /**
     * Resolve the request key for rate limiting.
     */
    private function resolveRequestKey(Request $request): string
    {
        // Use user ID if authenticated, otherwise use IP address
        if ($request->user()) {
            return 'user:' . $request->user()->id;
        }

        return 'ip:' . $request->ip();
    }

    /**
     * Get the maximum number of attempts for the given limiter.
     */
    private function getMaxAttempts(string $limiter): int
    {
        return match ($limiter) {
            'api' => 1000, // 1000 requests per window
            'auth' => 5,   // 5 login attempts per window
            'reports' => 50, // 50 report requests per window
            default => 100,
        };
    }

    /**
     * Get the decay time in seconds for the given limiter.
     */
    private function getDecaySeconds(string $limiter): int
    {
        return match ($limiter) {
            'api' => 60,    // 1 minute window
            'auth' => 900,  // 15 minute window
            'reports' => 300, // 5 minute window
            default => 60,
        };
    }

    /**
     * Build the rate limit exceeded response.
     */
    private function buildRateLimitResponse(Request $request, string $key, string $limiter): Response
    {
        $retryAfter = RateLimiter::availableIn($key);

        return response()->json([
            'code' => 'RATE_LIMIT_EXCEEDED',
            'message' => 'Too many requests. Please try again later.',
            'retry_after' => $retryAfter,
        ], 429)->withHeaders([
            'Retry-After' => $retryAfter,
            'X-RateLimit-Limit' => $this->getMaxAttempts($limiter),
            'X-RateLimit-Remaining' => 0,
            'X-RateLimit-Reset' => now()->addSeconds($retryAfter)->timestamp,
        ]);
    }

    /**
     * Add rate limit headers to the response.
     */
    private function addHeaders(Response $response, int $maxAttempts, int $remaining, int $resetInSeconds): Response
    {
        // Handle StreamedResponse which doesn't have withHeaders method
        if ($response instanceof \Symfony\Component\HttpFoundation\StreamedResponse) {
            $response->headers->set('X-RateLimit-Limit', $maxAttempts);
            $response->headers->set('X-RateLimit-Remaining', $remaining);
            $response->headers->set('X-RateLimit-Reset', now()->addSeconds($resetInSeconds)->timestamp);
            return $response;
        }

        return $response->withHeaders([
            'X-RateLimit-Limit' => $maxAttempts,
            'X-RateLimit-Remaining' => $remaining,
            'X-RateLimit-Reset' => now()->addSeconds($resetInSeconds)->timestamp,
        ]);
    }
}
