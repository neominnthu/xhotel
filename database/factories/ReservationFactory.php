<?php

namespace Database\Factories;

use App\Models\Guest;
use App\Models\Property;
use App\Models\RoomType;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Reservation>
 */
class ReservationFactory extends Factory
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
            'guest_id' => Guest::factory(),
            'code' => 'RSV-'.$this->faker->unique()->numerify('####'),
            'status' => 'confirmed',
            'source' => 'walk_in',
            'check_in' => now()->addDays(1)->toDateString(),
            'check_out' => now()->addDays(2)->toDateString(),
            'room_type_id' => RoomType::factory(),
            'room_id' => null,
            'adults' => 2,
            'children' => 0,
            'special_requests' => null,
        ];
    }
}
