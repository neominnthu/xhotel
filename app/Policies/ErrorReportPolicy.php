<?php

namespace App\Policies;

use App\Models\ErrorReport;
use App\Models\User;

class ErrorReportPolicy
{
    public function viewAny(User $user): bool
    {
        return $this->isAdmin($user);
    }

    public function view(User $user, ErrorReport $report): bool
    {
        return $this->isAdmin($user);
    }

    public function create(User $user): bool
    {
        return (bool) $user->id;
    }

    private function isAdmin(User $user): bool
    {
        return ($user->role ?? null) === 'admin';
    }
}
