<?php

namespace App\Policies;

use App\Models\CancellationPolicy;
use App\Models\User;

class CancellationPolicyPolicy
{
    public function viewAny(User $user): bool
    {
        return $this->hasRole($user, ['admin', 'reservation_manager']);
    }

    public function create(User $user): bool
    {
        return $this->hasRole($user, ['admin', 'reservation_manager']);
    }

    public function update(User $user, CancellationPolicy $policy): bool
    {
        return $this->scopeProperty($user, $policy)
            && $this->hasRole($user, ['admin', 'reservation_manager']);
    }

    public function delete(User $user, CancellationPolicy $policy): bool
    {
        return $this->scopeProperty($user, $policy)
            && $this->hasRole($user, ['admin', 'reservation_manager']);
    }

    private function hasRole(User $user, array $roles): bool
    {
        $role = $user->role ?? null;

        return $role && in_array($role, $roles, true);
    }

    private function scopeProperty(User $user, CancellationPolicy $policy): bool
    {
        if (! isset($user->property_id) || ! $policy->property_id) {
            return true;
        }

        return (int) $user->property_id === (int) $policy->property_id;
    }
}
