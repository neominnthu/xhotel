<?php

namespace App\Console\Commands;

use App\Models\RoomStatusLog;
use Illuminate\Console\Command;

class PruneRoomStatusLogs extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'room-status-logs:prune {--days=180}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Prune room housekeeping status logs older than the retention window.';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $days = (int) $this->option('days');
        $cutoff = now()->subDays($days);

        $deleted = RoomStatusLog::query()
            ->where('changed_at', '<', $cutoff)
            ->delete();

        $this->info("Deleted {$deleted} room status logs older than {$days} days.");

        return self::SUCCESS;
    }
}
