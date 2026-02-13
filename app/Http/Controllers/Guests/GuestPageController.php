<?php

namespace App\Http\Controllers\Guests;

use App\Http\Controllers\Controller;
use App\Http\Requests\Guests\MergeGuestRequest;
use App\Http\Requests\Guests\StoreGuestRequest;
use App\Http\Requests\Guests\UpdateGuestRequest;
use App\Models\Guest;
use App\Services\GuestService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class GuestPageController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('viewAny', Guest::class);

        $user = auth()->user();
        $propertyId = $user->property_id ?? 1;

        $query = Guest::query()
            ->where('property_id', $propertyId);

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('id_number', 'like', "%{$search}%")
                    ->orWhere('passport_number', 'like', "%{$search}%")
                    ->orWhere('id_card_number', 'like', "%{$search}%");
            });
        }

        $vipStatus = $request->input('vip_status');
        if (in_array($vipStatus, ['vip', 'vvip'], true)) {
            $query->where('vip_status', $vipStatus);
        }

        if ($request->boolean('blacklisted')) {
            $query->where('is_blacklisted', true);
        }

        $minStays = (int) $request->input('min_stays', 0);
        if ($minStays > 0) {
            $query->where('total_stays', '>=', $minStays);
        }

        $guests = $query->orderBy('name')
            ->paginate(20)
            ->through(function ($guest) {
                return [
                    'id' => $guest->id,
                    'name' => $guest->full_name,
                    'email' => $guest->email,
                    'phone' => $guest->phone,
                    'identification_type' => $guest->id_type,
                    'identification_number' => $guest->id_number,
                    'address' => $guest->address,
                    'date_of_birth' => $guest->date_of_birth?->format('Y-m-d'),
                    'nationality' => $guest->nationality,
                    'vip_status' => $guest->vip_status,
                    'is_blacklisted' => $guest->is_blacklisted,
                    'total_stays' => $guest->total_stays,
                    'last_visit' => $guest->last_visit_at?->format('M j, Y'),
                    'total_spent' => $guest->total_spent,
                    'created_at' => $guest->created_at->format('M j, Y'),
                ];
            });

        return Inertia::render('guests/index', [
            'guests' => $guests,
            'filters' => $request->only(['search', 'vip_status', 'blacklisted', 'min_stays']),
        ]);
    }

    public function show(Guest $guest)
    {
        $this->authorize('view', $guest);

        $guest->load([
            'reservations' => function ($query) {
                $query->with(['roomType', 'room', 'stay', 'folios.charges', 'folios.payments'])
                    ->orderBy('check_in', 'desc');
            },
        ]);

        $mergeCandidates = Guest::query()
            ->where('property_id', $guest->property_id)
            ->where('id', '!=', $guest->id)
            ->orderBy('name')
            ->limit(20)
            ->get();

        return Inertia::render('guests/show', [
            'guest' => [
                'id' => $guest->id,
                'name' => $guest->full_name,
                'email' => $guest->email,
                'phone' => $guest->phone,
                'identification_type' => $guest->id_type,
                'identification_number' => $guest->id_number,
                'address' => $guest->address,
                'date_of_birth' => $guest->date_of_birth?->format('Y-m-d'),
                'nationality' => $guest->nationality,
                'vip_status' => $guest->vip_status,
                'preferences' => $guest->preferences ?? [],
                'notes' => $guest->notes,
                'special_requests' => $guest->special_requests,
                'first_name' => $guest->first_name,
                'last_name' => $guest->last_name,
                'gender' => $guest->gender,
                'phone_country_code' => $guest->phone_country_code,
                'passport_number' => $guest->passport_number,
                'id_card_number' => $guest->id_card_number,
                'city' => $guest->city,
                'country' => $guest->country,
                'postal_code' => $guest->postal_code,
                'company' => $guest->company,
                'is_blacklisted' => $guest->is_blacklisted,
                'blacklist_reason' => $guest->blacklist_reason,
                'total_stays' => $guest->total_stays,
                'total_spent' => $guest->total_spent,
                'created_at' => $guest->created_at->format('M j, Y'),
                'updated_at' => $guest->updated_at->format('M j, Y'),
            ],
            'reservations' => $guest->reservations->map(function ($reservation) {
                $folio = $reservation->folios->first();
                $folioTotal = $reservation->folios->sum('total');

                return [
                    'id' => $reservation->id,
                    'code' => $reservation->code,
                    'status' => $reservation->status,
                    'check_in' => $reservation->check_in->format('M j, Y'),
                    'check_out' => $reservation->check_out->format('M j, Y'),
                    'room_type' => $reservation->roomType?->name['en'],
                    'room_number' => $reservation->room?->number,
                    'total_amount' => $folioTotal,
                    'folio_balance' => $folio?->balance ?? 0,
                    'stays' => $reservation->stay ? [[
                        'id' => $reservation->stay->id,
                        'status' => $reservation->stay->status,
                        'actual_check_in' => $reservation->stay->actual_check_in?->format('M j, Y H:i'),
                        'actual_check_out' => $reservation->stay->actual_check_out?->format('M j, Y H:i'),
                    ]] : [],
                ];
            }),
            'merge_candidates' => $mergeCandidates->map(fn (Guest $candidate) => [
                'id' => $candidate->id,
                'name' => $candidate->full_name,
                'email' => $candidate->email,
                'phone' => $candidate->phone,
            ]),
        ]);
    }

    public function store(StoreGuestRequest $request, GuestService $service): RedirectResponse
    {
        $this->authorize('create', Guest::class);

        $guest = $service->create($request->validated(), $request->user());

        return redirect()->to("/guests/{$guest->id}")
            ->with('success', 'ဧည့်သည် အချက်အလက် အသစ် ထည့်သွင်းပြီးပါပြီ။');
    }

    public function update(
        UpdateGuestRequest $request,
        Guest $guest,
        GuestService $service
    ): RedirectResponse {
        $this->authorize('update', $guest);

        $service->update($guest, $request->validated(), $request->user());

        return back()->with('success', 'ဧည့်သည် အချက်အလက် ပြင်ဆင်ပြီးပါပြီ။');
    }

    public function merge(
        MergeGuestRequest $request,
        Guest $guest,
        GuestService $service
    ): RedirectResponse {
        $this->authorize('update', $guest);

        $mergeIds = $request->validated('merge_ids', []);
        $mergeGuests = Guest::query()
            ->where('property_id', $guest->property_id)
            ->whereIn('id', $mergeIds)
            ->get();

        if ($mergeGuests->count() !== count($mergeIds)) {
            throw ValidationException::withMessages([
                'merge_ids' => ['ပေါင်းစည်းရန်ရွေးထားသော ဧည့်သည် မမှန်ကန်ပါ။'],
            ]);
        }

        $service->merge($guest, $mergeGuests, $request->user());

        return redirect()->to("/guests/{$guest->id}")
            ->with('success', 'ဧည့်သည် အချက်အလက်များကို ပေါင်းစည်းပြီးပါပြီ။');
    }
}
