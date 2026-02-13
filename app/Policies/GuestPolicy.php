<?php

namespace App\Policies;

use App\Models\Guest;
use App\Models\User;

class GuestPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $this->hasRole($user, [
            'admin',
            'reservation_manager',
            'front_desk',
            'cashier',
            'housekeeping',
        ]);
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Guest $guest): bool
    {
        return $this->scopeProperty($user, $guest)
            && $this->hasRole($user, [
                'admin',
                'reservation_manager',
                'front_desk',
                'cashier',
                'housekeeping',
            ]);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $this->hasRole($user, ['admin', 'reservation_manager', 'front_desk']);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Guest $guest): bool
    {
        return $this->scopeProperty($user, $guest)
            && $this->hasRole($user, ['admin', 'reservation_manager', 'front_desk']);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Guest $guest): bool
    {
        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Guest $guest): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Guest $guest): bool
    {
        return false;
    }

    private function hasRole(User $user, array $roles): bool
    {
        $role = $user->role ?? null;

        return $role && in_array($role, $roles, true);
    }

    private function scopeProperty(User $user, Guest $guest): bool
    {
        if (! isset($user->property_id) || ! $guest->property_id) {
            return true;
        }

        return (int) $user->property_id === (int) $guest->property_id;
    }
}
