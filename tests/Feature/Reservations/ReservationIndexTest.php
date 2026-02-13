<?php

namespace Tests\Feature\Reservations;

use App\Models\Property;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReservationIndexTest extends TestCase
{
    use RefreshDatabase;

    public function test_reservations_index_requires_auth(): void
    {
        $response = $this->get('/reservations');

        $response->assertRedirect('/login');
    }

    public function test_reservations_index_allows_authorized_user(): void
    {
        $property = Property::create([
            'name' => 'XHotel Yangon',
            'timezone' => 'Asia/Yangon',
            'default_currency' => 'MMK',
            'default_language' => 'my',
        ]);

        $user = User::factory()->create([
            'role' => 'admin',
            'property_id' => $property->id,
        ]);

        $response = $this->actingAs($user)->get('/reservations');

        $response->assertOk();
    }
}
