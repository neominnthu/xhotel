<?php

namespace App\Providers;

use App\Models\AuditLog;
use App\Models\AvailabilityHold;
use App\Models\CancellationPolicy;
use App\Models\ErrorReport;
use App\Models\Folio;
use App\Models\Guest;
use App\Models\HousekeepingTask;
use App\Models\Rate;
use App\Models\Refund;
use App\Models\ReportDailyKpi;
use App\Models\Reservation;
use App\Models\RoomType;
use App\Models\SystemBackup;
use App\Models\SystemUpdate;
use App\Policies\AuditLogPolicy;
use App\Policies\AvailabilityHoldPolicy;
use App\Policies\CancellationPolicyPolicy;
use App\Policies\ErrorReportPolicy;
use App\Policies\FolioPolicy;
use App\Policies\GuestPolicy;
use App\Policies\HousekeepingTaskPolicy;
use App\Policies\RatePolicy;
use App\Policies\RefundPolicy;
use App\Policies\ReportDailyKpiPolicy;
use App\Policies\ReservationPolicy;
use App\Policies\RoomTypePolicy;
use App\Policies\SystemBackupPolicy;
use App\Policies\SystemUpdatePolicy;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
        $this->registerPolicies();
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null
        );
    }

    protected function registerPolicies(): void
    {
        Gate::policy(Reservation::class, ReservationPolicy::class);
        Gate::policy(HousekeepingTask::class, HousekeepingTaskPolicy::class);
        Gate::policy(Folio::class, FolioPolicy::class);
        Gate::policy(Guest::class, GuestPolicy::class);
        Gate::policy(Rate::class, RatePolicy::class);
        Gate::policy(AvailabilityHold::class, AvailabilityHoldPolicy::class);
        Gate::policy(AuditLog::class, AuditLogPolicy::class);
        Gate::policy(CancellationPolicy::class, CancellationPolicyPolicy::class);
        Gate::policy(ReportDailyKpi::class, ReportDailyKpiPolicy::class);
        Gate::policy(Refund::class, RefundPolicy::class);
        Gate::policy(RoomType::class, RoomTypePolicy::class);
        Gate::policy(SystemUpdate::class, SystemUpdatePolicy::class);
        Gate::policy(SystemBackup::class, SystemBackupPolicy::class);
        Gate::policy(ErrorReport::class, ErrorReportPolicy::class);
    }
}
