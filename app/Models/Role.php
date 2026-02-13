<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Role extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'display_name',
        'description',
        'is_system_role',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'is_system_role' => 'boolean',
            'metadata' => 'array',
        ];
    }

    /**
     * Get the users that belong to this role.
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class)->withPivot(['assigned_by', 'assigned_at', 'metadata'])->withTimestamps();
    }

    /**
     * Get the permissions that belong to this role.
     */
    public function permissions(): BelongsToMany
    {
        return $this->belongsToMany(Permission::class)->withPivot(['assigned_by', 'assigned_at', 'metadata'])->withTimestamps();
    }

    /**
     * Check if the role has a specific permission.
     */
    public function hasPermission(string $permission): bool
    {
        return $this->permissions()->where('name', $permission)->exists();
    }

    /**
     * Check if the role has any of the given permissions.
     */
    public function hasAnyPermission(array $permissions): bool
    {
        return $this->permissions()->whereIn('name', $permissions)->exists();
    }

    /**
     * Check if the role has all of the given permissions.
     */
    public function hasAllPermissions(array $permissions): bool
    {
        $count = $this->permissions()->whereIn('name', $permissions)->count();
        return $count === count($permissions);
    }

    /**
     * Assign a permission to this role.
     */
    public function assignPermission(Permission $permission, ?User $assignedBy = null): void
    {
        $this->permissions()->attach($permission->id, [
            'assigned_by' => $assignedBy?->id,
            'assigned_at' => now(),
        ]);
    }

    /**
     * Remove a permission from this role.
     */
    public function removePermission(Permission $permission): void
    {
        $this->permissions()->detach($permission->id);
    }

    /**
     * Sync permissions for this role.
     */
    public function syncPermissions(array $permissionIds, ?User $assignedBy = null): void
    {
        $pivotData = [];
        foreach ($permissionIds as $permissionId) {
            $pivotData[$permissionId] = [
                'assigned_by' => $assignedBy?->id,
                'assigned_at' => now(),
            ];
        }

        $this->permissions()->sync($pivotData);
    }
}
