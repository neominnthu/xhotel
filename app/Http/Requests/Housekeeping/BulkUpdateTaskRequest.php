<?php

namespace App\Http\Requests\Housekeeping;

use App\Models\HousekeepingTask;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class BulkUpdateTaskRequest extends FormRequest
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
            'task_ids' => ['required', 'array', 'min:1'],
            'task_ids.*' => ['integer', 'exists:housekeeping_tasks,id'],
            'status' => ['nullable', Rule::in(['open', 'in_progress', 'completed'])],
            'assigned_to' => ['nullable', 'integer', 'exists:users,id'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            $status = $this->input('status');
            $assignedTo = $this->input('assigned_to');

            if ($status === null && $assignedTo === null) {
                $validator->errors()->add('status', 'Provide a status or assignee for bulk update.');
            }
        });
    }
}
