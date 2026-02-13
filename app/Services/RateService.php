<?php

namespace App\Services;

use App\Models\Rate;
use App\Models\Reservation;
use App\Models\Folio;
use App\Models\Charge;
use Carbon\Carbon;

class RateService
{
    public function calculateRate(Reservation $reservation): array
    {
        $checkIn = Carbon::parse($reservation->check_in);
        $checkOut = Carbon::parse($reservation->check_out);
        $nights = $checkIn->diffInDays($checkOut);

        $rates = Rate::active()
            ->forRoomType($reservation->room_type_id)
            ->forDateRange($reservation->check_in, $reservation->check_out)
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
        $taxRate = 0.05; // 5% tax
        $taxAmount = (int) round($subtotal * $taxRate);
        $total = $subtotal + $taxAmount;

        return [
            'rate' => $rateAmount,
            'nights' => $nights,
            'subtotal' => $subtotal,
            'tax_amount' => $taxAmount,
            'total' => $total,
            'currency' => 'MMK',
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
            'amount' => $calculation['subtotal'],
            'currency' => $calculation['currency'],
            'tax_amount' => $calculation['tax_amount'],
            'description' => "Room charge for {$calculation['nights']} nights",
            'posted_at' => now(),
            'created_by' => $actor?->id,
        ]);

        $folio->increment('total', $calculation['total']);
        $folio->increment('balance', $calculation['total']);
    }
}
