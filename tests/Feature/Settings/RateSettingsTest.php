<?php

namespace Tests\Feature\Settings;

use App\Models\AuditLog;
use App\Models\Property;
use App\Models\Rate;
use App\Models\RoomType;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RateSettingsTest extends TestCase
{
    use RefreshDatabase;

    public function test_rate_settings_can_create_and_update(): void
    {
        $property = Property::factory()->create();
        $roomType = RoomType::factory()->create([
            'property_id' => $property->id,
        ]);
        $user = User::factory()->create([
            'role' => 'reservation_manager',
            'property_id' => $property->id,
        ]);

        $createResponse = $this->actingAs($user)->post('/settings/rates', [
            'room_type_id' => $roomType->id,
            'name' => 'Base Rate',
            'type' => 'base',
            'start_date' => '2026-02-10',
            'end_date' => '2026-02-12',
            'rate' => 150000,
            'min_stay' => 1,
            'days_of_week' => [1, 2, 3],
            'length_of_stay_min' => 1,
            'length_of_stay_max' => 5,
            'adjustment_type' => 'override',
            'adjustment_value' => 140000,
            'is_active' => true,
        ]);

        $createResponse->assertRedirect();
        $rate = Rate::firstOrFail();

        // audit log for create
        $this->assertDatabaseHas('audit_logs', [
            'action' => 'rate.created',
            'resource' => 'rate',
        ]);

        \Illuminate\Support\Facades\Log::spy();

        $updateResponse = $this->actingAs($user)->patch(
            "/settings/rates/{$rate->id}",
            [
                'room_type_id' => $roomType->id,
                'name' => 'Seasonal',
                'type' => 'seasonal',
                'start_date' => '2026-02-11',
                'end_date' => '2026-02-15',
                'rate' => 170000,
                'min_stay' => 2,
                'days_of_week' => [4, 5],
                'length_of_stay_min' => 2,
                'length_of_stay_max' => 7,
                'adjustment_type' => 'percent',
                'adjustment_value' => 10,
                'is_active' => false,
            ]
        );

        $updateResponse->assertRedirect();
        $this->assertDatabaseHas('rates', [
            'id' => $rate->id,
            'name' => 'Seasonal',
            'type' => 'seasonal',
            'rate' => 170000,
            'min_stay' => 2,
            'is_active' => false,
        ]);

        // audit log for update
        $this->assertDatabaseHas('audit_logs', [
            'action' => 'rate.updated',
            'resource' => 'rate',
        ]);

        \Illuminate\Support\Facades\Log::shouldHaveReceived('info');
    }

    public function test_rate_settings_rejects_invalid_values(): void
    {
        $property = Property::factory()->create();
        $roomType = RoomType::factory()->create([
            'property_id' => $property->id,
        ]);
        $user = User::factory()->create([
            'role' => 'admin',
            'property_id' => $property->id,
        ]);

        $response = $this->actingAs($user)->post('/settings/rates', [
            'room_type_id' => $roomType->id,
            'name' => 'Bad Rate',
            'type' => 'base',
            'start_date' => '2026-02-12',
            'end_date' => '2026-02-11',
            'rate' => 100000,
            'min_stay' => 0,
            'days_of_week' => [0, 8],
            'length_of_stay_min' => 0,
            'length_of_stay_max' => 61,
            'adjustment_type' => 'override',
            'adjustment_value' => 100000,
            'is_active' => true,
        ]);

        $response->assertSessionHasErrors([
            'end_date',
            'min_stay',
            'days_of_week.0',
            'days_of_week.1',
            'length_of_stay_min',
            'length_of_stay_max',
        ]);
    }

    public function test_rate_settings_rejects_overlapping_rates(): void
    {
        $property = Property::factory()->create();
        $roomType = RoomType::factory()->create([
            'property_id' => $property->id,
        ]);
        $user = User::factory()->create([
            'role' => 'admin',
            'property_id' => $property->id,
        ]);

        Rate::create([
            'property_id' => $property->id,
            'room_type_id' => $roomType->id,
            'name' => 'Base Rate',
            'type' => 'base',
            'start_date' => '2026-02-10',
            'end_date' => '2026-02-12',
            'rate' => 150000,
            'min_stay' => 1,
            'is_active' => true,
        ]);

        $response = $this->actingAs($user)->post('/settings/rates', [
            'room_type_id' => $roomType->id,
            'name' => 'Overlapping',
            'type' => 'base',
            'start_date' => '2026-02-11',
            'end_date' => '2026-02-14',
            'rate' => 160000,
            'min_stay' => 1,
            'is_active' => true,
        ]);

        $response->assertSessionHasErrors(['start_date']);
    }

    public function test_rate_settings_rejects_overlap_on_update(): void
    {
        $property = Property::factory()->create();
        $roomType = RoomType::factory()->create([
            'property_id' => $property->id,
        ]);
        $user = User::factory()->create([
            'role' => 'admin',
            'property_id' => $property->id,
        ]);

        $firstRate = Rate::create([
            'property_id' => $property->id,
            'room_type_id' => $roomType->id,
            'name' => 'Base Rate',
            'type' => 'base',
            'start_date' => '2026-02-10',
            'end_date' => '2026-02-12',
            'rate' => 150000,
            'min_stay' => 1,
            'is_active' => true,
        ]);

        Rate::create([
            'property_id' => $property->id,
            'room_type_id' => $roomType->id,
            'name' => 'Seasonal Rate',
            'type' => 'base',
            'start_date' => '2026-02-15',
            'end_date' => '2026-02-20',
            'rate' => 160000,
            'min_stay' => 1,
            'is_active' => true,
        ]);

        $response = $this->actingAs($user)->patch(
            "/settings/rates/{$firstRate->id}",
            [
                'room_type_id' => $roomType->id,
                'name' => 'Base Rate',
                'type' => 'base',
                'start_date' => '2026-02-18',
                'end_date' => '2026-02-22',
                'rate' => 155000,
                'min_stay' => 1,
                'is_active' => true,
            ]
        );

        $response->assertSessionHasErrors(['start_date']);
    }

    public function test_rate_settings_allows_update_without_overlap(): void
    {
        $property = Property::factory()->create();
        $roomType = RoomType::factory()->create([
            'property_id' => $property->id,
        ]);
        $user = User::factory()->create([
            'role' => 'admin',
            'property_id' => $property->id,
        ]);

        $rate = Rate::create([
            'property_id' => $property->id,
            'room_type_id' => $roomType->id,
            'name' => 'Base Rate',
            'type' => 'base',
            'start_date' => '2026-02-10',
            'end_date' => '2026-02-12',
            'rate' => 150000,
            'min_stay' => 1,
            'is_active' => true,
        ]);

        $response = $this->actingAs($user)->patch(
            "/settings/rates/{$rate->id}",
            [
                'room_type_id' => $roomType->id,
                'name' => 'Base Rate',
                'type' => 'base',
                'start_date' => '2026-02-10',
                'end_date' => '2026-02-12',
                'rate' => 155000,
                'min_stay' => 1,
                'is_active' => true,
            ]
        );

        $response->assertSessionHasNoErrors();
    }

    public function test_rate_settings_can_delete_with_audit_logs(): void
    {
        $property = Property::factory()->create();
        $roomType = RoomType::factory()->create([
            'property_id' => $property->id,
        ]);
        $user = User::factory()->create([
            'role' => 'admin',
            'property_id' => $property->id,
        ]);

        $rate = Rate::create([
            'property_id' => $property->id,
            'room_type_id' => $roomType->id,
            'name' => 'Base Rate',
            'type' => 'base',
            'start_date' => '2026-02-10',
            'end_date' => '2026-02-12',
            'rate' => 150000,
            'min_stay' => 1,
            'is_active' => true,
        ]);

        $response = $this->actingAs($user)->delete("/settings/rates/{$rate->id}");

        $response->assertRedirect();
        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $user->id,
            'action' => 'rate.deleted',
            'resource' => 'rate',
        ]);
        $this->assertDatabaseMissing('rates', [
            'id' => $rate->id,
        ]);
    }

    public function test_rate_settings_forbid_unauthorized_users(): void
    {
        $user = User::factory()->create([
            'role' => 'front_desk',
        ]);

        $response = $this->actingAs($user)->get('/settings/rates');

        $response->assertForbidden();
    }

    public function test_rate_delete_forbidden_for_other_property(): void
    {
        $property = Property::factory()->create();
        $otherProperty = Property::factory()->create();
        $roomType = RoomType::factory()->create(['property_id' => $property->id]);

        $rate = Rate::create([
            'property_id' => $property->id,
            'room_type_id' => $roomType->id,
            'name' => 'Base Rate',
            'type' => 'base',
            'start_date' => '2026-02-10',
            'end_date' => '2026-02-12',
            'rate' => 150000,
            'min_stay' => 1,
            'is_active' => true,
        ]);

        $user = User::factory()->create(['role' => 'admin', 'property_id' => $otherProperty->id]);

        $response = $this->actingAs($user)->delete("/settings/rates/{$rate->id}");

        $response->assertForbidden();
    }
}
