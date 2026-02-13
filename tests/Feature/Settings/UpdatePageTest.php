<?php

namespace Tests\Feature\Settings;

use App\Models\ErrorReport;
use App\Models\Property;
use App\Models\SystemBackup;
use App\Models\SystemUpdate;
use App\Models\SystemUpdateLog;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class UpdatePageTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_view_updates_page(): void
    {
        $property = Property::factory()->create();
        $user = User::factory()->create([
            'role' => 'admin',
            'property_id' => $property->id,
        ]);

        SystemUpdate::create([
            'property_id' => $property->id,
            'status' => 'completed',
            'version_from' => '1.0.0',
            'version_to' => '1.1.0',
        ]);

        $update = SystemUpdate::query()->first();
        SystemUpdateLog::create([
            'system_update_id' => $update->id,
            'level' => 'info',
            'message' => 'Update completed.',
            'created_at' => now(),
        ]);

        SystemBackup::create([
            'property_id' => $property->id,
            'status' => 'completed',
            'driver' => 'sqlite',
            'storage_disk' => 'local',
            'file_path' => 'memory',
        ]);

        ErrorReport::create([
            'property_id' => $property->id,
            'title' => 'Test error',
            'severity' => 'low',
            'status' => 'pending',
        ]);

        $response = $this->actingAs($user)->get('/settings/updates');

        $response->assertInertia(fn (Assert $page) => $page
            ->component('settings/updates/index')
            ->has('update_status')
            ->has('prechecks')
            ->has('updates')
            ->has('backups')
            ->has('reports')
            ->has('update_logs')
        );
    }
}
