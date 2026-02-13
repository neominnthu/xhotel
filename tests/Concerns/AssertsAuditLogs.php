<?php

namespace Tests\Concerns;

use App\Models\AuditLog;

trait AssertsAuditLogs
{
    protected function assertAuditLogged(string $action, string $resource): void
    {
        $this->assertDatabaseHas('audit_logs', [
            'action' => $action,
            'resource' => $resource,
        ]);
    }

    protected function assertAuditCount(int $count): void
    {
        $this->assertSame($count, AuditLog::query()->count());
    }
}
