<?php

namespace Tests\Unit;

use App\Models\Property;
use App\Models\Rate;
use App\Models\Reservation;
use App\Models\RoomType;
use App\Services\RateService;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RateServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_applies_percent_adjustment(): void
    {
        $property = Property::factory()->create();
        $roomType = RoomType::factory()->create([
            'property_id' => $property->id,
            'base_rate' => 150000,
        ]);

        $checkIn = Carbon::parse('2026-02-16');
        $checkOut = Carbon::parse('2026-02-18');

        Rate::create([
            'room_type_id' => $roomType->id,
            'name' => 'Weekday Promo',
            'type' => 'base',
            'start_date' => $checkIn->toDateString(),
            'end_date' => $checkOut->toDateString(),
            'rate' => 100000,
            'min_stay' => 1,
            'days_of_week' => [$checkIn->dayOfWeekIso],
            'adjustment_type' => 'percent',
            'adjustment_value' => 10,
            'is_active' => true,
        ]);

        $reservation = Reservation::factory()->create([
            'property_id' => $property->id,
            'room_type_id' => $roomType->id,
            'check_in' => $checkIn->toDateString(),
            'check_out' => $checkOut->toDateString(),
        ]);

        $service = app(RateService::class);
        $result = $service->calculateRate($reservation);

        $this->assertEquals(90000, $result['rate']);
    }

    public function test_falls_back_to_base_rate_when_rule_misses(): void
    {
        $property = Property::factory()->create();
        $roomType = RoomType::factory()->create([
            'property_id' => $property->id,
            'base_rate' => 150000,
        ]);

        $checkIn = Carbon::parse('2026-02-17');
        $checkOut = Carbon::parse('2026-02-18');

        Rate::create([
            'room_type_id' => $roomType->id,
            'name' => 'Weekend Promo',
            'type' => 'base',
            'start_date' => $checkIn->toDateString(),
            'end_date' => $checkOut->toDateString(),
            'rate' => 120000,
            'min_stay' => 1,
            'days_of_week' => [7],
            'adjustment_type' => 'override',
            'adjustment_value' => 120000,
            'is_active' => true,
        ]);

        $reservation = Reservation::factory()->create([
            'property_id' => $property->id,
            'room_type_id' => $roomType->id,
            'check_in' => $checkIn->toDateString(),
            'check_out' => $checkOut->toDateString(),
        ]);

        $service = app(RateService::class);
        $result = $service->calculateRate($reservation);

        $this->assertEquals(150000, $result['rate']);
    }
}
