<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\ErrorReport;
use App\Models\SystemBackup;
use App\Http\Requests\System\ApplyUpdateRequest;
use App\Http\Requests\System\RollbackUpdateRequest;
use App\Http\Requests\System\StoreBackupRequest;
use App\Http\Requests\System\StoreErrorReportRequest;
use App\Models\SystemUpdateLog;
use App\Models\SystemUpdate;
use App\Services\BackupService;
use App\Services\AuditLogService;
use App\Services\GithubReportService;
use App\Services\UpdateService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use RuntimeException;
use Inertia\Inertia;
use Inertia\Response;

class UpdatePageController extends Controller
{
    public function index(Request $request, UpdateService $service): Response
    {
        $this->authorize('viewAny', SystemUpdate::class);

        $propertyId = $request->user()?->property_id;
        $updates = SystemUpdate::query()
            ->when($propertyId, fn ($query) => $query->where('property_id', $propertyId))
            ->latest('id')
            ->limit(5)
            ->get();

        $latestUpdate = $updates->first();
        $updateLogs = $latestUpdate
            ? SystemUpdateLog::query()
                ->where('system_update_id', $latestUpdate->id)
                ->latest('id')
                ->limit(25)
                ->get()
            : collect();

        $backups = SystemBackup::query()
            ->when($propertyId, fn ($query) => $query->where('property_id', $propertyId))
            ->latest('id')
            ->limit(5)
            ->get();

        $reports = ErrorReport::query()
            ->when($propertyId, fn ($query) => $query->where('property_id', $propertyId))
            ->latest('id')
            ->limit(5)
            ->get();

        $check = $service->checkForUpdates($request->user());
        $prechecks = $service->precheckStatus($request->user());

        return Inertia::render('settings/updates/index', [
            'update_status' => $check,
            'prechecks' => $prechecks,
            'updates' => $updates->map(fn (SystemUpdate $update) => [
                'id' => $update->id,
                'status' => $update->status,
                'version_from' => $update->version_from,
                'version_to' => $update->version_to,
                'release_tag' => $update->release_tag,
                'release_url' => $update->release_url,
                'started_at' => $update->started_at?->toDateTimeString(),
                'completed_at' => $update->completed_at?->toDateTimeString(),
                'failed_at' => $update->failed_at?->toDateTimeString(),
                'error_message' => $update->error_message,
            ]),
            'update_logs' => $updateLogs->map(fn (SystemUpdateLog $log) => [
                'id' => $log->id,
                'level' => $log->level,
                'message' => $log->message,
                'created_at' => $log->created_at?->toDateTimeString(),
            ]),
            'backups' => $backups->map(fn (SystemBackup $backup) => [
                'id' => $backup->id,
                'status' => $backup->status,
                'driver' => $backup->driver,
                'file_path' => $backup->file_path,
                'size_bytes' => $backup->size_bytes,
                'completed_at' => $backup->completed_at?->toDateTimeString(),
            ]),
            'reports' => $reports->map(fn (ErrorReport $report) => [
                'id' => $report->id,
                'title' => $report->title,
                'severity' => $report->severity,
                'status' => $report->status,
                'github_issue_url' => $report->github_issue_url,
                'created_at' => $report->created_at?->toDateTimeString(),
            ]),
            'updates_enabled' => config('updates.enabled'),
        ]);
    }

    public function apply(ApplyUpdateRequest $request, UpdateService $service): RedirectResponse
    {
        $this->authorize('create', SystemUpdate::class);

        try {
            $service->startUpdate($request->user(), $request->validated());

            return back()->with('success', 'Update ကို စတင်လိုက်ပါပြီ။');
        } catch (RuntimeException $exception) {
            $raw = $exception->getMessage();

            if ($raw === 'UPDATE_IN_PROGRESS') {
                return back()->with('error', 'Update လုပ်နေပါသည်။ ခဏစောင့်ပါ။');
            }

            $reason = str_starts_with($raw, 'UPDATE_PRECHECK_FAILED:')
                ? substr($raw, strlen('UPDATE_PRECHECK_FAILED:'))
                : null;

            return back()->with('error', $reason
                ? "Update မလုပ်မီ စစ်ဆေးမှု မအောင်မြင်ပါ: {$reason}"
                : 'Update မလုပ်မီ စစ်ဆေးမှုများ မအောင်မြင်ပါ။');
        }
    }

    public function rollback(RollbackUpdateRequest $request): RedirectResponse
    {
        $this->authorize('create', SystemUpdate::class);

        $update = SystemUpdate::query()
            ->when($request->filled('update_id'), fn ($query) => $query->where('id', $request->update_id))
            ->latest('id')
            ->first();

        if (! $update) {
            return back()->with('error', 'Rollback လုပ်ရန် update မတွေ့ပါ။');
        }

        dispatch(new \App\Jobs\RollbackUpdateJob(
            $update->id,
            $request->user()->id,
            (bool) $request->confirm_db_restore
        ));

        return back()->with('success', 'Rollback ကို စတင်လိုက်ပါပြီ။');
    }

    public function backup(StoreBackupRequest $request, BackupService $service): RedirectResponse
    {
        $this->authorize('create', SystemBackup::class);

        $service->createBackup($request->user(), [
            'reason' => $request->input('reason'),
            'source' => 'manual',
        ]);

        return back()->with('success', 'Backup အောင်မြင်ပါသည်။');
    }

    public function report(
        StoreErrorReportRequest $request,
        GithubReportService $service,
        AuditLogService $auditLogService
    ): RedirectResponse
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

            return back()->with('success', 'Report ကို GitHub သို့ ပို့ပြီးပါပြီ။');
        } catch (RuntimeException $exception) {
            $report->update([
                'status' => 'failed',
                'failed_at' => now(),
                'error_message' => $exception->getMessage(),
            ]);

            return back()->with('error', 'Report ပို့ရာတွင် ပြဿနာ ဖြစ်ပွားပါသည်။');
        }
    }
}
