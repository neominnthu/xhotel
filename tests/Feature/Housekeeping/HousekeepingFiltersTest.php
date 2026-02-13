<?php

namespace Tests\Feature\Housekeeping;

use App\Models\HousekeepingTask;
use App\Models\Property;
use App\Models\Room;
use App\Models\RoomType;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class HousekeepingFiltersTest extends TestCase
{
    use RefreshDatabase;

    public function test_housekeeping_filters_by_priority(): void
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
            'number' => '401',
            'status' => 'available',
            'housekeeping_status' => 'dirty',
            'is_active' => true,
        ]);

        $user = User::factory()->create([
            'role' => 'housekeeping',
            'property_id' => $property->id,
        ]);

        HousekeepingTask::create([
            'room_id' => $room->id,
            'type' => 'clean',
            'status' => 'open',
            'priority' => 'low',
            'due_at' => now()->addDay(),
        ]);

        HousekeepingTask::create([
            'room_id' => $room->id,
            'type' => 'clean',
            'status' => 'open',
            'priority' => 'high',
            'due_at' => now()->addDays(2),
        ]);

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/v1/housekeeping/tasks?filter[priority]=high');

        $response->assertOk();
        $this->assertCount(1, $response->json('data'));
        $this->assertSame('high', $response->json('data.0.priority'));
    }

    public function test_housekeeping_tasks_csv_export(): void
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
            'number' => '402',
            'status' => 'available',
            'housekeeping_status' => 'dirty',
            'is_active' => true,
        ]);

        $user = User::factory()->create([
            'role' => 'housekeeping',
            'property_id' => $property->id,
        ]);

        HousekeepingTask::create([
            'room_id' => $room->id,
            'type' => 'clean',
            'status' => 'open',
            'priority' => 'normal',
        ]);

        $response = $this->actingAs($user)->get('/housekeeping/tasks.csv?room_status=dirty');

        $response->assertOk();
        $this->assertStringContainsString('room,type,status', $response->streamedContent());
    }

    public function test_housekeeping_filters_unassigned_tasks(): void
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
            'number' => '403',
            'status' => 'available',
            'housekeeping_status' => 'dirty',
            'is_active' => true,
        ]);

        $user = User::factory()->create([
            'role' => 'housekeeping',
            'property_id' => $property->id,
        ]);

        $assignee = User::factory()->create([
            'role' => 'housekeeping',
            'property_id' => $property->id,
        ]);

        HousekeepingTask::create([
            'room_id' => $room->id,
            'type' => 'clean',
            'status' => 'open',
            'priority' => 'normal',
            'assigned_to' => $assignee->id,
        ]);

        $unassignedTask = HousekeepingTask::create([
            'room_id' => $room->id,
            'type' => 'clean',
            'status' => 'open',
            'priority' => 'normal',
        ]);

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/v1/housekeeping/tasks?filter[assigned_to]=unassigned');

        $response->assertOk();
        $this->assertCount(1, $response->json('data'));
        $this->assertSame($unassignedTask->id, $response->json('data.0.id'));
    }

    public function test_housekeeping_filters_room_status(): void
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

        $cleanRoom = Room::create([
            'property_id' => $property->id,
            'room_type_id' => $roomType->id,
            'number' => '407',
            'status' => 'available',
            'housekeeping_status' => 'clean',
            'is_active' => true,
        ]);

        $dirtyRoom = Room::create([
            'property_id' => $property->id,
            'room_type_id' => $roomType->id,
            'number' => '408',
            'status' => 'available',
            'housekeeping_status' => 'dirty',
            'is_active' => true,
        ]);

        $user = User::factory()->create([
            'role' => 'housekeeping',
            'property_id' => $property->id,
        ]);

        HousekeepingTask::create([
            'room_id' => $dirtyRoom->id,
            'type' => 'clean',
            'status' => 'open',
            'priority' => 'normal',
        ]);

        $cleanTask = HousekeepingTask::create([
            'room_id' => $cleanRoom->id,
            'type' => 'clean',
            'status' => 'open',
            'priority' => 'normal',
        ]);

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/v1/housekeeping/tasks?filter[room_status]=clean');

        $response->assertOk();
        $this->assertCount(1, $response->json('data'));
        $this->assertSame($cleanTask->id, $response->json('data.0.id'));
    }

    public function test_housekeeping_filters_overdue_tasks(): void
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
            'number' => '404',
            'status' => 'available',
            'housekeeping_status' => 'dirty',
            'is_active' => true,
        ]);

        $user = User::factory()->create([
            'role' => 'housekeeping',
            'property_id' => $property->id,
        ]);

        $overdueTask = HousekeepingTask::create([
            'room_id' => $room->id,
            'type' => 'clean',
            'status' => 'open',
            'priority' => 'normal',
            'due_at' => now()->subDay(),
        ]);

        HousekeepingTask::create([
            'room_id' => $room->id,
            'type' => 'clean',
            'status' => 'completed',
            'priority' => 'normal',
            'due_at' => now()->subDay(),
        ]);

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/v1/housekeeping/tasks?filter[overdue]=1');

        $response->assertOk();
        $this->assertCount(1, $response->json('data'));
        $this->assertSame($overdueTask->id, $response->json('data.0.id'));
    }

    public function test_housekeeping_filters_type_and_completed_range(): void
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
            'number' => '405',
            'status' => 'available',
            'housekeeping_status' => 'dirty',
            'is_active' => true,
        ]);

        $user = User::factory()->create([
            'role' => 'housekeeping',
            'property_id' => $property->id,
        ]);

        $matchedTask = HousekeepingTask::create([
            'room_id' => $room->id,
            'type' => 'inspect',
            'status' => 'completed',
            'priority' => 'normal',
            'completed_at' => now()->subDay(),
        ]);

        HousekeepingTask::create([
            'room_id' => $room->id,
            'type' => 'clean',
            'status' => 'completed',
            'priority' => 'normal',
            'completed_at' => now()->subDay(),
        ]);

        HousekeepingTask::create([
            'room_id' => $room->id,
            'type' => 'inspect',
            'status' => 'completed',
            'priority' => 'normal',
            'completed_at' => now()->subDays(10),
        ]);

        Sanctum::actingAs($user);

        $response = $this->getJson(
            '/api/v1/housekeeping/tasks?filter[type]=inspect&filter[completed_from]='.
                now()->subDays(2)->toDateString()
        );

        $response->assertOk();
        $this->assertCount(1, $response->json('data'));
        $this->assertSame($matchedTask->id, $response->json('data.0.id'));
    }

    public function test_housekeeping_pagination_meta(): void
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
            'number' => '406',
            'status' => 'available',
            'housekeeping_status' => 'dirty',
            'is_active' => true,
        ]);

        $user = User::factory()->create([
            'role' => 'housekeeping',
            'property_id' => $property->id,
        ]);

        HousekeepingTask::create([
            'room_id' => $room->id,
            'type' => 'clean',
            'status' => 'open',
            'priority' => 'normal',
        ]);

        HousekeepingTask::create([
            'room_id' => $room->id,
            'type' => 'inspect',
            'status' => 'open',
            'priority' => 'normal',
        ]);

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/v1/housekeeping/tasks?per_page=1');

        $response->assertOk();
        $this->assertCount(1, $response->json('data'));
        $this->assertSame(2, $response->json('meta.total'));
        $this->assertSame(1, $response->json('meta.per_page'));
    }

    public function test_housekeeping_sorts_by_priority_desc(): void
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
            'number' => '409',
            'status' => 'available',
            'housekeeping_status' => 'dirty',
            'is_active' => true,
        ]);

        $user = User::factory()->create([
            'role' => 'housekeeping',
            'property_id' => $property->id,
        ]);

        $lowTask = HousekeepingTask::create([
            'room_id' => $room->id,
            'type' => 'clean',
            'status' => 'open',
            'priority' => 'low',
        ]);

        $highTask = HousekeepingTask::create([
            'room_id' => $room->id,
            'type' => 'clean',
            'status' => 'open',
            'priority' => 'high',
        ]);

        $normalTask = HousekeepingTask::create([
            'room_id' => $room->id,
            'type' => 'clean',
            'status' => 'open',
            'priority' => 'normal',
        ]);

        Sanctum::actingAs($user);

        $response = $this->getJson(
            '/api/v1/housekeeping/tasks?filter[sort]=priority&filter[sort_dir]=desc'
        );

        $response->assertOk();
        $this->assertSame(
            [$highTask->id, $normalTask->id, $lowTask->id],
            array_column($response->json('data'), 'id')
        );
    }

    public function test_housekeeping_sorts_by_room_number(): void
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

        $roomA = Room::create([
            'property_id' => $property->id,
            'room_type_id' => $roomType->id,
            'number' => '201',
            'status' => 'available',
            'housekeeping_status' => 'dirty',
            'is_active' => true,
        ]);

        $roomB = Room::create([
            'property_id' => $property->id,
            'room_type_id' => $roomType->id,
            'number' => '105',
            'status' => 'available',
            'housekeeping_status' => 'dirty',
            'is_active' => true,
        ]);

        $user = User::factory()->create([
            'role' => 'housekeeping',
            'property_id' => $property->id,
        ]);

        $taskA = HousekeepingTask::create([
            'room_id' => $roomA->id,
            'type' => 'clean',
            'status' => 'open',
            'priority' => 'normal',
        ]);

        $taskB = HousekeepingTask::create([
            'room_id' => $roomB->id,
            'type' => 'clean',
            'status' => 'open',
            'priority' => 'normal',
        ]);

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/v1/housekeeping/tasks?filter[sort]=room_number');

        $response->assertOk();
        $this->assertSame(
            [$taskB->id, $taskA->id],
            array_column($response->json('data'), 'id')
        );
    }
}
