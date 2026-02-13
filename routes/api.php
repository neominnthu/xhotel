<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AvailabilityController;
use App\Http\Controllers\Api\AvailabilityHoldController;
use App\Http\Controllers\Api\CancellationPolicyController;
use App\Http\Controllers\Api\CashierShiftController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\FolioController;
use App\Http\Controllers\Api\FrontDeskController;
use App\Http\Controllers\Api\GuestController;
use App\Http\Controllers\Api\HousekeepingPerformanceController;
use App\Http\Controllers\Api\HousekeepingTaskController;
use App\Http\Controllers\Api\RefundController;
use App\Http\Controllers\Api\ReportsController;
use App\Http\Controllers\Api\ReservationController;
use App\Http\Controllers\Api\ReservationImportController;
use App\Http\Controllers\Api\RoomStatusLogController;
use App\Http\Controllers\Api\StayController;
use App\Http\Controllers\Api\SystemBackupController;
use App\Http\Controllers\Api\SystemReportController;
use App\Http\Controllers\Api\SystemUpdateController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::post('auth/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('auth/me', [AuthController::class, 'me']);
        Route::post('auth/logout', [AuthController::class, 'logout']);

        Route::get('availability', [AvailabilityController::class, 'index']);
        Route::get('availability/holds', [AvailabilityHoldController::class, 'index']);
        Route::post('availability/holds', [AvailabilityHoldController::class, 'store']);
        Route::delete('availability/holds/{hold}', [AvailabilityHoldController::class, 'destroy']);

        Route::get('calendar', [CalendarController::class, 'index']);

        Route::prefix('dashboard')->group(function () {
            Route::get('overview', [DashboardController::class, 'overview']);
            Route::get('realtime', [DashboardController::class, 'realtime']);
            Route::get('analytics', [DashboardController::class, 'analytics']);
            Route::get('performance', [DashboardController::class, 'performance']);
        });

        Route::apiResource('reservations', ReservationController::class)->except(['destroy']);
        Route::patch('reservations/{reservation}/cancel', [ReservationController::class, 'cancel']);
        Route::post('reservations/import', [ReservationImportController::class, 'store']);

        Route::apiResource('guests', GuestController::class)->except(['destroy']);
        Route::post('guests/{guest}/merge', [GuestController::class, 'merge']);

        Route::apiResource('cancellation-policies', CancellationPolicyController::class)->except(['show']);

        Route::post('stays/{stay}/check-in', [StayController::class, 'checkIn']);
        Route::post('stays/{stay}/check-out', [StayController::class, 'checkOut']);

        Route::get('folios/{folio}', [FolioController::class, 'show']);
        Route::post('folios/{folio}/charges', [FolioController::class, 'storeCharge']);
        Route::post('folios/{folio}/payments', [FolioController::class, 'storePayment']);
        Route::post('folios/{folio}/refunds', [FolioController::class, 'storeRefund']);
        Route::post('refunds/{refund}/approve', [RefundController::class, 'approve']);

        Route::get('rooms/{room}/housekeeping-history', [RoomStatusLogController::class, 'index']);

        Route::get('housekeeping/tasks', [HousekeepingTaskController::class, 'index']);
        Route::post('housekeeping/tasks', [HousekeepingTaskController::class, 'store']);
        Route::patch('housekeeping/tasks/bulk', [HousekeepingTaskController::class, 'bulkUpdate']);
        Route::patch('housekeeping/tasks/{task}', [HousekeepingTaskController::class, 'update']);

        Route::prefix('housekeeping/performance')->group(function () {
            Route::get('staff/{user}', [HousekeepingPerformanceController::class, 'getStaffPerformance']);
            Route::get('staff/{user}/trends', [HousekeepingPerformanceController::class, 'getPerformanceTrends']);
            Route::get('top-performers', [HousekeepingPerformanceController::class, 'getTopPerformers']);
            Route::get('metrics', [HousekeepingPerformanceController::class, 'getOverallMetrics']);
            Route::post('comparison', [HousekeepingPerformanceController::class, 'getPerformanceComparison']);
        });

        Route::prefix('front-desk')->group(function () {
            Route::get('dashboard', [FrontDeskController::class, 'dashboard']);
            Route::post('reservations/{reservation}/check-in', [FrontDeskController::class, 'checkIn']);
            Route::post('stays/{stay}/check-out', [FrontDeskController::class, 'checkOut']);
            Route::post('stays/{stay}/extend', [FrontDeskController::class, 'extendStay']);
            Route::get('guests/search', [FrontDeskController::class, 'searchGuests']);
            Route::get('guests/{guest}', [FrontDeskController::class, 'getGuest']);
            Route::post('stays/{stay}/assign-room', [FrontDeskController::class, 'assignRoom']);
            Route::get('rooms/available', [FrontDeskController::class, 'getAvailableRooms']);
        });

        Route::get('reports/occupancy', [ReportsController::class, 'occupancy']);
        Route::get('reports/cashier-shift', [ReportsController::class, 'cashierShift']);
        Route::get('reports/revenue', [ReportsController::class, 'revenue']);
        Route::get('reports/occupancy/export', [ReportsController::class, 'occupancyExport']);
        Route::get('reports/revenue/export', [ReportsController::class, 'revenueExport']);

        Route::prefix('cashier-shifts')->group(function () {
            Route::post('open', [CashierShiftController::class, 'open']);
            Route::post('{cashierShift}/close', [CashierShiftController::class, 'close']);
            Route::get('current', [CashierShiftController::class, 'current']);
        });

        Route::prefix('system')->group(function () {
            Route::post('updates/check', [SystemUpdateController::class, 'check']);
            Route::post('updates/apply', [SystemUpdateController::class, 'apply']);
            Route::post('updates/rollback', [SystemUpdateController::class, 'rollback']);
            Route::post('backups', [SystemBackupController::class, 'store']);
            Route::post('reports/errors', [SystemReportController::class, 'store'])
                ->middleware('api.rate:reports');
        });
    });
});
