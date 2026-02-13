<?php

namespace Database\Factories;

use App\Models\Reservation;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ReservationStatusLog>
 */
class ReservationStatusLogFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'reservation_id' => Reservation::factory(),
            'status_from' => 'confirmed',
            'status_to' => 'checked_in',
            'changed_at' => now(),
            'changed_by' => User::factory(),
            'reason' => null,
            'metadata' => null,
        ];
    }
}
