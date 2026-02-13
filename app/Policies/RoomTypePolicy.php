<?php

namespace App\Policies;

use App\Models\RoomType;
use App\Models\User;

class RoomTypePolicy
{
    public function viewAny(User $user): bool
    {
        return $this->hasRole($user, ['admin', 'reservation_manager']);
    }

    public function create(User $user): bool
    {
        return $this->hasRole($user, ['admin', 'reservation_manager']);
    }

    public function update(User $user, RoomType $roomType): bool
    {
        return $this->scopeProperty($user, $roomType)
            && $this->hasRole($user, ['admin', 'reservation_manager']);
    }

    public function delete(User $user, RoomType $roomType): bool
    {
        return $this->scopeProperty($user, $roomType)
            && $this->hasRole($user, ['admin', 'reservation_manager']);
    }

    private function hasRole(User $user, array $roles): bool
    {
        $role = $user->role ?? null;

        return $role && in_array($role, $roles, true);
    }

    private function scopeProperty(User $user, RoomType $roomType): bool
    {
        if (! isset($user->property_id) || ! $roomType->property_id) {
            return true;
        }

        return (int) $user->property_id === (int) $roomType->property_id;
    }
}
