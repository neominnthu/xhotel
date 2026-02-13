<?php

namespace App\Http\Requests\Guests;

use App\Models\Guest;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MergeGuestRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = $this->user();
        $guest = $this->route('guest');

        return $user && $guest instanceof Guest
            ? $user->can('update', $guest)
            : false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $guest = $this->route('guest');
        $guestId = $guest instanceof Guest ? $guest->id : null;

        return [
            'merge_ids' => ['required', 'array', 'min:1', 'distinct'],
            'merge_ids.*' => [
                'integer',
                'exists:guests,id',
                Rule::when($guestId, Rule::notIn([$guestId])),
            ],
        ];
    }
}
