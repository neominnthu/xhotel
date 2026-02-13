import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { dashboard } from '@/routes';
import {
    index as ratesIndex,
    destroy as ratesDestroy,
    store as ratesStore,
    update as ratesUpdate,
} from '@/routes/settings/rates';
import { index as cancellationPoliciesIndex } from '@/routes/settings/cancellation-policies';
import { index as roomTypesIndex } from '@/routes/settings/room-types';
import { index as auditLogsIndex } from '@/routes/settings/audit-logs';
import { t } from '@/lib/i18n';
import type { BreadcrumbItem } from '@/types';

type RoomTypeOption = {
    id: number;
    name: Record<string, string>;
};

type RateRow = {
    id: number;
    room_type_id: number;
    name: string;
    type: string;
    start_date: string;
    end_date: string;
    rate: number;
    min_stay: number;
    days_of_week: number[];
    length_of_stay_min: number | null;
    length_of_stay_max: number | null;
    adjustment_type: string | null;
    adjustment_value: number | null;
    is_active: boolean;
};

type Props = {
    roomTypes: RoomTypeOption[];
    rates: RateRow[];
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Settings', href: ratesIndex().url },
];

const tabs = [
    { label: t('settings.cancellationPolicies.tabs.cancellationPolicies'), href: cancellationPoliciesIndex().url },
    { label: t('settings.roomTypes.title'), href: roomTypesIndex().url },
    { label: t('settings.rates.title'), href: ratesIndex().url },
    { label: 'Audit Logs', href: auditLogsIndex().url },
    { label: 'System Updates', href: '/settings/updates' },
];

const rateTypes = [
    { value: 'base', label: 'Base' },
    { value: 'seasonal', label: 'Seasonal' },
    { value: 'special', label: 'Special' },
];

const adjustmentTypes = [
    { value: 'override', label: 'Override' },
    { value: 'percent', label: 'Percent discount' },
    { value: 'amount', label: 'Amount adjust' },
];

const weekdays = [
    { value: 1, label: 'Mon' },
    { value: 2, label: 'Tue' },
    { value: 3, label: 'Wed' },
    { value: 4, label: 'Thu' },
    { value: 5, label: 'Fri' },
    { value: 6, label: 'Sat' },
    { value: 7, label: 'Sun' },
];

export default function RatesIndex({ roomTypes, rates }: Props) {
    const { flash } = usePage<{ flash: { success?: string; error?: string } }>()
        .props;
    const [editingId, setEditingId] = useState<number | null>(null);
    const form = useForm({
        room_type_id: '',
        name: '',
        type: 'base',
        start_date: '',
        end_date: '',
        rate: '0',
        min_stay: '1',
        days_of_week: [] as number[],
        length_of_stay_min: '',
        length_of_stay_max: '',
        adjustment_type: 'none',
        adjustment_value: '',
        is_active: true,
    });

    const currentRates = useMemo(() => rates, [rates]);

    const toggleDay = (day: number) => {
        const next = form.data.days_of_week.includes(day)
            ? form.data.days_of_week.filter((value) => value !== day)
            : [...form.data.days_of_week, day];
        form.setData('days_of_week', next);
    };

    const startEdit = (rate: RateRow) => {
        setEditingId(rate.id);
        form.setData({
            room_type_id: rate.room_type_id.toString(),
            name: rate.name,
            type: rate.type,
            start_date: rate.start_date,
            end_date: rate.end_date,
            rate: rate.rate.toString(),
            min_stay: rate.min_stay.toString(),
            days_of_week: rate.days_of_week ?? [],
            length_of_stay_min: rate.length_of_stay_min?.toString() ?? '',
            length_of_stay_max: rate.length_of_stay_max?.toString() ?? '',
            adjustment_type: rate.adjustment_type ?? 'none',
            adjustment_value: rate.adjustment_value?.toString() ?? '',
            is_active: rate.is_active,
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
        form.reset();
    };

    const submit = () => {
        const payload = {
            room_type_id: Number(form.data.room_type_id),
            name: form.data.name,
            type: form.data.type,
            start_date: form.data.start_date,
            end_date: form.data.end_date,
            rate: Number(form.data.rate),
            min_stay: Number(form.data.min_stay),
            days_of_week: form.data.days_of_week.length
                ? form.data.days_of_week
                : null,
            length_of_stay_min: form.data.length_of_stay_min
                ? Number(form.data.length_of_stay_min)
                : null,
            length_of_stay_max: form.data.length_of_stay_max
                ? Number(form.data.length_of_stay_max)
                : null,
            adjustment_type:
                form.data.adjustment_type === 'none'
                    ? null
                    : form.data.adjustment_type,
            adjustment_value: form.data.adjustment_value
                ? Number(form.data.adjustment_value)
                : null,
            is_active: form.data.is_active,
        };

        if (editingId) {
            form.patch(ratesUpdate(editingId).url, {
                data: payload,
                preserveScroll: true,
                onSuccess: () => cancelEdit(),
            });
            return;
        }

        form.post(ratesStore().url, {
            data: payload,
            preserveScroll: true,
            onSuccess: () => form.reset(),
        });
    };

    const deleteRate = (rateId: number) => {
        if (!window.confirm(t('settings.rates.deleteConfirm'))) {
            return;
        }

        router.delete(ratesDestroy(rateId).url, {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('settings.rates.title')} />
            <div className="flex flex-1 flex-col gap-6 rounded-xl p-6">
                <div>
                    <h1 className="text-2xl font-semibold text-foreground">{t('settings.rates.title')}</h1>
                    <p className="text-sm text-muted-foreground">
                        ရက်သတ်မှတ်မှု၊ တည်းခိုကာလနှင့် discount စည်းမျဉ်းများကို စီမံပါ။
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    {tabs.map((tab) => (
                        <Button
                            key={tab.href}
                            asChild
                            variant={tab.href === ratesIndex().url ? 'default' : 'secondary'}
                        >
                            <Link href={tab.href}>{tab.label}</Link>
                        </Button>
                    ))}
                </div>

                {flash?.success && (
                    <Alert className="border-emerald-200 bg-emerald-50 text-emerald-900">
                        <AlertTitle>အောင်မြင်ပါသည်</AlertTitle>
                        <AlertDescription>{flash.success}</AlertDescription>
                    </Alert>
                )}

                {flash?.error && (
                    <Alert variant="destructive">
                        <AlertTitle>အမှားရှိသည်</AlertTitle>
                        <AlertDescription>{flash.error}</AlertDescription>
                    </Alert>
                )}

                <div className="rounded-xl border border-border bg-card p-5">
                    <h2 className="text-sm font-semibold text-muted-foreground">
                        {editingId ? 'Edit rate' : 'Create rate'}
                    </h2>
                    <div className="mt-4 grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground">
                                Room type
                            </label>
                            <Select
                                value={form.data.room_type_id}
                                onValueChange={(value) =>
                                    form.setData('room_type_id', value)
                                }
                            >
                                <SelectTrigger data-test="rate-room-type">
                                    <SelectValue placeholder="Select room type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {roomTypes.map((type) => (
                                        <SelectItem key={type.id} value={type.id.toString()}>
                                            {type.name.my ?? type.name.en ?? 'Room type'}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground">
                                Name
                            </label>
                            <Input
                                name="name"
                                value={form.data.name}
                                onChange={(event) =>
                                    form.setData('name', event.target.value)
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground">
                                Type
                            </label>
                            <Select
                                value={form.data.type}
                                onValueChange={(value) => form.setData('type', value)}
                            >
                                <SelectTrigger data-test="rate-type">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {rateTypes.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground">
                                Start date
                            </label>
                            <Input
                                type="date"
                                name="start_date"
                                value={form.data.start_date}
                                onChange={(event) =>
                                    form.setData('start_date', event.target.value)
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground">
                                End date
                            </label>
                            <Input
                                type="date"
                                name="end_date"
                                value={form.data.end_date}
                                onChange={(event) =>
                                    form.setData('end_date', event.target.value)
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground">
                                Rate (MMK)
                            </label>
                            <Input
                                type="number"
                                min={0}
                                name="rate"
                                value={form.data.rate}
                                onChange={(event) =>
                                    form.setData('rate', event.target.value)
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground">
                                Min stay
                            </label>
                            <Input
                                type="number"
                                min={1}
                                name="min_stay"
                                value={form.data.min_stay}
                                onChange={(event) =>
                                    form.setData('min_stay', event.target.value)
                                }
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-xs font-medium text-muted-foreground">
                                Days of week
                            </label>
                            <div className="flex flex-wrap gap-3">
                                {weekdays.map((day) => (
                                    <label key={day.value} className="flex items-center gap-2 text-xs">
                                        <Checkbox
                                            checked={form.data.days_of_week.includes(day.value)}
                                            onCheckedChange={() => toggleDay(day.value)}
                                        />
                                        {day.label}
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground">
                                LOS min
                            </label>
                            <Input
                                type="number"
                                min={1}
                                name="length_of_stay_min"
                                value={form.data.length_of_stay_min}
                                onChange={(event) =>
                                    form.setData('length_of_stay_min', event.target.value)
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground">
                                LOS max
                            </label>
                            <Input
                                type="number"
                                min={1}
                                name="length_of_stay_max"
                                value={form.data.length_of_stay_max}
                                onChange={(event) =>
                                    form.setData('length_of_stay_max', event.target.value)
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground">
                                Adjustment type
                            </label>
                            <Select
                                value={form.data.adjustment_type}
                                onValueChange={(value) =>
                                    form.setData('adjustment_type', value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="None" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
                                    {adjustmentTypes.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground">
                                Adjustment value
                            </label>
                            <Input
                                type="number"
                                min={0}
                                name="adjustment_value"
                                value={form.data.adjustment_value}
                                onChange={(event) =>
                                    form.setData('adjustment_value', event.target.value)
                                }
                            />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="rate-active"
                                checked={form.data.is_active}
                                onCheckedChange={(value) =>
                                    form.setData('is_active', Boolean(value))
                                }
                            />
                            <label htmlFor="rate-active" className="text-sm text-muted-foreground">
                                Active
                            </label>
                        </div>
                        <Button type="button" onClick={submit} disabled={form.processing} data-test="rate-submit">
                            {editingId ? t('settings.rates.form.buttons.save') : t('settings.rates.form.buttons.create')}
                        </Button>
                        {editingId && (
                            <Button type="button" variant="secondary" onClick={cancelEdit}>
                                {t('settings.cancellationPolicies.form.buttons.cancel')}
                            </Button>
                        )}
                    </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-5">
                    <h2 className="text-sm font-semibold text-muted-foreground">Rate list</h2>
                    <div className="mt-4 overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                                <tr>
                                    <th className="px-4 py-3 text-left font-medium">Name</th>
                                    <th className="px-4 py-3 text-left font-medium">Room type</th>
                                    <th className="px-4 py-3 text-left font-medium">Date range</th>
                                    <th className="px-4 py-3 text-left font-medium">Rate</th>
                                    <th className="px-4 py-3 text-left font-medium">Status</th>
                                    <th className="px-4 py-3 text-right font-medium">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {currentRates.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-4 py-6 text-center text-muted-foreground"
                                        >
                                            အချက်အလက် မရှိသေးပါ
                                        </td>
                                    </tr>
                                ) : (
                                    currentRates.map((rate) => (
                                        <tr key={rate.id}>
                                            <td className="px-4 py-3">{rate.name}</td>
                                            <td className="px-4 py-3">
                                                {roomTypes.find((type) => type.id === rate.room_type_id)?.name.my ??
                                                    roomTypes.find((type) => type.id === rate.room_type_id)?.name.en ??
                                                    'Room type'}
                                            </td>
                                            <td className="px-4 py-3">
                                                {rate.start_date} → {rate.end_date}
                                            </td>
                                            <td className="px-4 py-3">{rate.rate} MMK</td>
                                            <td className="px-4 py-3">
                                                <Badge variant={rate.is_active ? 'default' : 'secondary'}>
                                                    {rate.is_active ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        type="button"
                                                        variant="secondary"
                                                        onClick={() => startEdit(rate)}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        onClick={() => deleteRate(rate.id)}
                                                    >
                                                        ဖျက်ရန်
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
