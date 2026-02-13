<?php

namespace Tests\Feature;

use App\Models\CancellationPolicy;
use App\Models\Folio;
use App\Models\Guest;
use App\Models\Property;
use App\Models\Reservation;
use App\Models\RoomType;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class CancellationPenaltyAuditTrailTest extends TestCase
{
    use RefreshDatabase;

    public function test_cancellation_penalty_appears_in_folio_charges_with_audit_trail(): void
    {
        $property = Property::factory()->create(['default_currency' => 'MMK']);
        $roomType = RoomType::factory()->create(['property_id' => $property->id]);

        $user = User::factory()->create([
            'role' => 'front_desk',
            'property_id' => $property->id,
        ]);

        $reservation = Reservation::factory()->create([
            'property_id' => $property->id,
            'room_type_id' => $roomType->id,
            'status' => 'confirmed',
            'check_in' => now()->addDays(2)->toDateString(),
            'check_out' => now()->addDays(4)->toDateString(),
        ]);

        // Create a folio for the reservation
        $folio = Folio::create([
            'reservation_id' => $reservation->id,
            'currency' => 'MMK',
            'total' => 0,
            'balance' => 0,
            'status' => 'open',
        ]);

        // Create a cancellation policy
        CancellationPolicy::create([
            'property_id' => $property->id,
            'room_type_id' => null,
            'name' => 'Late Cancel',
            'deadline_hours' => 48, // 2 days before check-in
            'penalty_type' => 'flat',
            'penalty_amount' => 50000,
            'penalty_percent' => 0,
            'is_active' => true,
        ]);

        // Cancel the reservation (this should trigger after the deadline)
        $response = $this->actingAs($user)->post("/reservations/{$reservation->id}/cancel", [
            'reason' => 'Guest changed plans',
        ]);

        $response->assertRedirect();

        // Refresh the reservation and folio
        $reservation->refresh();
        $folio->refresh();

        // Check that reservation is canceled
        $this->assertEquals('canceled', $reservation->status);

        // Check that folio has the penalty charge
        $this->assertEquals(50000, $folio->total);
        $this->assertEquals(50000, $folio->balance);

        $charges = $folio->charges;
        $this->assertCount(1, $charges);

        $charge = $charges->first();
        $this->assertEquals('cancellation_penalty', $charge->type);
        $this->assertEquals('Cancellation penalty: Guest changed plans', $charge->description);
        $this->assertEquals(50000, $charge->amount);
        $this->assertEquals('MMK', $charge->currency);
        $this->assertEquals($user->id, $charge->created_by);

        // Check that the charge appears in the folio show page with audit trail
        $response = $this->actingAs($user)->get("/folios/{$folio->id}");

        $response->assertInertia(fn (Assert $page) => $page
            ->component('folios/show')
            ->has('charges', 1)
            ->where('charges.0.type', 'cancellation_penalty')
            ->where('charges.0.description', 'Cancellation penalty: Guest changed plans')
            ->where('charges.0.amount', 50000)
            ->where('charges.0.created_by.id', $user->id)
            ->where('charges.0.created_by.name', $user->name)
        );
    }

    public function test_cancellation_without_penalty_does_not_create_charge(): void
    {
        $property = Property::factory()->create(['default_currency' => 'MMK']);
        $roomType = RoomType::factory()->create(['property_id' => $property->id]);

        $user = User::factory()->create([
            'role' => 'front_desk',
            'property_id' => $property->id,
        ]);

        $reservation = Reservation::factory()->create([
            'property_id' => $property->id,
            'room_type_id' => $roomType->id,
            'status' => 'confirmed',
            'check_in' => now()->addDays(7)->toDateString(), // 7 days from now
            'check_out' => now()->addDays(9)->toDateString(),
        ]);

        // Create a folio for the reservation
        $folio = Folio::create([
            'reservation_id' => $reservation->id,
            'currency' => 'MMK',
            'total' => 0,
            'balance' => 0,
            'status' => 'open',
        ]);

        // Create a cancellation policy with 48-hour deadline
        CancellationPolicy::create([
            'property_id' => $property->id,
            'room_type_id' => null,
            'name' => 'Late Cancel',
            'deadline_hours' => 48,
            'penalty_type' => 'flat',
            'penalty_amount' => 50000,
            'penalty_percent' => 0,
            'is_active' => true,
        ]);

        // Cancel the reservation (this should be before the deadline, so no penalty)
        $response = $this->actingAs($user)->post("/reservations/{$reservation->id}/cancel", [
            'reason' => 'Guest changed plans',
        ]);

        $response->assertRedirect();

        // Refresh the folio
        $folio->refresh();

        // Check that no charges were created
        $this->assertEquals(0, $folio->total);
        $this->assertEquals(0, $folio->balance);
        $this->assertCount(0, $folio->charges);
    }
}