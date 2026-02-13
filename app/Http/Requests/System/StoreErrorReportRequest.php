<?php

namespace App\Http\Requests\System;

use App\Models\ErrorReport;
use Illuminate\Foundation\Http\FormRequest;

class StoreErrorReportRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = $this->user();

        return $user?->can('create', ErrorReport::class) ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:200'],
            'severity' => ['nullable', 'in:low,medium,high,critical'],
            'message' => ['nullable', 'string', 'max:2000'],
            'trace_id' => ['nullable', 'string', 'max:64'],
            'url' => ['nullable', 'string', 'max:255'],
            'app_version' => ['nullable', 'string', 'max:32'],
            'payload' => ['nullable', 'array'],
        ];
    }
}
