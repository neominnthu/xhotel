<?php

namespace Tests\Feature\Admin;

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class PermissionManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_with_permission_can_view_permissions_index(): void
    {
        $user = $this->createUserWithPermissions(['view-roles']);
        $this->createPermission('view-inventory', 'Inventory');

        $this->actingAs($user)
            ->get(route('admin.permissions.index'))
            ->assertInertia(fn (Assert $page) => $page
                ->component('admin/permissions/index')
                ->has('permissions.data')
                ->has('groups')
                ->has('filters')
            );
    }

    public function test_user_with_permission_can_create_permission(): void
    {
        $user = $this->createUserWithPermissions(['view-roles', 'create-roles']);

        $response = $this->actingAs($user)->post(route('admin.permissions.store'), [
            'name' => 'view-operations',
            'display_name' => 'View Operations',
            'group' => 'Operations',
            'description' => 'Can view operations dashboard.',
        ]);

        $response->assertRedirect(route('admin.permissions.index'));
        $this->assertDatabaseHas('permissions', [
            'name' => 'view-operations',
            'display_name' => 'View Operations',
            'group' => 'Operations',
        ]);
    }

    public function test_user_with_permission_can_update_permission(): void
    {
        $user = $this->createUserWithPermissions(['view-roles', 'edit-roles']);
        $permission = $this->createPermission('manage-events', 'Operations');

        $response = $this->actingAs($user)->patch(route('admin.permissions.update', $permission), [
            'name' => 'manage-events',
            'display_name' => 'Manage Events',
            'group' => 'Events',
            'description' => 'Manage event operations.',
        ]);

        $response->assertRedirect(route('admin.permissions.show', $permission));
        $this->assertDatabaseHas('permissions', [
            'id' => $permission->id,
            'display_name' => 'Manage Events',
            'group' => 'Events',
        ]);
    }

    public function test_user_with_permission_can_delete_permission(): void
    {
        $user = $this->createUserWithPermissions(['view-roles', 'delete-roles']);
        $permission = $this->createPermission('manage-amenities', 'Operations');

        $response = $this->actingAs($user)->delete(route('admin.permissions.destroy', $permission));

        $response->assertRedirect(route('admin.permissions.index'));
        $this->assertDatabaseMissing('permissions', ['id' => $permission->id]);
    }

    private function createUserWithPermissions(array $permissionNames): User
    {
        $permissions = collect($permissionNames)->map(function (string $name) {
            return $this->createPermission($name, 'Role Management');
        });

        $role = $this->createRole([
            'name' => 'permission-manager-'.Str::random(8),
            'display_name' => 'Permission Manager',
        ]);

        $role->permissions()->attach($permissions->pluck('id'));

        $user = User::factory()->create();
        $user->assignRole($role);

        return $user;
    }

    private function createPermission(string $name, string $group): Permission
    {
        return Permission::create([
            'name' => $name,
            'display_name' => Str::title(str_replace('-', ' ', $name)),
            'group' => $group,
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
