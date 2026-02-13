<?php

namespace Tests\Feature\Housekeeping;

use App\Models\HousekeepingTask;
use App\Models\Property;
use App\Models\Room;
use App\Models\RoomType;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class HousekeepingUpdateTest extends TestCase
{
    use RefreshDatabase;

    public function test_housekeeping_task_update_marks_completed(): void
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
            'number' => '101',
            'status' => 'available',
            'housekeeping_status' => 'dirty',
            'is_active' => true,
        ]);

        $task = HousekeepingTask::create([
            'room_id' => $room->id,
            'type' => 'clean',
            'status' => 'open',
            'priority' => 'normal',
        ]);

        $user = User::factory()->create([
            'role' => 'housekeeping',
            'property_id' => $property->id,
        ]);

        Sanctum::actingAs($user);

        $response = $this->patchJson("/api/v1/housekeeping/tasks/{$task->id}", [
            'status' => 'completed',
        ]);

        $response->assertOk()->assertJson([
            'id' => $task->id,
            'status' => 'completed',
        ]);

        $this->assertDatabaseHas('housekeeping_tasks', [
            'id' => $task->id,
            'status' => 'completed',
        ]);

        $this->assertNotNull($task->fresh()->completed_at);

        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $user->id,
            'action' => 'housekeeping.task.updated',
        ]);
    }

    public function test_housekeeping_task_reopen_clears_completed_at(): void
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
            'number' => '102',
            'status' => 'available',
            'housekeeping_status' => 'dirty',
            'is_active' => true,
        ]);

        $task = HousekeepingTask::create([
            'room_id' => $room->id,
            'type' => 'clean',
            'status' => 'completed',
            'priority' => 'normal',
            'completed_at' => now()->subHour(),
        ]);

        $user = User::factory()->create([
            'role' => 'housekeeping',
            'property_id' => $property->id,
        ]);

        Sanctum::actingAs($user);

        $response = $this->patchJson("/api/v1/housekeeping/tasks/{$task->id}", [
            'status' => 'open',
        ]);

        $response->assertOk()->assertJson([
            'id' => $task->id,
            'status' => 'open',
        ]);

        $this->assertDatabaseHas('housekeeping_tasks', [
            'id' => $task->id,
            'status' => 'open',
        ]);

        $this->assertNull($task->fresh()->completed_at);
    }

    public function test_housekeeping_task_assigns_user(): void
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
            'number' => '103',
            'status' => 'available',
            'housekeeping_status' => 'dirty',
            'is_active' => true,
        ]);

        $task = HousekeepingTask::create([
            'room_id' => $room->id,
            'type' => 'clean',
            'status' => 'open',
            'priority' => 'normal',
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

        $response = $this->patchJson("/api/v1/housekeeping/tasks/{$task->id}", [
            'status' => 'open',
            'assigned_to' => $assignee->id,
        ]);

        $response->assertOk()->assertJson([
            'id' => $task->id,
            'status' => 'open',
        ]);

        $this->assertDatabaseHas('housekeeping_tasks', [
            'id' => $task->id,
            'assigned_to' => $assignee->id,
        ]);

        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $user->id,
            'action' => 'housekeeping.task.updated',
        ]);
    }

    public function test_housekeeping_task_in_progress_sets_started_at(): void
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
            'number' => '106',
            'status' => 'available',
            'housekeeping_status' => 'dirty',
            'is_active' => true,
        ]);

        $task = HousekeepingTask::create([
            'room_id' => $room->id,
            'type' => 'clean',
            'status' => 'open',
            'priority' => 'normal',
        ]);

        $user = User::factory()->create([
            'role' => 'housekeeping',
            'property_id' => $property->id,
        ]);

        Sanctum::actingAs($user);

        $response = $this->patchJson("/api/v1/housekeeping/tasks/{$task->id}", [
            'status' => 'in_progress',
        ]);

        $response->assertOk();

        $this->assertNotNull($task->fresh()->started_at);
        $this->assertNull($task->fresh()->completed_at);
    }

    public function test_housekeeping_completion_sets_duration_and_completed_by(): void
    {
        Carbon::setTestNow(now());

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
            'number' => '107',
            'status' => 'available',
            'housekeeping_status' => 'dirty',
            'is_active' => true,
        ]);

        $task = HousekeepingTask::create([
            'room_id' => $room->id,
            'type' => 'clean',
            'status' => 'in_progress',
            'priority' => 'normal',
            'started_at' => now()->subMinutes(30),
        ]);

        $user = User::factory()->create([
            'role' => 'housekeeping',
            'property_id' => $property->id,
        ]);

        Sanctum::actingAs($user);

        $response = $this->patchJson("/api/v1/housekeeping/tasks/{$task->id}", [
            'status' => 'completed',
        ]);

        $response->assertOk();

        $task->refresh();

        $this->assertNotNull($task->completed_at);
        $this->assertEquals($user->id, $task->completed_by);
        $this->assertEquals(30, $task->actual_duration_minutes);

        Carbon::setTestNow();
    }

    public function test_housekeeping_bulk_update_updates_tasks(): void
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
            'number' => '105',
            'status' => 'available',
            'housekeeping_status' => 'dirty',
            'is_active' => true,
        ]);

        $taskA = HousekeepingTask::create([
            'room_id' => $room->id,
            'type' => 'clean',
            'status' => 'open',
            'priority' => 'normal',
        ]);

        $taskB = HousekeepingTask::create([
            'room_id' => $room->id,
            'type' => 'inspect',
            'status' => 'open',
            'priority' => 'normal',
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

        $response = $this->patchJson('/api/v1/housekeeping/tasks/bulk', [
            'task_ids' => [$taskA->id, $taskB->id],
            'status' => 'completed',
            'assigned_to' => $assignee->id,
        ]);

        $response->assertOk()->assertJson([
            'updated' => 2,
        ]);

        $this->assertDatabaseHas('housekeeping_tasks', [
            'id' => $taskA->id,
            'status' => 'completed',
            'assigned_to' => $assignee->id,
        ]);

        $this->assertDatabaseHas('housekeeping_tasks', [
            'id' => $taskB->id,
            'status' => 'completed',
            'assigned_to' => $assignee->id,
        ]);

        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $user->id,
            'action' => 'housekeeping.task.bulk_updated',
        ]);
    }

    public function test_housekeeping_completion_updates_room_status(): void
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
            'number' => '104',
            'status' => 'available',
            'housekeeping_status' => 'dirty',
            'is_active' => true,
        ]);

        $task = HousekeepingTask::create([
            'room_id' => $room->id,
            'type' => 'inspect',
            'status' => 'open',
            'priority' => 'normal',
        ]);

        $user = User::factory()->create([
            'role' => 'housekeeping',
            'property_id' => $property->id,
        ]);

        Sanctum::actingAs($user);

        $response = $this->patchJson("/api/v1/housekeeping/tasks/{$task->id}", [
            'status' => 'completed',
        ]);

        $response->assertOk();

        $this->assertDatabaseHas('rooms', [
            'id' => $room->id,
            'housekeeping_status' => 'inspected',
        ]);

        $this->assertDatabaseHas('room_status_logs', [
            'room_id' => $room->id,
            'from_status' => 'dirty',
            'to_status' => 'inspected',
        ]);
    }
}
