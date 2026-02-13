<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FrontDesk\CheckInPageController;
use App\Http\Controllers\FrontDesk\CheckOutPageController;
use App\Http\Controllers\FrontDesk\FrontDeskPageController;
use App\Http\Controllers\Guests\GuestPageController;
use App\Http\Controllers\Folios\FolioPageController;
use App\Http\Controllers\Housekeeping\HousekeepingAuditPageController;
use App\Http\Controllers\Housekeeping\HousekeepingPageController;
use App\Http\Controllers\Housekeeping\RoomHistoryPageController;
use App\Http\Controllers\ReportsPageController;
use App\Http\Controllers\Reservations\ReservationPageController;
use App\Http\Controllers\Reservations\ReservationImportPageController;
use App\Http\Controllers\Settings\CancellationPolicyPageController;
use App\Http\Controllers\Settings\AuditLogPageController;
use App\Http\Controllers\Settings\UpdatePageController;
use App\Http\Controllers\Settings\RatePageController;
use App\Http\Controllers\Settings\RoomTypePageController;
use App\Http\Controllers\BillingReportsController;
use App\Models\Folio;
use App\Models\HousekeepingTask;
use App\Models\Reservation;
use App\Models\RoomType;
use App\Models\Room;
use App\Models\User;
use App\Services\ReservationService;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('health', function () {
    return response()->json(['status' => 'ok']);
});

Route::get('dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::get('dashboard/analytics', function () {
    return Inertia::render('analytics-dashboard', [
        'overview' => app(\App\Http\Controllers\Api\DashboardController::class)->overview(request()),
    ]);
})
    ->middleware(['auth', 'verified'])
    ->name('dashboard.analytics');

Route::get('front-desk', [FrontDeskPageController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('front-desk');

Route::get('front-desk/check-in/{reservation}', [CheckInPageController::class, 'show'])
    ->middleware(['auth', 'verified'])
    ->name('front-desk.check-in');

Route::get('front-desk/check-out/{stay}', [CheckOutPageController::class, 'show'])
    ->middleware(['auth', 'verified'])
    ->name('front-desk.check-out');

Route::get('guests', [GuestPageController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('guests.index');

Route::get('guests/{guest}', [GuestPageController::class, 'show'])
    ->middleware(['auth', 'verified'])
    ->name('guests.show');

Route::post('guests', [GuestPageController::class, 'store'])
    ->middleware(['auth', 'verified'])
    ->name('guests.store');

Route::patch('guests/{guest}', [GuestPageController::class, 'update'])
    ->middleware(['auth', 'verified'])
    ->name('guests.update');

Route::post('guests/{guest}/merge', [GuestPageController::class, 'merge'])
    ->middleware(['auth', 'verified'])
    ->name('guests.merge');

Route::get('reservations', function () {
    Gate::authorize('viewAny', Reservation::class);
    $filters = request()->only(['search', 'status']);

    $query = Reservation::query()->with('guest');

    if (! empty($filters['status']) && $filters['status'] !== 'all') {
        $query->where('status', $filters['status']);
    }

    if (! empty($filters['search'])) {
        $search = $filters['search'];
        $query->where(function ($builder) use ($search) {
            $builder->where('code', 'like', "%{$search}%")
                ->orWhereHas('guest', function ($guestQuery) use ($search) {
                    $guestQuery->where('name', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%");
                });
        });
    }

    $reservations = $query->orderByDesc('check_in')
        ->paginate(20)
        ->withQueryString();

    return Inertia::render('reservations/index', [
        'filters' => $filters,
        'reservations' => [
            'data' => $reservations->map(fn (Reservation $reservation) => [
                'id' => $reservation->id,
                'code' => $reservation->code,
                'status' => $reservation->status,
                'check_in' => $reservation->check_in?->toDateString(),
                'check_out' => $reservation->check_out?->toDateString(),
                'guest' => $reservation->guest
                    ? [
                        'id' => $reservation->guest->id,
                        'name' => $reservation->guest->name,
                    ]
                    : null,
                'room_type_id' => $reservation->room_type_id,
                'room_id' => $reservation->room_id,
            ]),
            'meta' => [
                'total' => $reservations->total(),
                'page' => $reservations->currentPage(),
                'per_page' => $reservations->perPage(),
            ],
        ],
    ]);
})->middleware(['auth', 'verified'])->name('reservations.index');

Route::get('reservations/import', [ReservationImportPageController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('reservations.import');

Route::post('reservations/import', [ReservationImportPageController::class, 'store'])
    ->middleware(['auth', 'verified'])
    ->name('reservations.import.store');

Route::get('reservations/create', function () {
    Gate::authorize('create', Reservation::class);

    $roomTypes = RoomType::query()
        ->where('is_active', true)
        ->orderBy('sort_order')
        ->get(['id', 'name', 'base_rate']);

    return Inertia::render('reservations/create', [
        'roomTypes' => $roomTypes->map(fn (RoomType $roomType) => [
            'id' => $roomType->id,
            'name' => $roomType->name,
            'base_rate' => $roomType->base_rate,
        ]),
    ]);
})->middleware(['auth', 'verified'])->name('reservations.create');

Route::post('reservations', [ReservationPageController::class, 'store'])
    ->middleware(['auth', 'verified'])
    ->name('reservations.store');

Route::patch('reservations/{reservation}', [ReservationPageController::class, 'update'])
    ->middleware(['auth', 'verified'])
    ->name('reservations.update');

Route::post('reservations/{reservation}/cancel', [ReservationPageController::class, 'cancel'])
    ->middleware(['auth', 'verified'])
    ->name('reservations.cancel');

Route::get('reports', [ReportsPageController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('reports.index');

Route::get('reports/export', [ReportsPageController::class, 'export'])
    ->middleware(['auth', 'verified'])
    ->name('reports.export');

Route::get('reports/export-revenue', [ReportsPageController::class, 'exportRevenue'])
    ->middleware(['auth', 'verified'])
    ->name('reports.export.revenue');

Route::get('settings/cancellation-policies', [CancellationPolicyPageController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('settings.cancellation-policies.index');

Route::post('settings/cancellation-policies', [CancellationPolicyPageController::class, 'store'])
    ->middleware(['auth', 'verified'])
    ->name('settings.cancellation-policies.store');

Route::patch('settings/cancellation-policies/{cancellationPolicy}', [CancellationPolicyPageController::class, 'update'])
    ->middleware(['auth', 'verified'])
    ->name('settings.cancellation-policies.update');

Route::delete('settings/cancellation-policies/{cancellationPolicy}', [CancellationPolicyPageController::class, 'destroy'])
    ->middleware(['auth', 'verified'])
    ->name('settings.cancellation-policies.destroy');

Route::get('settings/updates', [UpdatePageController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('settings.updates.index');

Route::get('settings/audit-logs', [AuditLogPageController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('settings.audit-logs.index');

Route::get('settings/audit-logs/export', [AuditLogPageController::class, 'export'])
    ->middleware(['auth', 'verified'])
    ->name('settings.audit-logs.export');

Route::post('settings/updates', [UpdatePageController::class, 'apply'])
    ->middleware(['auth', 'verified'])
    ->name('settings.updates.apply');

Route::post('settings/updates/rollback', [UpdatePageController::class, 'rollback'])
    ->middleware(['auth', 'verified'])
    ->name('settings.updates.rollback');

Route::post('settings/updates/backups', [UpdatePageController::class, 'backup'])
    ->middleware(['auth', 'verified'])
    ->name('settings.updates.backups');

Route::post('settings/updates/reports', [UpdatePageController::class, 'report'])
    ->middleware(['auth', 'verified'])
    ->name('settings.updates.reports');

Route::get('settings/room-types', [RoomTypePageController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('settings.room-types.index');

Route::post('settings/room-types', [RoomTypePageController::class, 'store'])
    ->middleware(['auth', 'verified'])
    ->name('settings.room-types.store');

Route::patch('settings/room-types/{roomType}', [RoomTypePageController::class, 'update'])
    ->middleware(['auth', 'verified'])
    ->name('settings.room-types.update');

Route::delete('settings/room-types/{roomType}', [RoomTypePageController::class, 'destroy'])
    ->middleware(['auth', 'verified'])
    ->name('settings.room-types.destroy');

Route::get('settings/rates', [RatePageController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('settings.rates.index');

Route::post('settings/rates', [RatePageController::class, 'store'])
    ->middleware(['auth', 'verified'])
    ->name('settings.rates.store');

Route::patch('settings/rates/{rate}', [RatePageController::class, 'update'])
    ->middleware(['auth', 'verified'])
    ->name('settings.rates.update');

Route::delete('settings/rates/{rate}', [RatePageController::class, 'destroy'])
    ->middleware(['auth', 'verified'])
    ->name('settings.rates.destroy');

Route::get('reservations/{reservation}', function (Reservation $reservation) {
    Gate::authorize('view', $reservation);

    $reservation->load(['guest', 'roomType', 'room', 'stay', 'folios', 'statusLogs.actor']);
    $cancellationPreview = app(ReservationService::class)->cancellationPreview($reservation);

    return Inertia::render('reservations/show', [
        'reservation' => [
            'id' => $reservation->id,
            'code' => $reservation->code,
            'status' => $reservation->status,
            'check_in' => $reservation->check_in?->toDateString(),
            'check_out' => $reservation->check_out?->toDateString(),
            'adults' => $reservation->adults,
            'children' => $reservation->children,
            'special_requests' => $reservation->special_requests,
            'guest' => $reservation->guest
                ? [
                    'id' => $reservation->guest->id,
                    'name' => $reservation->guest->name,
                    'phone' => $reservation->guest->phone,
                ]
                : null,
            'room' => $reservation->room
                ? [
                    'id' => $reservation->room->id,
                    'number' => $reservation->room->number,
                ]
                : null,
            'room_type' => $reservation->roomType
                ? [
                    'id' => $reservation->roomType->id,
                    'name' => $reservation->roomType->name,
                ]
                : null,
            'stay' => $reservation->stay
                ? [
                    'status' => $reservation->stay->status,
                    'actual_check_in' => $reservation->stay->actual_check_in?->toDateTimeString(),
                    'actual_check_out' => $reservation->stay->actual_check_out?->toDateTimeString(),
                ]
                : null,
            'folio' => $reservation->folios->first()
                ? [
                    'id' => $reservation->folios->first()->id,
                    'currency' => $reservation->folios->first()->currency,
                    'total' => $reservation->folios->first()->total,
                    'balance' => $reservation->folios->first()->balance,
                    'status' => $reservation->folios->first()->status,
                ]
                : null,
            'status_logs' => $reservation->statusLogs->map(fn ($log) => [
                'id' => $log->id,
                'status_from' => $log->status_from,
                'status_to' => $log->status_to,
                'changed_at' => $log->changed_at?->toDateTimeString(),
                'actor' => $log->actor
                    ? [
                        'id' => $log->actor->id,
                        'name' => $log->actor->name,
                    ]
                    : null,
                'reason' => $log->reason,
            ]),
        ],
        'cancellation_preview' => $cancellationPreview,
    ]);
})->middleware(['auth', 'verified'])->name('reservations.show');

Route::get('calendar', function () {
    $user = auth()->user();
    $propertyId = $user->property_id ?? 1;

    $roomTypes = \App\Models\RoomType::where('property_id', $propertyId)
        ->where('is_active', true)
        ->orderBy('sort_order')
        ->get(['id', 'name', 'capacity', 'base_rate']);

    return Inertia::render('calendar/index', [
        'roomTypes' => $roomTypes->map(fn ($rt) => [
            'id' => $rt->id,
            'name' => $rt->name,
            'capacity' => $rt->capacity,
            'base_rate' => $rt->base_rate,
        ]),
    ]);
})->middleware(['auth', 'verified'])->name('calendar.index');

Route::get('folios/{folio}', function (Folio $folio) {
    $folio->load(['reservation.guest', 'charges.createdBy', 'payments']);

    if (! $folio->reservation) {
        abort(404);
    }

    Gate::authorize('view', $folio->reservation);

    return Inertia::render('folios/show', [
        'folio' => [
            'id' => $folio->id,
            'currency' => $folio->currency,
            'total' => $folio->total,
            'balance' => $folio->balance,
            'status' => $folio->status,
            'closed_at' => $folio->closed_at?->toDateTimeString(),
        ],
        'reservation' => [
            'id' => $folio->reservation->id,
            'code' => $folio->reservation->code,
            'guest' => $folio->reservation->guest
                ? [
                    'id' => $folio->reservation->guest->id,
                    'name' => $folio->reservation->guest->name,
                ]
                : null,
        ],
        'charges' => $folio->charges->map(fn ($charge) => [
            'id' => $charge->id,
            'type' => $charge->type,
            'description' => $charge->description,
            'amount' => $charge->amount,
            'currency' => $charge->currency,
            'posted_at' => $charge->posted_at?->toDateTimeString(),
            'created_by' => $charge->createdBy
                ? [
                    'id' => $charge->createdBy->id,
                    'name' => $charge->createdBy->name,
                ]
                : null,
        ]),
        'payments' => $folio->payments->map(fn ($payment) => [
            'id' => $payment->id,
            'method' => $payment->method,
            'amount' => $payment->amount,
            'currency' => $payment->currency,
            'reference' => $payment->reference,
            'card_last_four' => $payment->card_last_four,
            'card_type' => $payment->card_type,
            'bank_details' => $payment->bank_details,
            'wallet_type' => $payment->wallet_type,
            'check_number' => $payment->check_number,
            'received_at' => $payment->received_at?->toDateTimeString(),
        ]),
    ]);
})->middleware(['auth', 'verified'])->name('folios.show');

Route::post('folios/{folio}/charges', [FolioPageController::class, 'storeCharge'])
    ->middleware(['auth', 'verified'])
    ->name('folios.charges.store');

Route::post('folios/{folio}/payments', [FolioPageController::class, 'storePayment'])
    ->middleware(['auth', 'verified'])
    ->name('folios.payments.store');

use App\Http\Controllers\InvoiceController;

Route::get('invoices/{folio}', [InvoiceController::class, 'show'])
    ->middleware(['auth', 'verified'])
    ->name('invoices.show');

Route::get('billing-reports', [BillingReportsController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('billing-reports.index');

Route::get('housekeeping', function () {
    Gate::authorize('viewAny', HousekeepingTask::class);

    $status = request()->input('status');
    $priority = request()->input('priority');
    $type = request()->input('type');
    $dueFrom = request()->input('due_from');
    $dueTo = request()->input('due_to');
    $completedFrom = request()->input('completed_from');
    $completedTo = request()->input('completed_to');
    $assignedTo = request()->input('assigned_to');
    $roomStatus = request()->input('room_status');
    $roomId = request()->input('room_id');
    $overdue = request()->boolean('overdue');
    $sort = request()->input('sort', 'due_at');
    $sortDir = request()->input('sort_dir', 'asc');

    $assigneesQuery = User::query()
        ->where('role', 'housekeeping')
        ->where('is_active', true);

    $user = request()->user();
    if ($user?->property_id) {
        $assigneesQuery->where('property_id', $user->property_id);
    }

    $query = HousekeepingTask::query()->with(['room', 'assignee']);

    $roomsQuery = Room::query()->orderBy('number');
    if ($user?->property_id) {
        $roomsQuery->where('property_id', $user->property_id);
    }

    if ($status) {
        $query->where('status', $status);
    }

    if ($priority) {
        $query->where('priority', $priority);
    }

    if ($type) {
        $query->where('type', $type);
    }

    if ($dueFrom) {
        $query->whereDate('due_at', '>=', $dueFrom);
    }

    if ($dueTo) {
        $query->whereDate('due_at', '<=', $dueTo);
    }

    if ($completedFrom) {
        $query->whereDate('completed_at', '>=', $completedFrom);
    }

    if ($completedTo) {
        $query->whereDate('completed_at', '<=', $completedTo);
    }

    if ($assignedTo) {
        if ($assignedTo === 'unassigned') {
            $query->whereNull('assigned_to');
        } else {
            $query->where('assigned_to', $assignedTo);
        }
    }

    if ($roomStatus) {
        $query->whereHas('room', function ($builder) use ($roomStatus) {
            $builder->where('housekeeping_status', $roomStatus);
        });
    }

    if ($roomId) {
        $query->where('room_id', $roomId);
    }

    if ($overdue) {
        $query
            ->whereNotNull('due_at')
            ->whereDate('due_at', '<', today())
            ->where('status', '!=', 'completed');
    }

    $direction = $sortDir === 'desc' ? 'desc' : 'asc';

    switch ($sort) {
        case 'priority':
            $query->orderByRaw(
                "CASE priority WHEN 'low' THEN 1 WHEN 'normal' THEN 2 WHEN 'high' THEN 3 ELSE 4 END {$direction}"
            );
            break;
        case 'room_number':
            $query->orderBy(
                Room::select('number')
                    ->whereColumn('rooms.id', 'housekeeping_tasks.room_id'),
                $direction
            );
            break;
        case 'due_at':
        default:
            $query->orderBy('due_at', $direction);
            break;
    }

    $tasks = $query->paginate(15)->withQueryString();

    return Inertia::render('housekeeping/index', [
        'filters' => [
            'status' => $status,
            'priority' => $priority,
            'type' => $type,
            'due_from' => $dueFrom,
            'due_to' => $dueTo,
            'completed_from' => $completedFrom,
            'completed_to' => $completedTo,
            'assigned_to' => $assignedTo,
            'room_status' => $roomStatus,
            'room_id' => $roomId,
            'overdue' => $overdue ? '1' : null,
            'sort' => $sort,
            'sort_dir' => $sortDir,
            'page' => $tasks->currentPage(),
        ],
        'assignees' => $assigneesQuery->orderBy('name')->get(['id', 'name']),
        'rooms' => $roomsQuery->get(['id', 'number']),
        'current_user_id' => $user?->id,
        'tasks' => $tasks->map(fn (HousekeepingTask $task) => [
            'id' => $task->id,
            'type' => $task->type,
            'status' => $task->status,
            'priority' => $task->priority,
            'room' => $task->room
                ? [
                    'id' => $task->room->id,
                    'number' => $task->room->number,
                    'room_status' => $task->room->housekeeping_status,
                ]
                : null,
            'assignee' => $task->assignee
                ? [
                    'id' => $task->assignee->id,
                    'name' => $task->assignee->name,
                ]
                : null,
        ]),
        'meta' => [
            'current_page' => $tasks->currentPage(),
            'last_page' => $tasks->lastPage(),
            'per_page' => $tasks->perPage(),
            'total' => $tasks->total(),
        ],
    ]);
})->middleware(['auth', 'verified'])->name('housekeeping.index');

Route::post('housekeeping/tasks', [HousekeepingPageController::class, 'store'])
    ->middleware(['auth', 'verified'])
    ->name('housekeeping.tasks.store');

Route::patch('housekeeping/tasks/{task}', [HousekeepingPageController::class, 'update'])
    ->middleware(['auth', 'verified'])
    ->name('housekeeping.tasks.update');

Route::get('housekeeping/tasks.csv', [HousekeepingPageController::class, 'export'])
    ->middleware(['auth', 'verified'])
    ->name('housekeeping.tasks.export');

Route::get('housekeeping/rooms/{room}', [RoomHistoryPageController::class, 'show'])
    ->middleware(['auth', 'verified'])
    ->name('housekeeping.rooms.show');

Route::get('housekeeping/rooms/{room}/history.csv', [RoomHistoryPageController::class, 'export'])
    ->middleware(['auth', 'verified'])
    ->name('housekeeping.rooms.export');

Route::get('housekeeping/audit', [HousekeepingAuditPageController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('housekeeping.audit');

Route::get('housekeeping/performance', [HousekeepingPerformancePageController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('housekeeping.performance');

use App\Http\Controllers\Admin\AdminController;

Route::get('admin', [AdminController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('admin.index');

Route::get('admin/users/create', [AdminController::class, 'create'])
    ->middleware(['auth', 'verified'])
    ->name('admin.users.create');

Route::post('admin/users', [AdminController::class, 'store'])
    ->middleware(['auth', 'verified'])
    ->name('admin.users.store');

Route::get('admin/users/{user}', [AdminController::class, 'show'])
    ->middleware(['auth', 'verified'])
    ->name('admin.users.show');

Route::get('admin/users/{user}/edit', [AdminController::class, 'edit'])
    ->middleware(['auth', 'verified'])
    ->name('admin.users.edit');

Route::patch('admin/users/{user}', [AdminController::class, 'update'])
    ->middleware(['auth', 'verified'])
    ->name('admin.users.update');

Route::delete('admin/users/{user}', [AdminController::class, 'destroy'])
    ->middleware(['auth', 'verified'])
    ->name('admin.users.destroy');

require __DIR__.'/settings.php';
