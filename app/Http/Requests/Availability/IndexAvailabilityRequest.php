<?php

namespace App\Http\Requests\Availability;

use Illuminate\Foundation\Http\FormRequest;

class IndexAvailabilityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'check_in' => ['required', 'date', 'after_or_equal:today'],
            'check_out' => ['required', 'date', 'after:check_in'],
            'adults' => ['nullable', 'integer', 'min:1', 'max:10'],
            'children' => ['nullable', 'integer', 'min:0', 'max:10'],
            'room_type_id' => ['nullable', 'integer', 'exists:room_types,id'],
        ];
    }

    public function prepareForValidation(): void
    {
        $this->merge([
            'adults' => $this->input('adults', 1),
            'children' => $this->input('children', 0),
        ]);
    }
}
