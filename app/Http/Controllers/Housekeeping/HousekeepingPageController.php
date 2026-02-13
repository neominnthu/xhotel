<?php

namespace App\Http\Controllers\Housekeeping;

use App\Http\Controllers\Controller;
use App\Http\Requests\Housekeeping\StoreTaskRequest;
use App\Http\Requests\Housekeeping\UpdateTaskRequest;
use App\Models\HousekeepingTask;
use App\Models\Room;
use App\Models\RoomStatusLog;
use App\Services\AuditLogService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Symfony\Component\HttpFoundation\StreamedResponse;

class HousekeepingPageController extends Controller
{
    public function store(
        StoreTaskRequest $request,
        AuditLogService $auditLogService
    ): RedirectResponse {
        Gate::authorize('create', HousekeepingTask::class);

        $task = HousekeepingTask::create([
            'room_id' => $request->validated('room_id'),
            'type' => $request->validated('type'),
            'status' => 'open',
            'priority' => $request->validated('priority', 'normal'),
            'assigned_to' => $request->validated('assigned_to'),
            'due_at' => $request->validated('due_at'),
        ]);

        if ($actor = $request->user()) {
            $auditLogService->record($actor, 'housekeeping.task.created', 'housekeeping_task', [
                'task_id' => $task->id,
                'room_id' => $task->room_id,
                'type' => $task->type,
                'assigned_to' => $task->assigned_to,
                'due_at' => $task->due_at?->toDateTimeString(),
            ]);
        }

        return redirect()->route('housekeeping.index');
    }

    public function update(
        UpdateTaskRequest $request,
        HousekeepingTask $task,
        AuditLogService $auditLogService
    ): RedirectResponse {
        Gate::authorize('update', $task);

        $task->fill($request->validated());

        if ($task->status === 'in_progress' && ! $task->started_at) {
            $task->started_at = now();
        }

        if ($task->status === 'completed') {
            $task->started_at ??= now();
            $task->completed_at ??= now();
            $task->completed_by ??= $request->user()?->id;

            if ($task->started_at && $task->completed_at) {
                $task->actual_duration_minutes = $task->started_at->diffInMinutes($task->completed_at);
            }
        } else {
            $task->completed_at = null;
            $task->completed_by = null;
            $task->actual_duration_minutes = null;

            if ($task->status === 'open') {
                $task->started_at = null;
            }
        }

        $task->save();

        $this->syncRoomHousekeepingStatus($task);

        if ($actor = $request->user()) {
            $auditLogService->record($actor, 'housekeeping.task.updated', 'housekeeping_task', [
                'task_id' => $task->id,
                'status' => $task->status,
                'assigned_to' => $task->assigned_to,
            ]);
        }

        return redirect()->route('housekeeping.index');
    }

    public function export(Request $request): StreamedResponse
    {
        Gate::authorize('viewAny', HousekeepingTask::class);

        $query = HousekeepingTask::query()->with(['room', 'assignee']);

        $status = $request->input('status');
        if ($status) {
            $query->where('status', $status);
        }

        $priority = $request->input('priority');
        if ($priority) {
            $query->where('priority', $priority);
        }

        $type = $request->input('type');
        if ($type) {
            $query->where('type', $type);
        }

        $dueFrom = $request->input('due_from');
        if ($dueFrom) {
            $query->whereDate('due_at', '>=', $dueFrom);
        }

        $dueTo = $request->input('due_to');
        if ($dueTo) {
            $query->whereDate('due_at', '<=', $dueTo);
        }

        $completedFrom = $request->input('completed_from');
        if ($completedFrom) {
            $query->whereDate('completed_at', '>=', $completedFrom);
        }

        $completedTo = $request->input('completed_to');
        if ($completedTo) {
            $query->whereDate('completed_at', '<=', $completedTo);
        }

        $assignedTo = $request->input('assigned_to');
        if ($assignedTo) {
            if ($assignedTo === 'unassigned') {
                $query->whereNull('assigned_to');
            } else {
                $query->where('assigned_to', $assignedTo);
            }
        }

        $roomStatus = $request->input('room_status');
        if ($roomStatus) {
            $query->whereHas('room', function ($builder) use ($roomStatus) {
                $builder->where('housekeeping_status', $roomStatus);
            });
        }

        $roomId = $request->input('room_id');
        if ($roomId) {
            $query->where('room_id', $roomId);
        }

        $overdue = $request->boolean('overdue');
        if ($overdue) {
            $query
                ->whereNotNull('due_at')
                ->whereDate('due_at', '<', today())
                ->where('status', '!=', 'completed');
        }

        $sort = $request->input('sort', 'due_at');
        $sortDir = $request->input('sort_dir', 'asc');
        $direction = $sortDir === 'desc' ? 'desc' : 'asc';

        switch ($sort) {
            case 'priority':
                $query->orderByRaw(
                    "CASE priority WHEN 'low' THEN 1 WHEN 'normal' THEN 2 WHEN 'high' THEN 3 ELSE 4 END {$direction}"
                );
                break;
            case 'room_number':
                $query->orderBy(
                    Room::select('number')
                        ->whereColumn('rooms.id', 'housekeeping_tasks.room_id'),
                    $direction
                );
                break;
            case 'due_at':
            default:
                $query->orderBy('due_at', $direction);
                break;
        }

        $tasks = $query->get();

        return response()->streamDownload(function () use ($tasks) {
            $handle = fopen('php://output', 'w');

            fputcsv($handle, [
                'room',
                'type',
                'status',
                'priority',
                'assignee',
                'due_at',
            ]);

            foreach ($tasks as $task) {
                fputcsv($handle, [
                    $task->room?->number,
                    $task->type,
                    $task->status,
                    $task->priority,
                    $task->assignee?->name,
                    $task->due_at?->toDateTimeString(),
                ]);
            }

            fclose($handle);
        }, 'housekeeping-tasks.csv', [
            'Content-Type' => 'text/csv',
        ]);
    }

    private function syncRoomHousekeepingStatus(HousekeepingTask $task): void
    {
        if ($task->status !== 'completed') {
            return;
        }

        $task->loadMissing('room');

        if (! $task->room) {
            return;
        }

        $status = match ($task->type) {
            'clean' => 'clean',
            'inspect' => 'inspected',
            'maintenance' => 'dirty',
            default => null,
        };

        if (! $status) {
            return;
        }

        $room = $task->room;
        $fromStatus = $room->housekeeping_status;

        if ($fromStatus === $status) {
            return;
        }

        $room->update(['housekeeping_status' => $status]);

        RoomStatusLog::create([
            'room_id' => $room->id,
            'from_status' => $fromStatus,
            'to_status' => $status,
            'changed_by' => auth()->id(),
            'changed_at' => now(),
        ]);
    }
}
