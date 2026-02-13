<?php

namespace App\Http\Requests\Stays;

use Illuminate\Foundation\Http\FormRequest;

class CheckInRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'room_id' => ['required', 'integer', 'exists:rooms,id'],
            'guest' => ['nullable', 'array'],
            'guest.first_name' => ['required_with:guest', 'string', 'max:255'],
            'guest.last_name' => ['required_with:guest', 'string', 'max:255'],
            'guest.email' => ['nullable', 'email', 'max:120'],
            'guest.phone' => ['nullable', 'string', 'max:20'],
            'guest.phone_country_code' => ['nullable', 'string', 'max:5'],
            'guest.date_of_birth' => ['nullable', 'date'],
            'guest.nationality' => ['nullable', 'string', 'max:100'],
            'guest.passport_number' => ['nullable', 'string', 'max:50'],
            'guest.id_card_number' => ['nullable', 'string', 'max:50'],
            'guest.address' => ['nullable', 'string'],
            'adult_count' => ['nullable', 'integer', 'min:1', 'max:10'],
            'child_count' => ['nullable', 'integer', 'min:0', 'max:10'],
            'id_document_type' => ['nullable', 'in:passport,id_card,driving_license'],
            'id_document_number' => ['nullable', 'string', 'max:50'],
            'id_document_issued_by' => ['nullable', 'string', 'max:100'],
            'id_document_expiry' => ['nullable', 'date', 'after:today'],
            'security_deposit_amount' => ['nullable', 'integer', 'min:0'],
            'security_deposit_currency' => ['nullable', 'string', 'size:3'],
            'key_card_number' => ['nullable', 'string', 'max:50'],
            'special_requests' => ['nullable', 'string'],
            'guest_preferences' => ['nullable', 'array'],
            'notes' => ['nullable', 'string'],
            'deposit.amount' => ['nullable', 'integer', 'min:0'],
            'deposit.currency' => ['nullable', 'string', 'size:3'],
        ];
    }
}
