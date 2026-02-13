<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Guests\MergeGuestRequest;
use App\Http\Requests\Guests\StoreGuestRequest;
use App\Http\Requests\Guests\UpdateGuestRequest;
use App\Models\Guest;
use App\Services\GuestService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GuestController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Guest::class);

        $propertyId = $request->user()?->property_id ?? 1;

        $query = Guest::query()->where('property_id', $propertyId);

        if ($request->filled('search')) {
            $query->search($request->input('search'));
        }

        $perPage = (int) $request->input('per_page', 20);
        $guests = $query->orderBy('name')->paginate($perPage)->appends($request->query());

        $data = collect($guests->items())
            ->map(fn (Guest $guest) => $this->guestArray($guest))
            ->values();

        return response()->json([
            'data' => $data,
            'meta' => [
                'total' => $guests->total(),
                'page' => $guests->currentPage(),
                'per_page' => $guests->perPage(),
            ],
        ]);
    }

    public function show(Guest $guest): JsonResponse
    {
        $this->authorize('view', $guest);

        return response()->json($this->guestArray($guest));
    }

    public function store(StoreGuestRequest $request, GuestService $service): JsonResponse
    {
        $this->authorize('create', Guest::class);

        $guest = $service->create($request->validated(), $request->user());

        return response()->json($this->guestArray($guest), 201);
    }

    public function update(
        UpdateGuestRequest $request,
        Guest $guest,
        GuestService $service
    ): JsonResponse {
        $this->authorize('update', $guest);

        $guest = $service->update($guest, $request->validated(), $request->user());

        return response()->json($this->guestArray($guest));
    }

    public function merge(
        MergeGuestRequest $request,
        Guest $guest,
        GuestService $service
    ): JsonResponse {
        $mergeIds = $request->validated('merge_ids', []);
        $mergeGuests = Guest::query()->whereIn('id', $mergeIds)->get();

        foreach ($mergeGuests as $mergeGuest) {
            $this->authorize('update', $mergeGuest);
        }

        $guest = $service->merge($guest, $mergeGuests, $request->user());

        return response()->json(array_merge($this->guestArray($guest), [
            'merged_ids' => $mergeIds,
        ]));
    }

    private function guestArray(Guest $guest): array
    {
        return [
            'id' => $guest->id,
            'uuid' => $guest->uuid,
            'name' => $guest->name,
            'full_name' => $guest->full_name,
            'email' => $guest->email,
            'phone' => $guest->phone,
            'phone_country_code' => $guest->phone_country_code,
            'formatted_phone' => $guest->formatted_phone,
            'date_of_birth' => $guest->date_of_birth?->toDateString(),
            'gender' => $guest->gender,
            'nationality' => $guest->nationality,
            'id_type' => $guest->id_type,
            'id_number' => $guest->id_number,
            'passport_number' => $guest->passport_number,
            'id_card_number' => $guest->id_card_number,
            'address' => $guest->address,
            'city' => $guest->city,
            'country' => $guest->country,
            'postal_code' => $guest->postal_code,
            'company' => $guest->company,
            'vip_status' => $guest->vip_status,
            'preferences' => $guest->preferences,
            'special_requests' => $guest->special_requests,
            'notes' => $guest->notes,
            'is_blacklisted' => $guest->is_blacklisted,
            'blacklist_reason' => $guest->blacklist_reason,
            'last_visit_at' => $guest->last_visit_at?->toDateTimeString(),
            'total_stays' => $guest->total_stays,
            'total_spent' => $guest->total_spent,
            'created_at' => $guest->created_at?->toDateTimeString(),
            'updated_at' => $guest->updated_at?->toDateTimeString(),
        ];
    }
}
