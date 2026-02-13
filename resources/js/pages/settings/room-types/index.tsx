import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { dashboard } from '@/routes';
import {
    index as roomTypesIndex,
    destroy as roomTypesDestroy,
    store as roomTypesStore,
    update as roomTypesUpdate,
} from '@/routes/settings/room-types';
import { index as cancellationPoliciesIndex } from '@/routes/settings/cancellation-policies';
import { index as ratesIndex } from '@/routes/settings/rates';
import { index as auditLogsIndex } from '@/routes/settings/audit-logs';
import { t } from '@/lib/i18n';
import type { BreadcrumbItem } from '@/types';

type RoomTypeRow = {
    id: number;
    name: Record<string, string>;
    capacity: number;
    overbooking_limit: number;
    base_rate: number;
    sort_order: number;
    is_active: boolean;
};

type Props = {
    roomTypes: RoomTypeRow[];
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Settings', href: roomTypesIndex().url },
];

const tabs = [
    { label: t('settings.cancellationPolicies.tabs.cancellationPolicies'), href: cancellationPoliciesIndex().url },
    { label: t('settings.roomTypes.title'), href: roomTypesIndex().url },
    { label: t('settings.rates.title'), href: ratesIndex().url },
    { label: 'Audit Logs', href: auditLogsIndex().url },
    { label: 'System Updates', href: '/settings/updates' },
];

export default function RoomTypesIndex({ roomTypes }: Props) {
    const { flash } = usePage<{ flash: { success?: string; error?: string } }>()
        .props;
    const [editingId, setEditingId] = useState<number | null>(null);
    const form = useForm({
        name_en: '',
        name_my: '',
        capacity: '2',
        overbooking_limit: '0',
        base_rate: '0',
        sort_order: '0',
        is_active: true,
    });

    const currentTypes = useMemo(() => roomTypes, [roomTypes]);

    const startEdit = (roomType: RoomTypeRow) => {
        setEditingId(roomType.id);
        form.setData({
            name_en: roomType.name.en ?? '',
            name_my: roomType.name.my ?? '',
            capacity: roomType.capacity.toString(),
            overbooking_limit: roomType.overbooking_limit.toString(),
            base_rate: roomType.base_rate.toString(),
            sort_order: roomType.sort_order?.toString() ?? '0',
            is_active: roomType.is_active,
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
        form.reset();
    };

    const submit = () => {
        const payload = {
            name_en: form.data.name_en,
            name_my: form.data.name_my,
            capacity: Number(form.data.capacity),
            overbooking_limit: Number(form.data.overbooking_limit),
            base_rate: Number(form.data.base_rate),
            sort_order: Number(form.data.sort_order),
            is_active: form.data.is_active,
        };

        if (editingId) {
            form.patch(roomTypesUpdate(editingId).url, {
                data: payload,
                preserveScroll: true,
                onSuccess: () => cancelEdit(),
            });
            return;
        }

        form.post(roomTypesStore().url, {
            data: payload,
            preserveScroll: true,
            onSuccess: () => form.reset(),
        });
    };

    const deleteRoomType = (roomTypeId: number) => {
        if (!window.confirm(t('settings.roomTypes.deleteConfirm'))) {
            return;
        }

        router.delete(roomTypesDestroy(roomTypeId).url, {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('settings.roomTypes.title')} />
            <div className="flex flex-1 flex-col gap-6 rounded-xl p-6">
                <div>
                    <h1 className="text-2xl font-semibold text-foreground">
                        {t('settings.roomTypes.title')}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        အခန်းအမျိုးအစား၊ အင်အားနဲ့ overbooking ကန့်သတ်ချက်များကို စီမံပါ။
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    {tabs.map((tab) => (
                        <Button
                            key={tab.href}
                            asChild
                            variant={tab.href === roomTypesIndex().url ? 'default' : 'secondary'}
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
                        {editingId ? t('settings.roomTypes.form.editTitle') : t('settings.roomTypes.form.createTitle')}
                    </h2>
                    <div className="mt-4 grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground">
                                English name
                            </label>
                            <Input
                                name="name_en"
                                value={form.data.name_en}
                                onChange={(event) =>
                                    form.setData('name_en', event.target.value)
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground">
                                Myanmar name
                            </label>
                            <Input
                                name="name_my"
                                value={form.data.name_my}
                                onChange={(event) =>
                                    form.setData('name_my', event.target.value)
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground">
                                Capacity
                            </label>
                            <Input
                                type="number"
                                min={1}
                                name="capacity"
                                value={form.data.capacity}
                                onChange={(event) =>
                                    form.setData('capacity', event.target.value)
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground">
                                Overbooking limit
                            </label>
                            <Input
                                type="number"
                                min={0}
                                name="overbooking_limit"
                                value={form.data.overbooking_limit}
                                onChange={(event) =>
                                    form.setData('overbooking_limit', event.target.value)
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground">
                                Base rate (MMK)
                            </label>
                            <Input
                                type="number"
                                min={0}
                                name="base_rate"
                                value={form.data.base_rate}
                                onChange={(event) =>
                                    form.setData('base_rate', event.target.value)
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground">
                                Sort order
                            </label>
                            <Input
                                type="number"
                                min={0}
                                name="sort_order"
                                value={form.data.sort_order}
                                onChange={(event) =>
                                    form.setData('sort_order', event.target.value)
                                }
                            />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="roomtype-active"
                                checked={form.data.is_active}
                                onCheckedChange={(value) =>
                                    form.setData('is_active', Boolean(value))
                                }
                            />
                            <label
                                htmlFor="roomtype-active"
                                className="text-sm text-muted-foreground"
                            >
                                Active
                            </label>
                        </div>
                        <Button type="button" onClick={submit} disabled={form.processing} data-test="room-type-submit">
                            {editingId ? t('settings.roomTypes.form.buttons.save') : t('settings.roomTypes.form.buttons.create')}
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
                        Room type list
                    </h2>
                    <div className="mt-4 overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                                <tr>
                                    <th className="px-4 py-3 text-left font-medium">{t('settings.roomTypes.table.headers.name')}</th>
                                    <th className="px-4 py-3 text-left font-medium">{t('settings.roomTypes.table.headers.capacity')}</th>
                                    <th className="px-4 py-3 text-left font-medium">{t('settings.roomTypes.table.headers.overbooking')}</th>
                                    <th className="px-4 py-3 text-left font-medium">{t('settings.roomTypes.table.headers.base_rate')}</th>
                                    <th className="px-4 py-3 text-left font-medium">{t('settings.roomTypes.table.headers.status')}</th>
                                    <th className="px-4 py-3 text-right font-medium">{t('settings.roomTypes.table.actions.edit')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {currentTypes.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-4 py-6 text-center text-muted-foreground"
                                        >
                                            အချက်အလက် မရှိသေးပါ
                                        </td>
                                    </tr>
                                ) : (
                                    currentTypes.map((roomType) => (
                                        <tr key={roomType.id}>
                                            <td className="px-4 py-3">
                                                {roomType.name.my ?? roomType.name.en}
                                            </td>
                                            <td className="px-4 py-3">
                                                {roomType.capacity}
                                            </td>
                                            <td className="px-4 py-3">
                                                {roomType.overbooking_limit}
                                            </td>
                                            <td className="px-4 py-3">
                                                {roomType.base_rate} MMK
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge variant={roomType.is_active ? 'default' : 'secondary'}>
                                                    {roomType.is_active ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        type="button"
                                                        variant="secondary"
                                                        onClick={() => startEdit(roomType)}
                                                    >
                                                        {t('settings.roomTypes.table.actions.edit')}
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        onClick={() => deleteRoomType(roomType.id)}
                                                    >
                                                        {t('settings.roomTypes.table.actions.delete')}
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
