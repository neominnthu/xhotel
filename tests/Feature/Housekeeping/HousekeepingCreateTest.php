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

class HousekeepingCreateTest extends TestCase
{
    use RefreshDatabase;

    public function test_housekeeping_task_can_be_created(): void
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
            'number' => '201',
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

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/v1/housekeeping/tasks', [
            'room_id' => $room->id,
            'type' => 'clean',
            'priority' => 'high',
            'assigned_to' => $assignee->id,
            'due_at' => now()->addHour()->toDateTimeString(),
        ]);

        $response->assertOk()->assertJson([
            'status' => 'open',
        ]);

        $taskId = $response->json('id');

        $this->assertDatabaseHas('housekeeping_tasks', [
            'id' => $taskId,
            'room_id' => $room->id,
            'type' => 'clean',
            'priority' => 'high',
            'assigned_to' => $assignee->id,
        ]);

        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $user->id,
            'action' => 'housekeeping.task.created',
        ]);

        $task = HousekeepingTask::find($taskId);
        $this->assertNotNull($task?->due_at);
    }

    public function test_housekeeping_task_requires_room_id(): void
    {
        $property = Property::create([
            'name' => 'XHotel Yangon',
            'timezone' => 'Asia/Yangon',
            'default_currency' => 'MMK',
            'default_language' => 'my',
        ]);

        $user = User::factory()->create([
            'role' => 'housekeeping',
            'property_id' => $property->id,
        ]);

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/v1/housekeeping/tasks', [
            'type' => 'clean',
        ]);

        $response->assertStatus(422)->assertJsonValidationErrors(['room_id']);
    }

    public function test_housekeeping_task_rejects_invalid_type(): void
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
            'number' => '202',
            'status' => 'available',
            'housekeeping_status' => 'dirty',
            'is_active' => true,
        ]);

        $user = User::factory()->create([
            'role' => 'housekeeping',
            'property_id' => $property->id,
        ]);

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/v1/housekeeping/tasks', [
            'room_id' => $room->id,
            'type' => 'invalid',
        ]);

        $response->assertStatus(422)->assertJsonValidationErrors(['type']);
    }
}
