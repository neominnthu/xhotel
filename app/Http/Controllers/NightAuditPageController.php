<?php

namespace App\Http\Controllers;

use App\Models\Property;
use App\Models\Reservation;
use App\Services\NightAuditService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class NightAuditPageController extends Controller
{
    public function index(Request $request, NightAuditService $service): Response
    {
        Gate::authorize('viewAny', Reservation::class);

        $user = $request->user();
        $propertyId = $user?->property_id ?? 1;
        $property = Property::find($propertyId);
        $timezone = $property?->timezone ?? config('app.timezone');
        $date = $request->input('date')
            ? Carbon::parse($request->input('date'), $timezone)
            : now($timezone);

        $summary = $service->summary($propertyId, $date);

        return Inertia::render('night-audit/index', [
            'filters' => [
                'date' => $summary['date'],
            ],
            'summary' => $summary,
        ]);
    }
}
