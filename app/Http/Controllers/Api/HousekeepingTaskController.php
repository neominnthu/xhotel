<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Housekeeping\BulkUpdateTaskRequest;
use App\Http\Requests\Housekeeping\IndexTaskRequest;
use App\Http\Requests\Housekeeping\StoreTaskRequest;
use App\Http\Requests\Housekeeping\UpdateTaskRequest;
use App\Models\HousekeepingTask;
use App\Models\Room;
use App\Models\RoomStatusLog;
use App\Services\AuditLogService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Gate;

class HousekeepingTaskController extends Controller
{
    public function index(IndexTaskRequest $request): JsonResponse
    {
        $filters = $request->validated('filter', []);
        $page = (int) ($request->validated('page', 1) ?? 1);
        $perPage = (int) ($request->validated('per_page', 15) ?? 15);

        $cacheKey = 'housekeeping.tasks.'.md5(json_encode([
            'filters' => $filters,
            'page' => $page,
            'per_page' => $perPage,
            'user_id' => $request->user()?->id,
        ]));

        $payload = Cache::remember($cacheKey, now()->addSeconds(30), function () use (
            $filters,
            $page,
            $perPage
        ): array {
            $query = HousekeepingTask::query()->with(['room', 'assignee']);

            $this->applyFilters($query, $filters);
            $this->applySorting($query, $filters);

            $tasks = $query->paginate($perPage, ['*'], 'page', $page);

            return [
                'data' => $tasks->getCollection()->map(fn (HousekeepingTask $task) => $this->mapTask($task)),
                'meta' => [
                    'current_page' => $tasks->currentPage(),
                    'last_page' => $tasks->lastPage(),
                    'per_page' => $tasks->perPage(),
                    'total' => $tasks->total(),
                ],
            ];
        });

        return response()->json($payload);
    }

    public function store(
        StoreTaskRequest $request,
        AuditLogService $auditLogService
    ): JsonResponse {
        $this->authorize('create', HousekeepingTask::class);

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

        return response()->json([
            'id' => $task->id,
            'status' => $task->status,
        ]);
    }

    public function update(
        UpdateTaskRequest $request,
        HousekeepingTask $task,
        AuditLogService $auditLogService
    ): JsonResponse {
        $this->authorize('update', $task);

        $this->applyTaskUpdate($task, $request->validated());

        if ($actor = $request->user()) {
            $auditLogService->record($actor, 'housekeeping.task.updated', 'housekeeping_task', [
                'task_id' => $task->id,
                'status' => $task->status,
                'assigned_to' => $task->assigned_to,
            ]);
        }

        return response()->json([
            'id' => $task->id,
            'status' => $task->status,
            'completed_at' => $task->completed_at?->toDateTimeString(),
        ]);
    }

    public function bulkUpdate(
        BulkUpdateTaskRequest $request,
        AuditLogService $auditLogService
    ): JsonResponse {
        $payload = $request->validated();
        $taskIds = $payload['task_ids'];
        $updates = [];

        if (array_key_exists('status', $payload)) {
            $updates['status'] = $payload['status'];
        }

        if (array_key_exists('assigned_to', $payload)) {
            $updates['assigned_to'] = $payload['assigned_to'];
        }

        $tasks = HousekeepingTask::query()
            ->whereIn('id', $taskIds)
            ->get();

        foreach ($tasks as $task) {
            Gate::authorize('update', $task);
            $this->applyTaskUpdate($task, $updates);
        }

        if ($actor = $request->user()) {
            $auditLogService->record($actor, 'housekeeping.task.bulk_updated', 'housekeeping_task', [
                'task_ids' => $taskIds,
                'status' => $updates['status'] ?? null,
                'assigned_to' => $updates['assigned_to'] ?? null,
            ]);
        }

        return response()->json([
            'updated' => $tasks->count(),
        ]);
    }

    private function applyTaskUpdate(HousekeepingTask $task, array $updates): void
    {
        $statusProvided = array_key_exists('status', $updates);

        $task->fill($updates);

        if ($statusProvided) {
            if ($task->status === 'completed' && ! $task->completed_at) {
                $task->completed_at = now();
            } elseif ($task->status !== 'completed') {
                $task->completed_at = null;
            }
        }

        $task->save();

        if ($statusProvided) {
            $this->syncRoomHousekeepingStatus($task);
        }
    }

    private function applyFilters(Builder $query, array $filters): void
    {
        $status = $filters['status'] ?? null;
        if ($status) {
            $query->where('status', $status);
        }

        $priority = $filters['priority'] ?? null;
        if ($priority) {
            $query->where('priority', $priority);
        }

        $roomId = $filters['room_id'] ?? null;
        if ($roomId) {
            $query->where('room_id', $roomId);
        }

        $type = $filters['type'] ?? null;
        if ($type) {
            $query->where('type', $type);
        }

        $assignedTo = $filters['assigned_to'] ?? null;
        if ($assignedTo) {
            if ($assignedTo === 'unassigned') {
                $query->whereNull('assigned_to');
            } else {
                $query->where('assigned_to', $assignedTo);
            }
        }

        $roomStatus = $filters['room_status'] ?? null;
        if ($roomStatus) {
            $query->whereHas('room', function ($builder) use ($roomStatus) {
                $builder->where('housekeeping_status', $roomStatus);
            });
        }

        $dueFrom = $filters['due_from'] ?? null;
        if ($dueFrom) {
            $query->whereDate('due_at', '>=', $dueFrom);
        }

        $dueTo = $filters['due_to'] ?? null;
        if ($dueTo) {
            $query->whereDate('due_at', '<=', $dueTo);
        }

        $completedFrom = $filters['completed_from'] ?? null;
        if ($completedFrom) {
            $query->whereDate('completed_at', '>=', $completedFrom);
        }

        $completedTo = $filters['completed_to'] ?? null;
        if ($completedTo) {
            $query->whereDate('completed_at', '<=', $completedTo);
        }

        $overdue = filter_var($filters['overdue'] ?? false, FILTER_VALIDATE_BOOLEAN);
        if ($overdue) {
            $query
                ->whereNotNull('due_at')
                ->whereDate('due_at', '<', today())
                ->where('status', '!=', 'completed');
        }
    }

    private function applySorting(Builder $query, array $filters): void
    {
        $sort = $filters['sort'] ?? 'due_at';
        $direction = ($filters['sort_dir'] ?? 'asc') === 'desc' ? 'desc' : 'asc';

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
    }

    private function mapTask(HousekeepingTask $task): array
    {
        return [
            'id' => $task->id,
            'type' => $task->type,
            'status' => $task->status,
            'priority' => $task->priority,
            'assigned_to' => $task->assigned_to,
            'due_at' => $task->due_at?->toDateTimeString(),
            'completed_at' => $task->completed_at?->toDateTimeString(),
            'room' => $task->room
                ? [
                    'id' => $task->room->id,
                    'number' => $task->room->number,
                    'room_status' => $task->room->housekeeping_status,
                ]
                : null,
            'assignee' => $task->assignee
                ? [
                    'id' => $task->assignee->id,
                    'name' => $task->assignee->name,
                ]
                : null,
        ];
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
