<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Services\BackupService;
use Illuminate\Console\Command;

class SystemBackupCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'system:backup {--property_id=} {--source=scheduled} {--reason=}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a system backup.';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $propertyId = $this->option('property_id');
        $source = $this->option('source') ?? 'scheduled';
        $reason = $this->option('reason') ?? 'Scheduled backup';

        $actor = User::query()
            ->when($propertyId, fn ($query) => $query->where('property_id', $propertyId))
            ->where('is_active', true)
            ->whereIn('role', ['admin', 'reservation_manager'])
            ->first();

        if (! $actor) {
            $actor = User::query()
                ->when($propertyId, fn ($query) => $query->where('property_id', $propertyId))
                ->where('is_active', true)
                ->orderBy('id')
                ->first();
        }

        if (! $actor) {
            $this->error('No active user found to run backup.');
            return Command::FAILURE;
        }

        $backup = app(BackupService::class)->createBackup($actor, [
            'reason' => $reason,
            'source' => $source,
        ]);

        $this->info('Backup created: '.$backup->id);

        return Command::SUCCESS;
    }
}
