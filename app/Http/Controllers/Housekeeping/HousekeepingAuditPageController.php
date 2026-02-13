<?php

namespace App\Http\Controllers\Housekeeping;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\HousekeepingTask;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class HousekeepingAuditPageController extends Controller
{
    public function index(): Response
    {
        Gate::authorize('viewAny', HousekeepingTask::class);

        $logs = AuditLog::query()
            ->where('resource', 'housekeeping_task')
            ->with('user')
            ->orderByDesc('created_at')
            ->limit(200)
            ->get();

        return Inertia::render('housekeeping/audit', [
            'logs' => $logs->map(fn (AuditLog $log) => [
                'id' => $log->id,
                'action' => $log->action,
                'created_at' => $log->created_at?->toDateTimeString(),
                'user' => $log->user
                    ? [
                        'id' => $log->user->id,
                        'name' => $log->user->name,
                    ]
                    : null,
                'payload' => $log->payload,
            ]),
        ]);
    }
}
