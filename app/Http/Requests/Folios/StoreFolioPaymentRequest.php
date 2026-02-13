<?php

namespace App\Http\Requests\Folios;

use Illuminate\Foundation\Http\FormRequest;

class StoreFolioPaymentRequest extends FormRequest
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
            'method' => ['required', 'in:cash,card,bank_transfer,digital_wallet,check,voucher,other'],
            'amount' => ['required', 'integer', 'min:0'],
            'currency' => ['required', 'string', 'size:3'],
            'exchange_rate' => ['nullable', 'numeric', 'min:0.000001'],
            'reference' => ['nullable', 'string', 'max:64'],
            'card_last_four' => ['nullable', 'string', 'size:4', 'regex:/^\d{4}$/'],
            'card_type' => ['nullable', 'in:visa,mastercard,amex,discover,other'],
            'bank_details' => ['nullable', 'string', 'max:255'],
            'wallet_type' => ['nullable', 'in:paypal,apple_pay,google_pay,venmo,zelle,other'],
            'check_number' => ['nullable', 'string', 'max:64'],
        ];
    }
}
