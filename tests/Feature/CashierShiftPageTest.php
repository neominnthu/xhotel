<?php

namespace Tests\Feature;

use App\Models\CashierShift;
use App\Models\Property;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class CashierShiftPageTest extends TestCase
{
    use RefreshDatabase;

    public function test_cashier_shift_page_loads_for_cashier(): void
    {
        $property = Property::factory()->create();
        $cashier = User::factory()->create([
            'role' => 'cashier',
            'property_id' => $property->id,
        ]);

        $shift = CashierShift::create([
            'property_id' => $property->id,
            'cashier_id' => $cashier->id,
            'opened_at' => now(),
            'currency' => 'MMK',
            'opening_cash' => 10000,
            'status' => 'open',
        ]);

        $response = $this->actingAs($cashier)->get('/cashier-shifts');

        $response->assertInertia(fn (Assert $page) => $page
            ->component('cashier-shifts/index')
            ->where('current_shift.id', $shift->id)
            ->has('recent_shifts')
            ->has('cashiers')
            ->has('report')
        );
    }
}
