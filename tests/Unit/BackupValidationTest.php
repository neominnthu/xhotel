<?php

namespace Tests\Unit;

use App\Models\SystemBackup;
use App\Services\BackupService;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class BackupValidationTest extends TestCase
{
    public function test_validate_backup_returns_failed_when_missing_file(): void
    {
        Storage::fake('local');

        $backup = new SystemBackup([
            'storage_disk' => 'local',
            'file_path' => 'system/backups/missing.sql',
            'driver' => 'mysql',
        ]);

        $result = app(BackupService::class)->validateBackup($backup);

        $this->assertSame('failed', $result['status']);
    }

    public function test_validate_backup_returns_ok_for_valid_sqlite_header(): void
    {
        Storage::fake('local');

        $payload = "SQLite format 3\0".str_repeat('\0', 100);
        Storage::disk('local')->put('system/backups/test.sqlite', $payload);

        $backup = new SystemBackup([
            'storage_disk' => 'local',
            'file_path' => 'system/backups/test.sqlite',
            'driver' => 'sqlite',
            'checksum' => hash('sha256', $payload),
        ]);

        $result = app(BackupService::class)->validateBackup($backup);

        $this->assertSame('ok', $result['status']);
    }
}
