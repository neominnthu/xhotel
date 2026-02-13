<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ReportsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Carbon\Carbon;

class ReportsController extends Controller
{
    public function occupancy(Request $request, ReportsService $reports): JsonResponse
    {
        $this->authorize('viewAny', \App\Models\ReportDailyKpi::class);

        $request->validate([
            'from' => 'required|date',
            'to' => 'required|date|after_or_equal:from',
        ]);

        $from = Carbon::parse($request->from);
        $to = Carbon::parse($request->to);
        $user = $request->user();
        $propertyId = $user?->property_id;

        $data = $reports->occupancyRange($from, $to, $propertyId);

        return response()->json(['data' => $data]);
    }

    public function revenue(Request $request, ReportsService $reports): JsonResponse
    {
        $this->authorize('viewAny', \App\Models\ReportDailyKpi::class);

        $request->validate([
            'from' => 'required|date',
            'to' => 'required|date|after_or_equal:from',
        ]);

        $from = Carbon::parse($request->from);
        $to = Carbon::parse($request->to);
        $user = $request->user();
        $propertyId = $user?->property_id;

        return response()->json($reports->revenueSummary($from, $to, $propertyId));
    }

    public function occupancyExport(Request $request, ReportsService $reports)
    {
        $this->authorize('viewAny', \App\Models\ReportDailyKpi::class);

        $request->validate([
            'from' => 'required|date',
            'to' => 'required|date|after_or_equal:from',
        ]);

        $from = Carbon::parse($request->from);
        $to = Carbon::parse($request->to);
        $propertyId = $request->user()?->property_id;
        $data = $reports->occupancyRange($from, $to, $propertyId);

        $fileName = 'occupancy-report-'.$from->toDateString().'-'.$to->toDateString().'.csv';

        return response()->streamDownload(function () use ($data) {
            $handle = fopen('php://output', 'w');
            fwrite($handle, "\xEF\xBB\xBF");
            fputcsv($handle, ['date', 'total_rooms', 'occupied_rooms', 'occupancy_rate']);
            foreach ($data as $row) {
                fputcsv($handle, [
                    $row['date'],
                    $row['total_rooms'],
                    $row['occupied_rooms'],
                    $row['occupancy_rate'],
                ]);
            }
            fclose($handle);
        }, $fileName);
    }

    public function revenueExport(Request $request, ReportsService $reports)
    {
        $this->authorize('viewAny', \App\Models\ReportDailyKpi::class);

        $request->validate([
            'from' => 'required|date',
            'to' => 'required|date|after_or_equal:from',
        ]);

        $from = Carbon::parse($request->from);
        $to = Carbon::parse($request->to);
        $propertyId = $request->user()?->property_id;
        $summary = $reports->revenueSummary($from, $to, $propertyId);

        $fileName = 'revenue-report-'.$from->toDateString().'-'.$to->toDateString().'.csv';

        return response()->streamDownload(function () use ($summary) {
            $handle = fopen('php://output', 'w');
            fwrite($handle, "\xEF\xBB\xBF");
            fputcsv($handle, ['metric', 'value']);
            fputcsv($handle, ['total_revenue', $summary['total_revenue']]);
            fputcsv($handle, ['adr', $summary['adr']]);
            fputcsv($handle, ['revpar', $summary['revpar']]);
            fputcsv($handle, []);
            fputcsv($handle, ['source', 'revenue']);
            foreach ($summary['revenue_by_source'] as $row) {
                fputcsv($handle, [$row['source'], $row['revenue']]);
            }
            fclose($handle);
        }, $fileName);
    }
}
