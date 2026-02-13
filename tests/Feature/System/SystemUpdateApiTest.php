<?php

namespace Tests\Feature\System;

use App\Jobs\ApplyUpdateJob;
use App\Models\Folio;
use App\Models\Property;
use App\Models\Reservation;
use App\Models\SystemUpdate;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class SystemUpdateApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_check_for_updates(): void
    {
        config(['updates.current_version' => '1.0.0']);

        $property = Property::factory()->create();
        $user = User::factory()->create([
            'role' => 'admin',
            'property_id' => $property->id,
        ]);

        $response = $this->actingAs($user)->postJson('/api/v1/system/updates/check');

        $response->assertOk();
        $response->assertJsonFragment([
            'current_version' => '1.0.0',
        ]);
    }

    public function test_admin_can_start_update(): void
    {
        config(['updates.enabled' => true]);

        Queue::fake();

        $property = Property::factory()->create();
        $user = User::factory()->create([
            'role' => 'admin',
            'property_id' => $property->id,
        ]);

        $payload = [
            'release_tag' => 'v1.2.0',
            'version_to' => '1.2.0',
        ];

        $response = $this->actingAs($user)->postJson('/api/v1/system/updates/apply', $payload);

        $response->assertStatus(202);

        $this->assertDatabaseHas('system_updates', [
            'property_id' => $property->id,
            'status' => 'queued',
            'version_to' => '1.2.0',
        ]);

        Queue::assertPushed(ApplyUpdateJob::class);

        $this->assertNotNull(SystemUpdate::query()->first());
    }

    public function test_update_precheck_fails_when_open_folios_exist(): void
    {
        config(['updates.enabled' => true]);

        $property = Property::factory()->create();
        $user = User::factory()->create([
            'role' => 'admin',
            'property_id' => $property->id,
        ]);

        $reservation = Reservation::factory()->create([
            'property_id' => $property->id,
        ]);

        Folio::create([
            'reservation_id' => $reservation->id,
            'currency' => 'MMK',
            'total' => 0,
            'balance' => 0,
            'status' => 'open',
        ]);

        $response = $this->actingAs($user)->postJson('/api/v1/system/updates/apply', [
            'release_tag' => 'v1.2.0',
            'version_to' => '1.2.0',
        ]);

        $response->assertStatus(409);
        $response->assertJsonFragment([
            'code' => 'UPDATE_PRECHECK_FAILED',
        ]);
    }
}
