<?php

namespace App\Jobs;

use App\Models\SystemUpdate;
use App\Models\User;
use App\Services\UpdateService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class ApplyUpdateJob implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public array $backoff = [60, 300, 600];

    public int $timeout = 900;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public int $updateId,
        public int $actorId,
    ) {
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $update = SystemUpdate::find($this->updateId);
        $actor = User::find($this->actorId);

        if (! $update || ! $actor) {
            return;
        }

        if (in_array($update->status, ['completed', 'failed', 'rolled_back', 'rollback_failed'], true)) {
            return;
        }

        app(UpdateService::class)->applyUpdate($update, $actor);
    }
}
