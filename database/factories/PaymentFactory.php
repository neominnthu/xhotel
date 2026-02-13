<?php

namespace Database\Factories;

use App\Models\Folio;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Payment>
 */
class PaymentFactory extends Factory
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
            'method' => 'cash',
            'amount' => $this->faker->numberBetween(1000, 50000),
            'currency' => 'MMK',
            'exchange_rate' => 1,
            'reference' => $this->faker->optional()->bothify('PAY-####'),
            'received_at' => now(),
            'created_by' => User::factory(),
        ];
    }
}
