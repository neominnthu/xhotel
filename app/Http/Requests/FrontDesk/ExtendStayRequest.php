<?php

namespace App\Http\Requests\FrontDesk;

use Illuminate\Foundation\Http\FormRequest;

class ExtendStayRequest extends FormRequest
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
            'check_out' => ['required', 'date', 'after:today'],
            'notes' => ['nullable', 'string', 'max:255'],
        ];
    }
}
