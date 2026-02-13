import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type Summary = {
    date: string;
    total_rooms: number;
    arrivals: number;
    departures: number;
    in_house: number;
    occupancy_rate: number;
    charges_total: number;
    payments_total: number;
};

type Props = {
    filters: {
        date: string;
    };
    summary: Summary;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Night Audit', href: '/night-audit' },
];

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'MMK',
        minimumFractionDigits: 0,
    }).format(amount);
}

export default function NightAuditIndex({ filters, summary }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Night Audit" />
            <div className="flex flex-1 flex-col gap-6 rounded-xl p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-foreground">
                            Night Audit Rollup
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            ရက်အလိုက် အခန်းနှုန်းနှင့် ငွေစာရင်း အကျဉ်းချုပ်
                        </p>
                    </div>
                    <div className="w-full max-w-xs">
                        <label className="text-xs font-medium text-muted-foreground">
                            ရက်စွဲ
                        </label>
                        <Input
                            type="date"
                            value={filters.date}
                            onChange={(event) =>
                                router.get(
                                    '/night-audit',
                                    { date: event.target.value },
                                    { preserveScroll: true },
                                )
                            }
                        />
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>စုစုပေါင်း အခန်း</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-semibold">
                                {summary.total_rooms}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Check-in</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-semibold">
                                {summary.arrivals}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Check-out</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-semibold">
                                {summary.departures}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>In-house</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-semibold">
                                {summary.in_house}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Occupancy</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="text-3xl font-semibold">
                                {summary.occupancy_rate}%
                            </div>
                            <p className="text-sm text-muted-foreground">
                                အခန်းဖြည့်နှုန်း
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Daily Revenue</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="text-3xl font-semibold">
                                {formatCurrency(summary.charges_total)}
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Payments: {formatCurrency(summary.payments_total)}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
