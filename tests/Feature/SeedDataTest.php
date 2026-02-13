<?php

namespace Tests\Feature;

use App\Models\Folio;
use App\Models\Property;
use App\Models\Reservation;
use App\Models\Room;
use App\Models\RoomType;
use App\Models\User;
use Database\Seeders\PmsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SeedDataTest extends TestCase
{
    use RefreshDatabase;

    public function test_pms_seeder_creates_core_data(): void
    {
        $this->seed(PmsSeeder::class);

        $this->assertDatabaseCount('properties', 1);
        $this->assertDatabaseCount('room_types', 2);
        $this->assertDatabaseCount('rooms', 4);
        $this->assertDatabaseCount('reservations', 4);
        $this->assertDatabaseCount('folios', 4);

        $property = Property::first();
        $this->assertNotNull($property);
        $this->assertSame('MMK', $property->default_currency);

        $admin = User::where('email', 'admin@hotel.com')->first();
        $this->assertNotNull($admin);
        $this->assertSame('admin', $admin->role);
        $this->assertSame($property->id, $admin->property_id);

        $reservation = Reservation::first();
        $this->assertNotNull($reservation);
        $this->assertNotNull($reservation->guest_id);

        $folio = Folio::where('reservation_id', $reservation->id)->first();
        $this->assertNotNull($folio);
        $this->assertSame('MMK', $folio->currency);

        $room = Room::first();
        $this->assertNotNull($room);
        $this->assertSame($property->id, $room->property_id);

        $roomType = RoomType::first();
        $this->assertNotNull($roomType);
        $this->assertSame($property->id, $roomType->property_id);
    }
}
