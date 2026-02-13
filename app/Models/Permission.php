<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Permission extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'display_name',
        'group',
        'description',
        'is_system_permission',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'is_system_permission' => 'boolean',
            'metadata' => 'array',
        ];
    }

    /**
     * Get the roles that have this permission.
     */
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class)->withPivot(['assigned_by', 'assigned_at', 'metadata'])->withTimestamps();
    }

    /**
     * Get users that have this permission through their roles.
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'permission_role', 'permission_id', 'role_id')
            ->withPivot(['assigned_by', 'assigned_at', 'metadata'])
            ->withTimestamps();
    }

    /**
     * Scope to filter permissions by group.
     */
    public function scopeInGroup($query, string $group)
    {
        return $query->where('group', $group);
    }

    /**
     * Scope to get system permissions.
     */
    public function scopeSystemPermissions($query)
    {
        return $query->where('is_system_permission', true);
    }

    /**
     * Scope to get user-defined permissions.
     */
    public function scopeUserPermissions($query)
    {
        return $query->where('is_system_permission', false);
    }
}
