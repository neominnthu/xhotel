<?php

namespace Tests\Feature\Guests;

use App\Models\Guest;
use App\Models\Property;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class GuestPageTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_index_displays_guests_for_authorized_user(): void
    {
        $property = Property::factory()->create();
        $user = User::factory()->create([
            'role' => 'front_desk',
            'property_id' => $property->id,
        ]);
        $guest = Guest::factory()->create([
            'property_id' => $property->id,
        ]);

        $response = $this->actingAs($user)->get('/guests');

        $response->assertInertia(fn (Assert $page) => $page
            ->component('guests/index')
            ->has('guests.data', 1)
            ->where('guests.data.0.id', $guest->id)
            ->where('guests.data.0.name', $guest->name)
        );
    }

    public function test_guest_show_displays_profile_for_authorized_user(): void
    {
        $property = Property::factory()->create();
        $user = User::factory()->create([
            'role' => 'front_desk',
            'property_id' => $property->id,
        ]);
        $guest = Guest::factory()->create([
            'property_id' => $property->id,
        ]);

        $response = $this->actingAs($user)->get("/guests/{$guest->id}");

        $response->assertInertia(fn (Assert $page) => $page
            ->component('guests/show')
            ->where('guest.id', $guest->id)
            ->has('reservations', 0)
        );
    }

    public function test_guest_can_be_created_from_page(): void
    {
        $property = Property::factory()->create();
        $user = User::factory()->create([
            'role' => 'front_desk',
            'property_id' => $property->id,
        ]);

        $payload = [
            'first_name' => 'Aye',
            'last_name' => 'Ko',
            'phone' => '0912345678',
            'email' => 'aye.ko@example.com',
            'id_type' => 'passport',
            'id_number' => 'P123456',
        ];

        $response = $this->actingAs($user)->post('/guests', $payload);
        $guest = Guest::query()->latest('id')->first();

        $response->assertRedirect("/guests/{$guest->id}");

        $this->assertDatabaseHas('guests', [
            'id' => $guest->id,
            'property_id' => $property->id,
            'name' => 'Aye Ko',
        ]);
    }

    public function test_guest_can_be_updated_and_merged_from_page(): void
    {
        $property = Property::factory()->create();
        $user = User::factory()->create([
            'role' => 'front_desk',
            'property_id' => $property->id,
        ]);
        $guest = Guest::factory()->create([
            'property_id' => $property->id,
        ]);
        $secondary = Guest::factory()->create([
            'property_id' => $property->id,
        ]);

        $updateResponse = $this->actingAs($user)->patch(
            "/guests/{$guest->id}",
            ['vip_status' => 'vip']
        );
        $updateResponse->assertRedirect();

        $this->assertDatabaseHas('guests', [
            'id' => $guest->id,
            'vip_status' => 'vip',
        ]);

        $mergeResponse = $this->actingAs($user)->post(
            "/guests/{$guest->id}/merge",
            ['merge_ids' => [$secondary->id]]
        );
        $mergeResponse->assertRedirect("/guests/{$guest->id}");

        $this->assertSoftDeleted('guests', [
            'id' => $secondary->id,
        ]);
    }
}
