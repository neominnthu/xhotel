<?php

use App\Http\Middleware\ApiPerformanceMonitor;
use App\Http\Middleware\ApiRateLimit;
use App\Http\Middleware\ApiResponseCache;
use App\Http\Middleware\CheckPermission;
use App\Http\Middleware\CheckRole;
use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->api(prepend: [
            ApiRateLimit::class,
            ApiPerformanceMonitor::class,
        ]);

        $middleware->alias([
            'api.cache' => ApiResponseCache::class,
            'api.rate' => ApiRateLimit::class,
            'permission' => CheckPermission::class,
            'role' => CheckRole::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (Throwable $exception, Request $request) {
            if (! $request->expectsJson()) {
                return null;
            }

            if ($exception instanceof ValidationException) {
                return response()->json([
                    'code' => 'VALIDATION_ERROR',
                    'message' => 'Validation error.',
                    'errors' => $exception->errors(),
                ], 422);
            }

            if ($exception instanceof AuthorizationException) {
                return response()->json([
                    'code' => 'AUTHZ_DENIED',
                    'message' => 'Action is not allowed.',
                ], 403);
            }

            if ($exception instanceof ModelNotFoundException) {
                return response()->json([
                    'code' => 'RESOURCE_NOT_FOUND',
                    'message' => 'Resource not found.',
                ], 404);
            }

            if ($exception instanceof HttpExceptionInterface) {
                return response()->json([
                    'code' => 'HTTP_ERROR',
                    'message' => $exception->getMessage() ?: 'Request failed.',
                ], $exception->getStatusCode());
            }

            return response()->json([
                'code' => 'SERVER_ERROR',
                'message' => 'Unexpected server error.',
            ], 500);
        });
    })->create();
