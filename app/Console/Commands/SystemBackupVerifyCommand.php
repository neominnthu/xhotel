<?php

namespace App\Console\Commands;

use App\Models\SystemBackup;
use App\Services\BackupService;
use Illuminate\Console\Command;

class SystemBackupVerifyCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'system:backup-verify {--limit=10} {--property_id=}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Validate recent system backups.';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $limit = (int) $this->option('limit');
        $propertyId = $this->option('property_id');

        $backups = SystemBackup::query()
            ->where('status', 'completed')
            ->when($propertyId, fn ($query) => $query->where('property_id', $propertyId))
            ->latest('created_at')
            ->limit($limit > 0 ? $limit : 10)
            ->get();

        if ($backups->isEmpty()) {
            $this->info('No backups found.');
            return Command::SUCCESS;
        }

        $service = app(BackupService::class);
        $failed = 0;

        foreach ($backups as $backup) {
            $result = $service->validateBackup($backup);
            $status = $result['status'];
            $message = $result['message'];

            $this->line("#{$backup->id} {$backup->driver} {$status}: {$message}");

            if ($status === 'failed') {
                $failed++;
            }
        }

        if ($failed > 0) {
            $this->error("{$failed} backups failed validation.");
            return Command::FAILURE;
        }

        $this->info('All backups validated.');

        return Command::SUCCESS;
    }
}
