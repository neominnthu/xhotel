<?php

namespace Database\Seeders;

use App\Models\ExchangeRate;
use App\Models\Property;
use Illuminate\Database\Seeder;

class ExchangeRateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $property = Property::first() ?? Property::factory()->create();

        ExchangeRate::factory()->create([
            'property_id' => $property->id,
            'base_currency' => $property->default_currency ?? 'MMK',
            'quote_currency' => 'USD',
            'rate' => 3500,
            'effective_date' => now()->toDateString(),
            'source' => 'seed',
        ]);

        ExchangeRate::factory()->create([
            'property_id' => $property->id,
            'base_currency' => $property->default_currency ?? 'MMK',
            'quote_currency' => 'EUR',
            'rate' => 3800,
            'effective_date' => now()->toDateString(),
            'source' => 'seed',
        ]);
    }
}
