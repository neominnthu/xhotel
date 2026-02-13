<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Services\HousekeepingPerformanceService;
use Carbon\Carbon;
use Illuminate\Console\Command;

class CalculateHousekeepingPerformance extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'housekeeping:calculate-performance
                            {--date= : Calculate performance for specific date (YYYY-MM-DD)}
                            {--user= : Calculate performance for specific user ID}
                            {--days=1 : Number of days to calculate (for bulk processing)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Calculate daily performance metrics for housekeeping staff';

    protected HousekeepingPerformanceService $performanceService;

    public function __construct(HousekeepingPerformanceService $performanceService)
    {
        parent::__construct();
        $this->performanceService = $performanceService;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $specificDate = $this->option('date');
        $specificUser = $this->option('user');
        $days = (int) $this->option('days');

        if ($specificDate && $specificUser) {
            // Calculate for specific user and date
            $this->calculateForUserAndDate($specificUser, $specificDate);
        } elseif ($specificDate) {
            // Calculate for all housekeeping users on specific date
            $this->calculateForDate(Carbon::parse($specificDate));
        } elseif ($specificUser) {
            // Calculate for specific user over last N days
            $this->calculateForUserOverDays($specificUser, $days);
        } else {
            // Calculate for all housekeeping users over last N days
            $this->calculateBulkPerformance($days);
        }

        $this->info('Housekeeping performance calculation completed.');
    }

    /**
     * Calculate performance for a specific user and date.
     */
    private function calculateForUserAndDate(string $userId, string $date): void
    {
        $user = User::find($userId);
        if (!$user) {
            $this->error("User with ID {$userId} not found.");
            return;
        }

        $this->info("Calculating performance for {$user->name} on {$date}");

        try {
            $performance = $this->performanceService->calculateDailyPerformance(
                $user,
                Carbon::parse($date)
            );

            $this->info("Performance calculated: Efficiency {$performance->efficiency_rating}, Tasks {$performance->tasks_completed}/{$performance->tasks_assigned}");
        } catch (\Exception $e) {
            $this->error("Failed to calculate performance: {$e->getMessage()}");
        }
    }

    /**
     * Calculate performance for all housekeeping users on a specific date.
     */
    private function calculateForDate(Carbon $date): void
    {
        $housekeepingUsers = User::whereHas('roles', function ($query) {
            $query->whereIn('name', ['housekeeping-supervisor', 'housekeeper']);
        })->get();

        $this->info("Calculating performance for {$housekeepingUsers->count()} housekeeping users on {$date->toDateString()}");

        $progressBar = $this->output->createProgressBar($housekeepingUsers->count());
        $progressBar->start();

        foreach ($housekeepingUsers as $user) {
            try {
                $this->performanceService->calculateDailyPerformance($user, $date);
            } catch (\Exception $e) {
                $this->error("Failed for user {$user->name}: {$e->getMessage()}");
            }
            $progressBar->advance();
        }

        $progressBar->finish();
        $this->newLine();
    }

    /**
     * Calculate performance for a specific user over the last N days.
     */
    private function calculateForUserOverDays(string $userId, int $days): void
    {
        $user = User::find($userId);
        if (!$user) {
            $this->error("User with ID {$userId} not found.");
            return;
        }

        $this->info("Calculating performance for {$user->name} over the last {$days} days");

        $progressBar = $this->output->createProgressBar($days);
        $progressBar->start();

        for ($i = 0; $i < $days; $i++) {
            $date = Carbon::now()->subDays($i);
            try {
                $this->performanceService->calculateDailyPerformance($user, $date);
            } catch (\Exception $e) {
                $this->error("Failed for {$date->toDateString()}: {$e->getMessage()}");
            }
            $progressBar->advance();
        }

        $progressBar->finish();
        $this->newLine();
    }

    /**
     * Calculate performance for all housekeeping users over the last N days.
     */
    private function calculateBulkPerformance(int $days): void
    {
        $housekeepingUsers = User::whereHas('roles', function ($query) {
            $query->whereIn('name', ['housekeeping-supervisor', 'housekeeper']);
        })->get();

        $totalCalculations = $housekeepingUsers->count() * $days;
        $this->info("Calculating performance for {$housekeepingUsers->count()} users over {$days} days ({$totalCalculations} calculations)");

        $progressBar = $this->output->createProgressBar($totalCalculations);
        $progressBar->start();

        foreach ($housekeepingUsers as $user) {
            for ($i = 0; $i < $days; $i++) {
                $date = Carbon::now()->subDays($i);
                try {
                    $this->performanceService->calculateDailyPerformance($user, $date);
                } catch (\Exception $e) {
                    $this->error("Failed for {$user->name} on {$date->toDateString()}: {$e->getMessage()}");
                }
                $progressBar->advance();
            }
        }

        $progressBar->finish();
        $this->newLine();
    }
}
