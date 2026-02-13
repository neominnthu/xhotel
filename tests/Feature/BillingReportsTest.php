<?php

namespace Tests\Feature;

use App\Models\Charge;
use App\Models\Folio;
use App\Models\Payment;
use App\Models\Property;
use App\Models\Reservation;
use App\Models\RoomType;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class BillingReportsTest extends TestCase
{
    use RefreshDatabase;

    public function test_billing_reports_include_tax_and_gross_revenue(): void
    {
        $property = Property::factory()->create();
        $roomType = RoomType::factory()->create([
            'property_id' => $property->id,
        ]);
        $reservation = Reservation::factory()->create([
            'property_id' => $property->id,
            'room_type_id' => $roomType->id,
            'check_in' => now()->subDay()->toDateString(),
            'check_out' => now()->addDay()->toDateString(),
        ]);
        $folio = Folio::create([
            'reservation_id' => $reservation->id,
            'currency' => 'MMK',
            'total' => 0,
            'balance' => 0,
            'status' => 'open',
        ]);
        $user = User::factory()->create([
            'role' => 'admin',
            'property_id' => $property->id,
        ]);

        Charge::create([
            'folio_id' => $folio->id,
            'type' => 'accommodation',
            'amount' => 10000,
            'tax_amount' => 500,
            'currency' => 'MMK',
            'description' => 'Nightly rate',
            'posted_at' => now()->subDay(),
            'created_by' => $user->id,
        ]);
        Charge::create([
            'folio_id' => $folio->id,
            'type' => 'service',
            'amount' => 20000,
            'tax_amount' => 1000,
            'currency' => 'MMK',
            'description' => 'Service fee',
            'posted_at' => now(),
            'created_by' => $user->id,
        ]);
        Payment::create([
            'folio_id' => $folio->id,
            'method' => 'cash',
            'amount' => 15000,
            'currency' => 'MMK',
            'exchange_rate' => 1,
            'received_at' => now(),
            'created_by' => $user->id,
        ]);

        $response = $this->actingAs($user)->get('/billing-reports?date_from='.now()->subDay()->toDateString().'&date_to='.now()->toDateString());

        $response->assertInertia(fn (Assert $page) => $page
            ->component('billing-reports/index')
            ->has('revenueData', fn (Assert $data) => $data
                ->where('total_charges', 30000)
                ->where('total_tax', 1500)
                ->where('gross_revenue', 31500)
                ->where('total_payments', 15000)
                ->etc()
            )
        );
    }
}
