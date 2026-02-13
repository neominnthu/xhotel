<?php

namespace App\Http\Requests\ExchangeRates;

use App\Models\ExchangeRate;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateExchangeRateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        /** @var ExchangeRate $exchangeRate */
        $exchangeRate = $this->route('exchangeRate');
        $propertyId = $this->user()?->property_id ?? 1;
        $baseCurrency = strtoupper((string) $this->input('base_currency'));
        $quoteCurrency = strtoupper((string) $this->input('quote_currency'));

        return [
            'base_currency' => ['required', 'string', 'size:3'],
            'quote_currency' => ['required', 'string', 'size:3', 'different:base_currency'],
            'rate' => ['required', 'numeric', 'min:0.000001'],
            'effective_date' => [
                'required',
                'date',
                Rule::unique('exchange_rates', 'effective_date')
                    ->ignore($exchangeRate?->id)
                    ->where(fn ($query) => $query
                        ->where('property_id', $propertyId)
                        ->where('base_currency', $baseCurrency)
                        ->where('quote_currency', $quoteCurrency)
                        ->whereNull('deleted_at')),
            ],
            'source' => ['nullable', 'string', 'max:64'],
            'is_active' => ['nullable', 'boolean'],
        ];
    }
}
