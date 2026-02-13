<?php

namespace Database\Factories;

use App\Models\Property;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CashierShift>
 */
class CashierShiftFactory extends Factory
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
            'cashier_id' => User::factory(),
            'opened_at' => now(),
            'closed_at' => null,
            'currency' => 'MMK',
            'opening_cash' => 0,
            'closing_cash' => null,
            'expected_cash' => null,
            'variance' => null,
            'total_cash' => 0,
            'total_card' => 0,
            'status' => 'open',
            'notes' => null,
            'approved_by' => null,
            'approved_at' => null,
        ];
    }
}
