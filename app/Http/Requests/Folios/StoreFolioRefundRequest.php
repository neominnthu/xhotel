<?php

namespace App\Http\Requests\Folios;

use Illuminate\Foundation\Http\FormRequest;

class StoreFolioRefundRequest extends FormRequest
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
            'amount' => ['required', 'integer', 'min:1'],
            'currency' => ['required', 'string', 'size:3'],
            'exchange_rate' => ['nullable', 'numeric', 'min:0.000001'],
            'reference' => ['nullable', 'string', 'max:64'],
            'reason' => ['nullable', 'string', 'max:255'],
            'payment_id' => ['nullable', 'integer', 'exists:payments,id'],
        ];
    }
}
