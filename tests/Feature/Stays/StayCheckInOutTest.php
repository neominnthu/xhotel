<?php

namespace Tests\Feature\Stays;

use App\Models\Folio;
use App\Models\Property;
use App\Models\Reservation;
use App\Models\Room;
use App\Models\RoomType;
use App\Models\Stay;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StayCheckInOutTest extends TestCase
{
    use RefreshDatabase;

    public function test_check_in_updates_stay_room_reservation_and_deposit(): void
    {
        $property = Property::factory()->create();
        $roomType = RoomType::factory()->create(['property_id' => $property->id]);
        $room = Room::factory()->create([
            'property_id' => $property->id,
            'room_type_id' => $roomType->id,
            'status' => 'available',
            'housekeeping_status' => 'clean',
        ]);
        $reservation = Reservation::factory()->create([
            'property_id' => $property->id,
            'room_type_id' => $roomType->id,
            'status' => 'confirmed',
        ]);
        $stay = Stay::create([
            'reservation_id' => $reservation->id,
            'status' => 'expected',
        ]);
        $folio = Folio::create([
            'reservation_id' => $reservation->id,
            'currency' => 'MMK',
            'total' => 0,
            'balance' => 0,
            'status' => 'open',
        ]);
        $user = User::factory()->create([
            'role' => 'front_desk',
            'property_id' => $property->id,
        ]);

        $payload = [
            'room_id' => $room->id,
            'guest' => [
                'first_name' => 'John',
                'last_name' => 'Doe',
                'email' => 'john@example.com',
                'phone' => '0912345678',
            ],
            'security_deposit_amount' => 5000,
            'security_deposit_currency' => 'MMK',
        ];

        $response = $this->actingAs($user)->postJson("/api/v1/stays/{$stay->id}/check-in", $payload);

        $response->assertOk();

        $stay->refresh();
        $reservation->refresh();
        $room->refresh();
        $folio->refresh();

        $this->assertEquals('checked_in', $stay->status);
        $this->assertEquals($room->id, $stay->assigned_room_id);
        $this->assertNotNull($stay->primary_guest_id);
        $this->assertEquals('checked_in', $reservation->status);
        $this->assertEquals($room->id, $reservation->room_id);
        $this->assertEquals('occupied', $room->status);
        $this->assertEquals('dirty', $room->housekeeping_status);
        $this->assertEquals(5000, $folio->total);
        $this->assertEquals(5000, $folio->balance);

        $this->assertDatabaseHas('charges', [
            'folio_id' => $folio->id,
            'type' => 'deposit',
            'amount' => 5000,
            'currency' => 'MMK',
        ]);
    }

    public function test_check_out_closes_folio_and_room(): void
    {
        $property = Property::factory()->create();
        $roomType = RoomType::factory()->create(['property_id' => $property->id]);
        $room = Room::factory()->create([
            'property_id' => $property->id,
            'room_type_id' => $roomType->id,
            'status' => 'occupied',
            'housekeeping_status' => 'dirty',
        ]);
        $reservation = Reservation::factory()->create([
            'property_id' => $property->id,
            'room_type_id' => $roomType->id,
            'room_id' => $room->id,
            'status' => 'checked_in',
        ]);
        $stay = Stay::create([
            'reservation_id' => $reservation->id,
            'status' => 'checked_in',
            'assigned_room_id' => $room->id,
            'actual_check_in' => now(),
        ]);
        $folio = Folio::create([
            'reservation_id' => $reservation->id,
            'currency' => 'MMK',
            'total' => 10000,
            'balance' => 10000,
            'status' => 'open',
        ]);
        $user = User::factory()->create([
            'role' => 'front_desk',
            'property_id' => $property->id,
        ]);

        $payload = [
            'payment' => [
                'method' => 'cash',
                'amount' => 10000,
                'currency' => 'MMK',
            ],
            'key_returned' => true,
        ];

        $response = $this->actingAs($user)->postJson("/api/v1/stays/{$stay->id}/check-out", $payload);

        $response->assertOk();

        $stay->refresh();
        $reservation->refresh();
        $room->refresh();
        $folio->refresh();

        $this->assertEquals('checked_out', $stay->status);
        $this->assertNotNull($stay->actual_check_out);
        $this->assertEquals('checked_out', $reservation->status);
        $this->assertEquals('available', $room->status);
        $this->assertEquals('dirty', $room->housekeeping_status);
        $this->assertEquals('closed', $folio->status);
        $this->assertEquals(0, $folio->balance);
    }
}
