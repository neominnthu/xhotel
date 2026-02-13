<?php

namespace App\Console\Commands;

use App\Services\BackupService;
use Illuminate\Console\Command;

class SystemBackupPruneCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'system:backup-prune {--retain-days=} {--retain-count=}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Prune old system backups based on retention settings.';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $retainDays = $this->option('retain-days');
        $retainCount = $this->option('retain-count');

        $deleted = app(BackupService::class)->pruneBackups(
            $retainDays ? (int) $retainDays : null,
            $retainCount ? (int) $retainCount : null,
        );

        $this->info('Pruned backups: '.$deleted);

        return Command::SUCCESS;
    }
}
