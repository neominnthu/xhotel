<?php

namespace Tests\Feature\Settings;

use App\Models\ExchangeRate;
use App\Models\Property;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExchangeRateSettingsTest extends TestCase
{
    use RefreshDatabase;

    public function test_exchange_rate_settings_can_create_update_and_delete(): void
    {
        $property = Property::factory()->create([
            'default_currency' => 'MMK',
        ]);
        $user = User::factory()->create([
            'role' => 'admin',
            'property_id' => $property->id,
        ]);

        $createResponse = $this->actingAs($user)->post('/settings/exchange-rates', [
            'base_currency' => 'MMK',
            'quote_currency' => 'USD',
            'rate' => 3500,
            'effective_date' => '2026-02-13',
            'source' => 'manual',
            'is_active' => true,
        ]);

        $createResponse->assertRedirect();
        $exchangeRate = ExchangeRate::firstOrFail();

        $this->assertDatabaseHas('audit_logs', [
            'action' => 'exchange_rate.created',
            'resource' => 'exchange_rate',
        ]);

        $updateResponse = $this->actingAs($user)->patch(
            "/settings/exchange-rates/{$exchangeRate->id}",
            [
                'base_currency' => 'MMK',
                'quote_currency' => 'USD',
                'rate' => 3600,
                'effective_date' => '2026-02-14',
                'source' => 'manual',
                'is_active' => false,
            ]
        );

        $updateResponse->assertRedirect();
        $updatedExchangeRate = ExchangeRate::findOrFail($exchangeRate->id);
        $this->assertSame('2026-02-14', $updatedExchangeRate->effective_date?->toDateString());
        $this->assertSame(3600.0, (float) $updatedExchangeRate->rate);
        $this->assertFalse($updatedExchangeRate->is_active);

        $this->assertDatabaseHas('audit_logs', [
            'action' => 'exchange_rate.updated',
            'resource' => 'exchange_rate',
        ]);

        $deleteResponse = $this->actingAs($user)->delete(
            "/settings/exchange-rates/{$exchangeRate->id}"
        );

        $deleteResponse->assertRedirect();
        $this->assertSoftDeleted('exchange_rates', [
            'id' => $exchangeRate->id,
        ]);

        $this->assertDatabaseHas('audit_logs', [
            'action' => 'exchange_rate.deleted',
            'resource' => 'exchange_rate',
        ]);
    }

    public function test_exchange_rate_settings_rejects_invalid_values(): void
    {
        $property = Property::factory()->create([
            'default_currency' => 'MMK',
        ]);
        $user = User::factory()->create([
            'role' => 'reservation_manager',
            'property_id' => $property->id,
        ]);

        ExchangeRate::create([
            'property_id' => $property->id,
            'base_currency' => 'MMK',
            'quote_currency' => 'USD',
            'rate' => 3500,
            'effective_date' => '2026-02-13',
            'is_active' => true,
        ]);

        $response = $this->actingAs($user)->post('/settings/exchange-rates', [
            'base_currency' => 'MMK',
            'quote_currency' => 'MMK',
            'rate' => 0,
            'effective_date' => '2026-02-13',
        ]);

        $response->assertSessionHasErrors([
            'quote_currency',
            'rate',
        ]);
    }
}
