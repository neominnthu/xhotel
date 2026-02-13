<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\ExchangeRates\StoreExchangeRateRequest;
use App\Http\Requests\ExchangeRates\UpdateExchangeRateRequest;
use App\Models\ExchangeRate;
use App\Models\Property;
use App\Services\AuditLogService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class ExchangeRatePageController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', ExchangeRate::class);

        $propertyId = $request->user()?->property_id;
        $property = $propertyId ? Property::query()->find($propertyId) : null;
        $defaultCurrency = $property?->default_currency ?? 'MMK';

        $exchangeRates = ExchangeRate::query()
            ->when($propertyId, fn ($query) => $query->where('property_id', $propertyId))
            ->orderByDesc('effective_date')
            ->orderBy('quote_currency')
            ->get();

        return Inertia::render('settings/exchange-rates/index', [
            'defaultCurrency' => $defaultCurrency,
            'exchangeRates' => $exchangeRates->map(fn (ExchangeRate $rate) => [
                'id' => $rate->id,
                'base_currency' => $rate->base_currency,
                'quote_currency' => $rate->quote_currency,
                'rate' => (float) $rate->rate,
                'effective_date' => $rate->effective_date?->toDateString(),
                'source' => $rate->source,
                'is_active' => $rate->is_active,
            ]),
        ]);
    }

    public function store(
        StoreExchangeRateRequest $request,
        AuditLogService $auditLog
    ): RedirectResponse {
        $this->authorize('create', ExchangeRate::class);

        $data = $request->validated();
        $propertyId = $request->user()?->property_id ?? 1;

        $rate = ExchangeRate::create([
            'property_id' => $propertyId,
            'base_currency' => strtoupper($data['base_currency']),
            'quote_currency' => strtoupper($data['quote_currency']),
            'rate' => $data['rate'],
            'effective_date' => $data['effective_date'],
            'source' => $data['source'] ?? null,
            'is_active' => $data['is_active'] ?? true,
        ]);

        if ($actor = $request->user()) {
            $auditLog->record($actor, 'exchange_rate.created', 'exchange_rate', [
                'exchange_rate_id' => $rate->id,
                'base_currency' => $rate->base_currency,
                'quote_currency' => $rate->quote_currency,
                'effective_date' => $rate->effective_date?->toDateString(),
                'rate' => $rate->rate,
            ]);

            Log::info('metrics.exchange_rate.created', [
                'exchange_rate_id' => $rate->id,
                'property_id' => $rate->property_id,
                'user_id' => $actor->id,
            ]);
        }

        return back()->with('success', 'လဲလှယ်နှုန်း ထည့်သွင်းပြီးပါပြီ။');
    }

    public function update(
        UpdateExchangeRateRequest $request,
        ExchangeRate $exchangeRate,
        AuditLogService $auditLog
    ): RedirectResponse {
        $this->authorize('update', $exchangeRate);

        $data = $request->validated();

        $exchangeRate->update([
            'base_currency' => strtoupper($data['base_currency']),
            'quote_currency' => strtoupper($data['quote_currency']),
            'rate' => $data['rate'],
            'effective_date' => $data['effective_date'],
            'source' => $data['source'] ?? null,
            'is_active' => $data['is_active'] ?? true,
        ]);

        if ($actor = $request->user()) {
            $auditLog->record($actor, 'exchange_rate.updated', 'exchange_rate', [
                'exchange_rate_id' => $exchangeRate->id,
                'base_currency' => $exchangeRate->base_currency,
                'quote_currency' => $exchangeRate->quote_currency,
                'effective_date' => $exchangeRate->effective_date?->toDateString(),
                'rate' => $exchangeRate->rate,
            ]);

            Log::info('metrics.exchange_rate.updated', [
                'exchange_rate_id' => $exchangeRate->id,
                'property_id' => $exchangeRate->property_id,
                'user_id' => $actor->id,
            ]);
        }

        return back()->with('success', 'လဲလှယ်နှုန်း ပြင်ဆင်ပြီးပါပြီ။');
    }

    public function destroy(
        ExchangeRate $exchangeRate,
        AuditLogService $auditLog,
        Request $request
    ): RedirectResponse {
        $this->authorize('delete', $exchangeRate);

        if ($actor = $request->user()) {
            $auditLog->record($actor, 'exchange_rate.deleted', 'exchange_rate', [
                'exchange_rate_id' => $exchangeRate->id,
                'base_currency' => $exchangeRate->base_currency,
                'quote_currency' => $exchangeRate->quote_currency,
                'effective_date' => $exchangeRate->effective_date?->toDateString(),
            ]);

            Log::info('metrics.exchange_rate.deleted', [
                'exchange_rate_id' => $exchangeRate->id,
                'property_id' => $exchangeRate->property_id,
                'user_id' => $actor->id,
            ]);
        }

        $exchangeRate->delete();

        return back()->with('success', 'လဲလှယ်နှုန်း ဖျက်ပြီးပါပြီ။');
    }
}
