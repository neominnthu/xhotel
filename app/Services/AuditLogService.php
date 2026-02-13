<?php

namespace App\Services;

use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Http\Request;

class AuditLogService
{
    public function record(
        User $user,
        string $action,
        string $resource,
        array $payload = [],
        ?Request $request = null
    ): AuditLog {
        $request = $request ?: request();

        return AuditLog::create([
            'property_id' => $user->property_id,
            'user_id' => $user->id,
            'action' => $action,
            'resource' => $resource,
            'payload' => $payload,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'created_at' => now(),
        ]);
    }
}
