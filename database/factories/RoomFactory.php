<?php

namespace Database\Factories;

use App\Models\Property;
use App\Models\RoomType;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Room>
 */
class RoomFactory extends Factory
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
            'number' => (string) $this->faker->unique()->numberBetween(100, 999),
            'floor' => $this->faker->numberBetween(1, 5),
            'status' => 'available',
            'housekeeping_status' => 'clean',
            'is_active' => true,
        ];
    }
}
