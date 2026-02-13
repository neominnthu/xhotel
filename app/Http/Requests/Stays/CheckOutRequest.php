<?php

namespace App\Http\Requests\Stays;

use Illuminate\Foundation\Http\FormRequest;

class CheckOutRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'payment.method' => ['nullable', 'in:cash,card,transfer'],
            'payment.amount' => ['nullable', 'integer', 'min:0'],
            'payment.currency' => ['nullable', 'string', 'size:3'],
            'payment.exchange_rate' => ['nullable', 'numeric', 'min:0.000001'],
            'notes' => ['nullable', 'string'],
            'key_returned' => ['boolean'],
            'refund_deposit' => ['boolean'],
        ];
    }
}
