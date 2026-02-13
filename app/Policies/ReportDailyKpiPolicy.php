<?php

namespace App\Policies;

use App\Models\ReportDailyKpi;
use App\Models\User;

class ReportDailyKpiPolicy
{
    public function viewAny(User $user): bool
    {
        return $this->hasRole($user, ['admin', 'reservation_manager', 'front_desk', 'cashier']);
    }

    public function view(User $user, ReportDailyKpi $kpi): bool
    {
        if (! $this->scopeProperty($user, $kpi)) {
            return false;
        }

        return $this->hasRole($user, ['admin', 'reservation_manager', 'front_desk', 'cashier']);
    }

    private function hasRole(User $user, array $roles): bool
    {
        $role = $user->role ?? null;

        return $role && in_array($role, $roles, true);
    }

    private function scopeProperty(User $user, ReportDailyKpi $kpi): bool
    {
        if (! isset($user->property_id) || ! $kpi->property_id) {
            return true;
        }

        return (int) $user->property_id === (int) $kpi->property_id;
    }
}
