<?php

namespace Tests\Feature\Settings;

use App\Models\AuditLog;
use App\Models\Property;
use App\Models\RoomType;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoomTypeSettingsTest extends TestCase
{
    use RefreshDatabase;

    public function test_room_type_settings_can_create_and_update(): void
    {
        $property = Property::factory()->create();
        $user = User::factory()->create([
            'role' => 'reservation_manager',
            'property_id' => $property->id,
        ]);

        $createResponse = $this->actingAs($user)->post('/settings/room-types', [
            'name_en' => 'Deluxe',
            'name_my' => 'ဒီလက်စ်',
            'capacity' => 2,
            'overbooking_limit' => 3,
            'base_rate' => 150000,
            'sort_order' => 1,
            'is_active' => true,
        ]);

        $createResponse->assertRedirect();
        $this->assertDatabaseHas('room_types', [
            'property_id' => $property->id,
            'capacity' => 2,
            'overbooking_limit' => 3,
            'base_rate' => 150000,
        ]);

        // audit log for create
        $this->assertDatabaseHas('audit_logs', [
            'action' => 'room_type.created',
            'resource' => 'room_type',
        ]);

        // spy on Log and assert metrics called later
        \Illuminate\Support\Facades\Log::spy();

        $roomType = RoomType::firstOrFail();

        $updateResponse = $this->actingAs($user)->patch(
            "/settings/room-types/{$roomType->id}",
            [
                'name_en' => 'Suite',
                'name_my' => 'စွစ်',
                'capacity' => 3,
                'overbooking_limit' => 1,
                'base_rate' => 200000,
                'sort_order' => 2,
                'is_active' => false,
            ]
        );

        $updateResponse->assertRedirect();
        $this->assertDatabaseHas('room_types', [
            'id' => $roomType->id,
            'capacity' => 3,
            'overbooking_limit' => 1,
            'base_rate' => 200000,
            'is_active' => false,
        ]);

        // audit log for update
        $this->assertDatabaseHas('audit_logs', [
            'action' => 'room_type.updated',
            'resource' => 'room_type',
        ]);

        \Illuminate\Support\Facades\Log::shouldHaveReceived('info');
    }

    public function test_room_type_settings_rejects_invalid_values(): void
    {
        $property = Property::factory()->create();
        $user = User::factory()->create([
            'role' => 'admin',
            'property_id' => $property->id,
        ]);

        $response = $this->actingAs($user)->post('/settings/room-types', [
            'name_en' => 'Bad Room',
            'name_my' => 'မမှန်သော',
            'capacity' => 0,
            'overbooking_limit' => 51,
            'base_rate' => 1000,
            'sort_order' => 0,
            'is_active' => true,
        ]);

        $response->assertSessionHasErrors(['capacity', 'overbooking_limit']);
    }

    public function test_room_type_settings_can_delete_with_audit_logs(): void
    {
        $property = Property::factory()->create();
        $user = User::factory()->create([
            'role' => 'admin',
            'property_id' => $property->id,
        ]);

        $roomType = RoomType::factory()->create([
            'property_id' => $property->id,
        ]);

        \Illuminate\Support\Facades\Log::spy();

        $response = $this->actingAs($user)->delete("/settings/room-types/{$roomType->id}");

        $response->assertRedirect();
        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $user->id,
            'action' => 'room_type.deleted',
            'resource' => 'room_type',
        ]);

        \Illuminate\Support\Facades\Log::shouldHaveReceived('info')->withArgs(function ($msg, $data) use ($roomType) {
            return $msg === 'metrics.room_type.deleted' && $data['room_type_id'] === $roomType->id;
        });

        $this->assertSoftDeleted('room_types', [
            'id' => $roomType->id,
        ]);
    }

    public function test_room_type_settings_forbid_unauthorized_users(): void
    {
        $user = User::factory()->create([
            'role' => 'front_desk',
        ]);

        $response = $this->actingAs($user)->get('/settings/room-types');

        $response->assertForbidden();
    }
}
