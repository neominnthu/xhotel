<?php

namespace Tests\Feature\Housekeeping;

use App\Models\HousekeepingTask;
use App\Models\Property;
use App\Models\Room;
use App\Models\RoomType;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class HousekeepingWebFiltersTest extends TestCase
{
    use RefreshDatabase;

    public function test_housekeeping_filters_by_assignee_and_room_status(): void
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
            'number' => '501',
            'status' => 'available',
            'housekeeping_status' => 'clean',
            'is_active' => true,
        ]);

        $dirtyRoom = Room::create([
            'property_id' => $property->id,
            'room_type_id' => $roomType->id,
            'number' => '502',
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
            'room_id' => $dirtyRoom->id,
            'type' => 'clean',
            'status' => 'open',
            'priority' => 'normal',
            'assigned_to' => $assignee->id,
        ]);

        HousekeepingTask::create([
            'room_id' => $dirtyRoom->id,
            'type' => 'clean',
            'status' => 'open',
            'priority' => 'normal',
        ]);

        $assignedTask = HousekeepingTask::create([
            'room_id' => $cleanRoom->id,
            'type' => 'clean',
            'status' => 'open',
            'priority' => 'normal',
            'assigned_to' => $assignee->id,
        ]);

        Sanctum::actingAs($user);

        $response = $this->getJson(
            "/api/v1/housekeeping/tasks?filter[assigned_to]={$assignee->id}&filter[room_status]=clean"
        );

        $response->assertOk();
        $this->assertCount(1, $response->json('data'));
        $this->assertSame($assignedTask->id, $response->json('data.0.id'));
    }

    public function test_housekeeping_pagination_meta_is_exposed(): void
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
            'number' => '601',
            'status' => 'available',
            'housekeeping_status' => 'dirty',
            'is_active' => true,
        ]);

        $user = User::factory()->create([
            'role' => 'housekeeping',
            'property_id' => $property->id,
        ]);

        for ($index = 0; $index < 16; $index++) {
            HousekeepingTask::create([
                'room_id' => $room->id,
                'type' => 'clean',
                'status' => 'open',
                'priority' => 'normal',
            ]);
        }

        $this->actingAs($user)
            ->get('/housekeeping')
            ->assertInertia(fn (Assert $page) => $page
                ->component('housekeeping/index')
                ->where('meta.current_page', 1)
                ->where('meta.last_page', 2)
                ->where('meta.per_page', 15)
                ->where('meta.total', 16)
            );
    }
}
