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
    index as cancellationPoliciesIndex,
    store as cancellationPoliciesStore,
    update as cancellationPoliciesUpdate,
    destroy as cancellationPoliciesDestroy,
} from '@/routes/settings/cancellation-policies';
import { index as roomTypesIndex } from '@/routes/settings/room-types';
import { index as ratesIndex } from '@/routes/settings/rates';
import { index as exchangeRatesIndex } from '@/routes/settings/exchange-rates';
import { index as auditLogsIndex } from '@/routes/settings/audit-logs';
import { t } from '@/lib/i18n';
import type { BreadcrumbItem } from '@/types';

type RoomTypeOption = {
    id: number;
    name: Record<string, string>;
};

type PolicyRow = {
    id: number;
    name: string;
    room_type_id: number | null;
    deadline_hours: number;
    penalty_type: string;
    penalty_amount: number;
    penalty_percent: number;
    is_active: boolean;
};

type Props = {
    roomTypes: RoomTypeOption[];
    policies: PolicyRow[];
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Settings', href: cancellationPoliciesIndex().url },
];

const penaltyOptions = [
    { value: 'flat', label: 'Flat' },
    { value: 'percent', label: 'Percent' },
    { value: 'first_night', label: 'First night' },
];

const tabs = [
    { label: t('settings.cancellationPolicies.tabs.cancellationPolicies'), href: cancellationPoliciesIndex().url },
    { label: t('settings.cancellationPolicies.tabs.roomTypes'), href: roomTypesIndex().url },
    { label: t('settings.cancellationPolicies.tabs.rates'), href: ratesIndex().url },
    { label: t('settings.exchangeRates.title'), href: exchangeRatesIndex().url },
    { label: 'Audit Logs', href: auditLogsIndex().url },
    { label: 'System Updates', href: '/settings/updates' },
];

export default function CancellationPoliciesIndex({ roomTypes, policies }: Props) {
    const { flash } = usePage<{ flash: { success?: string; error?: string } }>()
        .props;
    const [editingId, setEditingId] = useState<number | null>(null);
    const form = useForm({
        name: '',
        room_type_id: 'all',
        deadline_hours: '24',
        penalty_type: 'flat',
        penalty_amount: '0',
        penalty_percent: '0',
        is_active: true,
    });

    const currentPolicies = useMemo(() => policies, [policies]);

    const startEdit = (policy: PolicyRow) => {
        setEditingId(policy.id);
        form.setData({
            name: policy.name,
            room_type_id: policy.room_type_id ? policy.room_type_id.toString() : 'all',
            deadline_hours: policy.deadline_hours.toString(),
            penalty_type: policy.penalty_type,
            penalty_amount: policy.penalty_amount.toString(),
            penalty_percent: policy.penalty_percent.toString(),
            is_active: policy.is_active,
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
        form.reset();
    };

    const submit = () => {
        form.transform((data) => ({
            ...data,
            room_type_id: data.room_type_id !== 'all' ? Number(data.room_type_id) : null,
            deadline_hours: Number(data.deadline_hours),
            penalty_amount: Number(data.penalty_amount),
            penalty_percent: Number(data.penalty_percent),
        }));

        if (editingId) {
            form.clearErrors();
            form.patch(cancellationPoliciesUpdate(editingId).url, {
                preserveScroll: true,
                onSuccess: () => cancelEdit(),
            });
            return;
        }

        form.post(cancellationPoliciesStore().url, {
            preserveScroll: true,
            onSuccess: () => form.reset(),
        });
    };

    const deletePolicy = (policyId: number) => {
        if (!window.confirm(t('settings.cancellationPolicies.deleteConfirm'))) {
            return;
        }

        router.delete(cancellationPoliciesDestroy(policyId).url, {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('settings.cancellationPolicies.title')} />
            <div className="flex flex-1 flex-col gap-6 rounded-xl p-6">
                <div>
                    <h1 className="text-2xl font-semibold text-foreground">
                        {t('settings.cancellationPolicies.title')}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        နောက်ဆုံးရက်စွဲနှင့် ဒဏ်ကြေးဆိုင်ရာ စည်းမျဉ်းများကို စီမံပါ။
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    {tabs.map((tab) => (
                        <Button
                            key={tab.href}
                            asChild
                            variant={tab.href === cancellationPoliciesIndex().url ? 'default' : 'secondary'}
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

                <div className="mt-4 mb-4 flex items-center gap-4">
                    <div className="w-64">
                        <Select
                            value={String('all')}
                            onValueChange={(value) => {
                                const roomTypeId = value === 'all' ? null : value;
                                router.get(cancellationPoliciesIndex().url, { room_type_id: roomTypeId });
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={t('settings.cancellationPolicies.form.placeholders.allRoomTypes')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{t('settings.cancellationPolicies.form.placeholders.allRoomTypes')}</SelectItem>
                                {roomTypes.map((roomType) => (
                                    <SelectItem key={roomType.id} value={String(roomType.id)}>
                                        {roomType.name.my ?? roomType.name.en}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-5">
                    <h2 className="text-sm font-semibold text-muted-foreground">
                        {editingId ? t('settings.cancellationPolicies.form.editTitle') : t('settings.cancellationPolicies.form.createTitle')}
                    </h2>
                    <div className="mt-4 grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground">
                                {t('settings.cancellationPolicies.form.labels.name')}
                            </label>
                            <Input
                                name="name"
                                value={form.data.name}
                                onChange={(event) =>
                                    form.setData('name', event.target.value)
                                }
                            />
                            <InputError message={form.errors.name} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground">
                                {t('settings.cancellationPolicies.form.labels.roomType')}
                            </label>
                            <Select
                                value={form.data.room_type_id}
                                onValueChange={(value) =>
                                    form.setData('room_type_id', value)
                                }
                            >
                                <SelectTrigger data-test="policy-room-type">
                                    <SelectValue
                                        placeholder={t('settings.cancellationPolicies.form.placeholders.allRoomTypes')}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        {t('settings.cancellationPolicies.form.placeholders.allRoomTypes')}
                                    </SelectItem>
                                    {roomTypes.map((roomType) => (
                                        <SelectItem
                                            key={roomType.id}
                                            value={roomType.id.toString()}
                                        >
                                            {roomType.name.my ?? roomType.name.en ?? 'Room type'}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={form.errors.room_type_id} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground">
                                Deadline hours
                            </label>
                            <Input
                                type="number"
                                min={0}
                                max={720}
                                name="deadline_hours"
                                value={form.data.deadline_hours}
                                onChange={(event) =>
                                    form.setData('deadline_hours', event.target.value)
                                }
                            />
                            <InputError message={form.errors.deadline_hours} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground">
                                Penalty type
                            </label>
                            <Select
                                value={form.data.penalty_type}
                                onValueChange={(value) =>
                                    form.setData('penalty_type', value)
                                }
                            >
                                <SelectTrigger data-test="policy-penalty-type">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {penaltyOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={form.errors.penalty_type} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground">
                                Penalty amount (MMK)
                            </label>
                            <Input
                                type="number"
                                min={0}
                                name="penalty_amount"
                                value={form.data.penalty_amount}
                                onChange={(event) =>
                                    form.setData('penalty_amount', event.target.value)
                                }
                            />
                            <InputError message={form.errors.penalty_amount} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground">
                                Penalty percent
                            </label>
                            <Input
                                type="number"
                                min={0}
                                max={100}
                                name="penalty_percent"
                                value={form.data.penalty_percent}
                                onChange={(event) =>
                                    form.setData('penalty_percent', event.target.value)
                                }
                            />
                            <InputError message={form.errors.penalty_percent} />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="policy-active"
                                checked={form.data.is_active}
                                onCheckedChange={(value) =>
                                    form.setData('is_active', Boolean(value))
                                }
                            />
                            <label
                                htmlFor="policy-active"
                                className="text-sm text-muted-foreground"
                            >
                                Active
                            </label>
                        </div>
                        <Button type="button" onClick={submit} disabled={form.processing} data-test="policy-submit">
                            {editingId ? 'Save changes' : 'Create policy'}
                        </Button>
                        {editingId && (
                            <Button type="button" variant="secondary" onClick={cancelEdit}>
                                Cancel
                            </Button>
                        )}
                    </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-5">
                    <h2 className="text-sm font-semibold text-muted-foreground">
                        Policy list
                    </h2>
                    <div className="mt-4 overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                                <tr>
                                    <th className="px-4 py-3 text-left font-medium">Name</th>
                                    <th className="px-4 py-3 text-left font-medium">Room type</th>
                                    <th className="px-4 py-3 text-left font-medium">Deadline</th>
                                    <th className="px-4 py-3 text-left font-medium">Penalty</th>
                                    <th className="px-4 py-3 text-right font-medium">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {currentPolicies.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-4 py-6 text-center text-muted-foreground"
                                        >
                                            မည်သည့် စည်းမျဉ်းမှ မရှိသေးပါ
                                        </td>
                                    </tr>
                                ) : (
                                    currentPolicies.map((policy) => (
                                        <tr key={policy.id}>
                                            <td className="px-4 py-3">{policy.name}</td>
                                            <td className="px-4 py-3">
                                                {policy.room_type_id
                                                    ? roomTypes.find(
                                                          (type) => type.id === policy.room_type_id,
                                                      )?.name.my ??
                                                      roomTypes.find(
                                                          (type) => type.id === policy.room_type_id,
                                                      )?.name.en
                                                    : 'All'}
                                            </td>
                                            <td className="px-4 py-3">
                                                {policy.deadline_hours}h
                                            </td>
                                            <td className="px-4 py-3">
                                                {policy.penalty_type === 'flat'
                                                    ? `${policy.penalty_amount} MMK`
                                                    : policy.penalty_type === 'percent'
                                                      ? `${policy.penalty_percent}%`
                                                      : 'First night'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge variant={policy.is_active ? 'default' : 'secondary'}>
                                                    {policy.is_active ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        type="button"
                                                        variant="secondary"
                                                        onClick={() => startEdit(policy)}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        onClick={() => deletePolicy(policy.id)}
                                                    >
                                                        Delete
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
