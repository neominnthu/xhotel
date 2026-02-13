<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response;

class ApiResponseCache
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ?int $ttl = null): Response
    {
        // Only cache GET requests
        if ($request->method() !== 'GET') {
            return $next($request);
        }

        // Skip caching if user is authenticated (personalized data)
        if ($request->user()) {
            return $next($request);
        }

        // Generate cache key based on request
        $cacheKey = $this->generateCacheKey($request);

        // Check if response is cached
        if (Cache::has($cacheKey)) {
            $cachedResponse = Cache::get($cacheKey);

            // Return cached response with cache headers
            return response($cachedResponse['content'], $cachedResponse['status'])
                ->withHeaders([
                    'X-Cache' => 'HIT',
                    'Cache-Control' => 'public, max-age=' . ($ttl ?? 300),
                    'ETag' => $cachedResponse['etag'],
                ]);
        }

        // Process the request
        $response = $next($request);

        // Only cache successful responses
        if ($response->getStatusCode() === 200) {
            $content = $response->getContent();
            $etag = md5($content);

            // Cache the response
            Cache::put($cacheKey, [
                'content' => $content,
                'status' => $response->getStatusCode(),
                'etag' => $etag,
            ], $ttl ?? 300); // Default 5 minutes

            // Add cache headers to response
            $response->headers->set('X-Cache', 'MISS');
            $response->headers->set('Cache-Control', 'public, max-age=' . ($ttl ?? 300));
            $response->headers->set('ETag', $etag);
        }

        return $response;
    }

    /**
     * Generate a unique cache key for the request.
     */
    private function generateCacheKey(Request $request): string
    {
        $key = 'api:' . $request->path();

        // Include query parameters in cache key
        if ($request->query()) {
            ksort($request->query());
            $key .= ':' . http_build_query($request->query());
        }

        // Include important headers that might affect response
        if ($request->hasHeader('Accept-Language')) {
            $key .= ':lang=' . $request->header('Accept-Language');
        }

        return $key;
    }
}
