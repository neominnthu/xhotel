<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Availability\IndexAvailabilityRequest;
use App\Models\AvailabilityHold;
use App\Models\Reservation;
use App\Models\Room;
use App\Models\RoomType;
use App\Services\ApiOptimizationService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;

class AvailabilityController extends Controller
{
    public function __construct(
        private ApiOptimizationService $apiOptimization
    ) {}

    public function index(IndexAvailabilityRequest $request): JsonResponse
    {
        $filters = $request->validated();
        $checkIn = $filters['check_in'];
        $checkOut = $filters['check_out'];
        $adults = $filters['adults'] ?? 1;
        $children = $filters['children'] ?? 0;
        $roomTypeId = $filters['room_type_id'] ?? null;

        // Use the optimization service to generate cache key
        $cacheKey = $this->apiOptimization->generateCacheKey($request, $filters);

        $availability = \Cache::remember($cacheKey, now()->addMinutes(10), function () use (
            $checkIn,
            $checkOut,
            $adults,
            $children,
            $roomTypeId
        ) {
            $roomTypes = RoomType::query()
                ->where('is_active', true)
                ->when($roomTypeId, fn (Builder $q) => $q->where('id', $roomTypeId))
                ->orderBy('sort_order')
                ->get();

            $results = [];

            foreach ($roomTypes as $roomType) {
                $availabilitySnapshot = $this->getAvailabilitySnapshot(
                    $roomType,
                    $checkIn,
                    $checkOut,
                    $adults,
                    $children
                );

                if ($availabilitySnapshot['available_count'] > 0) {
                    $results[] = [
                        'room_type' => [
                            'id' => $roomType->id,
                            'name' => $roomType->name,
                            'capacity' => $roomType->capacity,
                            'base_rate' => $roomType->base_rate,
                        ],
                        'available_rooms' => $availabilitySnapshot['available_rooms']->map(fn (Room $room) => [
                            'id' => $room->id,
                            'number' => $room->number,
                            'floor' => $room->floor,
                        ]),
                        'available_count' => $availabilitySnapshot['available_count'],
                        'holds_count' => $availabilitySnapshot['holds_count'],
                        'overbooking_limit' => $availabilitySnapshot['overbooking_limit'],
                    ];
                }
            }

            return $results;
        });

        // Use the optimization service to format response
        return $this->apiOptimization->formatResponse(
            $availability,
            'Availability retrieved successfully',
            200,
            [
                'check_in' => $checkIn,
                'check_out' => $checkOut,
                'adults' => $adults,
                'children' => $children,
            ]
        );
    }

    private function getAvailabilitySnapshot(RoomType $roomType, string $checkIn, string $checkOut, int $adults, int $children): array
    {
        $totalGuests = $adults + $children;

        $roomInventory = Room::query()
            ->where('room_type_id', $roomType->id)
            ->where('is_active', true)
            ->count();

        $bookedRooms = Reservation::query()
            ->where('room_type_id', $roomType->id)
            ->whereIn('status', ['confirmed', 'checked_in'])
            ->where(function (Builder $query) use ($checkIn, $checkOut) {
                $query->where('check_in', '<', $checkOut)
                    ->where('check_out', '>', $checkIn);
            })
            ->count();

        $holdsCount = AvailabilityHold::query()
            ->active()
            ->where('room_type_id', $roomType->id)
            ->where(function (Builder $query) use ($checkIn, $checkOut) {
                $query->where('check_in', '<', $checkOut)
                    ->where('check_out', '>', $checkIn);
            })
            ->sum('quantity');

        $availableCount = max(
            $roomInventory + (int) ($roomType->overbooking_limit ?? 0) - $bookedRooms - $holdsCount,
            0
        );

        $availableRooms = Room::query()
            ->where('room_type_id', $roomType->id)
            ->where('is_active', true)
            ->where('status', 'available')
            ->whereDoesntHave('reservations', function (Builder $query) use ($checkIn, $checkOut) {
                $query->where(function (Builder $q) use ($checkIn, $checkOut) {
                    $q->where('check_in', '<', $checkOut)
                      ->where('check_out', '>', $checkIn);
                })->whereIn('status', ['confirmed', 'checked_in']);
            })
            ->whereHas('roomType', function (Builder $query) use ($totalGuests) {
                $query->where('capacity', '>=', $totalGuests);
            })
            ->orderBy('number')
            ->get();

        return [
            'available_rooms' => $availableRooms,
            'available_count' => $availableCount,
            'holds_count' => (int) $holdsCount,
            'overbooking_limit' => (int) ($roomType->overbooking_limit ?? 0),
        ];
    }
}
