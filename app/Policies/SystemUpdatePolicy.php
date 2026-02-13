<?php

namespace App\Policies;

use App\Models\SystemUpdate;
use App\Models\User;

class SystemUpdatePolicy
{
    public function viewAny(User $user): bool
    {
        return $this->isAdmin($user) || $this->hasPermission($user, 'view-system-updates');
    }

    public function view(User $user, SystemUpdate $update): bool
    {
        return $this->isAdmin($user) || $this->hasPermission($user, 'view-system-updates');
    }

    public function create(User $user): bool
    {
        return $this->isAdmin($user)
            || $this->hasPermission($user, 'apply-system-updates')
            || $this->hasPermission($user, 'rollback-system-updates');
    }

    public function update(User $user, SystemUpdate $update): bool
    {
        return $this->isAdmin($user) || $this->hasPermission($user, 'apply-system-updates');
    }

    public function delete(User $user, SystemUpdate $update): bool
    {
        return false;
    }

    private function isAdmin(User $user): bool
    {
        return ($user->role ?? null) === 'admin';
    }

    private function hasPermission(User $user, string $permission): bool
    {
        return $user->hasPermission($permission);
    }
}
