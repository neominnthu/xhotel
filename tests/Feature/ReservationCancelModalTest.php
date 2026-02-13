<?php

namespace Tests\Feature;

use App\Models\Property;
use App\Models\Reservation;
use App\Models\RoomType;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ReservationCancelModalTest extends TestCase
{
    use RefreshDatabase;

    public function test_shows_cancellation_confirmation_modal_with_preview_details(): void
    {
        $property = Property::factory()->create();
        $user = User::factory()->create([
            'role' => 'reservation_manager',
            'property_id' => $property->id,
        ]);
        $roomType = RoomType::factory()->create(['property_id' => $property->id]);
        $reservation = Reservation::factory()->create([
            'property_id' => $property->id,
            'room_type_id' => $roomType->id,
            'status' => 'confirmed',
        ]);

        $response = $this->actingAs($user)->get("/reservations/{$reservation->id}");

        $response->assertInertia(fn (Assert $page) => $page
            ->component('reservations/show')
            ->has('cancellation_preview')
            ->where('cancellation_preview.policy', null) // No policy set
            ->where('cancellation_preview.applies', false)
            ->where('cancellation_preview.amount', 0)
        );
    }

    public function test_prevents_cancellation_when_reservation_is_already_canceled(): void
    {
        $property = Property::factory()->create();
        $user = User::factory()->create([
            'role' => 'reservation_manager',
            'property_id' => $property->id,
        ]);
        $roomType = RoomType::factory()->create(['property_id' => $property->id]);
        $reservation = Reservation::factory()->create([
            'property_id' => $property->id,
            'room_type_id' => $roomType->id,
            'status' => 'canceled',
        ]);

        $response = $this->actingAs($user)->get("/reservations/{$reservation->id}");

        $response->assertInertia(fn (Assert $page) => $page
            ->component('reservations/show')
            ->where('reservation.status', 'canceled')
        );
    }
}