<?php

namespace App\Policies;

use App\Models\SystemBackup;
use App\Models\User;

class SystemBackupPolicy
{
    public function viewAny(User $user): bool
    {
        return $this->isAdmin($user) || $this->hasPermission($user, 'view-system-backups');
    }

    public function view(User $user, SystemBackup $backup): bool
    {
        return $this->isAdmin($user) || $this->hasPermission($user, 'view-system-backups');
    }

    public function create(User $user): bool
    {
        return $this->isAdmin($user) || $this->hasPermission($user, 'create-system-backups');
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
