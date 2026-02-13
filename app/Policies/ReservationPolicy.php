<?php

namespace App\Policies;

use App\Models\Reservation;
use App\Models\User;

class ReservationPolicy
{
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

    public function view(User $user, Reservation $reservation): bool
    {
        return $this->scopeProperty($user, $reservation)
            && $this->hasRole($user, [
                'admin',
                'reservation_manager',
                'front_desk',
                'cashier',
                'housekeeping',
            ]);
    }

    public function create(User $user): bool
    {
        return $this->hasRole($user, ['admin', 'reservation_manager', 'front_desk']);
    }

    public function update(User $user, Reservation $reservation): bool
    {
        if (! $this->scopeProperty($user, $reservation)) {
            return false;
        }

        if ($reservation->status === 'checked_out') {
            return false;
        }

        return $this->hasRole($user, ['admin', 'reservation_manager', 'front_desk']);
    }

    public function cancel(User $user, Reservation $reservation): bool
    {
        if (! $this->scopeProperty($user, $reservation)) {
            return false;
        }

        if (in_array($reservation->status, ['canceled', 'checked_out'], true)) {
            return false;
        }

        return $this->hasRole($user, ['admin', 'reservation_manager', 'front_desk']);
    }

    private function hasRole(User $user, array $roles): bool
    {
        $role = $user->role ?? null;

        return $role && in_array($role, $roles, true);
    }

    private function scopeProperty(User $user, Reservation $reservation): bool
    {
        if (! isset($user->property_id) || ! $reservation->property_id) {
            return true;
        }

        return (int) $user->property_id === (int) $reservation->property_id;
    }
}
