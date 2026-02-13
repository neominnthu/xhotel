<?php

namespace App\Http\Controllers;

use App\Models\Charge;
use App\Models\Folio;
use App\Models\Payment;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BillingReportsController extends Controller
{
    public function index(Request $request): Response
    {
        $dateFrom = $request->get('date_from', now()->startOfMonth()->toDateString());
        $dateTo = $request->get('date_to', now()->endOfMonth()->toDateString());

        // Revenue Analytics
        $revenueData = $this->getRevenueAnalytics($dateFrom, $dateTo);

        // Outstanding Balances
        $outstandingBalances = $this->getOutstandingBalances();

        // Payment Methods Summary
        $paymentMethods = $this->getPaymentMethodsSummary($dateFrom, $dateTo);

        // Top Revenue Sources
        $topRevenueSources = $this->getTopRevenueSources($dateFrom, $dateTo);

        return Inertia::render('billing-reports/index', [
            'revenueData' => $revenueData,
            'outstandingBalances' => $outstandingBalances,
            'paymentMethods' => $paymentMethods,
            'topRevenueSources' => $topRevenueSources,
            'filters' => [
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
            ],
        ]);
    }

    private function getRevenueAnalytics(string $dateFrom, string $dateTo): array
    {
        $from = Carbon::parse($dateFrom)->startOfDay();
        $to = Carbon::parse($dateTo)->endOfDay();

        $charges = Charge::whereBetween('posted_at', [$from, $to])
            ->selectRaw('DATE(posted_at) as date, SUM(amount) as total_amount, currency')
            ->groupBy('date', 'currency')
            ->orderBy('date')
            ->get();

        $payments = Payment::whereBetween('received_at', [$from, $to])
            ->selectRaw('DATE(received_at) as date, SUM(amount) as total_amount, currency')
            ->groupBy('date', 'currency')
            ->orderBy('date')
            ->get();

        $totalCharges = (int) Charge::whereBetween('posted_at', [$from, $to])->sum('amount');
        $totalTax = (int) Charge::whereBetween('posted_at', [$from, $to])->sum('tax_amount');
        $grossRevenue = $totalCharges + $totalTax;

        return [
            'charges' => $charges,
            'payments' => $payments,
            'total_charges' => $totalCharges,
            'total_payments' => (int) $payments->sum('total_amount'),
            'total_tax' => $totalTax,
            'gross_revenue' => $grossRevenue,
        ];
    }

    private function getOutstandingBalances(): array
    {
        return Folio::where('balance', '>', 0)
            ->with(['reservation.guest'])
            ->orderBy('balance', 'desc')
            ->take(10)
            ->get()
            ->map(function ($folio) {
                return [
                    'id' => $folio->id,
                    'reservation_code' => $folio->reservation->code ?? 'N/A',
                    'guest_name' => $folio->reservation->guest->name ?? 'Unknown',
                    'balance' => $folio->balance,
                    'currency' => $folio->currency,
                    'days_overdue' => $folio->reservation ? $folio->reservation->check_out->diffInDays(now()) : 0,
                ];
            })
            ->toArray();
    }

    private function getPaymentMethodsSummary(string $dateFrom, string $dateTo): array
    {
        return Payment::whereBetween('received_at', [$dateFrom, $dateTo])
            ->selectRaw('method, SUM(amount) as total_amount, COUNT(*) as transaction_count')
            ->groupBy('method')
            ->orderBy('total_amount', 'desc')
            ->get()
            ->map(function ($payment) {
                return [
                    'method' => $payment->method,
                    'total_amount' => $payment->total_amount,
                    'transaction_count' => $payment->transaction_count,
                ];
            })
            ->toArray();
    }

    private function getTopRevenueSources(string $dateFrom, string $dateTo): array
    {
        return Charge::whereBetween('posted_at', [$dateFrom, $dateTo])
            ->selectRaw('type, SUM(amount) as total_amount, COUNT(*) as transaction_count')
            ->groupBy('type')
            ->orderBy('total_amount', 'desc')
            ->take(10)
            ->get()
            ->map(function ($charge) {
                return [
                    'type' => $charge->type,
                    'total_amount' => $charge->total_amount,
                    'transaction_count' => $charge->transaction_count,
                ];
            })
            ->toArray();
    }
}
