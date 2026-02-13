<?php

namespace App\Http\Requests\Housekeeping;

use App\Models\HousekeepingTask;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class IndexTaskRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->can('viewAny', HousekeepingTask::class) ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'filter.status' => ['nullable', Rule::in(['open', 'in_progress', 'completed'])],
            'filter.priority' => ['nullable', Rule::in(['low', 'normal', 'high'])],
            'filter.type' => ['nullable', Rule::in(['clean', 'inspect', 'maintenance'])],
            'filter.room_id' => ['nullable', 'integer', 'exists:rooms,id'],
            'filter.assigned_to' => ['nullable', 'string', 'regex:/^(unassigned|\d+)$/'],
            'filter.room_status' => ['nullable', Rule::in(['clean', 'dirty', 'inspected'])],
            'filter.due_from' => ['nullable', 'date'],
            'filter.due_to' => ['nullable', 'date'],
            'filter.completed_from' => ['nullable', 'date'],
            'filter.completed_to' => ['nullable', 'date'],
            'filter.overdue' => ['nullable', 'boolean'],
            'filter.sort' => ['nullable', Rule::in(['due_at', 'priority', 'room_number'])],
            'filter.sort_dir' => ['nullable', Rule::in(['asc', 'desc'])],
            'page' => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $sortDir = $this->input('filter.sort_dir');
        if ($sortDir && ! in_array($sortDir, ['asc', 'desc'], true)) {
            $this->merge([
                'filter' => array_merge($this->input('filter', []), ['sort_dir' => 'asc']),
            ]);
        }

        $sort = $this->input('filter.sort');
        if ($sort && ! in_array($sort, ['due_at', 'priority', 'room_number'], true)) {
            $this->merge([
                'filter' => array_merge($this->input('filter', []), ['sort' => 'due_at']),
            ]);
        }
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            $assignedTo = $this->input('filter.assigned_to');
            if (! $assignedTo || $assignedTo === 'unassigned') {
                return;
            }

            if (! User::whereKey($assignedTo)->exists()) {
                $validator->errors()->add('filter.assigned_to', 'The selected assignee is invalid.');
            }
        });
    }
}
