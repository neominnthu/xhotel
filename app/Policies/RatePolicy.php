<?php

namespace App\Policies;

use App\Models\Rate;
use App\Models\User;

class RatePolicy
{
    public function viewAny(User $user): bool
    {
        return $this->hasRole($user, ['admin', 'reservation_manager']);
    }

    public function view(User $user, Rate $rate): bool
    {
        return $this->scopeProperty($user, $rate)
            && $this->hasRole($user, ['admin', 'reservation_manager']);
    }

    public function create(User $user): bool
    {
        return $this->hasRole($user, ['admin', 'reservation_manager']);
    }

    public function update(User $user, Rate $rate): bool
    {
        return $this->scopeProperty($user, $rate)
            && $this->hasRole($user, ['admin', 'reservation_manager']);
    }

    public function delete(User $user, Rate $rate): bool
    {
        return $this->scopeProperty($user, $rate)
            && $this->hasRole($user, ['admin', 'reservation_manager']);
    }

    private function hasRole(User $user, array $roles): bool
    {
        $role = $user->role ?? null;

        return $role && in_array($role, $roles, true);
    }

    private function scopeProperty(User $user, Rate $rate): bool
    {
        if (! isset($user->property_id) || ! $rate->property_id) {
            return true;
        }

        return (int) $user->property_id === (int) $rate->property_id;
    }
}
