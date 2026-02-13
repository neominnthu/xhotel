<?php

namespace App\Policies;

use App\Models\Refund;
use App\Models\User;

class RefundPolicy
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
        ]);
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Refund $refund): bool
    {
        return $this->scopeProperty($user, $refund)
            && $this->hasRole($user, [
                'admin',
                'reservation_manager',
                'front_desk',
                'cashier',
            ]);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $this->hasRole($user, [
            'admin',
            'reservation_manager',
            'front_desk',
            'cashier',
        ]);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Refund $refund): bool
    {
        return $this->scopeProperty($user, $refund)
            && $this->hasRole($user, [
                'admin',
                'cashier',
            ]);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Refund $refund): bool
    {
        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Refund $refund): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Refund $refund): bool
    {
        return false;
    }

    public function approve(User $user, Refund $refund): bool
    {
        return $this->scopeProperty($user, $refund)
            && $this->hasRole($user, [
                'admin',
                'cashier',
            ]);
    }

    private function hasRole(User $user, array $roles): bool
    {
        $role = $user->role ?? null;

        return $role && in_array($role, $roles, true);
    }

    private function scopeProperty(User $user, Refund $refund): bool
    {
        $reservation = $refund->folio?->reservation;

        if (! isset($user->property_id) || ! $reservation?->property_id) {
            return true;
        }

        return (int) $user->property_id === (int) $reservation->property_id;
    }
}
