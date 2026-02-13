<?php

namespace App\Http\Controllers\Housekeeping;

use App\Http\Controllers\Controller;
use App\Models\HousekeepingTask;
use App\Models\Room;
use App\Models\RoomStatusLog;
use Illuminate\Support\Facades\Gate;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Inertia\Inertia;
use Inertia\Response;

class RoomHistoryPageController extends Controller
{
    public function show(Room $room): Response
    {
        Gate::authorize('viewAny', HousekeepingTask::class);

        $logs = RoomStatusLog::query()
            ->where('room_id', $room->id)
            ->with('changedBy')
            ->orderByDesc('changed_at')
            ->get();

        return Inertia::render('housekeeping/room-history', [
            'room' => [
                'id' => $room->id,
                'number' => $room->number,
                'housekeeping_status' => $room->housekeeping_status,
            ],
            'logs' => $logs->map(fn (RoomStatusLog $log) => [
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

    public function export(Room $room): StreamedResponse
    {
        Gate::authorize('viewAny', HousekeepingTask::class);

        $logs = RoomStatusLog::query()
            ->where('room_id', $room->id)
            ->with('changedBy')
            ->orderByDesc('changed_at')
            ->get();

        $filename = sprintf('room-%s-history.csv', $room->number);

        return response()->streamDownload(function () use ($logs) {
            $handle = fopen('php://output', 'w');

            fputcsv($handle, [
                'changed_at',
                'from_status',
                'to_status',
                'changed_by',
            ]);

            foreach ($logs as $log) {
                fputcsv($handle, [
                    $log->changed_at?->toDateTimeString(),
                    $log->from_status,
                    $log->to_status,
                    $log->changedBy?->name ?? 'System',
                ]);
            }

            fclose($handle);
        }, $filename, [
            'Content-Type' => 'text/csv',
        ]);
    }
}
