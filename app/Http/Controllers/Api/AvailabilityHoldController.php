<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Availability\StoreAvailabilityHoldRequest;
use App\Models\AvailabilityHold;
use App\Models\Reservation;
use App\Models\Room;
use App\Models\RoomType;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Str;

class AvailabilityHoldController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', AvailabilityHold::class);

        $propertyId = $request->user()?->property_id;

        $holds = AvailabilityHold::query()
            ->active()
            ->when($propertyId, fn (Builder $q) => $q->where('property_id', $propertyId))
            ->orderBy('expires_at')
            ->get();

        return response()->json([
            'data' => $holds->map(fn (AvailabilityHold $hold) => [
                'id' => $hold->id,
                'room_type_id' => $hold->room_type_id,
                'room_id' => $hold->room_id,
                'check_in' => $hold->check_in?->toDateString(),
                'check_out' => $hold->check_out?->toDateString(),
                'quantity' => $hold->quantity,
                'expires_at' => $hold->expires_at?->toDateTimeString(),
                'token' => $hold->token,
            ])->values(),
        ]);
    }

    public function store(StoreAvailabilityHoldRequest $request): JsonResponse
    {
        $this->authorize('create', AvailabilityHold::class);

        $data = $request->validated();
        $propertyId = $request->user()?->property_id ?? 1;

        $this->assertAvailability($propertyId, $data);

        $expiresAt = now()->addMinutes((int) ($data['expires_in_minutes'] ?? 15));

        $hold = AvailabilityHold::create([
            'property_id' => $propertyId,
            'room_type_id' => $data['room_type_id'],
            'room_id' => $data['room_id'] ?? null,
            'check_in' => $data['check_in'],
            'check_out' => $data['check_out'],
            'quantity' => $data['quantity'] ?? 1,
            'expires_at' => $expiresAt,
            'token' => Str::random(40),
            'created_by' => $request->user()?->id,
        ]);

        return response()->json([
            'id' => $hold->id,
            'room_type_id' => $hold->room_type_id,
            'room_id' => $hold->room_id,
            'check_in' => $hold->check_in?->toDateString(),
            'check_out' => $hold->check_out?->toDateString(),
            'quantity' => $hold->quantity,
            'expires_at' => $hold->expires_at?->toDateTimeString(),
            'token' => $hold->token,
        ], 201);
    }

    public function destroy(AvailabilityHold $hold): JsonResponse
    {
        $this->authorize('delete', $hold);

        $hold->delete();

        return response()->json(['status' => 'ok']);
    }

    private function assertAvailability(int $propertyId, array $data): void
    {
        $roomTypeId = (int) $data['room_type_id'];
        $checkIn = $data['check_in'];
        $checkOut = $data['check_out'];
        $quantity = (int) ($data['quantity'] ?? 1);

        $roomType = RoomType::query()->where('id', $roomTypeId)->first();

        if (! $roomType) {
            throw new HttpResponseException(response()->json([
                'code' => 'ROOM_TYPE_NOT_FOUND',
                'message' => 'Room type not found.',
            ], 404));
        }

        if (! empty($data['room_id'])) {
            $room = Room::query()
                ->where('id', (int) $data['room_id'])
                ->where('room_type_id', $roomTypeId)
                ->where('is_active', true)
                ->where('status', 'available')
                ->first();

            if (! $room) {
                throw new HttpResponseException(response()->json([
                    'code' => 'ROOM_NOT_AVAILABLE',
                    'message' => 'Selected room is not available.',
                ], 409));
            }
        }

        $roomInventory = Room::query()
            ->where('room_type_id', $roomTypeId)
            ->where('property_id', $propertyId)
            ->where('is_active', true)
            ->count();

        $bookedRooms = Reservation::query()
            ->where('room_type_id', $roomTypeId)
            ->where('property_id', $propertyId)
            ->whereIn('status', ['confirmed', 'checked_in'])
            ->where(function (Builder $query) use ($checkIn, $checkOut) {
                $query->where('check_in', '<', $checkOut)
                    ->where('check_out', '>', $checkIn);
            })
            ->count();

        $holdsCount = AvailabilityHold::query()
            ->active()
            ->where('room_type_id', $roomTypeId)
            ->where('property_id', $propertyId)
            ->where(function (Builder $query) use ($checkIn, $checkOut) {
                $query->where('check_in', '<', $checkOut)
                    ->where('check_out', '>', $checkIn);
            })
            ->sum('quantity');

        $availableCount = $roomInventory + (int) ($roomType->overbooking_limit ?? 0) - $bookedRooms - $holdsCount;

        if ($availableCount < $quantity) {
            throw new HttpResponseException(response()->json([
                'code' => 'AVAILABILITY_UNAVAILABLE',
                'message' => 'No availability for the selected dates.',
            ], 409));
        }
    }
}
