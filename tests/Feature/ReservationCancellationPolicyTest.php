<?php

namespace Tests\Feature;

use App\Models\CancellationPolicy;
use App\Models\Property;
use App\Models\Reservation;
use App\Models\Room;
use App\Models\RoomType;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReservationCancellationPolicyTest extends TestCase
{
    use RefreshDatabase;

    public function test_cancellation_penalty_is_applied_when_past_deadline(): void
    {
        Carbon::setTestNow(Carbon::parse('2026-02-12 12:00:00'));

        $property = Property::factory()->create([
            'default_currency' => 'MMK',
        ]);
        $roomType = RoomType::factory()->create([
            'property_id' => $property->id,
            'base_rate' => 150000,
        ]);

        Room::factory()->create([
            'property_id' => $property->id,
            'room_type_id' => $roomType->id,
            'status' => 'available',
        ]);

        $user = User::factory()->create([
            'role' => 'front_desk',
            'property_id' => $property->id,
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

        $reservationData = [
            'guest' => [
                'name' => 'Late Guest',
                'phone' => '959123456789',
                'id_type' => 'passport',
                'id_number' => 'P987654',
            ],
            'property_id' => $property->id,
            'check_in' => '2026-02-13',
            'check_out' => '2026-02-14',
            'room_type_id' => $roomType->id,
            'adults' => 2,
            'children' => 0,
            'source' => 'walk_in',
            'special_requests' => 'Late cancellation test',
            'currency' => 'MMK',
        ];

        $createResponse = $this->actingAs($user)->postJson('/api/v1/reservations', $reservationData);
        $createResponse->assertOk();

        $reservation = Reservation::find($createResponse->json('id'));
        $folio = $reservation->folios()->first();
        $initialTotal = $folio->total;

        $cancelResponse = $this->actingAs($user)->patchJson(
            "/api/v1/reservations/{$reservation->id}/cancel",
            ['reason' => 'Late cancellation']
        );

        $cancelResponse->assertOk();

        $reservation->refresh();
        $folio->refresh();

        $this->assertEquals('canceled', $reservation->status);
        $this->assertEquals($initialTotal + 50000, $folio->total);
    }
}
