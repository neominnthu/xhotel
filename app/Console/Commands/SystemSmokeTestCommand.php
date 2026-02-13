<?php

namespace App\Console\Commands;

use App\Services\SystemHealthService;
use Illuminate\Console\Command;

class SystemSmokeTestCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'system:smoke-test';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Run lightweight system smoke tests.';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $checks = app(SystemHealthService::class)->checks();
        $failed = collect($checks)->filter(fn ($status) => $status !== 'healthy');

        foreach ($checks as $component => $status) {
            $this->line("{$component}: {$status}");
        }

        if ($failed->isNotEmpty()) {
            $this->error('Smoke tests failed.');
            return Command::FAILURE;
        }

        $this->info('Smoke tests passed.');
        return Command::SUCCESS;
    }
}
