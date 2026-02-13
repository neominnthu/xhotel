<?php

namespace Tests\Feature\Folios;

use App\Models\ExchangeRate;
use App\Models\Folio;
use App\Models\Payment;
use App\Models\Refund;
use App\Models\Reservation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class FolioRefundsTest extends TestCase
{
    use RefreshDatabase;

    public function test_folio_refund_request_creates_pending_refund(): void
    {
        $reservation = Reservation::factory()->create();
        $user = User::factory()->create([
            'role' => 'cashier',
            'property_id' => $reservation->property_id,
        ]);

        $folio = Folio::factory()->create([
            'reservation_id' => $reservation->id,
            'currency' => 'MMK',
            'total' => 10000,
            'balance' => 0,
            'status' => 'closed',
            'closed_at' => now(),
        ]);

        Payment::create([
            'folio_id' => $folio->id,
            'method' => 'cash',
            'amount' => 10000,
            'currency' => 'MMK',
            'exchange_rate' => 1,
            'reference' => 'PAY-100',
            'received_at' => now(),
            'created_by' => $user->id,
        ]);

        Sanctum::actingAs($user);

        $response = $this->postJson("/api/v1/folios/{$folio->id}/refunds", [
            'method' => 'cash',
            'amount' => 5000,
            'currency' => 'MMK',
            'reason' => 'Deposit return',
        ]);

        $response->assertOk()->assertJson([
            'method' => 'cash',
            'amount' => 5000,
            'currency' => 'MMK',
            'status' => 'pending',
        ]);

        $this->assertDatabaseHas('refunds', [
            'folio_id' => $folio->id,
            'method' => 'cash',
            'amount' => 5000,
            'currency' => 'MMK',
            'status' => 'pending',
        ]);
    }

    public function test_folio_refund_approval_marks_refund_as_approved(): void
    {
        $reservation = Reservation::factory()->create();
        $user = User::factory()->create([
            'role' => 'cashier',
            'property_id' => $reservation->property_id,
        ]);

        $folio = Folio::factory()->create([
            'reservation_id' => $reservation->id,
            'currency' => 'MMK',
            'total' => 12000,
            'balance' => 0,
            'status' => 'closed',
            'closed_at' => now(),
        ]);

        Payment::create([
            'folio_id' => $folio->id,
            'method' => 'cash',
            'amount' => 12000,
            'currency' => 'MMK',
            'exchange_rate' => 1,
            'reference' => 'PAY-200',
            'received_at' => now(),
            'created_by' => $user->id,
        ]);

        $refund = Refund::create([
            'folio_id' => $folio->id,
            'method' => 'cash',
            'amount' => 6000,
            'currency' => 'MMK',
            'exchange_rate' => 1,
            'folio_amount' => 6000,
            'status' => 'pending',
            'reference' => 'RF-200',
            'requested_by' => $user->id,
        ]);

        Sanctum::actingAs($user);

        $response = $this->postJson("/api/v1/refunds/{$refund->id}/approve", []);

        $response->assertOk()->assertJson([
            'id' => $refund->id,
            'status' => 'approved',
        ]);

        $this->assertDatabaseHas('refunds', [
            'id' => $refund->id,
            'status' => 'approved',
            'approved_by' => $user->id,
        ]);
    }

    public function test_folio_refund_uses_exchange_rate_when_currency_differs(): void
    {
        $reservation = Reservation::factory()->create();
        $user = User::factory()->create([
            'role' => 'cashier',
            'property_id' => $reservation->property_id,
        ]);

        $folio = Folio::factory()->create([
            'reservation_id' => $reservation->id,
            'currency' => 'MMK',
            'total' => 10000,
            'balance' => 0,
            'status' => 'closed',
            'closed_at' => now(),
        ]);

        Payment::create([
            'folio_id' => $folio->id,
            'method' => 'cash',
            'amount' => 10000,
            'currency' => 'MMK',
            'exchange_rate' => 1,
            'reference' => 'PAY-300',
            'received_at' => now(),
            'created_by' => $user->id,
        ]);

        ExchangeRate::create([
            'property_id' => $reservation->property_id,
            'base_currency' => 'MMK',
            'quote_currency' => 'USD',
            'rate' => 3500,
            'effective_date' => now()->toDateString(),
            'is_active' => true,
        ]);

        Sanctum::actingAs($user);

        $response = $this->postJson("/api/v1/folios/{$folio->id}/refunds", [
            'method' => 'cash',
            'amount' => 1,
            'currency' => 'USD',
            'reason' => 'Foreign refund',
        ]);

        $response->assertOk()->assertJson([
            'method' => 'cash',
            'amount' => 1,
            'currency' => 'USD',
            'status' => 'pending',
        ]);

        $this->assertDatabaseHas('refunds', [
            'folio_id' => $folio->id,
            'amount' => 1,
            'currency' => 'USD',
            'exchange_rate' => 3500,
            'folio_amount' => 3500,
        ]);
    }
}
