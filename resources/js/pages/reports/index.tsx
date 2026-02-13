import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { dashboard } from '@/routes';
import { exportMethod as reportsExport, index as reportsIndex } from '@/routes/reports';
import { revenue as reportsExportRevenue } from '@/routes/reports/export';
import type { BreadcrumbItem } from '@/types';

type OccupancyRow = {
    date: string;
    total_rooms: number;
    occupied_rooms: number;
    occupancy_rate: number;
};

type RevenueSummary = {
    adr: number;
    revpar: number;
    total_revenue: number;
    revenue_by_source: Array<{ source: string; revenue: number }>;
    period: { from: string; to: string; days: number };
};

type Props = {
    filters: {
        from: string;
        to: string;
    };
    occupancy: OccupancyRow[];
    revenue: RevenueSummary;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Reports', href: reportsIndex().url },
];

export default function ReportsIndex({ filters, occupancy, revenue }: Props) {
    const [from, setFrom] = useState(filters.from);
    const [to, setTo] = useState(filters.to);

    const applyFilters = () => {
        router.get(
            reportsIndex().url,
            { from, to },
            { preserveState: true, replace: true },
        );
    };

    const exportCsv = () => {
        window.location.href = reportsExport.url({
            query: {
                from,
                to,
            },
        });
    };

    const exportRevenueCsv = () => {
        window.location.href = reportsExportRevenue.url({
            query: {
                from,
                to,
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reports" />
            <div className="flex flex-1 flex-col gap-6 rounded-xl p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-foreground">
                            အစီရင်ခံစာများ
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            နေ့စဉ်အရေအတွက်၊ ADR နှင့် RevPAR စာရင်းများကိုကြည့်ရှုပါ။
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Button type="button" variant="secondary" onClick={exportCsv}>
                            CSV ထုတ်ယူရန်
                        </Button>
                        <Button type="button" variant="secondary" onClick={exportRevenueCsv}>
                            ဝင်ငွေ CSV ထုတ်ယူရန်
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm text-muted-foreground">
                            အချိန်ကာလ စစ်ထုတ်မှု
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap items-end gap-3">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-medium text-muted-foreground">
                                    စတင်နေ့
                                </label>
                                <Input
                                    type="date"
                                    value={from}
                                    onChange={(event) => setFrom(event.target.value)}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-medium text-muted-foreground">
                                    နောက်ဆုံးနေ့
                                </label>
                                <Input
                                    type="date"
                                    value={to}
                                    onChange={(event) => setTo(event.target.value)}
                                />
                            </div>
                            <Button type="button" onClick={applyFilters}>
                                စစ်ထုတ်ရန်
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-4 lg:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm text-muted-foreground">
                                ADR
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-semibold text-foreground">
                                {revenue.adr} MMK
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm text-muted-foreground">
                                RevPAR
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-semibold text-foreground">
                                {revenue.revpar} MMK
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm text-muted-foreground">
                                စုစုပေါင်း ဝင်ငွေ
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-semibold text-foreground">
                                {revenue.total_revenue} MMK
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="text-sm text-muted-foreground">
                                နေ့စဉ် အခန်းသုံးစွဲမှု
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="w-full overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                                        <tr>
                                            <th className="px-4 py-3 text-left font-medium">
                                                နေ့စွဲ
                                            </th>
                                            <th className="px-4 py-3 text-left font-medium">
                                                အခန်းစုစုပေါင်း
                                            </th>
                                            <th className="px-4 py-3 text-left font-medium">
                                                အခန်းသုံးစွဲမှု
                                            </th>
                                            <th className="px-4 py-3 text-left font-medium">
                                                အခန်းသုံးစွဲနှုန်း
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {occupancy.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan={4}
                                                    className="px-4 py-6 text-center text-muted-foreground"
                                                >
                                                    အချက်အလက် မရှိသေးပါ
                                                </td>
                                            </tr>
                                        ) : (
                                            occupancy.map((row) => (
                                                <tr key={row.date}>
                                                    <td className="px-4 py-3">
                                                        {row.date}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        {row.total_rooms}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        {row.occupied_rooms}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        {row.occupancy_rate}%
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm text-muted-foreground">
                                လမ်းကြောင်းအလိုက် ဝင်ငွေ
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {revenue.revenue_by_source.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">
                                        လမ်းကြောင်းအလိုက် အချက်အလက် မရှိသေးပါ
                                    </p>
                                ) : (
                                    revenue.revenue_by_source.map((row) => (
                                        <div
                                            key={row.source}
                                            className="flex items-center justify-between text-sm"
                                        >
                                            <span className="capitalize">
                                                {row.source.replace('_', ' ')}
                                            </span>
                                            <span className="font-semibold text-foreground">
                                                {row.revenue} MMK
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
