<?php

namespace Tests\Feature\Reservations;

use App\Models\AvailabilityHold;
use App\Models\Property;
use App\Models\Room;
use App\Models\RoomType;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReservationHoldValidationTest extends TestCase
{
    use RefreshDatabase;

    public function test_reservation_rejects_hold_room_type_mismatch(): void
    {
        $property = Property::factory()->create();
        $roomType = RoomType::factory()->create([
            'property_id' => $property->id,
        ]);
        $otherRoomType = RoomType::factory()->create([
            'property_id' => $property->id,
        ]);
        Room::factory()->create([
            'property_id' => $property->id,
            'room_type_id' => $otherRoomType->id,
            'status' => 'available',
        ]);

        $hold = AvailabilityHold::factory()->create([
            'property_id' => $property->id,
            'room_type_id' => $roomType->id,
            'check_in' => now()->addDays(1)->toDateString(),
            'check_out' => now()->addDays(2)->toDateString(),
        ]);

        $user = User::factory()->create([
            'role' => 'front_desk',
            'property_id' => $property->id,
        ]);

        $payload = [
            'guest' => [
                'name' => 'Hold Mismatch',
                'phone' => '959123456789',
                'id_type' => 'passport',
                'id_number' => 'P123456',
            ],
            'property_id' => $property->id,
            'check_in' => $hold->check_in->toDateString(),
            'check_out' => $hold->check_out->toDateString(),
            'room_type_id' => $otherRoomType->id,
            'adults' => 2,
            'children' => 0,
            'source' => 'walk_in',
            'special_requests' => 'Hold mismatch test',
            'currency' => 'MMK',
            'hold_id' => $hold->id,
        ];

        $response = $this->actingAs($user)->postJson('/api/v1/reservations', $payload);

        $response->assertStatus(409);
        $response->assertJsonFragment(['code' => 'HOLD_MISMATCH']);
    }

    public function test_reservation_rejects_expired_hold(): void
    {
        $property = Property::factory()->create();
        $roomType = RoomType::factory()->create([
            'property_id' => $property->id,
        ]);
        Room::factory()->create([
            'property_id' => $property->id,
            'room_type_id' => $roomType->id,
            'status' => 'available',
        ]);

        $hold = AvailabilityHold::factory()->create([
            'property_id' => $property->id,
            'room_type_id' => $roomType->id,
            'check_in' => now()->addDays(1)->toDateString(),
            'check_out' => now()->addDays(2)->toDateString(),
            'expires_at' => now()->subMinute(),
        ]);

        $user = User::factory()->create([
            'role' => 'front_desk',
            'property_id' => $property->id,
        ]);

        $payload = [
            'guest' => [
                'name' => 'Hold Expired',
                'phone' => '959123456789',
                'id_type' => 'passport',
                'id_number' => 'P654321',
            ],
            'property_id' => $property->id,
            'check_in' => $hold->check_in->toDateString(),
            'check_out' => $hold->check_out->toDateString(),
            'room_type_id' => $roomType->id,
            'adults' => 1,
            'children' => 0,
            'source' => 'walk_in',
            'special_requests' => 'Hold expired test',
            'currency' => 'MMK',
            'hold_id' => $hold->id,
        ];

        $response = $this->actingAs($user)->postJson('/api/v1/reservations', $payload);

        $response->assertStatus(409);
        $response->assertJsonFragment(['code' => 'HOLD_NOT_FOUND']);
    }
}
