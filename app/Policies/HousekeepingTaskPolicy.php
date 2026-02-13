<?php

namespace App\Policies;

use App\Models\HousekeepingTask;
use App\Models\User;

class HousekeepingTaskPolicy
{
    public function viewAny(User $user): bool
    {
        return $this->hasRole($user, ['admin', 'housekeeping', 'reservation_manager']);
    }

    public function create(User $user): bool
    {
        return $this->hasRole($user, ['admin', 'housekeeping', 'reservation_manager']);
    }

    public function update(User $user, HousekeepingTask $task): bool
    {
        if (! $this->hasRole($user, ['admin', 'housekeeping'])) {
            return false;
        }

        if (! $task->room || ! isset($user->property_id)) {
            return true;
        }

        return (int) $task->room->property_id === (int) $user->property_id;
    }

    private function hasRole(User $user, array $roles): bool
    {
        $role = $user->role ?? null;

        return $role && in_array($role, $roles, true);
    }
}
