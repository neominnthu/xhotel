<?php

namespace App\Http\Requests\System;

use App\Models\SystemUpdate;
use Illuminate\Foundation\Http\FormRequest;

class ApplyUpdateRequest extends FormRequest
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
            'release_tag' => ['nullable', 'string', 'max:64'],
            'version_to' => ['nullable', 'string', 'max:32'],
            'notes' => ['nullable', 'string', 'max:255'],
        ];
    }
}
