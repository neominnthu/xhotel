<?php

namespace Database\Seeders;

use App\Models\Property;
use App\Models\RoomType;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class E2eUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $property = Property::query()->first() ?? Property::factory()->create([
            'name' => 'E2E Property',
        ]);

        $roomType = RoomType::query()->where('property_id', $property->id)->first();
        if ($roomType === null) {
            RoomType::factory()->create([
                'property_id' => $property->id,
                'name' => ['en' => 'E2E Standard', 'my' => 'E2E Standard'],
                'capacity' => 2,
                'overbooking_limit' => 0,
                'base_rate' => 150000,
                'amenities_json' => [],
                'sort_order' => 0,
                'is_active' => true,
            ]);
        }

        // Create deterministic E2E users (email/password)
        User::query()->updateOrCreate([
            'email' => 'e2e@example.com',
        ], [
            'name' => 'Playwright E2E',
            'password' => Hash::make('password'),
            'role' => 'reservation_manager',
            'property_id' => $property->id,
            'is_active' => true,
        ]);

        User::query()->updateOrCreate([
            'email' => 'e2e-frontdesk@example.com',
        ], [
            'name' => 'Playwright Front Desk',
            'password' => Hash::make('password'),
            'role' => 'front_desk',
            'property_id' => $property->id,
            'is_active' => true,
        ]);
    }
}
