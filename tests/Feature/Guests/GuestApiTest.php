<?php

namespace Tests\Feature\Guests;

use App\Models\Guest;
use App\Models\Property;
use App\Models\Reservation;
use App\Models\RoomType;
use App\Models\Stay;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GuestApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_create_update_and_merge_guest(): void
    {
        $property = Property::factory()->create();
        $user = User::factory()->create([
            'role' => 'front_desk',
            'property_id' => $property->id,
        ]);

        $createPayload = [
            'first_name' => 'Aye',
            'last_name' => 'Ko',
            'phone' => '0912345678',
            'email' => 'aye@example.com',
            'id_type' => 'passport',
            'id_number' => 'P123456',
        ];

        $createResponse = $this->actingAs($user)->postJson('/api/v1/guests', $createPayload);
        $createResponse->assertCreated();
        $guestId = $createResponse->json('id');

        $this->assertDatabaseHas('guests', [
            'id' => $guestId,
            'property_id' => $property->id,
            'name' => 'Aye Ko',
        ]);

        $updatePayload = [
            'vip_status' => 'vip',
            'is_blacklisted' => true,
            'blacklist_reason' => 'Unpaid balance',
        ];

        $updateResponse = $this->actingAs($user)->patchJson(
            "/api/v1/guests/{$guestId}",
            $updatePayload
        );
        $updateResponse->assertOk();

        $this->assertDatabaseHas('guests', [
            'id' => $guestId,
            'vip_status' => 'vip',
            'is_blacklisted' => true,
        ]);

        $secondaryGuest = Guest::factory()->create([
            'property_id' => $property->id,
            'name' => 'Secondary Guest',
        ]);

        $roomType = RoomType::factory()->create([
            'property_id' => $property->id,
        ]);

        $reservation = Reservation::factory()->create([
            'property_id' => $property->id,
            'guest_id' => $secondaryGuest->id,
            'room_type_id' => $roomType->id,
        ]);

        $stay = Stay::create([
            'reservation_id' => $reservation->id,
            'status' => 'expected',
            'primary_guest_id' => $secondaryGuest->id,
        ]);

        $mergeResponse = $this->actingAs($user)->postJson(
            "/api/v1/guests/{$guestId}/merge",
            ['merge_ids' => [$secondaryGuest->id]]
        );
        $mergeResponse->assertOk();

        $this->assertDatabaseHas('reservations', [
            'id' => $reservation->id,
            'guest_id' => $guestId,
        ]);

        $this->assertDatabaseHas('stays', [
            'id' => $stay->id,
            'primary_guest_id' => $guestId,
        ]);

        $this->assertSoftDeleted('guests', [
            'id' => $secondaryGuest->id,
        ]);

        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $user->id,
            'action' => 'guest.created',
            'resource' => 'guest',
        ]);

        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $user->id,
            'action' => 'guest.updated',
            'resource' => 'guest',
        ]);

        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $user->id,
            'action' => 'guest.merged',
            'resource' => 'guest',
        ]);
    }
}
