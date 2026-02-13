<?php

namespace Tests\Feature\Settings;

use App\Models\AuditLog;
use App\Models\CancellationPolicy;
use App\Models\Property;
use App\Models\RoomType;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CancellationPolicySettingsTest extends TestCase
{
    use RefreshDatabase;

    public function test_cancellation_policy_settings_can_create_update_and_delete_with_audit_logs(): void
    {
        $property = Property::factory()->create();
        $roomType = RoomType::factory()->create([
            'property_id' => $property->id,
        ]);
        $user = User::factory()->create([
            'role' => 'reservation_manager',
            'property_id' => $property->id,
        ]);

        $createResponse = $this->actingAs($user)->post('/settings/cancellation-policies', [
            'name' => 'Standard policy',
            'room_type_id' => $roomType->id,
            'deadline_hours' => 24,
            'penalty_type' => 'flat',
            'penalty_amount' => 50000,
            'penalty_percent' => 0,
            'is_active' => true,
        ]);

        $createResponse->assertRedirect();
        $policy = CancellationPolicy::firstOrFail();

        $updateResponse = $this->actingAs($user)->patch(
            "/settings/cancellation-policies/{$policy->id}",
            [
                'name' => 'Updated policy',
                'room_type_id' => $roomType->id,
                'deadline_hours' => 12,
                'penalty_type' => 'percent',
                'penalty_amount' => 0,
                'penalty_percent' => 25,
                'is_active' => false,
            ]
        );

        $updateResponse->assertRedirect();

        $deleteResponse = $this->actingAs($user)->delete(
            "/settings/cancellation-policies/{$policy->id}"
        );

        $deleteResponse->assertRedirect();

        // audit logs
        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $user->id,
            'action' => 'cancellation_policy.created',
            'resource' => 'cancellation_policy',
        ]);
        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $user->id,
            'action' => 'cancellation_policy.updated',
            'resource' => 'cancellation_policy',
        ]);
        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $user->id,
            'action' => 'cancellation_policy.deleted',
            'resource' => 'cancellation_policy',
        ]);

        // metrics logged via Log::info (we expect messages; payload checked elsewhere)
        \Illuminate\Support\Facades\Log::spy();

        $this->assertSoftDeleted('cancellation_policies', [
            'id' => $policy->id,
        ]);
        $this->assertSame(3, AuditLog::query()->count());

        $this->assertSoftDeleted('cancellation_policies', [
            'id' => $policy->id,
        ]);
        $this->assertSame(3, AuditLog::query()->count());
    }

    public function test_cancellation_policy_settings_rejects_invalid_percent_values(): void
    {
        $property = Property::factory()->create();
        $user = User::factory()->create([
            'role' => 'admin',
            'property_id' => $property->id,
        ]);

        $response = $this->actingAs($user)->post('/settings/cancellation-policies', [
            'name' => 'Invalid percent',
            'room_type_id' => null,
            'deadline_hours' => 24,
            'penalty_type' => 'percent',
            'penalty_amount' => 0,
            'penalty_percent' => 150,
            'is_active' => true,
        ]);

        $response->assertSessionHasErrors(['penalty_percent']);
    }

    public function test_cancellation_policy_settings_forbid_unauthorized_users(): void
    {
        $user = User::factory()->create([
            'role' => 'front_desk',
        ]);

        $response = $this->actingAs($user)->get('/settings/cancellation-policies');

        $response->assertForbidden();
    }

    public function test_cancellation_policy_settings_delete_forbidden_for_other_property(): void
    {
        $property = Property::factory()->create();
        $otherProperty = Property::factory()->create();

        $policy = CancellationPolicy::factory()->create([
            'property_id' => $property->id,
        ]);

        $user = User::factory()->create([
            'role' => 'admin',
            'property_id' => $otherProperty->id,
        ]);

        $response = $this->actingAs($user)->delete(
            "/settings/cancellation-policies/{$policy->id}"
        );

        $response->assertForbidden();
    }

    public function test_settings_page_can_filter_policies_by_room_type(): void
    {
        $property = Property::factory()->create();
        $roomType = RoomType::factory()->create(['property_id' => $property->id]);
        $otherRoomType = RoomType::factory()->create(['property_id' => $property->id]);

        CancellationPolicy::factory()->create([
            'property_id' => $property->id,
            'room_type_id' => $roomType->id,
            'name' => 'For Type A',
        ]);

        CancellationPolicy::factory()->create([
            'property_id' => $property->id,
            'room_type_id' => $otherRoomType->id,
            'name' => 'For Type B',
        ]);

        $user = User::factory()->create(['role' => 'reservation_manager', 'property_id' => $property->id]);

        $response = $this->actingAs($user)->get("/settings/cancellation-policies?room_type_id={$roomType->id}");

        $response->assertOk();
        $response->assertSee('For Type A');
        $response->assertDontSee('For Type B');
    }

    public function test_cancellation_policy_metrics_logged(): void
    {
        $property = Property::factory()->create();
        $roomType = RoomType::factory()->create(['property_id' => $property->id]);
        $user = User::factory()->create(['role' => 'reservation_manager', 'property_id' => $property->id]);

        // spy Log and assert messages after each action
        \Illuminate\Support\Facades\Log::spy();

        $createResponse = $this->actingAs($user)->post('/settings/cancellation-policies', [
            'name' => 'Metric policy',
            'room_type_id' => $roomType->id,
            'deadline_hours' => 24,
            'penalty_type' => 'flat',
            'penalty_amount' => 1000,
            'penalty_percent' => 0,
            'is_active' => true,
        ]);

        $createResponse->assertRedirect();

        $policy = CancellationPolicy::firstOrFail();

        \Illuminate\Support\Facades\Log::shouldHaveReceived('info')->withArgs(function ($msg, $data) use ($property) {
            return $msg === 'metrics.cancellation_policy.created' && $data['property_id'] === $property->id;
        });

        $this->actingAs($user)->patch("/settings/cancellation-policies/{$policy->id}", [
            'name' => 'Metric policy updated',
            'room_type_id' => $roomType->id,
            'deadline_hours' => 12,
            'penalty_type' => 'percent',
            'penalty_amount' => 0,
            'penalty_percent' => 10,
            'is_active' => true,
        ])->assertRedirect();

        \Illuminate\Support\Facades\Log::shouldHaveReceived('info')->withArgs(function ($msg, $data) use ($property, $policy) {
            return $msg === 'metrics.cancellation_policy.updated' && $data['policy_id'] === $policy->id && $data['property_id'] === $property->id;
        });

        $this->actingAs($user)->delete("/settings/cancellation-policies/{$policy->id}")->assertRedirect();

        \Illuminate\Support\Facades\Log::shouldHaveReceived('info')->withArgs(function ($msg, $data) use ($property, $policy) {
            return $msg === 'metrics.cancellation_policy.deleted' && $data['policy_id'] === $policy->id && $data['property_id'] === $property->id;
        });
    }
}

