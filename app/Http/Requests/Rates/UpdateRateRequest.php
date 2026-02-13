<?php

namespace App\Http\Requests\Rates;

use App\Models\Rate;
use Illuminate\Support\Facades\Log;
use Illuminate\Foundation\Http\FormRequest;

class UpdateRateRequest extends FormRequest
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
        return [
            'room_type_id' => ['required', 'integer', 'exists:room_types,id'],
            'name' => ['required', 'string', 'max:120'],
            'type' => ['required', 'in:base,seasonal,special'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'rate' => ['required', 'integer', 'min:0'],
            'min_stay' => ['required', 'integer', 'min:1', 'max:30'],
            'days_of_week' => ['nullable', 'array'],
            'days_of_week.*' => ['integer', 'min:1', 'max:7'],
            'length_of_stay_min' => ['nullable', 'integer', 'min:1', 'max:60'],
            'length_of_stay_max' => ['nullable', 'integer', 'min:1', 'max:60'],
            'adjustment_type' => ['nullable', 'in:override,percent,amount'],
            'adjustment_value' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $roomTypeId = $this->input('room_type_id');
            $type = $this->input('type');
            $startDate = $this->input('start_date');
            $endDate = $this->input('end_date');

            if (! $roomTypeId || ! $type || ! $startDate || ! $endDate) {
                return;
            }

            if (! $this->isRateActive()) {
                return;
            }

            $rate = $this->route('rate');
            $rateId = $rate instanceof Rate ? $rate->id : $rate;

            $overlaps = Rate::query()
                ->where('room_type_id', $roomTypeId)
                ->where('type', $type)
                ->where('is_active', true)
                ->when($rateId, fn ($query) => $query->where('id', '!=', $rateId))
                ->where(function ($query) use ($startDate, $endDate) {
                    $query->where('start_date', '<=', $endDate)
                        ->where('end_date', '>=', $startDate);
                })
                ->exists();

            if ($overlaps) {
                Log::warning('rate.overlap_detected', [
                    'room_type_id' => $roomTypeId,
                    'type' => $type,
                    'start_date' => $startDate,
                    'end_date' => $endDate,
                    'rate_id' => $rateId,
                    'source' => 'update',
                ]);
                $validator->errors()->add(
                    'start_date',
                    'The selected date range overlaps with an existing rate.'
                );
            }
        });
    }

    private function isRateActive(): bool
    {
        $value = $this->input('is_active');

        if ($value === null) {
            return true;
        }

        return filter_var($value, FILTER_VALIDATE_BOOLEAN);
    }
}
