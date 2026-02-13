<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Rate;
use App\Models\Reservation;
use App\Models\Room;
use App\Models\RoomType;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class CalendarController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'year' => 'required|integer|min:2020|max:2030',
            'month' => 'required|integer|min:1|max:12',
            'room_type_id' => 'nullable|integer|exists:room_types,id',
        ]);

        $year = $request->integer('year');
        $month = $request->integer('month');
        $roomTypeId = $request->integer('room_type_id');

        $cacheKey = "calendar.{$year}.{$month}.{$roomTypeId}";

        $data = Cache::remember($cacheKey, now()->addMinutes(30), function () use ($year, $month, $roomTypeId) {
            $user = auth()->user();
            $propertyId = $user->property_id ?? 1;

            // Get room types for this property
            $roomTypesQuery = RoomType::where('property_id', $propertyId)
                ->where('is_active', true);

            if ($roomTypeId) {
                $roomTypesQuery->where('id', $roomTypeId);
            }

            $roomTypes = $roomTypesQuery->orderBy('sort_order')->get();

            $calendarData = [];

            foreach ($roomTypes as $roomType) {
                $roomTypeData = [
                    'id' => $roomType->id,
                    'name' => $roomType->name,
                    'capacity' => $roomType->capacity,
                    'days' => [],
                ];

                // Get number of days in the month
                $daysInMonth = cal_days_in_month(CAL_GREGORIAN, $month, $year);

                for ($day = 1; $day <= $daysInMonth; $day++) {
                    $date = sprintf('%04d-%02d-%02d', $year, $month, $day);

                    // Get availability for this date
                    $availability = $this->getAvailabilityForDate($roomType, $date);

                    // Get rate for this date
                    $rate = $this->getRateForDate($roomType, $date);

                    $roomTypeData['days'][] = [
                        'date' => $date,
                        'day' => $day,
                        'availability' => $availability,
                        'rate' => $rate,
                    ];
                }

                $calendarData[] = $roomTypeData;
            }

            return $calendarData;
        });

        return response()->json([
            'data' => $data,
            'meta' => [
                'year' => $year,
                'month' => $month,
                'room_type_id' => $roomTypeId,
            ],
        ]);
    }

    private function getAvailabilityForDate(RoomType $roomType, string $date): array
    {
        $checkIn = $date;
        $checkOut = date('Y-m-d', strtotime($date . ' +1 day'));

        // Count total rooms for this type
        $totalRooms = Room::where('room_type_id', $roomType->id)
            ->where('is_active', true)
            ->count();

        // Count booked rooms for this date
        $bookedRooms = Reservation::where('room_type_id', $roomType->id)
            ->whereIn('status', ['confirmed', 'checked_in'])
            ->where(function ($query) use ($checkIn, $checkOut) {
                $query->where('check_in', '<', $checkOut)
                    ->where('check_out', '>', $checkIn);
            })
            ->count();

        $availableRooms = max(0, $totalRooms - $bookedRooms);

        return [
            'total_rooms' => $totalRooms,
            'booked_rooms' => $bookedRooms,
            'available_rooms' => $availableRooms,
            'status' => $this->getAvailabilityStatus($availableRooms, $totalRooms),
        ];
    }

    private function getAvailabilityStatus(int $availableRooms, int $totalRooms): string
    {
        if ($availableRooms === 0) {
            return 'unavailable';
        }

        if ($availableRooms <= 2) {
            return 'limited';
        }

        return 'available';
    }

    private function getRateForDate(RoomType $roomType, string $date): array
    {
        $rate = Rate::active()
            ->where('room_type_id', $roomType->id)
            ->where('start_date', '<=', $date)
            ->where('end_date', '>=', $date)
            ->orderByRaw("CASE type WHEN 'special' THEN 1 WHEN 'seasonal' THEN 2 WHEN 'base' THEN 3 END")
            ->first();

        $amount = $rate ? $rate->rate : $roomType->base_rate;

        return [
            'amount' => $amount,
            'currency' => 'MMK',
            'rate_type' => $rate ? $rate->type : 'base',
            'rate_name' => $rate ? $rate->name : 'Base Rate',
        ];
    }
}
