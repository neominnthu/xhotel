<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HousekeepingTask;
use App\Models\Room;
use App\Models\RoomStatusLog;
use Illuminate\Http\JsonResponse;

class RoomStatusLogController extends Controller
{
    public function index(Room $room): JsonResponse
    {
        $this->authorize('viewAny', HousekeepingTask::class);

        $logs = RoomStatusLog::query()
            ->where('room_id', $room->id)
            ->with('changedBy')
            ->orderByDesc('changed_at')
            ->get();

        return response()->json([
            'room' => [
                'id' => $room->id,
                'number' => $room->number,
                'housekeeping_status' => $room->housekeeping_status,
            ],
            'data' => $logs->map(fn (RoomStatusLog $log) => [
                'id' => $log->id,
                'from_status' => $log->from_status,
                'to_status' => $log->to_status,
                'changed_at' => $log->changed_at?->toDateTimeString(),
                'changed_by' => $log->changedBy
                    ? [
                        'id' => $log->changedBy->id,
                        'name' => $log->changedBy->name,
                    ]
                    : null,
            ]),
        ]);
    }
}
