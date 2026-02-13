<?php

namespace Tests\Feature;

use App\Models\CashierShift;
use App\Models\Folio;
use App\Models\Payment;
use App\Models\Property;
use App\Models\Refund;
use App\Models\Reservation;
use App\Models\RoomType;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class CashierShiftTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function cashier_can_open_shift(): void
    {
        $property = Property::factory()->create();
        $cashier = User::factory()->create([
            'role' => 'cashier',
            'property_id' => $property->id,
        ]);

        Sanctum::actingAs($cashier);

        $response = $this->postJson('/api/v1/cashier-shifts/open', [
            'opening_cash' => 10000,
            'currency' => 'MMK',
            'notes' => 'Morning shift',
        ]);

        $response->assertOk()->assertJson([
            'status' => 'open',
            'opening_cash' => 10000,
            'currency' => 'MMK',
        ]);

        $this->assertDatabaseHas('cashier_shifts', [
            'property_id' => $property->id,
            'cashier_id' => $cashier->id,
            'status' => 'open',
        ]);
    }

    #[Test]
    public function cashier_cannot_open_second_shift(): void
    {
        $property = Property::factory()->create();
        $cashier = User::factory()->create([
            'role' => 'cashier',
            'property_id' => $property->id,
        ]);

        CashierShift::create([
            'property_id' => $property->id,
            'cashier_id' => $cashier->id,
            'opened_at' => now()->subHour(),
            'currency' => 'MMK',
            'opening_cash' => 5000,
            'status' => 'open',
        ]);

        Sanctum::actingAs($cashier);

        $response = $this->postJson('/api/v1/cashier-shifts/open', [
            'opening_cash' => 8000,
            'currency' => 'MMK',
        ]);

        $response->assertStatus(409)->assertJson([
            'code' => 'CASHIER_SHIFT_ALREADY_OPEN',
        ]);
    }

    #[Test]
    public function cashier_can_close_shift_with_totals_and_variance(): void
    {
        Carbon::setTestNow(now());

        $property = Property::factory()->create();
        $roomType = RoomType::factory()->create([
            'property_id' => $property->id,
        ]);
        $reservation = Reservation::factory()->create([
            'property_id' => $property->id,
            'room_type_id' => $roomType->id,
        ]);
        $folio = Folio::factory()->create([
            'reservation_id' => $reservation->id,
            'currency' => 'MMK',
        ]);
        $cashier = User::factory()->create([
            'role' => 'cashier',
            'property_id' => $property->id,
        ]);

        $shift = CashierShift::create([
            'property_id' => $property->id,
            'cashier_id' => $cashier->id,
            'opened_at' => now()->subHours(2),
            'currency' => 'MMK',
            'opening_cash' => 10000,
            'status' => 'open',
        ]);

        Payment::create([
            'folio_id' => $folio->id,
            'method' => 'cash',
            'amount' => 15000,
            'currency' => 'MMK',
            'exchange_rate' => 1,
            'received_at' => now()->subHour(),
            'created_by' => $cashier->id,
        ]);

        Payment::create([
            'folio_id' => $folio->id,
            'method' => 'card',
            'amount' => 20000,
            'currency' => 'MMK',
            'exchange_rate' => 1,
            'received_at' => now()->subMinutes(30),
            'created_by' => $cashier->id,
        ]);

        Refund::create([
            'folio_id' => $folio->id,
            'method' => 'cash',
            'amount' => 5000,
            'currency' => 'MMK',
            'exchange_rate' => 1,
            'folio_amount' => 5000,
            'status' => 'approved',
            'approved_by' => $cashier->id,
            'refunded_at' => now()->subMinutes(10),
        ]);

        Sanctum::actingAs($cashier);

        $response = $this->postJson("/api/v1/cashier-shifts/{$shift->id}/close", [
            'closing_cash' => 19000,
            'notes' => 'End of shift',
        ]);

        $response->assertOk()->assertJson([
            'status' => 'closed',
            'total_cash' => 10000,
            'total_card' => 20000,
            'expected_cash' => 20000,
            'variance' => -1000,
        ]);

        $this->assertDatabaseHas('cashier_shifts', [
            'id' => $shift->id,
            'status' => 'closed',
            'total_cash' => 10000,
            'total_card' => 20000,
            'expected_cash' => 20000,
            'variance' => -1000,
        ]);

        Carbon::setTestNow();
    }

    #[Test]
    public function cashier_shift_report_returns_totals(): void
    {
        Carbon::setTestNow(now());

        $property = Property::factory()->create();
        $cashier = User::factory()->create([
            'role' => 'cashier',
            'property_id' => $property->id,
        ]);

        CashierShift::create([
            'property_id' => $property->id,
            'cashier_id' => $cashier->id,
            'opened_at' => now()->startOfDay()->addHour(),
            'closed_at' => now()->startOfDay()->addHours(8),
            'currency' => 'MMK',
            'opening_cash' => 0,
            'total_cash' => 12000,
            'total_card' => 8000,
            'status' => 'closed',
        ]);

        Sanctum::actingAs($cashier);

        $response = $this->getJson('/api/v1/reports/cashier-shift?date='.
            now()->toDateString().'&cashier_id='.$cashier->id);

        $response->assertOk()->assertJson([
            'date' => now()->toDateString(),
            'cashier' => [
                'id' => $cashier->id,
                'name' => $cashier->name,
            ],
            'total_cash' => 12000,
            'total_card' => 8000,
        ]);

        Carbon::setTestNow();
    }
}
