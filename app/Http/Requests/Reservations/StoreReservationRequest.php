<?php

namespace App\Http\Requests\Reservations;

use Illuminate\Foundation\Http\FormRequest;

class StoreReservationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'guest.name' => ['required', 'string', 'max:120'],
            'guest.phone' => ['nullable', 'string', 'max:32'],
            'guest.id_type' => ['nullable', 'in:nrc,passport,other'],
            'guest.id_number' => ['nullable', 'string', 'max:64'],
            'check_in' => ['required', 'date', 'after_or_equal:today'],
            'check_out' => ['required', 'date', 'after:check_in'],
            'room_type_id' => ['required', 'integer', 'exists:room_types,id'],
            'room_id' => ['nullable', 'integer', 'exists:rooms,id'],
            'hold_id' => ['nullable', 'integer', 'exists:availability_holds,id'],
            'adults' => ['required', 'integer', 'min:1', 'max:10'],
            'children' => ['nullable', 'integer', 'min:0', 'max:10'],
            'source' => ['required', 'in:walk_in,phone,ota,corporate'],
            'special_requests' => ['nullable', 'string', 'max:500'],
            'currency' => ['nullable', 'string', 'size:3'],
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $checkIn = $this->input('check_in');
            $checkOut = $this->input('check_out');
            $roomTypeId = $this->input('room_type_id');

            if ($checkIn && $checkOut && $roomTypeId) {
                $nights = \Carbon\Carbon::parse($checkIn)->diffInDays(\Carbon\Carbon::parse($checkOut));

                $rate = \App\Models\Rate::active()
                    ->forRoomType($roomTypeId)
                    ->forDateRange($checkIn, $checkOut)
                    ->orderBy('type')
                    ->first();

                if ($rate) {
                    if ($nights < $rate->min_stay) {
                        $validator->errors()->add('check_out', "Minimum stay of {$rate->min_stay} nights required for this rate.");
                    }

                    if ($rate->length_of_stay_min && $nights < $rate->length_of_stay_min) {
                        $validator->errors()->add('check_out', "Minimum stay of {$rate->length_of_stay_min} nights required for this rate.");
                    }

                    if ($rate->length_of_stay_max && $nights > $rate->length_of_stay_max) {
                        $validator->errors()->add('check_out', "Maximum stay of {$rate->length_of_stay_max} nights allowed for this rate.");
                    }
                }
            }
        });
    }
}
