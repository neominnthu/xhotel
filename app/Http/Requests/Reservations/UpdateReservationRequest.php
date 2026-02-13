<?php

namespace App\Http\Requests\Reservations;

use Illuminate\Foundation\Http\FormRequest;

class UpdateReservationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'check_in' => ['nullable', 'date', 'after_or_equal:today'],
            'check_out' => ['nullable', 'date', 'after:check_in'],
            'adults' => ['nullable', 'integer', 'min:1', 'max:10'],
            'children' => ['nullable', 'integer', 'min:0', 'max:10'],
            'room_id' => ['nullable', 'integer', 'exists:rooms,id'],
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $reservation = $this->route('reservation');
            $checkIn = $this->input('check_in') ?? $reservation?->check_in?->toDateString();
            $checkOut = $this->input('check_out');

            if ($checkIn && $checkOut && \Carbon\Carbon::parse($checkOut)->lte(
                \Carbon\Carbon::parse($checkIn)
            )) {
                $validator->errors()->add('check_out', 'Check-out must be after check-in.');
            }
        });
    }
}
