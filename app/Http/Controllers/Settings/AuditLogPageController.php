<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\AuditLogExportRequest;
use App\Http\Requests\AuditLogIndexRequest;
use App\Models\AuditLog;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AuditLogPageController extends Controller
{
    public function index(AuditLogIndexRequest $request): Response
    {
        $this->authorize('viewAny', AuditLog::class);

        $filters = $request->validated();
        $propertyId = $request->user()?->property_id;

        $query = AuditLog::query()
            ->with('user')
            ->when($propertyId, fn ($query) => $query->where('property_id', $propertyId))
            ->latest('created_at');

        $this->applyFilters($query, $filters);

        $logs = $query->limit(100)->get();

        return Inertia::render('settings/audit-logs/index', [
            'logs' => $logs->map(fn (AuditLog $log) => [
                'id' => $log->id,
                'action' => $log->action,
                'resource' => $log->resource,
                'payload' => $log->payload,
                'ip_address' => $log->ip_address,
                'user_agent' => $log->user_agent,
                'created_at' => $log->created_at?->toDateTimeString(),
                'user' => $log->user
                    ? [
                        'id' => $log->user->id,
                        'name' => $log->user->name,
                        'role' => $log->user->role,
                    ]
                    : null,
            ]),
            'filters' => $filters,
            'can_export' => $this->canExport($request->user()),
        ]);
    }

    public function export(AuditLogExportRequest $request): StreamedResponse
    {
        $this->authorize('viewAny', AuditLog::class);

        if (! $this->canExport($request->user())) {
            abort(403);
        }

        $filters = $request->validated();
        $propertyId = $request->user()?->property_id;

        $query = AuditLog::query()
            ->with('user')
            ->when($propertyId, fn ($query) => $query->where('property_id', $propertyId))
            ->latest('created_at');

        $this->applyFilters($query, $filters);

        $filename = 'audit-logs-'.now()->format('Ymd-His').'.csv';

        return response()->streamDownload(function () use ($query) {
            $handle = fopen('php://output', 'w');

            fputcsv($handle, [
                'ID',
                'Action',
                'Resource',
                'User',
                'Role',
                'IP Address',
                'Created At',
            ]);

            $query->chunk(500, function ($logs) use ($handle) {
                foreach ($logs as $log) {
                    fputcsv($handle, [
                        $log->id,
                        $log->action,
                        $log->resource,
                        $log->user?->name,
                        $log->user?->role,
                        $log->ip_address,
                        $log->created_at?->toDateTimeString(),
                    ]);
                }
            });

            fclose($handle);
        }, $filename, [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }

    private function applyFilters($query, array $filters): void
    {
        if (! empty($filters['action'])) {
            $query->where('action', 'like', '%'.$filters['action'].'%');
        }

        if (! empty($filters['resource'])) {
            $query->where('resource', 'like', '%'.$filters['resource'].'%');
        }

        if (! empty($filters['user_id'])) {
            $query->where('user_id', $filters['user_id']);
        }

        if (! empty($filters['date_from'])) {
            $query->where('created_at', '>=', $filters['date_from'].' 00:00:00');
        }

        if (! empty($filters['date_to'])) {
            $query->where('created_at', '<=', $filters['date_to'].' 23:59:59');
        }

        if (! empty($filters['q'])) {
            $query->where(function ($builder) use ($filters) {
                $builder->where('action', 'like', '%'.$filters['q'].'%')
                    ->orWhere('resource', 'like', '%'.$filters['q'].'%');
            });
        }
    }

    private function canExport(?User $user): bool
    {
        if (! $user) {
            return false;
        }

        return ($user->role ?? null) === 'admin'
            || $user->hasPermission('export-audit-logs');
    }
}
