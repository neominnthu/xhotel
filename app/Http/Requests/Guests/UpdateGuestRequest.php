<?php

namespace App\Http\Requests\Guests;

use App\Models\Guest;
use Illuminate\Foundation\Http\FormRequest;

class UpdateGuestRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = $this->user();
        $guest = $this->route('guest');

        return $user && $guest instanceof Guest
            ? $user->can('update', $guest)
            : false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['nullable', 'string', 'max:120'],
            'first_name' => ['nullable', 'string', 'max:120'],
            'last_name' => ['nullable', 'string', 'max:120'],
            'email' => ['nullable', 'email', 'max:120'],
            'phone' => ['nullable', 'string', 'max:32'],
            'phone_country_code' => ['nullable', 'string', 'max:8'],
            'date_of_birth' => ['nullable', 'date'],
            'gender' => ['nullable', 'string', 'max:16'],
            'nationality' => ['nullable', 'string', 'max:64'],
            'id_type' => ['nullable', 'in:nrc,passport,other'],
            'id_number' => ['nullable', 'string', 'max:64'],
            'passport_number' => ['nullable', 'string', 'max:64'],
            'id_card_number' => ['nullable', 'string', 'max:64'],
            'address' => ['nullable', 'string', 'max:500'],
            'city' => ['nullable', 'string', 'max:64'],
            'country' => ['nullable', 'string', 'max:64'],
            'postal_code' => ['nullable', 'string', 'max:20'],
            'company' => ['nullable', 'string', 'max:120'],
            'vip_status' => ['nullable', 'in:vip,vvip'],
            'preferences' => ['nullable', 'array'],
            'preferences.*' => ['string', 'max:120'],
            'special_requests' => ['nullable', 'string', 'max:500'],
            'notes' => ['nullable', 'string', 'max:500'],
            'is_blacklisted' => ['nullable', 'boolean'],
            'blacklist_reason' => ['nullable', 'string', 'max:500', 'required_if:is_blacklisted,true'],
        ];
    }
}
