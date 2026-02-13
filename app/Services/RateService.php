<?php

namespace App\Services;

use App\Models\Charge;
use App\Models\Folio;
use App\Models\Rate;
use App\Models\Reservation;
use Carbon\Carbon;

class RateService
{
    public function calculateRate(Reservation $reservation): array
    {
        return $this->calculateRateForDates(
            $reservation,
            $reservation->check_in?->toDateString(),
            $reservation->check_out?->toDateString()
        );
    }

    public function calculateRateForDates(Reservation $reservation, ?string $checkInDate, ?string $checkOutDate): array
    {
        if (! $checkInDate || ! $checkOutDate) {
            return [
                'rate' => 0,
                'nights' => 0,
                'subtotal' => 0,
                'tax_amount' => 0,
                'total' => 0,
                'currency' => 'MMK',
            ];
        }

        $checkIn = Carbon::parse($checkInDate);
        $checkOut = Carbon::parse($checkOutDate);
        $nights = $checkIn->diffInDays($checkOut);

        $rates = Rate::active()
            ->forRoomType($reservation->room_type_id)
            ->forDateRange($checkInDate, $checkOutDate)
            ->orderByRaw("CASE type WHEN 'special' THEN 1 WHEN 'seasonal' THEN 2 WHEN 'base' THEN 3 END")
            ->get();

        $roomType = $reservation->roomType;
        $defaultRate = $roomType ? $roomType->base_rate : 0;

        $rate = $rates->first(function (Rate $rate) use ($checkIn, $nights) {
            return $this->rateMatches($rate, $checkIn, $nights);
        });

        $baseRate = $rate ? $rate->rate : $defaultRate;
        $rateAmount = $rate ? $this->applyAdjustment($rate, $baseRate) : $baseRate;

        $subtotal = $rateAmount * $nights;
        $serviceChargeRate = (float) config('billing.service_charge_rate', 0.0);
        $taxRate = (float) config('billing.tax_rate', 0.0);
        $serviceChargeAmount = (int) round($subtotal * $serviceChargeRate);
        $taxableAmount = $subtotal + $serviceChargeAmount;
        $taxAmount = (int) round($taxableAmount * $taxRate);
        $total = $subtotal + $serviceChargeAmount + $taxAmount;
        $roundedTotal = $this->roundTotal($total);

        if ($roundedTotal !== $total) {
            $taxAmount += $roundedTotal - $total;
            $total = $roundedTotal;
        }

        return [
            'rate' => $rateAmount,
            'nights' => $nights,
            'subtotal' => $subtotal,
            'service_charge_amount' => $serviceChargeAmount,
            'charge_amount' => $subtotal + $serviceChargeAmount,
            'tax_amount' => $taxAmount,
            'total' => $total,
            'currency' => 'MMK',
            'tax_rate' => $taxRate,
            'service_charge_rate' => $serviceChargeRate,
        ];
    }

    private function rateMatches(Rate $rate, Carbon $checkIn, int $nights): bool
    {
        if (! empty($rate->days_of_week)) {
            $day = $checkIn->dayOfWeekIso;
            if (! in_array($day, $rate->days_of_week, true)) {
                return false;
            }
        }

        if ($rate->length_of_stay_min && $nights < $rate->length_of_stay_min) {
            return false;
        }

        if ($rate->length_of_stay_max && $nights > $rate->length_of_stay_max) {
            return false;
        }

        return true;
    }

    private function applyAdjustment(Rate $rate, int $baseRate): int
    {
        if (! $rate->adjustment_type || $rate->adjustment_value === null) {
            return $baseRate;
        }

        if ($rate->adjustment_type === 'override') {
            return max((int) $rate->adjustment_value, 0);
        }

        if ($rate->adjustment_type === 'percent') {
            $percent = (int) $rate->adjustment_value;
            $percent = max(min($percent, 100), 0);

            return (int) round($baseRate * (100 - $percent) / 100);
        }

        return max($baseRate + (int) $rate->adjustment_value, 0);
    }

    public function generateFolioCharges(Reservation $reservation, Folio $folio, $actor = null): void
    {
        $calculation = $this->calculateRate($reservation);

        // Room charge
        Charge::create([
            'folio_id' => $folio->id,
            'type' => 'accommodation',
            'amount' => $calculation['charge_amount'],
            'currency' => $calculation['currency'],
            'tax_amount' => $calculation['tax_amount'],
            'description' => "Room charge for {$calculation['nights']} nights",
            'posted_at' => now(),
            'created_by' => $actor?->id,
        ]);

        $folio->increment('total', $calculation['total']);
        $folio->increment('balance', $calculation['total']);
    }

    private function roundTotal(int $total): int
    {
        $unit = (int) config('billing.rounding_unit', 1);
        $method = (string) config('billing.rounding_method', 'nearest');

        if ($unit <= 1) {
            return $total;
        }

        $factor = $total / $unit;

        return match ($method) {
            'up' => (int) ceil($factor) * $unit,
            'down' => (int) floor($factor) * $unit,
            default => (int) round($factor) * $unit,
        };
    }
}
