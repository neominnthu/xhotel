<?php

namespace Tests\Feature;

use App\Models\Folio;
use App\Models\Guest;
use App\Models\Property;
use App\Models\Reservation;
use App\Models\Room;
use App\Models\RoomType;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReportsExportTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_export_revenue_csv(): void
    {
        Carbon::setTestNow(Carbon::parse('2026-02-12 08:00:00'));

        $property = Property::factory()->create([
            'default_currency' => 'MMK',
        ]);
        $roomType = RoomType::factory()->create([
            'property_id' => $property->id,
        ]);
        Room::factory()->create([
            'property_id' => $property->id,
            'room_type_id' => $roomType->id,
            'status' => 'available',
        ]);

        $guest = Guest::factory()->create();

        $reservation = Reservation::factory()->create([
            'property_id' => $property->id,
            'guest_id' => $guest->id,
            'room_type_id' => $roomType->id,
            'status' => 'checked_in',
            'check_in' => '2026-02-10',
            'check_out' => '2026-02-12',
        ]);

        $folio = Folio::create([
            'reservation_id' => $reservation->id,
            'currency' => 'MMK',
            'total' => 200000,
            'balance' => 0,
            'status' => 'closed',
            'closed_at' => Carbon::parse('2026-02-11 10:00:00'),
        ]);

        $folio->forceFill([
            'created_at' => Carbon::parse('2026-02-11 10:00:00'),
            'updated_at' => Carbon::parse('2026-02-11 10:00:00'),
        ])->save();

        $user = User::factory()->create([
            'role' => 'reservation_manager',
            'property_id' => $property->id,
        ]);

        $response = $this->actingAs($user)->get('/api/v1/reports/revenue/export?from=2026-02-11&to=2026-02-11');

        $response->assertOk();
        $rawContent = $response->streamedContent();
        $this->assertStringStartsWith("\xEF\xBB\xBF", $rawContent);
        $content = ltrim($rawContent, "\xEF\xBB\xBF");

        $this->assertStringContainsString('metric,value', $content);
        $this->assertStringContainsString('total_revenue,200000', $content);
        $this->assertStringContainsString('source,revenue', $content);
    }

    public function test_can_export_occupancy_csv_with_bom(): void
    {
        Carbon::setTestNow(Carbon::parse('2026-02-12 08:00:00'));

        $property = Property::factory()->create([
            'default_currency' => 'MMK',
        ]);
        $roomType = RoomType::factory()->create([
            'property_id' => $property->id,
        ]);
        Room::factory()->create([
            'property_id' => $property->id,
            'room_type_id' => $roomType->id,
            'status' => 'available',
        ]);

        $guest = Guest::factory()->create();

        Reservation::factory()->create([
            'property_id' => $property->id,
            'guest_id' => $guest->id,
            'room_type_id' => $roomType->id,
            'status' => 'checked_in',
            'check_in' => '2026-02-10',
            'check_out' => '2026-02-12',
        ]);

        $user = User::factory()->create([
            'role' => 'reservation_manager',
            'property_id' => $property->id,
        ]);

        $response = $this->actingAs($user)->get('/api/v1/reports/occupancy/export?from=2026-02-11&to=2026-02-11');

        $response->assertOk();
        $rawContent = $response->streamedContent();
        $this->assertStringStartsWith("\xEF\xBB\xBF", $rawContent);
        $content = ltrim($rawContent, "\xEF\xBB\xBF");

        $this->assertStringContainsString('date,total_rooms,occupied_rooms,occupancy_rate', $content);
    }
}
