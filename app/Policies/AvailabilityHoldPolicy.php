<?php

namespace App\Policies;

use App\Models\AvailabilityHold;
use App\Models\User;

class AvailabilityHoldPolicy
{
    public function viewAny(User $user): bool
    {
        return $this->hasRole($user, ['admin', 'reservation_manager', 'front_desk']);
    }

    public function create(User $user): bool
    {
        return $this->hasRole($user, ['admin', 'reservation_manager', 'front_desk']);
    }

    public function delete(User $user, AvailabilityHold $hold): bool
    {
        if (! $this->scopeProperty($user, $hold)) {
            return false;
        }

        return $this->hasRole($user, ['admin', 'reservation_manager', 'front_desk']);
    }

    private function hasRole(User $user, array $roles): bool
    {
        $role = $user->role ?? null;

        return $role && in_array($role, $roles, true);
    }

    private function scopeProperty(User $user, AvailabilityHold $hold): bool
    {
        if (! isset($user->property_id) || ! $hold->property_id) {
            return true;
        }

        return (int) $user->property_id === (int) $hold->property_id;
    }
}
