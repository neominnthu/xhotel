<?php

namespace App\Http\Requests\CancellationPolicies;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCancellationPolicyRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:120'],
            'room_type_id' => ['nullable', 'integer', 'exists:room_types,id'],
            'deadline_hours' => ['required', 'integer', 'min:0', 'max:720'],
            'penalty_type' => ['required', 'in:flat,percent,first_night'],
            'penalty_amount' => ['required_if:penalty_type,flat', 'integer', 'min:0'],
            'penalty_percent' => ['required_if:penalty_type,percent', 'integer', 'between:0,100'],
            'is_active' => ['nullable', 'boolean'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $roomTypeId = $this->input('room_type_id');

        if ($roomTypeId === '' || $roomTypeId === 'all') {
            $this->merge(['room_type_id' => null]);
        }
    }
}
