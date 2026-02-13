<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Storage;
use RuntimeException;

class SystemHealthService
{
    public function checks(): array
    {
        return [
            'database' => $this->checkDatabase() ? 'healthy' : 'unhealthy',
            'cache' => $this->checkCache() ? 'healthy' : 'unhealthy',
            'storage' => $this->checkStorage() ? 'healthy' : 'unhealthy',
            'queue' => $this->checkQueue() ? 'healthy' : 'unhealthy',
        ];
    }

    public function assertHealthy(): void
    {
        foreach ($this->checks() as $component => $status) {
            if ($status !== 'healthy') {
                throw new RuntimeException("{$component} check failed.");
            }
        }
    }

    public function checkDatabase(): bool
    {
        try {
            DB::connection()->getPdo();
            return true;
        } catch (\Exception $exception) {
            return false;
        }
    }

    public function checkCache(): bool
    {
        try {
            $key = 'system_health_check';
            Cache::put($key, 'ok', 5);
            return Cache::get($key) === 'ok';
        } catch (\Exception $exception) {
            return false;
        }
    }

    public function checkStorage(): bool
    {
        try {
            $disk = config('filesystems.default', 'local');
            $path = 'system/health-check.tmp';
            Storage::disk($disk)->put($path, 'ok');
            Storage::disk($disk)->delete($path);
            return true;
        } catch (\Exception $exception) {
            return false;
        }
    }

    public function checkQueue(): bool
    {
        $driver = config('queue.default', 'sync');

        if ($driver === 'sync') {
            return true;
        }

        try {
            if ($driver === 'database') {
                $table = config('queue.connections.database.table', 'jobs');
                DB::table($table)->limit(1)->get();
                return true;
            }

            if ($driver === 'redis') {
                $connection = config('queue.connections.redis.connection', 'default');
                app('redis')->connection($connection)->ping();
                return true;
            }

            Queue::connection($driver)->getName();
            return true;
        } catch (\Exception $exception) {
            return false;
        }
    }
}
