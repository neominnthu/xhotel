<?php

namespace Tests\Feature\Housekeeping;

use App\Models\Property;
use App\Models\Room;
use App\Models\RoomStatusLog;
use App\Models\RoomType;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoomStatusLogPruneTest extends TestCase
{
    use RefreshDatabase;

    public function test_prune_command_removes_old_logs(): void
    {
        $property = Property::create([
            'name' => 'XHotel Yangon',
            'timezone' => 'Asia/Yangon',
            'default_currency' => 'MMK',
            'default_language' => 'my',
        ]);

        $roomType = RoomType::create([
            'property_id' => $property->id,
            'name' => ['my' => 'Standard', 'en' => 'Standard'],
            'capacity' => 2,
            'base_rate' => 60000,
            'sort_order' => 1,
            'is_active' => true,
        ]);

        $room = Room::create([
            'property_id' => $property->id,
            'room_type_id' => $roomType->id,
            'number' => '701',
            'status' => 'available',
            'housekeeping_status' => 'dirty',
            'is_active' => true,
        ]);

        $oldLog = RoomStatusLog::create([
            'room_id' => $room->id,
            'from_status' => 'dirty',
            'to_status' => 'clean',
            'changed_at' => now()->subDays(200),
        ]);

        $recentLog = RoomStatusLog::create([
            'room_id' => $room->id,
            'from_status' => 'clean',
            'to_status' => 'inspected',
            'changed_at' => now()->subDays(10),
        ]);

        Artisan::call('room-status-logs:prune', ['--days' => 90]);

        $this->assertDatabaseMissing('room_status_logs', [
            'id' => $oldLog->id,
        ]);

        $this->assertDatabaseHas('room_status_logs', [
            'id' => $recentLog->id,
        ]);
    }
}
