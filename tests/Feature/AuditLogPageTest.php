<?php

namespace Tests\Feature;

use App\Models\AuditLog;
use App\Models\Property;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AuditLogPageTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_view_audit_logs(): void
    {
        $property = Property::factory()->create();
        $user = User::factory()->create([
            'role' => 'admin',
            'property_id' => $property->id,
        ]);

        AuditLog::create([
            'user_id' => $user->id,
            'action' => 'system.update.completed',
            'resource' => 'system_update',
            'payload' => ['update_id' => 1],
            'ip_address' => '127.0.0.1',
            'user_agent' => 'PHPUnit',
            'created_at' => now(),
        ]);

        $response = $this->actingAs($user)->get('/settings/audit-logs');

        $response->assertInertia(fn (Assert $page) => $page
            ->component('settings/audit-logs/index')
            ->has('logs')
            ->has('filters')
            ->has('can_export')
        );
    }

    public function test_non_admin_cannot_view_audit_logs(): void
    {
        $property = Property::factory()->create();
        $user = User::factory()->create([
            'role' => 'front_desk',
            'property_id' => $property->id,
        ]);

        $response = $this->actingAs($user)->get('/settings/audit-logs');

        $response->assertStatus(403);
    }

    public function test_admin_can_export_audit_logs(): void
    {
        $property = Property::factory()->create();
        $user = User::factory()->create([
            'role' => 'admin',
            'property_id' => $property->id,
        ]);

        AuditLog::create([
            'user_id' => $user->id,
            'property_id' => $property->id,
            'action' => 'system.update.completed',
            'resource' => 'system_update',
            'payload' => ['update_id' => 1],
            'ip_address' => '127.0.0.1',
            'user_agent' => 'PHPUnit',
            'created_at' => now(),
        ]);

        $response = $this->actingAs($user)->get('/settings/audit-logs/export');

        $response->assertOk();
        $response->assertHeader('content-type', 'text/csv; charset=UTF-8');
    }
}
