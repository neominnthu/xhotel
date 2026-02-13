<?php

namespace Tests\Feature\Settings;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class SettingsAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_access_settings_pages(): void
    {
        $user = User::factory()->create([
            'role' => 'admin',
        ]);

        $this->actingAs($user)
            ->get(route('settings.cancellation-policies.index'))
            ->assertInertia(fn (Assert $page) => $page
                ->component('settings/cancellation-policies/index')
            );

        $this->actingAs($user)
            ->get(route('settings.room-types.index'))
            ->assertInertia(fn (Assert $page) => $page
                ->component('settings/room-types/index')
            );

        $this->actingAs($user)
            ->get(route('settings.rates.index'))
            ->assertInertia(fn (Assert $page) => $page
                ->component('settings/rates/index')
            );
    }

    public function test_reservation_manager_can_access_settings_pages(): void
    {
        $user = User::factory()->create([
            'role' => 'reservation_manager',
        ]);

        $this->actingAs($user)
            ->get(route('settings.cancellation-policies.index'))
            ->assertInertia(fn (Assert $page) => $page
                ->component('settings/cancellation-policies/index')
            );

        $this->actingAs($user)
            ->get(route('settings.room-types.index'))
            ->assertInertia(fn (Assert $page) => $page
                ->component('settings/room-types/index')
            );

        $this->actingAs($user)
            ->get(route('settings.rates.index'))
            ->assertInertia(fn (Assert $page) => $page
                ->component('settings/rates/index')
            );
    }

    public function test_front_desk_cannot_access_settings_pages(): void
    {
        $user = User::factory()->create([
            'role' => 'front_desk',
        ]);

        $this->actingAs($user)
            ->get(route('settings.cancellation-policies.index'))
            ->assertForbidden();

        $this->actingAs($user)
            ->get(route('settings.room-types.index'))
            ->assertForbidden();

        $this->actingAs($user)
            ->get(route('settings.rates.index'))
            ->assertForbidden();
    }
}
