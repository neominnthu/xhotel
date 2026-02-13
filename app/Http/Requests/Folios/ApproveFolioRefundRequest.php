<?php

namespace App\Http\Requests\Folios;

use Illuminate\Foundation\Http\FormRequest;

class ApproveFolioRefundRequest extends FormRequest
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
            'reference' => ['nullable', 'string', 'max:64'],
        ];
    }
}
