<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\System\ApplyUpdateRequest;
use App\Http\Requests\System\CheckUpdateRequest;
use App\Http\Requests\System\RollbackUpdateRequest;
use App\Jobs\RollbackUpdateJob;
use App\Models\SystemUpdate;
use App\Services\UpdateService;
use Illuminate\Http\JsonResponse;
use RuntimeException;

class SystemUpdateController extends Controller
{
    public function check(CheckUpdateRequest $request, UpdateService $service): JsonResponse
    {
        $this->authorize('viewAny', SystemUpdate::class);

        return response()->json($service->checkForUpdates($request->user()));
    }

    public function apply(ApplyUpdateRequest $request, UpdateService $service): JsonResponse
    {
        $this->authorize('create', SystemUpdate::class);

        try {
            $update = $service->startUpdate($request->user(), $request->validated());

            return response()->json([
                'update_id' => $update->id,
                'status' => $update->status,
            ], 202);
        } catch (RuntimeException $exception) {
            $raw = $exception->getMessage();

            if ($raw === 'UPDATE_IN_PROGRESS') {
                return response()->json([
                    'code' => 'UPDATE_IN_PROGRESS',
                    'message' => 'Update already in progress.',
                ], 409);
            }

            $reason = str_starts_with($raw, 'UPDATE_PRECHECK_FAILED:')
                ? substr($raw, strlen('UPDATE_PRECHECK_FAILED:'))
                : null;

            return response()->json([
                'code' => 'UPDATE_PRECHECK_FAILED',
                'message' => $reason ?: 'Update precheck failed.',
            ], 409);
        }
    }

    public function rollback(RollbackUpdateRequest $request, UpdateService $service): JsonResponse
    {
        $this->authorize('create', SystemUpdate::class);

        $update = SystemUpdate::query()
            ->when($request->filled('update_id'), fn ($query) => $query->where('id', $request->update_id))
            ->latest('id')
            ->first();

        if (! $update) {
            return response()->json([
                'code' => 'UPDATE_PACKAGE_NOT_FOUND',
                'message' => 'Update not found.',
            ], 404);
        }

        RollbackUpdateJob::dispatch($update->id, $request->user()->id, (bool) $request->confirm_db_restore);

        return response()->json([
            'update_id' => $update->id,
            'status' => 'rollback_queued',
        ], 202);
    }
}
