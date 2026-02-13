<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CancellationPolicies\StoreCancellationPolicyRequest;
use App\Http\Requests\CancellationPolicies\UpdateCancellationPolicyRequest;
use App\Models\CancellationPolicy;
use App\Services\AuditLogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CancellationPolicyController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', CancellationPolicy::class);

        $propertyId = $request->user()?->property_id;
        $roomTypeId = $request->input('room_type_id');

        $policies = CancellationPolicy::query()
            ->when($propertyId, fn ($q) => $q->where('property_id', $propertyId))
            ->when($roomTypeId, fn ($q) => $q->where('room_type_id', $roomTypeId))
            ->orderBy('room_type_id')
            ->get();

        return response()->json([
            'data' => $policies->map(fn (CancellationPolicy $policy) => $this->policyArray($policy)),
        ]);
    }

    public function store(StoreCancellationPolicyRequest $request, AuditLogService $auditLog): JsonResponse
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
        }

        return response()->json($this->policyArray($policy), 201);
    }

    public function update(
        UpdateCancellationPolicyRequest $request,
        CancellationPolicy $cancellationPolicy,
        AuditLogService $auditLog
    ): JsonResponse
    {
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
        }

        return response()->json($this->policyArray($cancellationPolicy));
    }

    public function destroy(
        CancellationPolicy $cancellationPolicy,
        AuditLogService $auditLog,
        Request $request
    ): JsonResponse
    {
        $this->authorize('delete', $cancellationPolicy);

        if ($actor = $request->user()) {
            $auditLog->record($actor, 'cancellation_policy.deleted', 'cancellation_policy', [
                'policy_id' => $cancellationPolicy->id,
                'name' => $cancellationPolicy->name,
            ]);
        }

        $cancellationPolicy->delete();

        return response()->json(['status' => 'ok']);
    }

    private function policyArray(CancellationPolicy $policy): array
    {
        return [
            'id' => $policy->id,
            'name' => $policy->name,
            'room_type_id' => $policy->room_type_id,
            'deadline_hours' => $policy->deadline_hours,
            'penalty_type' => $policy->penalty_type,
            'penalty_amount' => $policy->penalty_amount,
            'penalty_percent' => $policy->penalty_percent,
            'is_active' => $policy->is_active,
        ];
    }
}
