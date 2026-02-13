<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\CancellationPolicies\StoreCancellationPolicyRequest;
use App\Http\Requests\CancellationPolicies\UpdateCancellationPolicyRequest;
use App\Models\CancellationPolicy;
use App\Models\RoomType;
use App\Services\AuditLogService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class CancellationPolicyPageController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', CancellationPolicy::class);

        $propertyId = $request->user()?->property_id;

        $roomTypes = RoomType::query()
            ->when($propertyId, fn ($q) => $q->where('property_id', $propertyId))
            ->orderBy('sort_order')
            ->get(['id', 'name']);

        $roomTypeId = $request->input('room_type_id');

        $policies = CancellationPolicy::query()
            ->when($propertyId, fn ($q) => $q->where('property_id', $propertyId))
            ->when($roomTypeId, fn ($q) => $q->where('room_type_id', $roomTypeId))
            ->orderBy('room_type_id')
            ->get();

        return Inertia::render('settings/cancellation-policies/index', [
            'roomTypes' => $roomTypes->map(fn (RoomType $type) => [
                'id' => $type->id,
                'name' => $type->name,
            ]),
            'policies' => $policies->map(fn (CancellationPolicy $policy) => [
                'id' => $policy->id,
                'name' => $policy->name,
                'room_type_id' => $policy->room_type_id,
                'deadline_hours' => $policy->deadline_hours,
                'penalty_type' => $policy->penalty_type,
                'penalty_amount' => $policy->penalty_amount,
                'penalty_percent' => $policy->penalty_percent,
                'is_active' => $policy->is_active,
            ]),
        ]);
    }

    public function store(StoreCancellationPolicyRequest $request, AuditLogService $auditLog): RedirectResponse
    {
        $this->authorize('create', CancellationPolicy::class);

        $data = $request->validated();
        $propertyId = $request->user()?->property_id ?? 1;

        $policy = CancellationPolicy::create([
            'property_id' => $propertyId,
            'room_type_id' => $data['room_type_id'] ?? null,
            'name' => $data['name'],
            'deadline_hours' => $data['deadline_hours'],
            'penalty_type' => $data['penalty_type'],
            'penalty_amount' => $data['penalty_amount'] ?? 0,
            'penalty_percent' => $data['penalty_percent'] ?? 0,
            'is_active' => $data['is_active'] ?? true,
        ]);

        if ($actor = $request->user()) {
            $auditLog->record($actor, 'cancellation_policy.created', 'cancellation_policy', [
                'policy_id' => $policy->id,
                'name' => $policy->name,
            ]);

            Log::info('metrics.cancellation_policy.created', [
                'policy_id' => $policy->id,
                'property_id' => $policy->property_id,
                'user_id' => $actor->id,
            ]);
        }

        return back()->with('success', 'Cancellation policy ထည့်သွင်းပြီးပါပြီ။');
    }

    public function update(
        UpdateCancellationPolicyRequest $request,
        CancellationPolicy $cancellationPolicy,
        AuditLogService $auditLog
    ): RedirectResponse {
        $this->authorize('update', $cancellationPolicy);

        $data = $request->validated();

        $cancellationPolicy->update([
            'room_type_id' => $data['room_type_id'] ?? null,
            'name' => $data['name'],
            'deadline_hours' => $data['deadline_hours'],
            'penalty_type' => $data['penalty_type'],
            'penalty_amount' => $data['penalty_amount'] ?? 0,
            'penalty_percent' => $data['penalty_percent'] ?? 0,
            'is_active' => $data['is_active'] ?? true,
        ]);

        if ($actor = $request->user()) {
            $auditLog->record($actor, 'cancellation_policy.updated', 'cancellation_policy', [
                'policy_id' => $cancellationPolicy->id,
                'name' => $cancellationPolicy->name,
            ]);

            Log::info('metrics.cancellation_policy.updated', [
                'policy_id' => $cancellationPolicy->id,
                'property_id' => $cancellationPolicy->property_id,
                'user_id' => $actor->id,
            ]);
        }

        return back()->with('success', 'Cancellation policy ပြင်ဆင်ပြီးပါပြီ။');
    }

    public function destroy(
        CancellationPolicy $cancellationPolicy,
        AuditLogService $auditLog,
        Request $request
    ): RedirectResponse {
        $this->authorize('delete', $cancellationPolicy);

        if ($actor = $request->user()) {
            $auditLog->record($actor, 'cancellation_policy.deleted', 'cancellation_policy', [
                'policy_id' => $cancellationPolicy->id,
                'name' => $cancellationPolicy->name,
            ]);

            Log::info('metrics.cancellation_policy.deleted', [
                'policy_id' => $cancellationPolicy->id,
                'property_id' => $cancellationPolicy->property_id,
                'user_id' => $actor->id,
            ]);
        }

        $cancellationPolicy->delete();

        return back()->with('success', 'Cancellation policy ဖျက်ပြီးပါပြီ။');
    }
}
