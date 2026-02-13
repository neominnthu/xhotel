<?php

namespace Tests\Feature;

use App\Models\AuditLog;
use App\Models\CancellationPolicy;
use App\Models\Property;
use App\Models\RoomType;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CancellationPolicyApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_crud_cancellation_policy(): void
    {
        $property = Property::factory()->create();
        $roomType = RoomType::factory()->create([
            'property_id' => $property->id,
        ]);
        $user = User::factory()->create([
            'role' => 'reservation_manager',
            'property_id' => $property->id,
        ]);

        $payload = [
            'name' => 'Default policy',
            'room_type_id' => $roomType->id,
            'deadline_hours' => 24,
            'penalty_type' => 'flat',
            'penalty_amount' => 50000,
            'penalty_percent' => 0,
            'is_active' => true,
        ];

        $createResponse = $this->actingAs($user)->postJson('/api/v1/cancellation-policies', $payload);
        $createResponse->assertCreated();
        $policyId = $createResponse->json('id');

        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $user->id,
            'action' => 'cancellation_policy.created',
            'resource' => 'cancellation_policy',
        ]);

        $updateResponse = $this->actingAs($user)->patchJson(
            "/api/v1/cancellation-policies/{$policyId}",
            [
                ...$payload,
                'deadline_hours' => 12,
                'penalty_amount' => 30000,
            ]
        );
        $updateResponse->assertOk();

        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $user->id,
            'action' => 'cancellation_policy.updated',
            'resource' => 'cancellation_policy',
        ]);

        $this->assertDatabaseHas('cancellation_policies', [
            'id' => $policyId,
            'deadline_hours' => 12,
            'penalty_amount' => 30000,
        ]);

        $deleteResponse = $this->actingAs($user)->deleteJson(
            "/api/v1/cancellation-policies/{$policyId}"
        );
        $deleteResponse->assertOk();

        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $user->id,
            'action' => 'cancellation_policy.deleted',
            'resource' => 'cancellation_policy',
        ]);

        $this->assertSoftDeleted('cancellation_policies', [
            'id' => $policyId,
        ]);

        $this->assertEquals(3, AuditLog::query()->count());
    }

    public function test_can_filter_cancellation_policies_by_room_type(): void
    {
        $property = Property::factory()->create();
        $roomType = RoomType::factory()->create([
            'property_id' => $property->id,
        ]);
        $otherRoomType = RoomType::factory()->create([
            'property_id' => $property->id,
        ]);
        $user = User::factory()->create([
            'role' => 'reservation_manager',
            'property_id' => $property->id,
        ]);

        $policy = CancellationPolicy::factory()->create([
            'property_id' => $property->id,
            'room_type_id' => $roomType->id,
        ]);

        CancellationPolicy::factory()->create([
            'property_id' => $property->id,
            'room_type_id' => $otherRoomType->id,
        ]);

        $response = $this->actingAs($user)->getJson(
            "/api/v1/cancellation-policies?room_type_id={$roomType->id}"
        );

        $response->assertOk();
        $response->assertJsonCount(1, 'data');
        $response->assertJsonFragment([
            'id' => $policy->id,
            'room_type_id' => $roomType->id,
        ]);
    }

    public function test_validation_rejects_invalid_percent_and_deadline_on_update(): void
    {
        $property = Property::factory()->create();
        $roomType = RoomType::factory()->create(['property_id' => $property->id]);
        $user = User::factory()->create(['role' => 'reservation_manager', 'property_id' => $property->id]);

        $policy = CancellationPolicy::factory()->create([
            'property_id' => $property->id,
            'room_type_id' => $roomType->id,
            'deadline_hours' => 24,
            'penalty_type' => 'percent',
            'penalty_percent' => 25,
        ]);

        $response = $this->actingAs($user)->patchJson(
            "/api/v1/cancellation-policies/{$policy->id}",
            [
                'name' => 'Bad update',
                'room_type_id' => $roomType->id,
                'deadline_hours' => 9999,
                'penalty_type' => 'percent',
                'penalty_amount' => 0,
                'penalty_percent' => 150,
                'is_active' => true,
            ]
        );

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['deadline_hours', 'penalty_percent']);
    }

    public function test_api_response_contract_for_policy(): void
    {
        $property = Property::factory()->create();
        $roomType = RoomType::factory()->create(['property_id' => $property->id]);
        $user = User::factory()->create(['role' => 'reservation_manager', 'property_id' => $property->id]);

        $payload = [
            'name' => 'Contract policy',
            'room_type_id' => $roomType->id,
            'deadline_hours' => 24,
            'penalty_type' => 'flat',
            'penalty_amount' => 50000,
            'penalty_percent' => 0,
            'is_active' => true,
        ];

        $createResponse = $this->actingAs($user)->postJson('/api/v1/cancellation-policies', $payload);
        $createResponse->assertCreated();
        $createResponse->assertJsonStructure([
            'id',
            'name',
            'room_type_id',
            'deadline_hours',
            'penalty_type',
            'penalty_amount',
            'penalty_percent',
            'is_active',
        ]);

        $body = $createResponse->json();
        $this->assertIsInt($body['id']);
        $this->assertSame($payload['name'], $body['name']);
        $this->assertSame($payload['deadline_hours'], $body['deadline_hours']);
    }

    public function test_store_returns_expected_json_shape(): void
    {
        $property = Property::factory()->create();
        $roomType = RoomType::factory()->create(['property_id' => $property->id]);
        $user = User::factory()->create(['role' => 'reservation_manager', 'property_id' => $property->id]);

        $payload = [
            'name' => 'API policy',
            'room_type_id' => $roomType->id,
            'deadline_hours' => 24,
            'penalty_type' => 'flat',
            'penalty_amount' => 50000,
            'penalty_percent' => 0,
            'is_active' => true,
        ];

        $response = $this->actingAs($user)->postJson('/api/v1/cancellation-policies', $payload);

        $response->assertCreated();
        $response->assertJsonStructure([
            'id', 'name', 'room_type_id', 'deadline_hours', 'penalty_type', 'penalty_amount', 'penalty_percent', 'is_active'
        ]);
    }

    public function test_update_validation_rejects_invalid_percent_and_deadline(): void
    {
        $property = Property::factory()->create();
        $roomType = RoomType::factory()->create(['property_id' => $property->id]);
        $user = User::factory()->create(['role' => 'reservation_manager', 'property_id' => $property->id]);

        $policy = CancellationPolicy::factory()->create([
            'property_id' => $property->id,
            'room_type_id' => $roomType->id,
        ]);

        $response = $this->actingAs($user)->patchJson(
            "/api/v1/cancellation-policies/{$policy->id}",
            [
                'name' => 'Updated',
                'deadline_hours' => 9999,
                'penalty_type' => 'percent',
                'penalty_amount' => 0,
                'penalty_percent' => 500,
            ]
        );

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['deadline_hours', 'penalty_percent']);
    }

    public function test_update_accepts_boundary_values(): void
    {
        $property = Property::factory()->create();
        $roomType = RoomType::factory()->create(['property_id' => $property->id]);
        $user = User::factory()->create(['role' => 'reservation_manager', 'property_id' => $property->id]);

        $policy = CancellationPolicy::factory()->create([
            'property_id' => $property->id,
            'room_type_id' => $roomType->id,
            'deadline_hours' => 24,
            'penalty_type' => 'percent',
            'penalty_percent' => 25,
        ]);

        $response = $this->actingAs($user)->patchJson(
            "/api/v1/cancellation-policies/{$policy->id}",
            [
                'name' => 'Boundary update',
                'room_type_id' => $roomType->id,
                'deadline_hours' => 720,
                'penalty_type' => 'percent',
                'penalty_amount' => 0,
                'penalty_percent' => 100,
                'is_active' => true,
            ]
        );

        $response->assertOk();
        $this->assertDatabaseHas('cancellation_policies', [
            'id' => $policy->id,
            'deadline_hours' => 720,
            'penalty_percent' => 100,
        ]);
    }

    public function test_update_rejects_missing_required_fields(): void
    {
        $property = Property::factory()->create();
        $roomType = RoomType::factory()->create(['property_id' => $property->id]);
        $user = User::factory()->create(['role' => 'reservation_manager', 'property_id' => $property->id]);

        $policy = CancellationPolicy::factory()->create([
            'property_id' => $property->id,
            'room_type_id' => $roomType->id,
        ]);

        $response = $this->actingAs($user)->patchJson(
            "/api/v1/cancellation-policies/{$policy->id}",
            []
        );

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['name', 'deadline_hours', 'penalty_type']);
    }

    public function test_validation_rejects_invalid_percent_and_deadline_on_store(): void
    {
        $property = Property::factory()->create();
        $roomType = RoomType::factory()->create(['property_id' => $property->id]);
        $user = User::factory()->create([
            'role' => 'reservation_manager',
            'property_id' => $property->id,
        ]);

        $payload = [
            'name' => 'Invalid policy',
            'room_type_id' => $roomType->id,
            'deadline_hours' => 9999, // too large
            'penalty_type' => 'percent',
            'penalty_amount' => 0,
            'penalty_percent' => 150, // > 100
            'is_active' => true,
        ];

        $response = $this->actingAs($user)->postJson('/api/v1/cancellation-policies', $payload);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['deadline_hours', 'penalty_percent']);
    }

    public function test_validation_accepts_boundary_values_on_store(): void
    {
        $property = Property::factory()->create();
        $roomType = RoomType::factory()->create(['property_id' => $property->id]);
        $user = User::factory()->create(['role' => 'reservation_manager', 'property_id' => $property->id]);

        $payload = [
            'name' => 'Boundary policy',
            'room_type_id' => $roomType->id,
            'deadline_hours' => 720,
            'penalty_type' => 'percent',
            'penalty_amount' => 0,
            'penalty_percent' => 100,
            'is_active' => true,
        ];

        $response = $this->actingAs($user)->postJson('/api/v1/cancellation-policies', $payload);
        $response->assertCreated();
    }

    public function test_validation_rejects_missing_required_fields_on_store(): void
    {
        $user = User::factory()->create(['role' => 'reservation_manager']);

        $response = $this->actingAs($user)->postJson('/api/v1/cancellation-policies', []);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['name', 'deadline_hours', 'penalty_type']);
    }
}
