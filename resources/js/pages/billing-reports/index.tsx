import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarDays, CreditCard, DollarSign, TrendingUp, Users, Wallet } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

type RevenueData = {
    charges: Array<{
        date: string;
        total_amount: number;
        currency: string;
    }>;
    payments: Array<{
        date: string;
        total_amount: number;
        currency: string;
    }>;
    total_charges: number;
    total_payments: number;
};

type OutstandingBalance = {
    id: number;
    reservation_code: string;
    guest_name: string;
    balance: number;
    currency: string;
    days_overdue: number;
};

type PaymentMethod = {
    method: string;
    total_amount: number;
    transaction_count: number;
};

type RevenueSource = {
    type: string;
    total_amount: number;
    transaction_count: number;
};

type Props = {
    revenueData: RevenueData;
    outstandingBalances: OutstandingBalance[];
    paymentMethods: PaymentMethod[];
    topRevenueSources: RevenueSource[];
    filters: {
        date_from: string;
        date_to: string;
    };
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Billing Reports',
        href: '/billing-reports',
    },
];

function formatCurrency(amount: number, currency: string): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
    }).format(amount);
}

function formatPaymentMethod(method: string): string {
    const methodMap: Record<string, string> = {
        'cash': 'Cash',
        'card': 'Credit/Debit Card',
        'bank_transfer': 'Bank Transfer',
        'digital_wallet': 'Digital Wallet',
        'check': 'Check',
        'voucher': 'Voucher/Coupon',
        'other': 'Other',
    };
    return methodMap[method] || method.charAt(0).toUpperCase() + method.slice(1);
}

function formatChargeType(type: string): string {
    return type
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

export default function BillingReportsIndex({
    revenueData,
    outstandingBalances,
    paymentMethods,
    topRevenueSources,
    filters,
}: Props) {
    const handleFilterChange = (field: string, value: string) => {
        router.get('/billing-reports', {
            ...filters,
            [field]: value,
        }, {
            preserveState: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Billing Reports" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-foreground">
                            Billing Reports
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Comprehensive analytics and insights for your hotel billing operations.
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Report Filters</CardTitle>
                        <CardDescription>
                            Select date range for your billing reports
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 sm:grid-cols-3">
                            <div className="space-y-2">
                                <Label htmlFor="date_from">From Date</Label>
                                <Input
                                    id="date_from"
                                    type="date"
                                    value={filters.date_from}
                                    onChange={(e) => handleFilterChange('date_from', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="date_to">To Date</Label>
                                <Input
                                    id="date_to"
                                    type="date"
                                    value={filters.date_to}
                                    onChange={(e) => handleFilterChange('date_to', e.target.value)}
                                />
                            </div>
                            <div className="flex items-end">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        router.get('/billing-reports', {}, { preserveState: true });
                                    }}
                                >
                                    Reset Filters
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Summary Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Charges</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatCurrency(revenueData.total_charges, 'MMK')}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                In selected period
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
                            <Wallet className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatCurrency(revenueData.total_payments, 'MMK')}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                In selected period
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Outstanding Balance</CardTitle>
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatCurrency(
                                    outstandingBalances.reduce((sum, balance) => sum + balance.balance, 0),
                                    'MMK'
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Across all folios
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Payment Methods</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {paymentMethods.length}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Active methods
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="overview" className="flex-1">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="outstanding">Outstanding Balances</TabsTrigger>
                        <TabsTrigger value="payments">Payment Methods</TabsTrigger>
                        <TabsTrigger value="revenue">Revenue Sources</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-4">
                        <div className="grid gap-4 lg:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Revenue Trend</CardTitle>
                                    <CardDescription>
                                        Charges vs Payments over time
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium">Charges</span>
                                            <span className="text-sm text-muted-foreground">
                                                {revenueData.charges.length} days
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium">Payments</span>
                                            <span className="text-sm text-muted-foreground">
                                                {revenueData.payments.length} days
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Quick Stats</CardTitle>
                                    <CardDescription>
                                        Key performance indicators
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium">Avg Daily Charges</span>
                                            <span className="text-sm text-muted-foreground">
                                                {revenueData.charges.length > 0
                                                    ? formatCurrency(
                                                          revenueData.total_charges / revenueData.charges.length,
                                                          'MMK'
                                                      )
                                                    : formatCurrency(0, 'MMK')}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium">Avg Daily Payments</span>
                                            <span className="text-sm text-muted-foreground">
                                                {revenueData.payments.length > 0
                                                    ? formatCurrency(
                                                          revenueData.total_payments / revenueData.payments.length,
                                                          'MMK'
                                                      )
                                                    : formatCurrency(0, 'MMK')}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium">Collection Rate</span>
                                            <span className="text-sm text-muted-foreground">
                                                {revenueData.total_charges > 0
                                                    ? `${((revenueData.total_payments / revenueData.total_charges) * 100).toFixed(1)}%`
                                                    : '0%'}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="outstanding" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Outstanding Balances</CardTitle>
                                <CardDescription>
                                    Folios with remaining balances requiring payment
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="w-full overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                                            <tr>
                                                <th className="px-4 py-3 text-left font-medium">Reservation</th>
                                                <th className="px-4 py-3 text-left font-medium">Guest</th>
                                                <th className="px-4 py-3 text-left font-medium">Balance</th>
                                                <th className="px-4 py-3 text-left font-medium">Days Overdue</th>
                                                <th className="px-4 py-3 text-left font-medium">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {outstandingBalances.length === 0 ? (
                                                <tr>
                                                    <td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">
                                                        No outstanding balances
                                                    </td>
                                                </tr>
                                            ) : (
                                                outstandingBalances.map((balance) => (
                                                    <tr key={balance.id}>
                                                        <td className="px-4 py-3 font-medium">
                                                            {balance.reservation_code}
                                                        </td>
                                                        <td className="px-4 py-3">{balance.guest_name}</td>
                                                        <td className="px-4 py-3">
                                                            {formatCurrency(balance.balance, balance.currency)}
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <Badge variant={balance.days_overdue > 7 ? 'destructive' : 'secondary'}>
                                                                {balance.days_overdue} days
                                                            </Badge>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <Button asChild variant="outline" size="sm">
                                                                <Link href={`/folios/${balance.id}`}>
                                                                    View Folio
                                                                </Link>
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="payments" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Payment Methods Summary</CardTitle>
                                <CardDescription>
                                    Breakdown of payments by method in selected period
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="w-full overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                                            <tr>
                                                <th className="px-4 py-3 text-left font-medium">Payment Method</th>
                                                <th className="px-4 py-3 text-left font-medium">Total Amount</th>
                                                <th className="px-4 py-3 text-left font-medium">Transactions</th>
                                                <th className="px-4 py-3 text-left font-medium">Average</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {paymentMethods.length === 0 ? (
                                                <tr>
                                                    <td colSpan={4} className="px-4 py-6 text-center text-muted-foreground">
                                                        No payment data available
                                                    </td>
                                                </tr>
                                            ) : (
                                                paymentMethods.map((method) => (
                                                    <tr key={method.method}>
                                                        <td className="px-4 py-3 font-medium">
                                                            {formatPaymentMethod(method.method)}
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            {formatCurrency(method.total_amount, 'MMK')}
                                                        </td>
                                                        <td className="px-4 py-3">{method.transaction_count}</td>
                                                        <td className="px-4 py-3">
                                                            {formatCurrency(
                                                                method.total_amount / method.transaction_count,
                                                                'MMK'
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="revenue" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Top Revenue Sources</CardTitle>
                                <CardDescription>
                                    Charge types generating the most revenue
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="w-full overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                                            <tr>
                                                <th className="px-4 py-3 text-left font-medium">Charge Type</th>
                                                <th className="px-4 py-3 text-left font-medium">Total Amount</th>
                                                <th className="px-4 py-3 text-left font-medium">Transactions</th>
                                                <th className="px-4 py-3 text-left font-medium">Average</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {topRevenueSources.length === 0 ? (
                                                <tr>
                                                    <td colSpan={4} className="px-4 py-6 text-center text-muted-foreground">
                                                        No charge data available
                                                    </td>
                                                </tr>
                                            ) : (
                                                topRevenueSources.map((source) => (
                                                    <tr key={source.type}>
                                                        <td className="px-4 py-3 font-medium">
                                                            {formatChargeType(source.type)}
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            {formatCurrency(source.total_amount, 'MMK')}
                                                        </td>
                                                        <td className="px-4 py-3">{source.transaction_count}</td>
                                                        <td className="px-4 py-3">
                                                            {formatCurrency(
                                                                source.total_amount / source.transaction_count,
                                                                'MMK'
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}