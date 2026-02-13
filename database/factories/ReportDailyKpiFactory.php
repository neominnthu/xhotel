<?php

namespace Database\Factories;

use App\Models\Property;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ReportDailyKpi>
 */
class ReportDailyKpiFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'property_id' => Property::factory(),
            'report_date' => now()->subDay()->toDateString(),
            'total_rooms' => 100,
            'occupied_rooms' => 70,
            'room_nights' => 70,
            'total_revenue' => 7000000,
            'adr' => 100000,
            'revpar' => 70000,
            'currency' => 'MMK',
        ];
    }
}
