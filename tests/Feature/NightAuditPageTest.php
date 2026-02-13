<?php

namespace Tests\Feature;

use App\Models\Charge;
use App\Models\Folio;
use App\Models\Payment;
use App\Models\Property;
use App\Models\Reservation;
use App\Models\Room;
use App\Models\RoomType;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class NightAuditPageTest extends TestCase
{
    use RefreshDatabase;

    public function test_night_audit_page_shows_summary(): void
    {
        $date = now()->toDateString();
        $property = Property::factory()->create();
        $user = User::factory()->create([
            'role' => 'front_desk',
            'property_id' => $property->id,
        ]);
        $roomType = RoomType::factory()->create([
            'property_id' => $property->id,
        ]);

        Room::factory()->create([
            'property_id' => $property->id,
            'room_type_id' => $roomType->id,
            'is_active' => true,
        ]);
        Room::factory()->create([
            'property_id' => $property->id,
            'room_type_id' => $roomType->id,
            'is_active' => true,
        ]);

        $inHouseReservation = Reservation::factory()->create([
            'property_id' => $property->id,
            'room_type_id' => $roomType->id,
            'status' => 'checked_in',
            'check_in' => now()->subDay()->toDateString(),
            'check_out' => now()->addDay()->toDateString(),
        ]);

        Reservation::factory()->create([
            'property_id' => $property->id,
            'room_type_id' => $roomType->id,
            'status' => 'confirmed',
            'check_in' => $date,
            'check_out' => now()->addDays(2)->toDateString(),
        ]);

        $folio = Folio::factory()->create([
            'reservation_id' => $inHouseReservation->id,
            'currency' => 'MMK',
        ]);

        Charge::factory()->create([
            'folio_id' => $folio->id,
            'amount' => 50000,
            'currency' => 'MMK',
            'posted_at' => $date.' 12:00:00',
        ]);

        Payment::factory()->create([
            'folio_id' => $folio->id,
            'amount' => 30000,
            'currency' => 'MMK',
            'received_at' => $date.' 15:00:00',
        ]);

        $response = $this->actingAs($user)->get('/night-audit?date='.$date);

        $response->assertInertia(fn (Assert $page) => $page
            ->component('night-audit/index')
            ->where('filters.date', $date)
            ->where('summary.date', $date)
            ->where('summary.total_rooms', 2)
            ->where('summary.arrivals', 1)
            ->where('summary.in_house', 1)
            ->where('summary.charges_total', 50000)
            ->where('summary.payments_total', 30000)
        );
    }
}
