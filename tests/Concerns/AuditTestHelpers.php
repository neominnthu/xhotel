<?php

namespace Tests\Concerns;

use Illuminate\Support\Facades\Log;

trait AuditTestHelpers
{
    /**
     * Expect an audit log record in the database.
     */
    protected function assertAuditRecorded(int $userId, string $action, string $resource): void
    {
        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $userId,
            'action' => $action,
            'resource' => $resource,
        ]);
    }

    /**
     * Helper to set expectations for metric Log::info messages.
     */
    protected function expectMetricLogged(string $messageStartsWith, array $expectedData = [], int $times = 1): void
    {
        Log::shouldReceive('info')->times($times)->withArgs(function ($msg, $data) use ($messageStartsWith, $expectedData) {
            if (! str_starts_with($msg, $messageStartsWith)) {
                return false;
            }

            foreach ($expectedData as $k => $v) {
                if (! isset($data[$k]) || $data[$k] !== $v) {
                    return false;
                }
            }

            return true;
        });
    }
}
