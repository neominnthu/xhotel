<?php

namespace App\Policies;

use App\Models\ExchangeRate;
use App\Models\User;

class ExchangeRatePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $this->hasRole($user, ['admin', 'reservation_manager']);
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, ExchangeRate $exchangeRate): bool
    {
        return $this->scopeProperty($user, $exchangeRate)
            && $this->hasRole($user, ['admin', 'reservation_manager']);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $this->hasRole($user, ['admin', 'reservation_manager']);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, ExchangeRate $exchangeRate): bool
    {
        return $this->scopeProperty($user, $exchangeRate)
            && $this->hasRole($user, ['admin', 'reservation_manager']);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, ExchangeRate $exchangeRate): bool
    {
        return $this->scopeProperty($user, $exchangeRate)
            && $this->hasRole($user, ['admin', 'reservation_manager']);
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, ExchangeRate $exchangeRate): bool
    {
        return false;
    }

    public function forceDelete(User $user, ExchangeRate $exchangeRate): bool
    {
        return false;
    }

    private function hasRole(User $user, array $roles): bool
    {
        $role = $user->role ?? null;

        return $role && in_array($role, $roles, true);
    }

    private function scopeProperty(User $user, ExchangeRate $exchangeRate): bool
    {
        if (! isset($user->property_id) || ! $exchangeRate->property_id) {
            return true;
        }

        return (int) $user->property_id === (int) $exchangeRate->property_id;
    }
}
