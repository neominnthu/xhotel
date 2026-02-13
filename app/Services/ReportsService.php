<?php

namespace App\Services;

use App\Models\CashierShift;
use App\Models\Folio;
use App\Models\Payment;
use App\Models\Refund;
use App\Models\ReportDailyKpi;
use App\Models\Reservation;
use App\Models\Room;
use App\Models\User;
use Carbon\CarbonInterface;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class ReportsService
{
    public function occupancyRange(CarbonInterface $from, CarbonInterface $to, ?int $propertyId): array
    {
        $rollups = ReportDailyKpi::query()
            ->when($propertyId, fn ($q) => $q->where('property_id', $propertyId))
            ->whereBetween('report_date', [$from->toDateString(), $to->toDateString()])
            ->get()
            ->keyBy(fn (ReportDailyKpi $row) => $row->report_date->toDateString());

        $data = [];
        $current = $from->copy();

        while ($current <= $to) {
            $date = $current->toDateString();
            $rollup = $rollups->get($date);

            if ($rollup) {
                $totalRooms = (int) $rollup->total_rooms;
                $occupiedRooms = (int) $rollup->occupied_rooms;
            } else {
                $totalRooms = Room::query()
                    ->when($propertyId, fn ($q) => $q->where('property_id', $propertyId))
                    ->where('is_active', true)
                    ->count();

                $occupiedRooms = Reservation::query()
                    ->when($propertyId, fn ($q) => $q->where('property_id', $propertyId))
                    ->where('status', 'checked_in')
                    ->where('check_in', '<=', $date)
                    ->where('check_out', '>', $date)
                    ->count();
            }

            $occupancyRate = $totalRooms > 0
                ? round(($occupiedRooms / $totalRooms) * 100, 2)
                : 0;

            $data[] = [
                'date' => $date,
                'total_rooms' => $totalRooms,
                'occupied_rooms' => $occupiedRooms,
                'occupancy_rate' => $occupancyRate,
            ];

            $current = $current->addDay();
        }

        return $data;
    }

    public function revenueSummary(CarbonInterface $from, CarbonInterface $to, ?int $propertyId): array
    {
        $cacheKey = 'reports.revenue.'.($propertyId ?? 'all').'.'.$from->toDateString().'.'.$to->toDateString();

        return Cache::remember($cacheKey, now()->addMinutes(10), function () use ($from, $to, $propertyId) {
            $revenueBySource = Folio::query()
                ->when($propertyId, fn ($q) => $q->whereHas('reservation', fn ($rq) => $rq->where('property_id', $propertyId)))
                ->join('reservations', 'folios.reservation_id', '=', 'reservations.id')
                ->whereBetween('folios.created_at', [$from, $to->copy()->endOfDay()])
                ->where('folios.status', 'closed')
                ->select('reservations.source', DB::raw('SUM(folios.total) as total_revenue'))
                ->groupBy('reservations.source')
                ->get()
                ->map(fn ($row) => [
                    'source' => $row->source,
                    'revenue' => (int) $row->total_revenue,
                ]);

            $days = $from->diffInDays($to) + 1;

            $rollups = ReportDailyKpi::query()
                ->when($propertyId, fn ($q) => $q->where('property_id', $propertyId))
                ->whereBetween('report_date', [$from->toDateString(), $to->toDateString()])
                ->get();

            if ($rollups->count() === $days) {
                $totalRevenue = (int) $rollups->sum('total_revenue');
                $roomNights = (int) $rollups->sum('room_nights');
            } else {
                $roomNightsExpression = $this->roomNightsExpression();
                $adrData = Folio::query()
                    ->when($propertyId, fn ($q) => $q->whereHas('reservation', fn ($rq) => $rq->where('property_id', $propertyId)))
                    ->join('reservations', 'folios.reservation_id', '=', 'reservations.id')
                    ->whereBetween('folios.created_at', [$from, $to->copy()->endOfDay()])
                    ->where('folios.status', 'closed')
                    ->select(
                        DB::raw('SUM(folios.total) as total_revenue'),
                        DB::raw("SUM({$roomNightsExpression}) as total_room_nights")
                    )
                    ->first();

                $totalRevenue = (int) ($adrData?->total_revenue ?? 0);
                $roomNights = (int) ($adrData?->total_room_nights ?? 0);
            }

            $totalRooms = Room::query()
                ->when($propertyId, fn ($q) => $q->where('property_id', $propertyId))
                ->where('is_active', true)
                ->count();

            $adr = $roomNights > 0 ? (int) round($totalRevenue / $roomNights) : 0;
            $revpar = $totalRooms > 0 && $days > 0
                ? (int) round($totalRevenue / ($totalRooms * $days))
                : 0;

            return [
                'adr' => $adr,
                'revpar' => $revpar,
                'total_revenue' => $totalRevenue,
                'revenue_by_source' => $revenueBySource,
                'period' => [
                    'from' => $from->toDateString(),
                    'to' => $to->toDateString(),
                    'days' => $days,
                ],
            ];
        });
    }

    public function cashierShiftReport(CarbonInterface $date, User $cashier): array
    {
        $propertyId = $cashier->property_id;
        $start = $date->copy()->startOfDay();
        $end = $date->copy()->endOfDay();

        $shifts = CashierShift::query()
            ->when($propertyId, fn ($query) => $query->where('property_id', $propertyId))
            ->where('cashier_id', $cashier->id)
            ->whereBetween('opened_at', [$start, $end])
            ->get();

        if ($shifts->isNotEmpty()) {
            return [
                'total_cash' => (int) $shifts->sum('total_cash'),
                'total_card' => (int) $shifts->sum('total_card'),
            ];
        }

        $cash = (int) Payment::query()
            ->when($propertyId, fn ($query) => $query->whereHas('folio.reservation', fn ($reservationQuery) => $reservationQuery->where('property_id', $propertyId)))
            ->where('created_by', $cashier->id)
            ->where('method', 'cash')
            ->whereBetween('received_at', [$start, $end])
            ->sum('amount');

        $card = (int) Payment::query()
            ->when($propertyId, fn ($query) => $query->whereHas('folio.reservation', fn ($reservationQuery) => $reservationQuery->where('property_id', $propertyId)))
            ->where('created_by', $cashier->id)
            ->where('method', 'card')
            ->whereBetween('received_at', [$start, $end])
            ->sum('amount');

        $cashRefunds = (int) Refund::query()
            ->when($propertyId, fn ($query) => $query->whereHas('folio.reservation', fn ($reservationQuery) => $reservationQuery->where('property_id', $propertyId)))
            ->where('approved_by', $cashier->id)
            ->where('method', 'cash')
            ->where('status', 'approved')
            ->whereBetween('refunded_at', [$start, $end])
            ->sum('amount');

        $cardRefunds = (int) Refund::query()
            ->when($propertyId, fn ($query) => $query->whereHas('folio.reservation', fn ($reservationQuery) => $reservationQuery->where('property_id', $propertyId)))
            ->where('approved_by', $cashier->id)
            ->where('method', 'card')
            ->where('status', 'approved')
            ->whereBetween('refunded_at', [$start, $end])
            ->sum('amount');

        return [
            'total_cash' => $cash - $cashRefunds,
            'total_card' => $card - $cardRefunds,
        ];
    }

    private function roomNightsExpression(): string
    {
        $driver = DB::connection()->getDriverName();

        if ($driver === 'sqlite') {
            return 'CAST(julianday(reservations.check_out) - julianday(reservations.check_in) AS INTEGER)';
        }

        return 'DATEDIFF(reservations.check_out, reservations.check_in)';
    }
}
