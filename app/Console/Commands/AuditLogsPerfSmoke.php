<?php

namespace App\Console\Commands;

use App\Models\AuditLog;
use Illuminate\Console\Command;

class AuditLogsPerfSmoke extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'audit:perf-smoke';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Run a lightweight audit_logs query timing smoke check';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('Running audit_logs performance smoke check...');

        $start = microtime(true);
        $total = AuditLog::query()->count();
        $countMs = (microtime(true) - $start) * 1000;

        $queryStart = microtime(true);
        $query = AuditLog::query()->orderByDesc('id')->limit(100);
        $sample = $query->get();
        $queryMs = (microtime(true) - $queryStart) * 1000;

        $propertyId = $sample->first()?->property_id;
        if ($propertyId !== null) {
            $filteredStart = microtime(true);
            $filtered = AuditLog::query()
                ->where('property_id', $propertyId)
                ->orderByDesc('id')
                ->limit(100)
                ->get();
            $filteredMs = (microtime(true) - $filteredStart) * 1000;

            $this->line(sprintf('Filtered query (property_id=%d): %d rows in %.2f ms', $propertyId, $filtered->count(), $filteredMs));
        }

        $this->line(sprintf('Total audit_logs: %d (count in %.2f ms)', $total, $countMs));
        $this->line(sprintf('Latest 100 rows: %d (query in %.2f ms)', $sample->count(), $queryMs));

        return self::SUCCESS;
    }
}
