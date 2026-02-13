import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { dashboard } from '@/routes';
import {
    index as exchangeRatesIndex,
    store as exchangeRatesStore,
    update as exchangeRatesUpdate,
    destroy as exchangeRatesDestroy,
} from '@/routes/settings/exchange-rates';
import { index as cancellationPoliciesIndex } from '@/routes/settings/cancellation-policies';
import { index as roomTypesIndex } from '@/routes/settings/room-types';
import { index as ratesIndex } from '@/routes/settings/rates';
import { index as auditLogsIndex } from '@/routes/settings/audit-logs';
import { t } from '@/lib/i18n';
import type { BreadcrumbItem } from '@/types';

type ExchangeRateRow = {
    id: number;
    base_currency: string;
    quote_currency: string;
    rate: number;
    effective_date: string;
    source: string | null;
    is_active: boolean;
};

type Props = {
    defaultCurrency: string;
    exchangeRates: ExchangeRateRow[];
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Settings', href: exchangeRatesIndex().url },
];

const currencyOptions = ['MMK', 'USD', 'EUR', 'THB', 'SGD'];

const tabs = [
    { label: t('settings.cancellationPolicies.tabs.cancellationPolicies'), href: cancellationPoliciesIndex().url },
    { label: t('settings.roomTypes.title'), href: roomTypesIndex().url },
    { label: t('settings.rates.title'), href: ratesIndex().url },
    { label: t('settings.exchangeRates.title'), href: exchangeRatesIndex().url },
    { label: 'Audit Logs', href: auditLogsIndex().url },
    { label: 'System Updates', href: '/settings/updates' },
];

export default function ExchangeRatesIndex({ defaultCurrency, exchangeRates }: Props) {
    const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props;
    const [editingId, setEditingId] = useState<number | null>(null);
    const availableQuotes = useMemo(() => {
        const options = Array.from(
            new Set([defaultCurrency, ...currencyOptions]),
        );

        return options.filter((currency) => currency !== defaultCurrency);
    }, [defaultCurrency]);

    const form = useForm({
        base_currency: defaultCurrency,
        quote_currency: availableQuotes[0] ?? '',
        rate: '',
        effective_date: '',
        source: '',
        is_active: true,
    });

    const currentRates = useMemo(() => exchangeRates, [exchangeRates]);

    const startEdit = (rate: ExchangeRateRow) => {
        setEditingId(rate.id);
        form.setData({
            base_currency: rate.base_currency,
            quote_currency: rate.quote_currency,
            rate: rate.rate.toString(),
            effective_date: rate.effective_date,
            source: rate.source ?? '',
            is_active: rate.is_active,
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
        form.reset();
        form.setData('base_currency', defaultCurrency);
        form.setData('quote_currency', availableQuotes[0] ?? '');
    };

    const submit = () => {
        form.transform((data) => ({
            ...data,
            base_currency: data.base_currency.toUpperCase(),
            quote_currency: data.quote_currency.toUpperCase(),
            rate: Number(data.rate),
            source: data.source || null,
        }));

        if (editingId) {
            form.patch(exchangeRatesUpdate(editingId).url, {
                preserveState: false,
                preserveScroll: true,
                onSuccess: () => {
                    cancelEdit();
                    router.reload({ only: ['exchangeRates'], preserveScroll: true });
                },
            });
            return;
        }

        form.post(exchangeRatesStore().url, {
            preserveState: false,
            preserveScroll: true,
            onSuccess: () => {
                form.reset();
                form.setData('base_currency', defaultCurrency);
                form.setData('quote_currency', availableQuotes[0] ?? '');
                router.reload({ only: ['exchangeRates'], preserveScroll: true });
            },
        });
    };

    const deleteRate = (rateId: number) => {
        if (!window.confirm(t('settings.exchangeRates.deleteConfirm'))) {
            return;
        }

        router.delete(exchangeRatesDestroy(rateId).url, {
            preserveScroll: true,
            onSuccess: () => {
                router.reload({ only: ['exchangeRates'], preserveScroll: true });
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('settings.exchangeRates.title')} />
            <div className="flex flex-1 flex-col gap-6 rounded-xl p-6">
                <div>
                    <h1 className="text-2xl font-semibold text-foreground">
                        {t('settings.exchangeRates.title')}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        ငွေလဲလှယ်နှုန်းများကို သတ်မှတ်ပြီး အခြားငွေကြေး လက်ခံမှုများကို အဆင်ပြေစေပါသည်။
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    {tabs.map((tab) => (
                        <Button
                            key={tab.href}
                            asChild
                            variant={tab.href === exchangeRatesIndex().url ? 'default' : 'secondary'}
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
                        {editingId
                            ? t('settings.exchangeRates.form.editTitle')
                            : t('settings.exchangeRates.form.createTitle')}
                    </h2>
                    <div className="mt-4 grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground">
                                {t('settings.exchangeRates.form.labels.baseCurrency')}
                            </label>
                            <Input
                                value={form.data.base_currency}
                                disabled
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground">
                                {t('settings.exchangeRates.form.labels.quoteCurrency')}
                            </label>
                            <Select
                                value={form.data.quote_currency}
                                onValueChange={(value) => form.setData('quote_currency', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Currency" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableQuotes.map((currency) => (
                                        <SelectItem key={currency} value={currency}>
                                            {currency}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={form.errors.quote_currency} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground">
                                {t('settings.exchangeRates.form.labels.rate')}
                            </label>
                            <Input
                                type="number"
                                min={0}
                                step="0.000001"
                                placeholder="0.000000"
                                value={form.data.rate}
                                onChange={(event) => form.setData('rate', event.target.value)}
                            />
                            <InputError message={form.errors.rate} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground">
                                {t('settings.exchangeRates.form.labels.effectiveDate')}
                            </label>
                            <Input
                                type="date"
                                value={form.data.effective_date}
                                onChange={(event) =>
                                    form.setData('effective_date', event.target.value)
                                }
                            />
                            <InputError message={form.errors.effective_date} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground">
                                {t('settings.exchangeRates.form.labels.source')}
                            </label>
                            <Input
                                placeholder="Manual"
                                value={form.data.source}
                                onChange={(event) => form.setData('source', event.target.value)}
                            />
                            <InputError message={form.errors.source} />
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox
                                checked={form.data.is_active}
                                onCheckedChange={(value) =>
                                    form.setData('is_active', Boolean(value))
                                }
                            />
                            <span className="text-sm text-muted-foreground">
                                {t('settings.exchangeRates.form.labels.isActive')}
                            </span>
                        </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                        <Button type="button" onClick={submit} disabled={form.processing}>
                            {editingId
                                ? t('settings.exchangeRates.form.buttons.save')
                                : t('settings.exchangeRates.form.buttons.create')}
                        </Button>
                        {editingId && (
                            <Button type="button" variant="ghost" onClick={cancelEdit}>
                                {t('settings.exchangeRates.form.buttons.cancel')}
                            </Button>
                        )}
                    </div>
                </div>

                <div className="rounded-xl border border-border bg-card">
                    <div className="border-b border-border px-4 py-3">
                        <h2 className="text-sm font-semibold text-foreground">
                            {t('settings.exchangeRates.table.title')}
                        </h2>
                    </div>
                    <div className="w-full overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                                <tr>
                                    <th className="px-4 py-3 text-left font-medium">
                                        {t('settings.exchangeRates.table.headers.pair')}
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium">
                                        {t('settings.exchangeRates.table.headers.rate')}
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium">
                                        {t('settings.exchangeRates.table.headers.effectiveDate')}
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium">
                                        {t('settings.exchangeRates.table.headers.source')}
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium">
                                        {t('settings.exchangeRates.table.headers.status')}
                                    </th>
                                    <th className="px-4 py-3 text-right font-medium">
                                        {t('settings.exchangeRates.table.headers.actions')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {currentRates.length === 0 ? (
                                    <tr>
                                        <td
                                            className="px-4 py-6 text-center text-muted-foreground"
                                            colSpan={6}
                                        >
                                            {t('settings.exchangeRates.table.empty')}
                                        </td>
                                    </tr>
                                ) : (
                                    currentRates.map((rate) => (
                                        <tr key={rate.id}>
                                            <td className="px-4 py-3 font-medium text-foreground">
                                                {rate.quote_currency} → {rate.base_currency}
                                            </td>
                                            <td className="px-4 py-3">
                                                1 {rate.quote_currency} = {rate.rate} {rate.base_currency}
                                            </td>
                                            <td className="px-4 py-3">
                                                {rate.effective_date}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {rate.source || '—'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge variant={rate.is_active ? 'secondary' : 'outline'}>
                                                    {rate.is_active
                                                        ? t('settings.exchangeRates.table.active')
                                                        : t('settings.exchangeRates.table.inactive')}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => startEdit(rate)}
                                                    >
                                                        {t('settings.exchangeRates.table.actions.edit')}
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="ghost"
                                                        className="text-destructive"
                                                        onClick={() => deleteRate(rate.id)}
                                                    >
                                                        {t('settings.exchangeRates.table.actions.delete')}
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
