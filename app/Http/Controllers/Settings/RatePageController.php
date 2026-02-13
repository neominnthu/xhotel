<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Rates\StoreRateRequest;
use App\Http\Requests\Rates\UpdateRateRequest;
use App\Models\Rate;
use App\Models\RoomType;
use App\Services\AuditLogService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class RatePageController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Rate::class);

        $propertyId = $request->user()?->property_id;

        $roomTypes = RoomType::query()
            ->when($propertyId, fn ($q) => $q->where('property_id', $propertyId))
            ->orderBy('sort_order')
            ->get(['id', 'name']);

        $rates = Rate::query()
            ->when($propertyId, fn ($q) => $q->where('property_id', $propertyId))
            ->orderBy('start_date')
            ->get();

        return Inertia::render('settings/rates/index', [
            'roomTypes' => $roomTypes->map(fn (RoomType $type) => [
                'id' => $type->id,
                'name' => $type->name,
            ]),
            'rates' => $rates->map(fn (Rate $rate) => [
                'id' => $rate->id,
                'room_type_id' => $rate->room_type_id,
                'name' => $rate->name,
                'type' => $rate->type,
                'start_date' => $rate->start_date?->toDateString(),
                'end_date' => $rate->end_date?->toDateString(),
                'rate' => $rate->rate,
                'min_stay' => $rate->min_stay,
                'days_of_week' => $rate->days_of_week ?? [],
                'length_of_stay_min' => $rate->length_of_stay_min,
                'length_of_stay_max' => $rate->length_of_stay_max,
                'adjustment_type' => $rate->adjustment_type,
                'adjustment_value' => $rate->adjustment_value,
                'is_active' => $rate->is_active,
            ]),
        ]);
    }

    public function store(StoreRateRequest $request, AuditLogService $auditLog): RedirectResponse
    {
        $this->authorize('create', Rate::class);

        $data = $request->validated();
        $propertyId = $request->user()?->property_id ?? 1;

        $rate = Rate::create([
            'property_id' => $propertyId,
            'room_type_id' => $data['room_type_id'],
            'name' => $data['name'],
            'type' => $data['type'],
            'start_date' => $data['start_date'],
            'end_date' => $data['end_date'],
            'rate' => $data['rate'],
            'min_stay' => $data['min_stay'],
            'days_of_week' => $data['days_of_week'] ?? null,
            'length_of_stay_min' => $data['length_of_stay_min'] ?? null,
            'length_of_stay_max' => $data['length_of_stay_max'] ?? null,
            'adjustment_type' => $data['adjustment_type'] ?? null,
            'adjustment_value' => $data['adjustment_value'] ?? null,
            'is_active' => $data['is_active'] ?? true,
        ]);

        if ($actor = $request->user()) {
            $auditLog->record($actor, 'rate.created', 'rate', [
                'rate_id' => $rate->id,
                'name' => $rate->name,
            ]);

            Log::info('metrics.rate.created', [
                'rate_id' => $rate->id,
                'property_id' => $rate->property_id,
                'user_id' => $actor->id,
            ]);
        }

        return back()->with('success', 'ဈေးနှုန်း သတ်မှတ်ချက် ထည့်သွင်းပြီးပါပြီ။');
    }

    public function update(UpdateRateRequest $request, Rate $rate, AuditLogService $auditLog): RedirectResponse
    {
        $this->authorize('update', $rate);

        $data = $request->validated();

        $rate->update([
            'room_type_id' => $data['room_type_id'],
            'name' => $data['name'],
            'type' => $data['type'],
            'start_date' => $data['start_date'],
            'end_date' => $data['end_date'],
            'rate' => $data['rate'],
            'min_stay' => $data['min_stay'],
            'days_of_week' => $data['days_of_week'] ?? null,
            'length_of_stay_min' => $data['length_of_stay_min'] ?? null,
            'length_of_stay_max' => $data['length_of_stay_max'] ?? null,
            'adjustment_type' => $data['adjustment_type'] ?? null,
            'adjustment_value' => $data['adjustment_value'] ?? null,
            'is_active' => $data['is_active'] ?? true,
        ]);

        if ($actor = $request->user()) {
            $auditLog->record($actor, 'rate.updated', 'rate', [
                'rate_id' => $rate->id,
                'name' => $rate->name,
            ]);

            Log::info('metrics.rate.updated', [
                'rate_id' => $rate->id,
                'property_id' => $rate->property_id,
                'user_id' => $actor->id,
            ]);
        }

        return back()->with('success', 'ဈေးနှုန်း သတ်မှတ်ချက် ပြင်ဆင်ပြီးပါပြီ။');
    }

    public function destroy(Rate $rate, AuditLogService $auditLog, Request $request): RedirectResponse
    {
        $this->authorize('delete', $rate);

        if ($actor = $request->user()) {
            $auditLog->record($actor, 'rate.deleted', 'rate', [
                'rate_id' => $rate->id,
                'name' => $rate->name,
            ]);

            Log::info('metrics.rate.deleted', [
                'rate_id' => $rate->id,
                'property_id' => $rate->property_id,
                'user_id' => $actor->id,
            ]);
        }

        $rate->delete();

        return back()->with('success', 'ဈေးနှုန်း သတ်မှတ်ချက် ဖျက်ပြီးပါပြီ။');
    }
}
