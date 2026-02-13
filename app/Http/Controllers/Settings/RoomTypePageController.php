<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\RoomTypes\StoreRoomTypeRequest;
use App\Http\Requests\RoomTypes\UpdateRoomTypeRequest;
use App\Models\RoomType;
use App\Services\AuditLogService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class RoomTypePageController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', RoomType::class);

        $propertyId = $request->user()?->property_id;

        $roomTypes = RoomType::query()
            ->when($propertyId, fn ($q) => $q->where('property_id', $propertyId))
            ->orderBy('sort_order')
            ->get();

        return Inertia::render('settings/room-types/index', [
            'roomTypes' => $roomTypes->map(fn (RoomType $type) => [
                'id' => $type->id,
                'name' => $type->name,
                'capacity' => $type->capacity,
                'overbooking_limit' => $type->overbooking_limit,
                'base_rate' => $type->base_rate,
                'sort_order' => $type->sort_order,
                'is_active' => $type->is_active,
            ]),
        ]);
    }

    public function store(StoreRoomTypeRequest $request, AuditLogService $auditLog): RedirectResponse
    {
        $this->authorize('create', RoomType::class);

        $data = $request->validated();
        $propertyId = $request->user()?->property_id ?? 1;

        $roomType = RoomType::create([
            'property_id' => $propertyId,
            'name' => [
                'en' => $data['name_en'],
                'my' => $data['name_my'],
            ],
            'capacity' => $data['capacity'],
            'overbooking_limit' => $data['overbooking_limit'],
            'base_rate' => $data['base_rate'],
            'sort_order' => $data['sort_order'] ?? 0,
            'is_active' => $data['is_active'] ?? true,
        ]);

        if ($actor = $request->user()) {
            $auditLog->record($actor, 'room_type.created', 'room_type', [
                'room_type_id' => $roomType->id,
                'name' => $roomType->name,
            ]);

            Log::info('metrics.room_type.created', [
                'room_type_id' => $roomType->id,
                'property_id' => $roomType->property_id,
                'user_id' => $actor->id,
            ]);
        }

        return back()->with('success', 'အခန်းအမျိုးအစား ထည့်သွင်းပြီးပါပြီ။');
    }

    public function update(UpdateRoomTypeRequest $request, RoomType $roomType, AuditLogService $auditLog): RedirectResponse
    {
        $this->authorize('update', $roomType);

        $data = $request->validated();

        $roomType->update([
            'name' => [
                'en' => $data['name_en'],
                'my' => $data['name_my'],
            ],
            'capacity' => $data['capacity'],
            'overbooking_limit' => $data['overbooking_limit'],
            'base_rate' => $data['base_rate'],
            'sort_order' => $data['sort_order'] ?? 0,
            'is_active' => $data['is_active'] ?? true,
        ]);

        if ($actor = $request->user()) {
            $auditLog->record($actor, 'room_type.updated', 'room_type', [
                'room_type_id' => $roomType->id,
                'name' => $roomType->name,
            ]);

            Log::info('metrics.room_type.updated', [
                'room_type_id' => $roomType->id,
                'property_id' => $roomType->property_id,
                'user_id' => $actor->id,
            ]);
        }

        return back()->with('success', 'အခန်းအမျိုးအစား ပြင်ဆင်ပြီးပါပြီ။');
    }

    public function destroy(RoomType $roomType, AuditLogService $auditLog, Request $request): RedirectResponse
    {
        $this->authorize('delete', $roomType);

        if ($actor = $request->user()) {
            $auditLog->record($actor, 'room_type.deleted', 'room_type', [
                'room_type_id' => $roomType->id,
                'name' => $roomType->name,
            ]);

            Log::info('metrics.room_type.deleted', [
                'room_type_id' => $roomType->id,
                'property_id' => $roomType->property_id,
                'user_id' => $actor->id,
            ]);
        }

        $roomType->delete();

        return back()->with('success', 'အခန်းအမျိုးအစား ဖျက်ပြီးပါပြီ။');
    }
}
