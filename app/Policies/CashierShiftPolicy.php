<?php

namespace App\Policies;

use App\Models\CashierShift;
use App\Models\User;

class CashierShiftPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $this->hasRole($user, ['admin', 'cashier']);
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, CashierShift $cashierShift): bool
    {
        if (! $this->scopeProperty($user, $cashierShift)) {
            return false;
        }

        if ($user->role === 'cashier') {
            return (int) $cashierShift->cashier_id === (int) $user->id;
        }

        return $this->hasRole($user, ['admin']);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $this->hasRole($user, ['admin', 'cashier']);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, CashierShift $cashierShift): bool
    {
        if (! $this->scopeProperty($user, $cashierShift)) {
            return false;
        }

        if ($user->role === 'cashier') {
            return (int) $cashierShift->cashier_id === (int) $user->id;
        }

        return $this->hasRole($user, ['admin']);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, CashierShift $cashierShift): bool
    {
        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, CashierShift $cashierShift): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, CashierShift $cashierShift): bool
    {
        return false;
    }

    private function hasRole(User $user, array $roles): bool
    {
        $role = $user->role ?? null;

        return $role && in_array($role, $roles, true);
    }

    private function scopeProperty(User $user, CashierShift $cashierShift): bool
    {
        if (! isset($user->property_id) || ! $cashierShift->property_id) {
            return true;
        }

        return (int) $user->property_id === (int) $cashierShift->property_id;
    }
}
