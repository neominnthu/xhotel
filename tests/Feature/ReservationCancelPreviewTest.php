<?php

namespace Tests\Feature;

use App\Models\CancellationPolicy;
use App\Models\Folio;
use App\Models\Guest;
use App\Models\Property;
use App\Models\Reservation;
use App\Models\RoomType;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ReservationCancelPreviewTest extends TestCase
{
    use RefreshDatabase;

    public function test_cancellation_preview_is_visible_on_reservation_show(): void
    {
        Carbon::setTestNow(Carbon::parse('2026-02-12 12:00:00'));

        $property = Property::factory()->create([
            'default_currency' => 'MMK',
        ]);
        $roomType = RoomType::factory()->create([
            'property_id' => $property->id,
        ]);
        $guest = Guest::factory()->create();
        $reservation = Reservation::factory()->create([
            'property_id' => $property->id,
            'guest_id' => $guest->id,
            'room_type_id' => $roomType->id,
            'status' => 'confirmed',
            'check_in' => '2026-02-13',
            'check_out' => '2026-02-14',
        ]);

        Folio::create([
            'reservation_id' => $reservation->id,
            'currency' => 'MMK',
            'total' => 0,
            'balance' => 0,
            'status' => 'open',
        ]);

        CancellationPolicy::create([
            'property_id' => $property->id,
            'room_type_id' => null,
            'name' => 'Late cancel',
            'deadline_hours' => 24,
            'penalty_type' => 'flat',
            'penalty_amount' => 50000,
            'penalty_percent' => 0,
            'is_active' => true,
        ]);

        $user = User::factory()->create([
            'role' => 'reservation_manager',
            'property_id' => $property->id,
        ]);

        $response = $this->actingAs($user)->get("/reservations/{$reservation->id}");

        $response->assertInertia(fn (Assert $page) => $page
            ->component('reservations/show')
            ->where('cancellation_preview.applies', true)
            ->where('cancellation_preview.amount', 50000)
            ->where('cancellation_preview.currency', 'MMK')
            ->where('cancellation_preview.policy.name', 'Late cancel')
        );
    }
}
