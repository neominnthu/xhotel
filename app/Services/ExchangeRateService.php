<?php

namespace App\Services;

use App\Models\ExchangeRate;
use Carbon\CarbonInterface;

class ExchangeRateService
{
    public function resolveRate(
        ?int $propertyId,
        string $baseCurrency,
        string $quoteCurrency,
        ?CarbonInterface $date = null
    ): ?float {
        if (strtoupper($baseCurrency) === strtoupper($quoteCurrency)) {
            return 1.0;
        }

        $date = $date ?? now();

        $rate = ExchangeRate::query()
            ->when($propertyId, fn ($query) => $query->where('property_id', $propertyId))
            ->where('base_currency', strtoupper($baseCurrency))
            ->where('quote_currency', strtoupper($quoteCurrency))
            ->whereDate('effective_date', '<=', $date->toDateString())
            ->where('is_active', true)
            ->orderByDesc('effective_date')
            ->value('rate');

        return $rate === null ? null : (float) $rate;
    }
}
