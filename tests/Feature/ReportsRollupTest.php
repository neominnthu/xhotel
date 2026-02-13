<?php

namespace Tests\Feature;

use App\Models\Folio;
use App\Models\Guest;
use App\Models\Property;
use App\Models\ReportDailyKpi;
use App\Models\Reservation;
use App\Models\Room;
use App\Models\RoomType;
use App\Models\User;
use App\Models\AuditLog;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Artisan;
use Tests\TestCase;

class ReportsRollupTest extends TestCase
{
    use RefreshDatabase;

    public function test_reports_rollup_creates_daily_kpi(): void
    {
        Carbon::setTestNow(Carbon::parse('2026-02-12 08:00:00'));

        $property = Property::factory()->create([
            'default_currency' => 'MMK',
        ]);
        $user = User::factory()->create([
            'role' => 'admin',
            'property_id' => $property->id,
        ]);
        $roomType = RoomType::factory()->create([
            'property_id' => $property->id,
        ]);
        $room = Room::factory()->create([
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

        Artisan::call('reports:rollup', [
            '--date' => '2026-02-11',
            '--property_id' => $property->id,
        ]);

        $this->assertDatabaseHas('report_daily_kpis', [
            'property_id' => $property->id,
            'report_date' => Carbon::parse('2026-02-11')->toDateTimeString(),
            'total_rooms' => 1,
            'occupied_rooms' => 1,
            'total_revenue' => 200000,
        ]);

        $kpi = ReportDailyKpi::first();
        $this->assertEquals('MMK', $kpi->currency);

        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $user->id,
            'action' => 'reports.rollup',
            'resource' => 'report_daily_kpi',
        ]);

        $this->assertEquals(1, AuditLog::query()->count());
    }
}
