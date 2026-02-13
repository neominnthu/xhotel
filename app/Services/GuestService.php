<?php

namespace App\Services;

use App\Models\Guest;
use App\Models\Reservation;
use App\Models\Stay;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class GuestService
{
    public function __construct(public AuditLogService $auditLogService)
    {
    }

    public function create(array $data, User $actor): Guest
    {
        return DB::transaction(function () use ($data, $actor) {
            $payload = $this->buildPayload($data, $actor, true);
            $guest = Guest::create($payload);

            $this->auditLogService->record($actor, 'guest.created', 'guest', [
                'guest_id' => $guest->id,
            ]);

            return $guest;
        });
    }

    public function update(Guest $guest, array $data, User $actor): Guest
    {
        return DB::transaction(function () use ($guest, $data, $actor) {
            $payload = $this->buildPayload($data, $actor, false);
            $guest->fill($payload);
            $guest->save();

            $this->auditLogService->record($actor, 'guest.updated', 'guest', [
                'guest_id' => $guest->id,
            ]);

            return $guest->fresh();
        });
    }

    public function merge(Guest $primary, Collection $mergeGuests, User $actor): Guest
    {
        if ($mergeGuests->isEmpty()) {
            return $primary;
        }

        return DB::transaction(function () use ($primary, $mergeGuests, $actor) {
            $mergeGuests = $mergeGuests->where('id', '!=', $primary->id)->values();

            if ($mergeGuests->isEmpty()) {
                return $primary;
            }

            $mergeIds = $mergeGuests->pluck('id')->all();

            Reservation::query()
                ->whereIn('guest_id', $mergeIds)
                ->update(['guest_id' => $primary->id]);

            Stay::query()
                ->whereIn('primary_guest_id', $mergeIds)
                ->update(['primary_guest_id' => $primary->id]);

            $this->mergeGuestDetails($primary, $mergeGuests);

            $primary->save();

            foreach ($mergeGuests as $mergeGuest) {
                $mergeGuest->delete();
            }

            $this->auditLogService->record($actor, 'guest.merged', 'guest', [
                'guest_id' => $primary->id,
                'merged_ids' => $mergeIds,
            ]);

            return $primary->fresh();
        });
    }

    private function buildPayload(array $data, User $actor, bool $isCreate): array
    {
        $payload = [];
        $fields = [
            'name',
            'first_name',
            'last_name',
            'email',
            'phone',
            'phone_country_code',
            'date_of_birth',
            'gender',
            'nationality',
            'id_type',
            'id_number',
            'passport_number',
            'id_card_number',
            'address',
            'city',
            'country',
            'postal_code',
            'company',
            'vip_status',
            'preferences',
            'special_requests',
            'notes',
            'is_blacklisted',
            'blacklist_reason',
        ];

        foreach ($fields as $field) {
            if (array_key_exists($field, $data)) {
                $payload[$field] = $data[$field];
            }
        }

        if (array_key_exists('first_name', $data) || array_key_exists('last_name', $data)) {
            $fullName = trim(($data['first_name'] ?? '') . ' ' . ($data['last_name'] ?? ''));
            if ($fullName !== '') {
                $payload['name'] = $fullName;
            }
        }

        if ($isCreate) {
            $payload['property_id'] = $actor->property_id ?? 1;
        }

        if ($isCreate && empty($payload['name'])) {
            $payload['name'] = 'Guest';
        }

        if ($isCreate && ! empty($payload['phone']) && empty($payload['phone_country_code'])) {
            $payload['phone_country_code'] = '95';
        }

        if (array_key_exists('is_blacklisted', $payload) && ! $payload['is_blacklisted']) {
            $payload['blacklist_reason'] = null;
        }

        return $payload;
    }

    private function mergeGuestDetails(Guest $primary, Collection $mergeGuests): void
    {
        $totalStays = (int) $primary->total_stays;
        $totalSpent = (int) $primary->total_spent;
        $lastVisitAt = $primary->last_visit_at;
        $preferences = is_array($primary->preferences) ? $primary->preferences : [];

        $mergeableFields = [
            'name',
            'first_name',
            'last_name',
            'email',
            'phone',
            'phone_country_code',
            'date_of_birth',
            'gender',
            'nationality',
            'id_type',
            'id_number',
            'passport_number',
            'id_card_number',
            'address',
            'city',
            'country',
            'postal_code',
            'company',
            'vip_status',
            'special_requests',
            'notes',
        ];

        foreach ($mergeGuests as $mergeGuest) {
            $totalStays += (int) $mergeGuest->total_stays;
            $totalSpent += (int) $mergeGuest->total_spent;

            if ($mergeGuest->last_visit_at && (! $lastVisitAt || $mergeGuest->last_visit_at->gt($lastVisitAt))) {
                $lastVisitAt = $mergeGuest->last_visit_at;
            }

            foreach ($mergeableFields as $field) {
                if (empty($primary->{$field}) && ! empty($mergeGuest->{$field})) {
                    $primary->{$field} = $mergeGuest->{$field};
                }
            }

            $mergePreferences = is_array($mergeGuest->preferences) ? $mergeGuest->preferences : [];
            if (! empty($mergePreferences)) {
                $preferences = array_values(array_unique(array_merge($preferences, $mergePreferences)));
            }
        }

        $primary->total_stays = $totalStays;
        $primary->total_spent = $totalSpent;
        $primary->last_visit_at = $lastVisitAt;

        if (! empty($preferences)) {
            $primary->preferences = $preferences;
        }
    }
}
