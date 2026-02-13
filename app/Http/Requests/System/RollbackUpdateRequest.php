<?php

namespace App\Http\Requests\System;

use App\Models\SystemUpdate;
use Illuminate\Foundation\Http\FormRequest;

class RollbackUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = $this->user();

        return $user?->can('create', SystemUpdate::class) ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'update_id' => ['nullable', 'integer', 'exists:system_updates,id'],
            'confirm_db_restore' => ['nullable', 'boolean'],
        ];
    }
}
