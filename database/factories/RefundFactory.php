<?php

namespace Database\Factories;

use App\Models\Folio;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Refund>
 */
class RefundFactory extends Factory
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
            'payment_id' => null,
            'method' => 'cash',
            'amount' => 5000,
            'currency' => 'MMK',
            'exchange_rate' => 1,
            'folio_amount' => 5000,
            'status' => 'pending',
            'reference' => fake()->bothify('RF###'),
            'reason' => fake()->sentence(4),
            'approved_at' => null,
            'requested_by' => User::factory(),
            'approved_by' => null,
            'refunded_at' => null,
        ];
    }
}
