<?php

namespace Tests\Feature;

use App\Models\Guest;
use App\Models\Property;
use App\Models\Reservation;
use App\Models\Room;
use App\Models\RoomType;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class RoomInventoryPageTest extends TestCase
{
    use RefreshDatabase;

    public function test_room_inventory_page_loads(): void
    {
        $property = Property::factory()->create();
        $roomType = RoomType::factory()->create([
            'property_id' => $property->id,
        ]);
        $room = Room::factory()->create([
            'property_id' => $property->id,
            'room_type_id' => $roomType->id,
            'number' => '301',
        ]);
        $guest = Guest::factory()->create();
        Reservation::factory()->create([
            'property_id' => $property->id,
            'room_type_id' => $roomType->id,
            'room_id' => $room->id,
            'guest_id' => $guest->id,
            'status' => 'confirmed',
            'check_in' => now()->toDateString(),
            'check_out' => now()->addDays(2)->toDateString(),
        ]);
        $user = User::factory()->create([
            'role' => 'front_desk',
            'property_id' => $property->id,
        ]);

        $response = $this->actingAs($user)->get('/room-inventory');

        $response->assertInertia(fn (Assert $page) => $page
            ->component('room-inventory/index')
            ->has('dates')
            ->has('rooms', 1)
            ->has('reservations', 1)
        );
    }
}
