<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\Stay;
use App\Models\HousekeepingTask;
use App\Models\Folio;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $propertyId = $user?->property_id;

        $cacheKey = "dashboard.{$propertyId}." . today()->toDateString();

        $data = Cache::remember($cacheKey, now()->addMinutes(15), function () use ($propertyId) {
            return [
                'today_arrivals' => $this->getTodayArrivals($propertyId),
                'today_departures' => $this->getTodayDepartures($propertyId),
                'current_occupancy' => $this->getCurrentOccupancy($propertyId),
                'pending_housekeeping' => $this->getPendingHousekeeping($propertyId),
                'unpaid_folios' => $this->getUnpaidFolios($propertyId),
                'recent_activity' => $this->getRecentActivity($propertyId),
            ];
        });

        return inertia('dashboard', $data);
    }

    private function getTodayArrivals($propertyId)
    {
        return Reservation::query()
            ->when($propertyId, fn ($q) => $q->where('property_id', $propertyId))
            ->whereDate('check_in', today())
            ->whereIn('status', ['confirmed', 'pending'])
            ->with(['guest', 'roomType'])
            ->orderBy('check_in')
            ->get()
            ->map(fn ($reservation) => [
                'id' => $reservation->id,
                'code' => $reservation->code,
                'guest_name' => $reservation->guest?->name,
                'room_type' => $reservation->roomType?->name['en'],
                'check_in' => $reservation->check_in->toDateString(),
            ]);
    }

    private function getTodayDepartures($propertyId)
    {
        return Reservation::query()
            ->when($propertyId, fn ($q) => $q->where('property_id', $propertyId))
            ->whereDate('check_out', today())
            ->where('status', 'checked_in')
            ->with(['guest', 'roomType', 'stay'])
            ->orderBy('check_out')
            ->get()
            ->map(fn ($reservation) => [
                'id' => $reservation->id,
                'code' => $reservation->code,
                'guest_name' => $reservation->guest?->name,
                'room_type' => $reservation->roomType?->name['en'],
                'check_out' => $reservation->check_out->toDateString(),
                'folio_balance' => $reservation->folios->first()?->balance ?? 0,
            ]);
    }

    private function getCurrentOccupancy($propertyId)
    {
        $totalRooms = \App\Models\Room::query()
            ->when($propertyId, fn ($q) => $q->where('property_id', $propertyId))
            ->where('is_active', true)
            ->count();

        $occupiedRooms = \App\Models\Room::query()
            ->when($propertyId, fn ($q) => $q->where('property_id', $propertyId))
            ->where('status', 'occupied')
            ->count();

        $occupancyRate = $totalRooms > 0 ? round(($occupiedRooms / $totalRooms) * 100, 1) : 0;

        return [
            'total_rooms' => $totalRooms,
            'occupied_rooms' => $occupiedRooms,
            'occupancy_rate' => $occupancyRate,
        ];
    }

    private function getPendingHousekeeping($propertyId)
    {
        return HousekeepingTask::query()
            ->when($propertyId, fn ($q) => $q->whereHas('room', fn ($rq) => $rq->where('property_id', $propertyId)))
            ->whereIn('status', ['open', 'in_progress'])
            ->with(['room', 'assignee'])
            ->orderBy('priority', 'desc')
            ->orderBy('due_at')
            ->limit(10)
            ->get()
            ->map(fn ($task) => [
                'id' => $task->id,
                'type' => $task->type,
                'room_number' => $task->room?->number,
                'priority' => $task->priority,
                'assignee' => $task->assignee?->name,
                'due_at' => $task->due_at?->toDateString(),
                'is_overdue' => $task->isOverdue(),
            ]);
    }

    private function getUnpaidFolios($propertyId)
    {
        return Folio::query()
            ->when($propertyId, fn ($q) => $q->whereHas('reservation', fn ($rq) => $rq->where('property_id', $propertyId)))
            ->where('status', 'open')
            ->where('balance', '>', 0)
            ->with(['reservation.guest'])
            ->orderBy('balance', 'desc')
            ->limit(5)
            ->get()
            ->map(fn ($folio) => [
                'id' => $folio->id,
                'reservation_code' => $folio->reservation?->code,
                'guest_name' => $folio->reservation?->guest?->name,
                'balance' => $folio->balance,
                'currency' => $folio->currency,
            ]);
    }

    private function getRecentActivity($propertyId)
    {
        // This would typically come from audit logs
        // For now, return recent reservations and stays
        $recentReservations = Reservation::query()
            ->when($propertyId, fn ($q) => $q->where('property_id', $propertyId))
            ->with(['guest'])
            ->orderBy('updated_at', 'desc')
            ->limit(5)
            ->get()
            ->map(fn ($reservation) => [
                'type' => 'reservation',
                'action' => 'updated',
                'description' => "Reservation {$reservation->code} for {$reservation->guest?->name}",
                'timestamp' => $reservation->updated_at->diffForHumans(),
            ]);

        return $recentReservations;
    }
}
