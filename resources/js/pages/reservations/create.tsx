import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
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
import { t } from '@/lib/i18n';
import type { BreadcrumbItem } from '@/types';

type RoomTypeOption = {
    id: number;
    name: Record<string, string>;
    base_rate: number;
};

type Props = {
    roomTypes: RoomTypeOption[];
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Reservations', href: '/reservations' },
    { title: 'New Reservation', href: '/reservations/create' },
];

const sourceOptions = [
    { value: 'walk_in', label: 'Walk in' },
    { value: 'phone', label: 'Phone' },
    { value: 'ota', label: 'OTA' },
    { value: 'corporate', label: 'Corporate' },
];

export default function ReservationCreate({ roomTypes }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        guest: {
            name: '',
            phone: '',
        },
        check_in: '',
        check_out: '',
        room_type_id: '',
        adults: '1',
        children: '0',
        source: 'walk_in',
        special_requests: '',
        hold_id: '',
    });
    const [hold, setHold] = useState<{
        id: number;
        expires_at: string;
    } | null>(null);
    const [holdError, setHoldError] = useState<string | null>(null);
    const [nowMs, setNowMs] = useState(() => Date.now());
    const showHoldHint = Boolean(
        data.check_in && data.check_out && data.room_type_id && !hold && !holdError,
    );

    const selectedRoomType = useMemo(
        () =>
            roomTypes.find(
                (type) => type.id.toString() === data.room_type_id,
            ),
        [data.room_type_id, roomTypes],
    );

    const holdTimeLeft = useMemo(() => {
        if (!hold) {
            return null;
        }

        const expiresAt = new Date(hold.expires_at).getTime();

        if (Number.isNaN(expiresAt)) {
            return null;
        }

        const diffMs = expiresAt - nowMs;
        const totalSeconds = Math.max(Math.floor(diffMs / 1000), 0);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        return {
            expired: diffMs <= 0,
            display: `${minutes}:${seconds.toString().padStart(2, '0')}`,
        };
    }, [hold, nowMs]);

    useEffect(() => {
        if (!hold) {
            return undefined;
        }

        const interval = window.setInterval(() => {
            setNowMs(Date.now());
        }, 1000);

        return () => window.clearInterval(interval);
    }, [hold]);

    useEffect(() => {
        if (!hold || !holdTimeLeft?.expired) {
            return;
        }

        setHold(null);
        setData('hold_id', '');
        setHoldError(t('reservation.holdExpired'));
    }, [hold, holdTimeLeft, setData]);

    const handleSubmit = () => {
        post('/reservations');
    };

    const getCsrfToken = () => {
        const token = document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute('content');
        return token ?? '';
    };

    const requestHold = async () => {
        setHoldError(null);
        setHold(null);
        setData('hold_id', '');

        if (!data.check_in || !data.check_out || !data.room_type_id) {
            setHoldError('အချိန်ကာလနှင့် အခန်းအမျိုးအစားကို ဖြည့်ပါ။');
            return;
        }

        const response = await fetch('/api/v1/availability/holds', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': getCsrfToken(),
                'X-Requested-With': 'XMLHttpRequest',
            },
            body: JSON.stringify({
                room_type_id: Number(data.room_type_id),
                check_in: data.check_in,
                check_out: data.check_out,
                quantity: 1,
            }),
        });

        if (!response.ok) {
            const payload = await response.json();
            setHoldError(payload?.message ?? 'Hold မရနိုင်ပါ။');
            return;
        }

        const payload = await response.json();
        setHold({
            id: payload.id,
            expires_at: payload.expires_at,
        });
        setData('hold_id', payload.id.toString());
    };

    const releaseHold = async () => {
        if (!hold) {
            return;
        }

        await fetch(`/api/v1/availability/holds/${hold.id}`, {
            method: 'DELETE',
            headers: {
                'X-CSRF-TOKEN': getCsrfToken(),
                'X-Requested-With': 'XMLHttpRequest',
            },
        });

        setHold(null);
        setData('hold_id', '');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="New Reservation" />
            <div className="flex flex-1 flex-col gap-6 rounded-xl p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-semibold text-foreground">
                            New Reservation
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Capture guest and stay details.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button asChild variant="ghost">
                            <Link href="/reservations">Back</Link>
                        </Button>
                        <Button
                            type="button"
                            disabled={processing}
                            onClick={handleSubmit}
                        >
                            Save Reservation
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="rounded-xl border border-border bg-card p-5 lg:col-span-2">
                        <div className="grid gap-6">
                            <div>
                                <h2 className="text-sm font-semibold text-muted-foreground">
                                    Guest
                                </h2>
                                <div className="mt-3 grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Input
                                            placeholder="Guest name"
                                            value={data.guest.name}
                                            onChange={(event) =>
                                                setData('guest', {
                                                    ...data.guest,
                                                    name: event.target.value,
                                                })
                                            }
                                        />
                                        <InputError message={errors['guest.name']} />
                                    </div>
                                    <div className="space-y-2">
                                        <Input
                                            placeholder="Phone number"
                                            value={data.guest.phone}
                                            onChange={(event) =>
                                                setData('guest', {
                                                    ...data.guest,
                                                    phone: event.target.value,
                                                })
                                            }
                                        />
                                        <InputError message={errors['guest.phone']} />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-sm font-semibold text-muted-foreground">
                                    Stay Details
                                </h2>
                                <div className="mt-3 grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Input
                                            type="date"
                                            placeholder="Check in"
                                            value={data.check_in}
                                            onChange={(event) => {
                                                setData('check_in', event.target.value);
                                                setHold(null);
                                                setData('hold_id', '');
                                            }}
                                        />
                                        <InputError message={errors.check_in} />
                                    </div>
                                    <div className="space-y-2">
                                        <Input
                                            type="date"
                                            placeholder="Check out"
                                            value={data.check_out}
                                            onChange={(event) => {
                                                setData('check_out', event.target.value);
                                                setHold(null);
                                                setData('hold_id', '');
                                            }}
                                        />
                                        <InputError message={errors.check_out} />
                                    </div>
                                    <div className="space-y-2">
                                        <Select
                                            value={data.room_type_id}
                                            onValueChange={(value) => {
                                                setData('room_type_id', value);
                                                setHold(null);
                                                setData('hold_id', '');
                                            }}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Room type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {roomTypes.map((roomType) => (
                                                    <SelectItem
                                                        key={roomType.id}
                                                        value={roomType.id.toString()}
                                                    >
                                                        {roomType.name.en ??
                                                            'Room type'}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.room_type_id} />
                                    </div>
                                    <div className="space-y-2">
                                        <Input
                                            type="number"
                                            min={1}
                                            placeholder="Adults"
                                            value={data.adults}
                                            onChange={(event) =>
                                                setData(
                                                    'adults',
                                                    event.target.value,
                                                )
                                            }
                                        />
                                        <InputError message={errors.adults} />
                                    </div>
                                    <div className="space-y-2">
                                        <Input
                                            type="number"
                                            min={0}
                                            placeholder="Children"
                                            value={data.children}
                                            onChange={(event) =>
                                                setData(
                                                    'children',
                                                    event.target.value,
                                                )
                                            }
                                        />
                                        <InputError message={errors.children} />
                                    </div>
                                    <div className="space-y-2">
                                        <Select
                                            value={data.source}
                                            onValueChange={(value) =>
                                                setData('source', value)
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Source" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {sourceOptions.map((option) => (
                                                    <SelectItem
                                                        key={option.value}
                                                        value={option.value}
                                                    >
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.source} />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-sm font-semibold text-muted-foreground">
                                    Special Requests
                                </h2>
                                <div className="mt-3">
                                    <div className="space-y-2">
                                        <Input
                                            placeholder="Notes or requests"
                                            value={data.special_requests}
                                            onChange={(event) =>
                                                setData(
                                                    'special_requests',
                                                    event.target.value,
                                                )
                                            }
                                        />
                                        <InputError message={errors.special_requests} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-5">
                        <h2 className="text-sm font-semibold text-muted-foreground">
                            Summary
                        </h2>
                        <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                            <div className="flex items-center justify-between">
                                <span>Guest</span>
                                <span className="text-foreground">
                                    {data.guest.name || '—'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Stay</span>
                                <span className="text-foreground">
                                    {data.check_in && data.check_out
                                        ? `${data.check_in} - ${data.check_out}`
                                        : '—'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Room type</span>
                                <span className="text-foreground">
                                    {selectedRoomType?.name.en ?? '—'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Guests</span>
                                <span className="text-foreground">
                                    {data.adults} adult(s), {data.children} child
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Source</span>
                                <span className="text-foreground">
                                    {sourceOptions.find(
                                        (opt) => opt.value === data.source,
                                    )?.label ?? '—'}
                                </span>
                            </div>
                            <div className="rounded-lg border border-dashed border-border p-3 text-xs">
                                Rate: {selectedRoomType?.base_rate ?? 0} MMK/night
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <span>Availability Hold အခြေအနေ</span>
                                    <span>{hold ? 'အတည်ပြုထားသည်' : 'မရှိသေးပါ'}</span>
                                </div>
                                {showHoldHint && (
                                    <Alert className="border-sky-200 bg-sky-50 text-sky-900">
                                        <AlertTitle>{t('reservation.holdRequiredTitle')}</AlertTitle>
                                        <AlertDescription>
                                            {t('reservation.holdRequired')}
                                        </AlertDescription>
                                    </Alert>
                                )}
                                {hold && (
                                    <Alert className="border-amber-200 bg-amber-50 text-amber-900">
                                        <AlertTitle>{t('reservation.holdActive')}</AlertTitle>
                                        <AlertDescription>
                                            {t('reservation.holdExpiresAt')}: {hold.expires_at}
                                            {holdTimeLeft?.display
                                                ? ` (${t('reservation.holdTimeLeft')} ${holdTimeLeft.display})`
                                                : ''}
                                        </AlertDescription>
                                    </Alert>
                                )}
                                {holdError && (
                                    <Alert variant="destructive">
                                        <AlertTitle>Hold မရနိုင်ပါ</AlertTitle>
                                        <AlertDescription>{holdError}</AlertDescription>
                                    </Alert>
                                )}
                                <div className="flex flex-wrap gap-2">
                                    <Button type="button" variant="secondary" onClick={requestHold}>
                                        Hold လုပ်ရန်
                                    </Button>
                                    {hold && (
                                        <Button type="button" variant="ghost" onClick={releaseHold}>
                                            Release လုပ်ရန်
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
