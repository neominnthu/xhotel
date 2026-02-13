<?php

namespace Database\Factories;

use App\Models\Property;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ExchangeRate>
 */
class ExchangeRateFactory extends Factory
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
            'base_currency' => 'MMK',
            'quote_currency' => 'USD',
            'rate' => $this->faker->randomFloat(6, 0.0001, 10000),
            'effective_date' => $this->faker->dateTimeBetween('-2 months', 'now')->format('Y-m-d'),
            'source' => 'manual',
            'is_active' => true,
        ];
    }
}
