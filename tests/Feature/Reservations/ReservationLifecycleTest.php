<?php

namespace Tests\Feature\Reservations;

use App\Models\Folio;
use App\Models\Guest;
use App\Models\Property;
use App\Models\Rate;
use App\Models\Reservation;
use App\Models\Room;
use App\Models\RoomType;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReservationLifecycleTest extends TestCase
{
    use RefreshDatabase;

    public function test_reservation_lifecycle_with_billing(): void
    {
        $property = Property::create([
            'name' => 'XHotel Yangon',
            'timezone' => 'Asia/Yangon',
            'default_currency' => 'MMK',
            'default_language' => 'my',
        ]);

        $roomType = RoomType::create([
            'name' => 'Deluxe Room',
            'property_id' => $property->id,
            'capacity' => 2,
            'base_rate' => 150000, // MMK
        ]);

        $room = Room::create([
            'number' => '101',
            'room_type_id' => $roomType->id,
            'property_id' => $property->id,
            'floor' => 1,
            'is_active' => true,
        ]);

        $rate = Rate::create([
            'room_type_id' => $roomType->id,
            'name' => 'Standard Rate',
            'type' => 'base',
            'start_date' => now()->subDays(1)->toDateString(),
            'end_date' => now()->addDays(30)->toDateString(),
            'rate' => 150000,
            'min_stay' => 1,
            'is_active' => true,
        ]);

        $guest = Guest::create([
            'name' => 'John Doe',
            'email' => 'john@example.com',
            // 'phone' => '0912345678',
        ]);

        $user = User::factory()->create([
            'role' => 'front_desk',
            'property_id' => $property->id,
        ]);

        // Create reservation
        $reservationData = [
            'guest' => [
                'name' => 'John Doe',
                // 'phone' => '0912345678',
                'id_type' => 'passport',
                'id_number' => 'P123456',
            ],
            'property_id' => $property->id,
            'check_in' => now()->addDays(1)->toDateString(),
            'check_out' => now()->addDays(3)->toDateString(),
            'room_type_id' => $roomType->id,
            'adults' => 2,
            'children' => 0,
            'source' => 'walk_in',
            'special_requests' => 'Test reservation',
            'currency' => 'MMK',
        ];

        $response = $this->actingAs($user)->postJson('/api/v1/reservations', $reservationData);

        $response->assertOk();
        $reservation = Reservation::find($response->json('id'));

        $this->assertEquals('confirmed', $reservation->status);
        $this->assertEquals($property->id, $reservation->property_id);
        $this->assertNotNull($reservation->folios()->first());

        // Check folio charges
        $folio = $reservation->folios()->first();
        $this->assertEquals('open', $folio->status);
        $this->assertGreaterThan(0, $folio->total);

        // Expected charges: 2 nights * 150000 MMK = 300000 MMK + 5% tax = 315000 MMK
        $this->assertEquals(315000, $folio->total);

        // Update reservation
        $updateData = [
            'adults' => 3,
        ];

        $response = $this->actingAs($user)->patchJson("/api/v1/reservations/{$reservation->id}", $updateData);

        $response->assertOk();
        $reservation->refresh();
        $this->assertEquals(3, $reservation->adults);

        // Add additional charge
        $chargeData = [
            'type' => 'service',
            'description' => 'Room service',
            'amount' => 25000,
            'currency' => 'MMK',
        ];

        $response = $this->actingAs($user)->postJson("/api/v1/folios/{$folio->id}/charges", $chargeData);

        $response->assertOk();
        $folio->refresh();
        $this->assertEquals(340000, $folio->total); // 315000 + 25000

        // Add payment
        $paymentData = [
            'amount' => 340000, // Updated to match new total
            'method' => 'cash',
            'currency' => 'MMK',
            'reference' => 'PAY-001',
        ];

        $response = $this->actingAs($user)->postJson("/api/v1/folios/{$folio->id}/payments", $paymentData);

        $response->assertOk();
        $folio->refresh();
        $this->assertEquals('closed', $folio->status);
        $this->assertEquals(0, $folio->balance);

        // Cancel reservation
        $response = $this->actingAs($user)->patchJson("/api/v1/reservations/{$reservation->id}/cancel", [
            'reason' => 'Guest requested cancellation',
        ]);

        $response->assertOk();
    }

    public function test_reservation_cancellation(): void
    {
        $property = Property::create([
            'name' => 'XHotel Yangon',
            'timezone' => 'Asia/Yangon',
            'default_currency' => 'MMK',
            'default_language' => 'my',
        ]);

        $roomType = RoomType::create([
            'name' => 'Deluxe Room',
            'property_id' => $property->id,
            'capacity' => 2,
            'base_rate' => 150000,
        ]);

        $guest = Guest::create([
            'name' => 'Test Guest',
            'email' => 'test@example.com',
        ]);

        $user = User::factory()->create([
            'role' => 'front_desk',
            'property_id' => $property->id,
        ]);

        $reservation = Reservation::create([
            'property_id' => $property->id,
            'guest_id' => $guest->id,
            'code' => 'RSV-001',
            'check_in' => now()->addDays(7)->toDateString(),
            'check_out' => now()->addDays(9)->toDateString(),
            'room_type_id' => $roomType->id,
            'adults' => 1,
            'status' => 'confirmed',
            'source' => 'walk_in',
        ]);

        $response = $this->actingAs($user)->patchJson("/api/v1/reservations/{$reservation->id}/cancel", [
            'reason' => 'Guest requested cancellation'
        ]);

        $response->assertOk();
        $reservation->refresh();
        $this->assertEquals('canceled', $reservation->status);
    }
}
