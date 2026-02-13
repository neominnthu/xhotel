<?php

namespace Tests\Feature\System;

use App\Models\Property;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SystemBackupApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_create_backup(): void
    {
        $property = Property::factory()->create();
        $user = User::factory()->create([
            'role' => 'admin',
            'property_id' => $property->id,
        ]);

        $response = $this->actingAs($user)->postJson('/api/v1/system/backups', [
            'reason' => 'Pre-update backup',
        ]);

        $response->assertStatus(201);

        $this->assertDatabaseHas('system_backups', [
            'property_id' => $property->id,
            'status' => 'completed',
        ]);

        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $user->id,
            'action' => 'system.backup.completed',
            'resource' => 'system_backup',
        ]);
    }
}
