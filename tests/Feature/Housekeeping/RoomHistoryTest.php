<?php

namespace Tests\Feature\Housekeeping;

use App\Models\HousekeepingTask;
use App\Models\Property;
use App\Models\Room;
use App\Models\RoomStatusLog;
use App\Models\RoomType;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class RoomHistoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_room_history_api_returns_logs(): void
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
            'number' => '301',
            'status' => 'available',
            'housekeeping_status' => 'dirty',
            'is_active' => true,
        ]);

        $user = User::factory()->create([
            'role' => 'housekeeping',
            'property_id' => $property->id,
        ]);

        $task = HousekeepingTask::create([
            'room_id' => $room->id,
            'type' => 'clean',
            'status' => 'open',
            'priority' => 'normal',
        ]);

        Sanctum::actingAs($user);

        $this->patchJson("/api/v1/housekeeping/tasks/{$task->id}", [
            'status' => 'completed',
        ])->assertOk();

        $this->assertDatabaseHas('room_status_logs', [
            'room_id' => $room->id,
            'from_status' => 'dirty',
            'to_status' => 'clean',
        ]);

        $response = $this->getJson("/api/v1/rooms/{$room->id}/housekeeping-history");

        $response->assertOk()->assertJson([
            'room' => [
                'id' => $room->id,
                'number' => '301',
                'housekeeping_status' => 'clean',
            ],
        ]);

        $this->assertNotEmpty($response->json('data'));
    }

    public function test_room_history_csv_export(): void
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
            'number' => '302',
            'status' => 'available',
            'housekeeping_status' => 'dirty',
            'is_active' => true,
        ]);

        $user = User::factory()->create([
            'role' => 'housekeeping',
            'property_id' => $property->id,
        ]);

        RoomStatusLog::create([
            'room_id' => $room->id,
            'from_status' => 'dirty',
            'to_status' => 'clean',
            'changed_by' => $user->id,
            'changed_at' => now(),
        ]);

        $this->actingAs($user);

        $response = $this->get("/housekeeping/rooms/{$room->id}/history.csv");

        $response->assertOk();
        $response->assertHeader('Content-Type', 'text/csv; charset=utf-8');
        $this->assertStringContainsString('from_status', $response->streamedContent());
    }
}
