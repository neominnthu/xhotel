<?php

namespace Tests\Feature\Folios;

use App\Models\ExchangeRate;
use App\Models\Folio;
use App\Models\Guest;
use App\Models\Property;
use App\Models\Reservation;
use App\Models\RoomType;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class FolioActionsTest extends TestCase
{
    use RefreshDatabase;

    public function test_folio_charge_creates_charge_and_updates_balance(): void
    {
        $property = Property::create([
            'name' => 'XHotel Yangon',
            'timezone' => 'Asia/Yangon',
            'default_currency' => 'MMK',
            'default_language' => 'my',
        ]);

        $user = User::factory()->create([
            'role' => 'cashier',
            'property_id' => $property->id,
        ]);

        $guest = Guest::create([
            'name' => 'Aye Aye',
            'phone' => '+959123456',
        ]);

        $roomType = RoomType::create([
            'property_id' => $property->id,
            'name' => ['my' => 'Standard', 'en' => 'Standard'],
            'capacity' => 2,
            'base_rate' => 60000,
            'sort_order' => 1,
            'is_active' => true,
        ]);

        $reservation = Reservation::create([
            'property_id' => $property->id,
            'guest_id' => $guest->id,
            'code' => 'RSV-20260212-009',
            'status' => 'confirmed',
            'source' => 'walk_in',
            'check_in' => now()->toDateString(),
            'check_out' => now()->addDay()->toDateString(),
            'room_type_id' => $roomType->id,
            'adults' => 2,
            'children' => 0,
        ]);

        $folio = Folio::create([
            'reservation_id' => $reservation->id,
            'currency' => 'MMK',
            'total' => 0,
            'balance' => 0,
            'status' => 'open',
        ]);

        Sanctum::actingAs($user);

        $response = $this->postJson("/api/v1/folios/{$folio->id}/charges", [
            'type' => 'minibar',
            'description' => 'Snacks',
            'amount' => 8000,
            'currency' => 'MMK',
            'tax_amount' => 400,
        ]);

        $response->assertOk()->assertJson([
            'type' => 'minibar',
            'amount' => 8000,
            'currency' => 'MMK',
        ]);

        $this->assertDatabaseHas('charges', [
            'folio_id' => $folio->id,
            'type' => 'minibar',
            'amount' => 8000,
            'currency' => 'MMK',
        ]);

        $this->assertDatabaseHas('folios', [
            'id' => $folio->id,
            'total' => 8400,
            'balance' => 8400,
        ]);

        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $user->id,
            'action' => 'folio.charge.created',
        ]);
    }

    public function test_folio_payment_reduces_balance(): void
    {
        $property = Property::create([
            'name' => 'XHotel Yangon',
            'timezone' => 'Asia/Yangon',
            'default_currency' => 'MMK',
            'default_language' => 'my',
        ]);

        $user = User::factory()->create([
            'role' => 'cashier',
            'property_id' => $property->id,
        ]);

        $guest = Guest::create([
            'name' => 'Min Min',
            'phone' => '+959555555',
        ]);

        $roomType = RoomType::create([
            'property_id' => $property->id,
            'name' => ['my' => 'Standard', 'en' => 'Standard'],
            'capacity' => 2,
            'base_rate' => 60000,
            'sort_order' => 1,
            'is_active' => true,
        ]);

        $reservation = Reservation::create([
            'property_id' => $property->id,
            'guest_id' => $guest->id,
            'code' => 'RSV-20260212-010',
            'status' => 'confirmed',
            'source' => 'walk_in',
            'check_in' => now()->toDateString(),
            'check_out' => now()->addDay()->toDateString(),
            'room_type_id' => $roomType->id,
            'adults' => 1,
            'children' => 0,
        ]);

        $folio = Folio::create([
            'reservation_id' => $reservation->id,
            'currency' => 'MMK',
            'total' => 12000,
            'balance' => 12000,
            'status' => 'open',
        ]);

        Sanctum::actingAs($user);

        $response = $this->postJson("/api/v1/folios/{$folio->id}/payments", [
            'method' => 'cash',
            'amount' => 5000,
            'currency' => 'MMK',
        ]);

        $response->assertOk()->assertJson([
            'method' => 'cash',
            'amount' => 5000,
            'currency' => 'MMK',
        ]);

        $this->assertDatabaseHas('payments', [
            'folio_id' => $folio->id,
            'method' => 'cash',
            'amount' => 5000,
            'currency' => 'MMK',
        ]);

        $this->assertDatabaseHas('folios', [
            'id' => $folio->id,
            'balance' => 7000,
        ]);

        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $user->id,
            'action' => 'folio.payment.created',
        ]);
    }

    public function test_folio_payment_uses_exchange_rate_when_currency_differs(): void
    {
        $property = Property::create([
            'name' => 'XHotel Yangon',
            'timezone' => 'Asia/Yangon',
            'default_currency' => 'MMK',
            'default_language' => 'my',
        ]);

        $user = User::factory()->create([
            'role' => 'cashier',
            'property_id' => $property->id,
        ]);

        $guest = Guest::create([
            'name' => 'Nay Nay',
            'phone' => '+959777777',
        ]);

        $roomType = RoomType::create([
            'property_id' => $property->id,
            'name' => ['my' => 'Standard', 'en' => 'Standard'],
            'capacity' => 2,
            'base_rate' => 60000,
            'sort_order' => 1,
            'is_active' => true,
        ]);

        $reservation = Reservation::create([
            'property_id' => $property->id,
            'guest_id' => $guest->id,
            'code' => 'RSV-20260212-011',
            'status' => 'confirmed',
            'source' => 'walk_in',
            'check_in' => now()->toDateString(),
            'check_out' => now()->addDay()->toDateString(),
            'room_type_id' => $roomType->id,
            'adults' => 1,
            'children' => 0,
        ]);

        $folio = Folio::create([
            'reservation_id' => $reservation->id,
            'currency' => 'MMK',
            'total' => 7000,
            'balance' => 7000,
            'status' => 'open',
        ]);

        ExchangeRate::create([
            'property_id' => $property->id,
            'base_currency' => 'MMK',
            'quote_currency' => 'USD',
            'rate' => 3500,
            'effective_date' => now()->toDateString(),
            'is_active' => true,
        ]);

        Sanctum::actingAs($user);

        $response = $this->postJson("/api/v1/folios/{$folio->id}/payments", [
            'method' => 'cash',
            'amount' => 2,
            'currency' => 'USD',
        ]);

        $response->assertOk()->assertJson([
            'method' => 'cash',
            'amount' => 2,
            'currency' => 'USD',
        ]);

        $this->assertDatabaseHas('payments', [
            'folio_id' => $folio->id,
            'amount' => 2,
            'currency' => 'USD',
            'exchange_rate' => 3500,
        ]);

        $this->assertDatabaseHas('folios', [
            'id' => $folio->id,
            'balance' => 0,
        ]);
    }
}
