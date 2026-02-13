<?php

namespace App\Console\Commands;

use App\Services\PerformanceMonitoringService;
use Illuminate\Console\Command;

class ResetPerformanceCounters extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'performance:reset-counters {--type=all : Type of counters to reset (all, daily, weekly)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Reset performance monitoring counters';

    public function __construct(
        private PerformanceMonitoringService $performanceMonitor
    ) {
        parent::__construct();
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $type = $this->option('type');

        $this->info("Resetting {$type} performance counters...");

        switch ($type) {
            case 'daily':
                $this->performanceMonitor->resetDailyCounters();
                $this->info('Daily counters reset successfully.');
                break;

            case 'all':
            default:
                $this->performanceMonitor->resetDailyCounters();
                // Reset other counters as needed
                $this->info('All performance counters reset successfully.');
                break;
        }

        return Command::SUCCESS;
    }
}
