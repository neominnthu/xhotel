<?php

namespace Database\Factories;

use App\Models\Property;
use App\Models\RoomType;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Rate>
 */
class RateFactory extends Factory
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
            'room_type_id' => RoomType::factory(),
            'name' => $this->faker->word(),
            'type' => 'base',
            'start_date' => $this->faker->date(),
            'end_date' => $this->faker->date(),
            'rate' => $this->faker->numberBetween(100000, 500000),
            'min_stay' => 1,
            'days_of_week' => null,
            'length_of_stay_min' => null,
            'length_of_stay_max' => null,
            'adjustment_type' => null,
            'adjustment_value' => null,
            'is_active' => true,
            'conditions' => [],
        ];
    }
}
