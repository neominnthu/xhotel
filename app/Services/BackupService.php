<?php

namespace App\Services;

use App\Models\SystemBackup;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Process;
use Illuminate\Support\Facades\Storage;
use RuntimeException;

class BackupService
{
    public function __construct(public AuditLogService $auditLogService)
    {
    }

    public function createBackup(User $actor, array $context = []): SystemBackup
    {
        $connection = config('database.default');
        $driver = config("database.connections.{$connection}.driver");
        $disk = config('updates.backup_disk', 'local');
        $backupPath = trim(config('updates.backup_path', 'system/backups'), '/');

        $backup = SystemBackup::create([
            'property_id' => $actor->property_id ?? 1,
            'initiated_by' => $actor->id,
            'status' => 'running',
            'driver' => $driver,
            'storage_disk' => $disk,
            'file_path' => $backupPath,
            'started_at' => now(),
            'meta' => $context,
        ]);

        Log::info('metrics.system.backup.started', [
            'backup_id' => $backup->id,
            'property_id' => $backup->property_id,
            'user_id' => $actor->id,
            'driver' => $driver,
        ]);

        try {
            $storedPath = $this->performBackup($backup, $connection, $driver, $disk, $backupPath);
            $fullPath = Storage::disk($disk)->path($storedPath);

            $backup->update([
                'status' => 'completed',
                'file_path' => $storedPath,
                'checksum' => is_file($fullPath) ? hash_file('sha256', $fullPath) : null,
                'size_bytes' => is_file($fullPath) ? filesize($fullPath) : 0,
                'completed_at' => now(),
            ]);

            $this->auditLogService->record($actor, 'system.backup.completed', 'system_backup', [
                'backup_id' => $backup->id,
                'driver' => $driver,
            ]);

            Log::info('metrics.system.backup.completed', [
                'backup_id' => $backup->id,
                'property_id' => $backup->property_id,
                'user_id' => $actor->id,
            ]);

            return $backup->fresh();
        } catch (RuntimeException $exception) {
            $backup->update([
                'status' => 'failed',
                'failed_at' => now(),
                'error_message' => $exception->getMessage(),
            ]);

            $this->auditLogService->record($actor, 'system.backup.failed', 'system_backup', [
                'backup_id' => $backup->id,
                'driver' => $driver,
                'error' => $exception->getMessage(),
            ]);

            throw $exception;
        }
    }

    public function restoreBackup(SystemBackup $backup, User $actor): void
    {
        $connection = config('database.default');
        $driver = config("database.connections.{$connection}.driver");
        $disk = $backup->storage_disk;
        $backupPath = $backup->file_path;

        if (! Storage::disk($disk)->exists($backupPath)) {
            throw new RuntimeException('Backup file not found.');
        }

        $backup->update([
            'status' => 'running',
            'started_at' => now(),
        ]);

        Log::info('metrics.system.rollback.started', [
            'backup_id' => $backup->id,
            'property_id' => $backup->property_id,
            'user_id' => $actor->id,
            'driver' => $driver,
        ]);

        try {
            $this->performRestore($backup, $connection, $driver, $disk, $backupPath);

            $backup->update([
                'status' => 'completed',
                'completed_at' => now(),
            ]);

            $this->auditLogService->record($actor, 'system.rollback.completed', 'system_backup', [
                'backup_id' => $backup->id,
                'driver' => $driver,
            ]);

            Log::info('metrics.system.rollback.completed', [
                'backup_id' => $backup->id,
                'property_id' => $backup->property_id,
                'user_id' => $actor->id,
            ]);
        } catch (RuntimeException $exception) {
            $backup->update([
                'status' => 'failed',
                'failed_at' => now(),
                'error_message' => $exception->getMessage(),
            ]);

            $this->auditLogService->record($actor, 'system.rollback.failed', 'system_backup', [
                'backup_id' => $backup->id,
                'driver' => $driver,
                'error' => $exception->getMessage(),
            ]);

            throw $exception;
        }
    }

    private function performBackup(
        SystemBackup $backup,
        string $connection,
        string $driver,
        string $disk,
        string $backupPath
    ): string {
        if ($driver === 'sqlite') {
            $database = config("database.connections.{$connection}.database");

            if ($database === ':memory:') {
                $backup->update([
                    'status' => 'completed',
                    'file_path' => 'memory',
                    'completed_at' => now(),
                    'meta' => array_merge($backup->meta ?? [], ['skipped' => true]),
                ]);

                return 'memory';
            }

            $target = $backupPath.'/backup-'.$backup->id.'.sqlite';
            Storage::disk($disk)->put($target, file_get_contents($database));

            return $target;
        }

        if ($driver === 'mysql' || $driver === 'mariadb') {
            $config = config("database.connections.{$connection}");
            $target = $backupPath.'/backup-'.$backup->id.'.sql';
            $fullPath = Storage::disk($disk)->path($target);
            $dumpBinary = config('updates.mysql_dump_path', 'mysqldump');

            $command = [
                $dumpBinary,
                '--user='.$config['username'],
                '--password='.$config['password'],
                '--host='.$config['host'],
                '--port='.$config['port'],
                $config['database'],
            ];

            $result = Process::run($command);

            if (! $result->successful()) {
                throw new RuntimeException('mysqldump failed: '.$result->errorOutput());
            }

            Storage::disk($disk)->put($target, $result->output());

            if (! is_file($fullPath)) {
                throw new RuntimeException('Backup file was not written.');
            }

            return $target;
        }

        throw new RuntimeException('Unsupported database driver for backup.');
    }

    private function performRestore(
        SystemBackup $backup,
        string $connection,
        string $driver,
        string $disk,
        string $backupPath
    ): void {
        if ($driver === 'sqlite') {
            $database = config("database.connections.{$connection}.database");

            if ($database === ':memory:') {
                return;
            }

            $fullPath = Storage::disk($disk)->path($backupPath);
            if (! is_file($fullPath)) {
                throw new RuntimeException('Backup file not found on disk.');
            }

            copy($fullPath, $database);

            return;
        }

        if ($driver === 'mysql' || $driver === 'mariadb') {
            $config = config("database.connections.{$connection}");
            $restoreBinary = config('updates.mysql_restore_path', 'mysql');
            $fullPath = Storage::disk($disk)->path($backupPath);

            if (! is_file($fullPath)) {
                throw new RuntimeException('Backup file not found on disk.');
            }

            $command = [
                $restoreBinary,
                '--user='.$config['username'],
                '--password='.$config['password'],
                '--host='.$config['host'],
                '--port='.$config['port'],
                $config['database'],
            ];

            $result = Process::run($command, input: file_get_contents($fullPath));

            if (! $result->successful()) {
                throw new RuntimeException('mysql restore failed: '.$result->errorOutput());
            }

            return;
        }

        throw new RuntimeException('Unsupported database driver for restore.');
    }

    public function validateBackup(SystemBackup $backup): array
    {
        $disk = $backup->storage_disk;
        $path = $backup->file_path;

        if (! $path || $path === 'memory') {
            return ['status' => 'skipped', 'message' => 'In-memory backup.'];
        }

        if (! Storage::disk($disk)->exists($path)) {
            return ['status' => 'failed', 'message' => 'Backup file not found.'];
        }

        $fullPath = Storage::disk($disk)->path($path);
        $checksum = $backup->checksum;
        if ($checksum && is_file($fullPath)) {
            $actual = hash_file('sha256', $fullPath);
            if (! hash_equals($checksum, $actual)) {
                return ['status' => 'failed', 'message' => 'Checksum mismatch.'];
            }
        }

        if ($backup->driver === 'sqlite') {
            $handle = fopen($fullPath, 'rb');
            $header = $handle ? fread($handle, 16) : '';
            if ($handle) {
                fclose($handle);
            }

            if (strpos((string) $header, 'SQLite format 3') !== 0) {
                return ['status' => 'failed', 'message' => 'Invalid SQLite header.'];
            }
        }

        if (in_array($backup->driver, ['mysql', 'mariadb'], true)) {
            $contents = file_get_contents($fullPath, false, null, 0, 512) ?: '';
            if (! str_contains($contents, 'CREATE') && ! str_contains($contents, 'INSERT')) {
                return ['status' => 'failed', 'message' => 'SQL backup content invalid.'];
            }
        }

        return ['status' => 'ok', 'message' => 'Backup verified.'];
    }

    public function runRestoreDrill(SystemBackup $backup): array
    {
        $result = $this->validateBackup($backup);
        if ($result['status'] !== 'ok') {
            return $result;
        }

        if ($backup->driver === 'sqlite') {
            $disk = $backup->storage_disk;
            $path = $backup->file_path;

            if (! $path || $path === 'memory') {
                return ['status' => 'skipped', 'message' => 'In-memory backup.'];
            }

            $fullPath = Storage::disk($disk)->path($path);
            $tempPath = 'system/backups/drills/backup-'.$backup->id.'-'.time().'.sqlite';
            Storage::disk($disk)->put($tempPath, file_get_contents($fullPath));
            Storage::disk($disk)->delete($tempPath);
        }

        return ['status' => 'ok', 'message' => 'Restore drill completed.'];
    }

    public function pruneBackups(?int $retainDays = null, ?int $retainCount = null): int
    {
        $retainDays = $retainDays ?? config('updates.backup_retention_days', 30);
        $retainCount = $retainCount ?? config('updates.backup_retention_count', 10);
        $retainCount = max($retainCount, 1);

        $backups = SystemBackup::query()
            ->where('status', 'completed')
            ->orderByDesc('created_at')
            ->get();

        $keepIds = $backups->take($retainCount)->pluck('id')->all();
        $threshold = $retainDays ? now()->subDays($retainDays) : null;

        $prunable = $backups->filter(function (SystemBackup $backup) use ($keepIds, $threshold) {
            if (in_array($backup->id, $keepIds, true)) {
                return false;
            }

            if ($threshold && $backup->created_at?->greaterThanOrEqualTo($threshold)) {
                return false;
            }

            return true;
        });

        $deleted = 0;

        foreach ($prunable as $backup) {
            if ($backup->file_path && $backup->file_path !== 'memory') {
                Storage::disk($backup->storage_disk)->delete($backup->file_path);
            }

            $backup->delete();
            $deleted++;
        }

        return $deleted;
    }
}
