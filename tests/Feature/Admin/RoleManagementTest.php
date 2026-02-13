<?php

namespace Tests\Feature\Admin;

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class RoleManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_with_permission_can_view_roles_index(): void
    {
        $user = $this->createUserWithPermissions(['view-roles']);
        $this->createRole(['name' => 'front-office', 'display_name' => 'Front Office']);

        $this->actingAs($user)
            ->get(route('admin.roles.index'))
            ->assertInertia(fn (Assert $page) => $page
                ->component('admin/roles/index')
                ->has('roles.data')
                ->has('permissions')
                ->has('filters')
            );
    }

    public function test_user_with_permission_can_create_role(): void
    {
        $user = $this->createUserWithPermissions(['view-roles', 'create-roles']);
        $permission = $this->createPermission('view-reports');

        $response = $this->actingAs($user)->post(route('admin.roles.store'), [
            'name' => 'night-auditor',
            'display_name' => 'Night Auditor',
            'description' => 'Oversees night audit tasks.',
            'permissions' => [$permission->id],
        ]);

        $role = Role::where('name', 'night-auditor')->first();

        $this->assertNotNull($role);
        $response->assertRedirect(route('admin.roles.show', $role));
        $this->assertDatabaseHas('roles', [
            'id' => $role->id,
            'display_name' => 'Night Auditor',
        ]);
        $this->assertDatabaseHas('permission_role', [
            'role_id' => $role->id,
            'permission_id' => $permission->id,
        ]);
    }

    public function test_user_with_permission_can_update_role(): void
    {
        $user = $this->createUserWithPermissions(['view-roles', 'edit-roles']);
        $role = $this->createRole(['name' => 'concierge', 'display_name' => 'Concierge']);
        $permission = $this->createPermission('view-analytics');

        $response = $this->actingAs($user)->patch(route('admin.roles.update', $role), [
            'name' => 'concierge-lead',
            'display_name' => 'Concierge Lead',
            'description' => 'Leads concierge team.',
            'permissions' => [$permission->id],
        ]);

        $response->assertRedirect(route('admin.roles.show', $role));
        $this->assertDatabaseHas('roles', [
            'id' => $role->id,
            'name' => 'concierge-lead',
            'display_name' => 'Concierge Lead',
        ]);
        $this->assertDatabaseHas('permission_role', [
            'role_id' => $role->id,
            'permission_id' => $permission->id,
        ]);
    }

    public function test_user_with_permission_can_delete_role(): void
    {
        $user = $this->createUserWithPermissions(['view-roles', 'delete-roles']);
        $role = $this->createRole(['name' => 'temp-role', 'display_name' => 'Temporary Role']);

        $response = $this->actingAs($user)->delete(route('admin.roles.destroy', $role));

        $response->assertRedirect(route('admin.roles.index'));
        $this->assertDatabaseMissing('roles', ['id' => $role->id]);
    }

    private function createUserWithPermissions(array $permissionNames): User
    {
        $permissions = collect($permissionNames)->map(function (string $name) {
            return $this->createPermission($name);
        });

        $role = $this->createRole([
            'name' => 'role-manager-'.Str::random(8),
            'display_name' => 'Role Manager',
        ]);

        $role->permissions()->attach($permissions->pluck('id'));

        $user = User::factory()->create();
        $user->assignRole($role);

        return $user;
    }

    private function createPermission(string $name): Permission
    {
        return Permission::create([
            'name' => $name,
            'display_name' => Str::title(str_replace('-', ' ', $name)),
            'group' => 'Role Management',
            'description' => 'Test permission.',
            'is_system_permission' => false,
        ]);
    }

    private function createRole(array $overrides = []): Role
    {
        return Role::create(array_merge([
            'name' => 'role-'.Str::random(8),
            'display_name' => 'Role',
            'description' => 'Test role.',
            'is_system_role' => false,
        ], $overrides));
    }
}
