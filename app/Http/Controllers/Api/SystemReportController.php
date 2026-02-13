<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\System\StoreErrorReportRequest;
use App\Models\ErrorReport;
use App\Services\AuditLogService;
use App\Services\GithubReportService;
use Illuminate\Http\JsonResponse;
use RuntimeException;

class SystemReportController extends Controller
{
    public function store(
        StoreErrorReportRequest $request,
        GithubReportService $service,
        AuditLogService $auditLogService
    ): JsonResponse
    {
        $this->authorize('create', ErrorReport::class);

        $report = ErrorReport::create([
            'property_id' => $request->user()?->property_id,
            'user_id' => $request->user()?->id,
            'title' => $request->input('title'),
            'severity' => $request->input('severity', 'medium'),
            'message' => $request->input('message'),
            'trace_id' => $request->input('trace_id'),
            'url' => $request->input('url'),
            'app_version' => $request->input('app_version'),
            'payload' => $request->input('payload'),
            'status' => 'pending',
        ]);

        if ($actor = $request->user()) {
            $auditLogService->record($actor, 'system.error_report.created', 'error_report', [
                'report_id' => $report->id,
                'severity' => $report->severity,
            ]);
        }

        try {
            $issue = $service->createIssue($report);

            $report->update([
                'status' => 'sent',
                'github_issue_url' => $issue['html_url'] ?? null,
                'github_issue_number' => $issue['number'] ?? null,
                'sent_at' => now(),
            ]);

            return response()->json([
                'report_id' => $report->id,
                'status' => $report->status,
                'github_issue_url' => $report->github_issue_url,
            ], 201);
        } catch (RuntimeException $exception) {
            $report->update([
                'status' => 'failed',
                'failed_at' => now(),
                'error_message' => $exception->getMessage(),
            ]);

            return response()->json([
                'code' => 'REPORT_GITHUB_UNAVAILABLE',
                'message' => $exception->getMessage(),
            ], 502);
        }
    }
}
