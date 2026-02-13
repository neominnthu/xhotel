<?php

namespace App\Http\Controllers;

use App\Models\ReportDailyKpi;
use App\Services\ReportsService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReportsPageController extends Controller
{
    public function index(Request $request, ReportsService $reports): Response
    {
        $this->authorize('viewAny', ReportDailyKpi::class);

        $from = $request->input('from')
            ? Carbon::parse($request->input('from'))
            : now()->subDays(6)->startOfDay();
        $to = $request->input('to')
            ? Carbon::parse($request->input('to'))
            : now()->startOfDay();

        $propertyId = $request->user()?->property_id;

        return Inertia::render('reports/index', [
            'filters' => [
                'from' => $from->toDateString(),
                'to' => $to->toDateString(),
            ],
            'occupancy' => $reports->occupancyRange($from, $to, $propertyId),
            'revenue' => $reports->revenueSummary($from, $to, $propertyId),
        ]);
    }

    public function export(Request $request, ReportsService $reports)
    {
        $this->authorize('viewAny', ReportDailyKpi::class);

        $request->validate([
            'from' => 'required|date',
            'to' => 'required|date|after_or_equal:from',
        ]);

        $from = Carbon::parse($request->input('from'));
        $to = Carbon::parse($request->input('to'));
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

    public function exportRevenue(Request $request, ReportsService $reports)
    {
        $this->authorize('viewAny', ReportDailyKpi::class);

        $request->validate([
            'from' => 'required|date',
            'to' => 'required|date|after_or_equal:from',
        ]);

        $from = Carbon::parse($request->input('from'));
        $to = Carbon::parse($request->input('to'));
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
