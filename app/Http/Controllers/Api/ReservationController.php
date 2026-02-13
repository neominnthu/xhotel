<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Reservations\CancelReservationRequest;
use App\Http\Requests\Reservations\StoreReservationRequest;
use App\Http\Requests\Reservations\UpdateReservationRequest;
use App\Models\Reservation;
use App\Services\ReservationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReservationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Reservation::class);

        $query = Reservation::query()->with(['guest', 'roomType', 'room']);

        $status = $request->input('filter.status');
        if ($status) {
            $query->where('status', $status);
        }

        $checkIn = $request->input('filter.check_in');
        if ($checkIn) {
            $query->whereDate('check_in', $checkIn);
        }

        $sort = $request->input('sort');
        $allowedSorts = ['check_in', 'check_out', 'created_at'];
        if ($sort) {
            $direction = str_starts_with($sort, '-') ? 'desc' : 'asc';
            $field = ltrim($sort, '-');
            if (in_array($field, $allowedSorts, true)) {
                $query->orderBy($field, $direction);
            }
        }

        $perPage = (int) $request->input('per_page', 20);
        $reservations = $query->paginate($perPage)->appends($request->query());

        $data = collect($reservations->items())
            ->map(fn (Reservation $reservation) => $this->reservationArray($reservation))
            ->values();

        return response()->json([
            'data' => $data,
            'meta' => [
                'total' => $reservations->total(),
                'page' => $reservations->currentPage(),
                'per_page' => $reservations->perPage(),
            ],
        ]);
    }

    public function store(
        StoreReservationRequest $request,
        ReservationService $service
    ): JsonResponse {
        $this->authorize('create', Reservation::class);

        $reservation = $service->create($request->validated(), $request->user());

        return response()->json($this->reservationArray($reservation));
    }

    public function show(Reservation $reservation): JsonResponse
    {
        $this->authorize('view', $reservation);

        return response()->json($this->reservationArray($reservation->load([
            'guest',
            'roomType',
            'room',
            'statusLogs.actor',
        ])));
    }

    public function update(
        UpdateReservationRequest $request,
        Reservation $reservation,
        ReservationService $service
    ): JsonResponse {
        $this->authorize('update', $reservation);

        $reservation = $service->update($reservation, $request->validated(), $request->user());

        return response()->json($this->reservationArray($reservation));
    }

    public function cancel(
        CancelReservationRequest $request,
        Reservation $reservation,
        ReservationService $service
    ): JsonResponse {
        $this->authorize('cancel', $reservation);

        $reservation = $service->cancel($reservation, $request->validated(), $request->user());

        return response()->json($this->reservationArray($reservation));
    }

    private function reservationArray(Reservation $reservation): array
    {
        return [
            'id' => $reservation->id,
            'code' => $reservation->code,
            'status' => $reservation->status,
            'check_in' => $reservation->check_in?->toDateString(),
            'check_out' => $reservation->check_out?->toDateString(),
            'guest' => $reservation->guest
                ? [
                    'id' => $reservation->guest->id,
                    'name' => $reservation->guest->name,
                ]
                : null,
            'room_type_id' => $reservation->room_type_id,
            'room_id' => $reservation->room_id,
            'status_logs' => $reservation->relationLoaded('statusLogs')
                ? $reservation->statusLogs->map(fn ($log) => [
                    'id' => $log->id,
                    'status_from' => $log->status_from,
                    'status_to' => $log->status_to,
                    'changed_at' => $log->changed_at?->toDateTimeString(),
                    'actor' => $log->actor
                        ? [
                            'id' => $log->actor->id,
                            'name' => $log->actor->name,
                        ]
                        : null,
                    'reason' => $log->reason,
                ])->values()
                : null,
        ];
    }
}
