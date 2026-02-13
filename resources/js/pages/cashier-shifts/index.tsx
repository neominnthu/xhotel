import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type CashierOption = {
    id: number;
    name: string;
};

type Shift = {
    id: number;
    status: string;
    currency: string;
    opening_cash: number;
    closing_cash?: number | null;
    expected_cash?: number | null;
    variance?: number | null;
    total_cash: number;
    total_card: number;
    opened_at?: string | null;
    closed_at?: string | null;
    notes?: string | null;
};

type Report = {
    date: string;
    total_cash: number;
    total_card: number;
};

type Props = {
    filters: {
        date: string;
        cashier_id?: number | null;
    };
    cashiers: CashierOption[];
    current_shift: Shift | null;
    recent_shifts: Shift[];
    report: Report;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Cashier Shifts', href: '/cashier-shifts' },
];

function formatCurrency(amount: number, currency: string): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
    }).format(amount);
}

function formatDateTime(value?: string | null): string {
    if (!value) {
        return '—';
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
        return value;
    }

    return parsed.toLocaleString();
}

function statusVariant(status: string): 'default' | 'secondary' | 'outline' | 'destructive' {
    if (status === 'open') {
        return 'default';
    }

    if (status === 'closed') {
        return 'secondary';
    }

    return 'outline';
}

export default function CashierShiftsIndex({
    filters,
    cashiers,
    current_shift: currentShift,
    recent_shifts: recentShifts,
    report,
}: Props) {
    const { auth } = usePage().props as { auth: { user?: { role?: string } } };
    const isAdmin = auth?.user?.role === 'admin';
    const cashierOptions = useMemo(() => cashiers ?? [], [cashiers]);

    const [reportDate, setReportDate] = useState(report.date);
    const [reportCashierId, setReportCashierId] = useState(
        filters.cashier_id ? String(filters.cashier_id) : '',
    );

    const openForm = useForm({
        opening_cash: '',
        currency: 'MMK',
        notes: '',
    });

    const closeForm = useForm({
        closing_cash: '',
        notes: '',
    });

    const applyReportFilters = () => {
        router.get(
            '/cashier-shifts',
            {
                date: reportDate,
                cashier_id: reportCashierId ? Number(reportCashierId) : undefined,
            },
            { preserveState: true, replace: true },
        );
    };

    const hasOpenShift = currentShift?.status === 'open';
    const selectedCashier = cashierOptions.find(
        (cashier) => String(cashier.id) === reportCashierId,
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Cashier Shifts" />
            <div className="flex flex-1 flex-col gap-6 rounded-xl p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-foreground">
                            ငွေကိုင်အပြောင်း
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            အပြောင်းဖွင့်/ပိတ် နှင့် နေ့စဉ်ငွေစာရင်းကို စစ်ဆေးပါ။
                        </p>
                    </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm text-muted-foreground">
                                လက်ရှိအပြောင်း
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {currentShift ? (
                                <>
                                    <Badge variant={statusVariant(currentShift.status)}>
                                        {currentShift.status === 'open'
                                            ? 'ဖွင့်ထား'
                                            : 'ပိတ်ထား'}
                                    </Badge>
                                    <div className="text-sm text-muted-foreground">
                                        ဖွင့်ချိန်: {formatDateTime(currentShift.opened_at)}
                                    </div>
                                    <div className="text-lg font-semibold text-foreground">
                                        {formatCurrency(currentShift.opening_cash, currentShift.currency)}
                                    </div>
                                </>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    လက်ရှိအပြောင်း မရှိသေးပါ။
                                </p>
                            )}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm text-muted-foreground">
                                စုစုပေါင်း ကတ်/ငွေ
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="text-sm text-muted-foreground">ငွေသား</div>
                            <div className="text-lg font-semibold text-foreground">
                                {formatCurrency(report.total_cash, 'MMK')}
                            </div>
                            <div className="text-sm text-muted-foreground">ကတ်</div>
                            <div className="text-lg font-semibold text-foreground">
                                {formatCurrency(report.total_card, 'MMK')}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm text-muted-foreground">
                                Variance
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="text-sm text-muted-foreground">
                                လက်ရှိအပြောင်း Variance
                            </div>
                            <div
                                className={`text-lg font-semibold ${
                                    currentShift?.variance
                                        ? currentShift.variance < 0
                                            ? 'text-destructive'
                                            : 'text-foreground'
                                        : 'text-muted-foreground'
                                }`}
                            >
                                {currentShift?.variance !== null &&
                                currentShift?.variance !== undefined
                                    ? formatCurrency(currentShift.variance, currentShift.currency)
                                    : '—'}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm text-muted-foreground">
                            အပြောင်း စစ်ထုတ်မှု
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap items-end gap-3">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-medium text-muted-foreground">
                                    နေ့စွဲ
                                </label>
                                <Input
                                    type="date"
                                    value={reportDate}
                                    onChange={(event) => setReportDate(event.target.value)}
                                />
                            </div>
                            <div className="flex flex-col gap-2 min-w-[200px]">
                                    <label className="text-xs font-medium text-muted-foreground">
                                        ငွေကိုင်
                                    </label>
                                <Select
                                    value={reportCashierId}
                                    onValueChange={setReportCashierId}
                                    disabled={!isAdmin && cashierOptions.length <= 1}
                                >
                                    <SelectTrigger>
                                        <SelectValue
                                            placeholder={
                                                selectedCashier
                                                    ? selectedCashier.name
                                                    : 'Cashier ရွေးပါ'
                                            }
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {cashierOptions.map((cashier) => (
                                            <SelectItem key={cashier.id} value={String(cashier.id)}>
                                                {cashier.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button type="button" onClick={applyReportFilters}>
                                စစ်ထုတ်ရန်
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-6 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm text-muted-foreground">
                                အပြောင်း ဖွင့်ရန်
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {hasOpenShift ? (
                                <p className="text-sm text-muted-foreground">
                                    လက်ရှိအပြောင်း ဖွင့်ထားပြီးသားဖြစ်ပါသည်။
                                </p>
                            ) : (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-muted-foreground">
                                            ဖွင့်ငွေ
                                        </label>
                                        <Input
                                            type="number"
                                            min={0}
                                            value={openForm.data.opening_cash}
                                            onChange={(event) =>
                                                openForm.setData('opening_cash', event.target.value)
                                            }
                                        />
                                        <InputError message={openForm.errors.opening_cash} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-muted-foreground">
                                            ငွေကြေး
                                        </label>
                                        <Input
                                            value={openForm.data.currency}
                                            onChange={(event) =>
                                                openForm.setData(
                                                    'currency',
                                                    event.target.value.toUpperCase(),
                                                )
                                            }
                                        />
                                        <InputError message={openForm.errors.currency} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-muted-foreground">
                                            မှတ်ချက်
                                        </label>
                                        <Input
                                            value={openForm.data.notes}
                                            onChange={(event) =>
                                                openForm.setData('notes', event.target.value)
                                            }
                                        />
                                        <InputError message={openForm.errors.notes} />
                                    </div>
                                    <Button
                                        type="button"
                                        onClick={() => openForm.post('/cashier-shifts/open')}
                                        disabled={openForm.processing}
                                    >
                                        အပြောင်းဖွင့်ရန်
                                    </Button>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm text-muted-foreground">
                                အပြောင်း ပိတ်ရန်
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {!hasOpenShift ? (
                                <p className="text-sm text-muted-foreground">
                                    ပိတ်ရန်အတွက် ဖွင့်ထားသော အပြောင်း မရှိပါ။
                                </p>
                            ) : (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-muted-foreground">
                                            ပိတ်ငွေ
                                        </label>
                                        <Input
                                            type="number"
                                            min={0}
                                            value={closeForm.data.closing_cash}
                                            onChange={(event) =>
                                                closeForm.setData('closing_cash', event.target.value)
                                            }
                                        />
                                        <InputError message={closeForm.errors.closing_cash} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-muted-foreground">
                                            မှတ်ချက်
                                        </label>
                                        <Input
                                            value={closeForm.data.notes}
                                            onChange={(event) =>
                                                closeForm.setData('notes', event.target.value)
                                            }
                                        />
                                        <InputError message={closeForm.errors.notes} />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={() =>
                                            closeForm.post(`/cashier-shifts/${currentShift?.id}/close`)
                                        }
                                        disabled={closeForm.processing}
                                    >
                                        အပြောင်းပိတ်ရန်
                                    </Button>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm text-muted-foreground">
                            မကြာသေးမီ အပြောင်းများ
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="w-full overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                                    <tr>
                                        <th className="px-4 py-3 text-left font-medium">အခြေအနေ</th>
                                        <th className="px-4 py-3 text-left font-medium">ဖွင့်ချိန်</th>
                                        <th className="px-4 py-3 text-left font-medium">ပိတ်ချိန်</th>
                                        <th className="px-4 py-3 text-right font-medium">ငွေသား</th>
                                        <th className="px-4 py-3 text-right font-medium">ကတ်</th>
                                        <th className="px-4 py-3 text-right font-medium">Variance</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {recentShifts.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="px-4 py-6 text-center text-muted-foreground"
                                            >
                                                အပြောင်းအချက်အလက် မရှိသေးပါ
                                            </td>
                                        </tr>
                                    ) : (
                                        recentShifts.map((shift) => (
                                            <tr key={shift.id}>
                                                <td className="px-4 py-3">
                                                    <Badge variant={statusVariant(shift.status)}>
                                                        {shift.status}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-3">
                                                    {formatDateTime(shift.opened_at)}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {formatDateTime(shift.closed_at)}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    {formatCurrency(shift.total_cash, shift.currency)}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    {formatCurrency(shift.total_card, shift.currency)}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    {shift.variance !== null && shift.variance !== undefined
                                                        ? formatCurrency(shift.variance, shift.currency)
                                                        : '—'}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
