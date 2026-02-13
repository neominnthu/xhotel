<?php

namespace Tests\Feature\System;

use App\Models\Property;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class SystemReportApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_send_error_report(): void
    {
        config([
            'updates.error_reports.enabled' => true,
            'updates.github.owner' => 'xhotel',
            'updates.github.repo' => 'pms',
            'updates.github.token' => 'token',
        ]);

        Http::fake([
            'https://api.github.com/repos/xhotel/pms/issues' => Http::response([
                'html_url' => 'https://github.com/xhotel/pms/issues/1',
                'number' => 1,
            ], 201),
        ]);

        $property = Property::factory()->create();
        $user = User::factory()->create([
            'role' => 'admin',
            'property_id' => $property->id,
        ]);

        $payload = [
            'title' => 'Crash on dashboard',
            'severity' => 'high',
            'message' => 'Dashboard crashed after refresh.',
            'url' => 'http://localhost/dashboard',
        ];

        $response = $this->actingAs($user)->postJson('/api/v1/system/reports/errors', $payload);

        $response->assertStatus(201);
        $response->assertJsonFragment([
            'github_issue_url' => 'https://github.com/xhotel/pms/issues/1',
        ]);

        $this->assertDatabaseHas('error_reports', [
            'property_id' => $property->id,
            'title' => 'Crash on dashboard',
            'status' => 'sent',
        ]);

        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $user->id,
            'action' => 'system.error_report.created',
            'resource' => 'error_report',
        ]);
    }
}
