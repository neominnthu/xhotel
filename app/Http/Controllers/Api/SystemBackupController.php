<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\System\StoreBackupRequest;
use App\Models\SystemBackup;
use App\Services\BackupService;
use Illuminate\Http\JsonResponse;
use RuntimeException;

class SystemBackupController extends Controller
{
    public function store(StoreBackupRequest $request, BackupService $service): JsonResponse
    {
        $this->authorize('create', SystemBackup::class);

        try {
            $backup = $service->createBackup($request->user(), [
                'reason' => $request->input('reason'),
                'source' => 'manual',
            ]);

            return response()->json([
                'backup_id' => $backup->id,
                'status' => $backup->status,
            ], 201);
        } catch (RuntimeException $exception) {
            return response()->json([
                'code' => 'BACKUP_FAILED',
                'message' => $exception->getMessage(),
            ], 500);
        }
    }
}
