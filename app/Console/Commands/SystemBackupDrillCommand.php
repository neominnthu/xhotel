<?php

namespace App\Console\Commands;

use App\Models\SystemBackup;
use App\Services\BackupService;
use Illuminate\Console\Command;

class SystemBackupDrillCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'system:backup-drill {--backup_id=} {--property_id=}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Run a non-destructive restore drill for backups.';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $backupId = $this->option('backup_id');
        $propertyId = $this->option('property_id');

        $backup = SystemBackup::query()
            ->where('status', 'completed')
            ->when($backupId, fn ($query) => $query->where('id', $backupId))
            ->when($propertyId, fn ($query) => $query->where('property_id', $propertyId))
            ->latest('created_at')
            ->first();

        if (! $backup) {
            $this->error('Backup not found.');
            return Command::FAILURE;
        }

        $result = app(BackupService::class)->runRestoreDrill($backup);

        $this->line("#{$backup->id} {$backup->driver} {$result['status']}: {$result['message']}");

        return $result['status'] === 'ok' ? Command::SUCCESS : Command::FAILURE;
    }
}
