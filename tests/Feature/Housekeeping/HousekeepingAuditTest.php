<?php

namespace Tests\Feature\Housekeeping;

use App\Models\AuditLog;
use App\Models\Property;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HousekeepingAuditTest extends TestCase
{
    use RefreshDatabase;

    public function test_housekeeping_audit_page_renders_logs(): void
    {
        $property = Property::create([
            'name' => 'XHotel Yangon',
            'timezone' => 'Asia/Yangon',
            'default_currency' => 'MMK',
            'default_language' => 'my',
        ]);

        $user = User::factory()->create([
            'role' => 'housekeeping',
            'property_id' => $property->id,
        ]);

        AuditLog::create([
            'user_id' => $user->id,
            'action' => 'housekeeping.task.created',
            'resource' => 'housekeeping_task',
            'payload' => ['task_id' => 1],
            'created_at' => now(),
        ]);

        config(['app.asset_url' => 'http://assets.test']);
        $version = hash('xxh128', config('app.asset_url'));

        $response = $this->actingAs($user)
            ->withHeader('X-Inertia', 'true')
            ->withHeader('X-Inertia-Version', $version)
            ->get('/housekeeping/audit');

        $response->assertOk();
        $response->assertHeader('X-Inertia', 'true');
        $response->assertJson([
            'component' => 'housekeeping/audit',
        ]);
        $this->assertCount(1, $response->json('props.logs'));
        $this->assertSame('housekeeping.task.created', $response->json('props.logs.0.action'));
    }
}
