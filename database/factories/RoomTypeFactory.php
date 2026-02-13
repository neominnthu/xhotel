<?php

namespace Database\Factories;

use App\Models\Property;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\RoomType>
 */
class RoomTypeFactory extends Factory
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
            'name' => [
                'en' => 'Standard Room',
                'my' => 'စံအခန်း',
            ],
            'capacity' => 2,
            'overbooking_limit' => 0,
            'base_rate' => 150000,
            'amenities_json' => [],
            'sort_order' => 0,
            'is_active' => true,
        ];
    }
}
