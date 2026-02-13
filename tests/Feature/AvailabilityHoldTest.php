<?php

namespace Tests\Feature;

use App\Models\AvailabilityHold;
use App\Models\Guest;
use App\Models\Property;
use App\Models\Reservation;
use App\Models\Room;
use App\Models\RoomType;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AvailabilityHoldTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_create_and_release_hold(): void
    {
        $property = Property::factory()->create();
        $roomType = RoomType::factory()->create([
            'property_id' => $property->id,
        ]);
        $room = Room::factory()->create([
            'property_id' => $property->id,
            'room_type_id' => $roomType->id,
            'status' => 'available',
        ]);

        $user = User::factory()->create([
            'role' => 'front_desk',
            'property_id' => $property->id,
        ]);

        $payload = [
            'room_type_id' => $roomType->id,
            'room_id' => $room->id,
            'check_in' => now()->addDays(1)->toDateString(),
            'check_out' => now()->addDays(2)->toDateString(),
            'quantity' => 1,
        ];

        $response = $this->actingAs($user)->postJson('/api/v1/availability/holds', $payload);

        $response->assertCreated();
        $this->assertDatabaseCount('availability_holds', 1);

        $holdId = $response->json('id');
        $hold = AvailabilityHold::find($holdId);

        $indexResponse = $this->actingAs($user)->getJson('/api/v1/availability/holds');
        $indexResponse->assertOk();
        $indexResponse->assertJsonFragment(['id' => $holdId]);

        $deleteResponse = $this->actingAs($user)->deleteJson("/api/v1/availability/holds/{$hold->id}");
        $deleteResponse->assertOk();
    }

    public function test_hold_rejects_when_inventory_is_full(): void
    {
        $property = Property::factory()->create();
        $roomType = RoomType::factory()->create([
            'property_id' => $property->id,
            'overbooking_limit' => 0,
        ]);

        Room::factory()->create([
            'property_id' => $property->id,
            'room_type_id' => $roomType->id,
            'status' => 'available',
        ]);

        $guest = Guest::factory()->create();

        Reservation::factory()->create([
            'property_id' => $property->id,
            'guest_id' => $guest->id,
            'room_type_id' => $roomType->id,
            'status' => 'confirmed',
            'check_in' => now()->addDays(1)->toDateString(),
            'check_out' => now()->addDays(2)->toDateString(),
        ]);

        $user = User::factory()->create([
            'role' => 'front_desk',
            'property_id' => $property->id,
        ]);

        $payload = [
            'room_type_id' => $roomType->id,
            'check_in' => now()->addDays(1)->toDateString(),
            'check_out' => now()->addDays(2)->toDateString(),
            'quantity' => 1,
        ];

        $response = $this->actingAs($user)->postJson('/api/v1/availability/holds', $payload);

        $response->assertStatus(409);
        $response->assertJsonFragment(['code' => 'AVAILABILITY_UNAVAILABLE']);
    }
}
