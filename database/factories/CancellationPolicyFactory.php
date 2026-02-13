<?php

namespace Database\Factories;

use App\Models\Property;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CancellationPolicy>
 */
class CancellationPolicyFactory extends Factory
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
            'room_type_id' => null,
            'name' => 'Standard Cancellation',
            'deadline_hours' => 24,
            'penalty_type' => 'flat',
            'penalty_amount' => 50000,
            'penalty_percent' => 0,
            'is_active' => true,
        ];
    }
}
