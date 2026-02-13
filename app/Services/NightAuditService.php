<?php

namespace App\Services;

use App\Models\Charge;
use App\Models\Payment;
use App\Models\Reservation;
use App\Models\Room;
use Carbon\CarbonInterface;

class NightAuditService
{
    public function summary(int $propertyId, CarbonInterface $date): array
    {
        $dateString = $date->toDateString();

        $totalRooms = Room::query()
            ->where('property_id', $propertyId)
            ->where('is_active', true)
            ->count();

        $arrivals = Reservation::query()
            ->where('property_id', $propertyId)
            ->whereDate('check_in', $dateString)
            ->count();

        $departures = Reservation::query()
            ->where('property_id', $propertyId)
            ->whereDate('check_out', $dateString)
            ->count();

        $inHouse = Reservation::query()
            ->where('property_id', $propertyId)
            ->where('status', 'checked_in')
            ->whereDate('check_in', '<=', $dateString)
            ->whereDate('check_out', '>', $dateString)
            ->count();

        $occupancyRate = $totalRooms > 0
            ? round(($inHouse / $totalRooms) * 100, 1)
            : 0.0;

        $chargesTotal = Charge::query()
            ->whereHas('folio.reservation', fn ($query) => $query->where('property_id', $propertyId))
            ->whereDate('posted_at', $dateString)
            ->sum('amount');

        $paymentsTotal = Payment::query()
            ->whereHas('folio.reservation', fn ($query) => $query->where('property_id', $propertyId))
            ->whereDate('received_at', $dateString)
            ->sum('amount');

        return [
            'date' => $dateString,
            'total_rooms' => $totalRooms,
            'arrivals' => $arrivals,
            'departures' => $departures,
            'in_house' => $inHouse,
            'occupancy_rate' => $occupancyRate,
            'charges_total' => $chargesTotal,
            'payments_total' => $paymentsTotal,
        ];
    }
}
