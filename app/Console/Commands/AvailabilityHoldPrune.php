<?php

namespace App\Console\Commands;

use App\Models\AvailabilityHold;
use Illuminate\Console\Command;

class AvailabilityHoldPrune extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'availability-holds:prune {--dry-run}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Remove expired availability holds.';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $query = AvailabilityHold::query()->where('expires_at', '<=', now());
        $count = $query->count();

        if ($this->option('dry-run')) {
            $this->info("{$count} expired availability holds would be deleted.");

            return Command::SUCCESS;
        }

        $deleted = $query->delete();

        $this->info("Deleted {$deleted} expired availability holds.");

        return Command::SUCCESS;
    }
}
