<?php

namespace App\Policies;

use App\Models\Folio;
use App\Models\User;

class FolioPolicy
{
    public function viewAny(User $user): bool
    {
        return $this->hasRole($user, [
            'admin',
            'reservation_manager',
            'front_desk',
            'cashier',
        ]);
    }

    public function view(User $user, Folio $folio): bool
    {
        return $this->scopeProperty($user, $folio)
            && $this->hasRole($user, [
                'admin',
                'reservation_manager',
                'front_desk',
                'cashier',
            ]);
    }

    public function create(User $user): bool
    {
        return $this->hasRole($user, ['admin', 'reservation_manager', 'front_desk']);
    }

    public function update(User $user, Folio $folio): bool
    {
        if (! $this->scopeProperty($user, $folio)) {
            return false;
        }

        if ($folio->status === 'closed') {
            return false;
        }

        return $this->hasRole($user, ['admin', 'reservation_manager', 'front_desk', 'cashier']);
    }

    public function addCharge(User $user, Folio $folio): bool
    {
        if (! $this->scopeProperty($user, $folio)) {
            return false;
        }

        if ($folio->status === 'closed') {
            return false;
        }

        return $this->hasRole($user, ['admin', 'reservation_manager', 'front_desk', 'cashier']);
    }

    public function addPayment(User $user, Folio $folio): bool
    {
        if (! $this->scopeProperty($user, $folio)) {
            return false;
        }

        if ($folio->status === 'closed') {
            return false;
        }

        return $this->hasRole($user, ['admin', 'reservation_manager', 'front_desk', 'cashier']);
    }

    public function addRefund(User $user, Folio $folio): bool
    {
        if (! $this->scopeProperty($user, $folio)) {
            return false;
        }

        return $this->hasRole($user, ['admin', 'reservation_manager', 'front_desk', 'cashier']);
    }

    private function hasRole(User $user, array $roles): bool
    {
        $role = $user->role ?? null;

        return $role && in_array($role, $roles, true);
    }

    private function scopeProperty(User $user, Folio $folio): bool
    {
        if (! isset($user->property_id) || ! $folio->reservation || ! $folio->reservation->property_id) {
            return true;
        }

        return (int) $user->property_id === (int) $folio->reservation->property_id;
    }
}
