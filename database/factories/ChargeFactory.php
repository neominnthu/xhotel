<?php

namespace Database\Factories;

use App\Models\Folio;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Charge>
 */
class ChargeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'folio_id' => Folio::factory(),
            'type' => 'room_charge',
            'amount' => $this->faker->numberBetween(1000, 50000),
            'currency' => 'MMK',
            'tax_amount' => 0,
            'description' => $this->faker->sentence(3),
            'posted_at' => now(),
            'created_by' => User::factory(),
        ];
    }
}
