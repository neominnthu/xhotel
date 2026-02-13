<?php

namespace App\Console\Commands;

use App\Models\Folio;
use App\Models\Property;
use App\Models\ReportDailyKpi;
use App\Models\Reservation;
use App\Models\Room;
use App\Models\User;
use App\Services\AuditLogService;
use Carbon\Carbon;
use Illuminate\Console\Command;

class ReportsDailyRollup extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'reports:rollup {--date=} {--property_id=}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate daily occupancy and revenue rollups.';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $date = $this->option('date')
            ? Carbon::parse($this->option('date'))->startOfDay()
            : now()->subDay()->startOfDay();

        $propertyId = $this->option('property_id');

        $properties = Property::query()
            ->when($propertyId, fn ($q) => $q->where('id', $propertyId))
            ->get();

        foreach ($properties as $property) {
            $totalRooms = Room::query()
                ->where('property_id', $property->id)
                ->where('is_active', true)
                ->count();

            $occupiedRooms = Reservation::query()
                ->where('property_id', $property->id)
                ->where('status', 'checked_in')
                ->where('check_in', '<=', $date->toDateString())
                ->where('check_out', '>', $date->toDateString())
                ->count();

            $totalRevenue = Folio::query()
                ->whereHas('reservation', fn ($q) => $q->where('property_id', $property->id))
                ->whereDate('created_at', $date->toDateString())
                ->where('status', 'closed')
                ->sum('total');

            $roomNights = $occupiedRooms;
            $adr = $roomNights > 0 ? (int) round($totalRevenue / $roomNights) : 0;
            $revpar = $totalRooms > 0 ? (int) round($totalRevenue / $totalRooms) : 0;

            ReportDailyKpi::updateOrCreate([
                'property_id' => $property->id,
                'report_date' => $date->toDateString(),
            ], [
                'total_rooms' => $totalRooms,
                'occupied_rooms' => $occupiedRooms,
                'room_nights' => $roomNights,
                'total_revenue' => (int) $totalRevenue,
                'adr' => $adr,
                'revpar' => $revpar,
                'currency' => $property->default_currency ?? 'MMK',
            ]);

            $actor = User::query()
                ->where('property_id', $property->id)
                ->whereIn('role', ['admin', 'reservation_manager'])
                ->first();

            if ($actor) {
                app(AuditLogService::class)->record($actor, 'reports.rollup', 'report_daily_kpi', [
                    'property_id' => $property->id,
                    'report_date' => $date->toDateString(),
                    'total_rooms' => $totalRooms,
                    'occupied_rooms' => $occupiedRooms,
                    'total_revenue' => (int) $totalRevenue,
                ]);
            }
        }

        $this->info('Report rollups generated for '.$date->toDateString().'.');

        return Command::SUCCESS;
    }
}
