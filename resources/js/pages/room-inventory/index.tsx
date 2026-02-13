import { Head, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

type RoomRow = {
    id: number;
    number: string;
    floor?: string | number | null;
    status: string;
    housekeeping_status: string | null;
    room_type?: {
        id: number;
        name: Record<string, string> | string;
    } | null;
};

type ReservationBlock = {
    id: number;
    room_id: number;
    status: string;
    guest_name?: string | null;
    check_in: string;
    check_out: string;
};

type Props = {
    filters: {
        from: string;
        days: number;
    };
    dates: string[];
    rooms: RoomRow[];
    reservations: ReservationBlock[];
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Room Inventory', href: '/room-inventory' },
];

function formatRoomType(name?: Record<string, string> | string | null): string {
    if (!name) {
        return '—';
    }

    if (typeof name === 'string') {
        return name;
    }

    return name.my ?? name.en ?? Object.values(name)[0] ?? '—';
}

function formatDateLabel(value: string): string {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
        return value;
    }

    return parsed.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
    });
}

function formatWeekday(value: string): string {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
        return '';
    }

    return parsed.toLocaleDateString('en-US', { weekday: 'short' });
}

function statusVariant(status: string): 'default' | 'secondary' | 'outline' | 'destructive' {
    if (status === 'checked_in') {
        return 'default';
    }

    if (status === 'confirmed') {
        return 'secondary';
    }

    return 'outline';
}

function roomStatusTone(status: string): string {
    switch (status) {
        case 'occupied':
            return 'bg-emerald-500/20 text-emerald-700';
        case 'out_of_order':
            return 'bg-rose-500/20 text-rose-700';
        default:
            return 'bg-slate-500/10 text-slate-600';
    }
}

export default function RoomInventoryIndex({ filters, dates, rooms, reservations }: Props) {
    const [from, setFrom] = useState(filters.from);
    const [days, setDays] = useState(String(filters.days));

    const reservationsByRoom = useMemo(() => {
        const map = new Map<number, ReservationBlock[]>();
        reservations.forEach((reservation) => {
            const list = map.get(reservation.room_id) ?? [];
            list.push(reservation);
            map.set(reservation.room_id, list);
        });
        return map;
    }, [reservations]);

    const applyFilters = () => {
        router.get(
            '/room-inventory',
            {
                from,
                days: Number(days),
            },
            { preserveState: true, replace: true },
        );
    };

    const columnsTemplate = useMemo(
        () => `220px repeat(${dates.length}, minmax(120px, 1fr))`,
        [dates.length],
    );

    const hasData = rooms.length > 0 && dates.length > 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Room Inventory" />
            <div className="flex flex-1 flex-col gap-6 rounded-xl p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-foreground">
                            အခန်းအရေအတွက် Grid
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            အချိန်ကာလအလိုက် အခန်းအသုံးပြုမှုကို လျင်မြန်စွာ ကြည့်ရှုပါ။
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm text-muted-foreground">
                            စစ်ထုတ်မှု
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
                            <div className="flex flex-col gap-2 min-w-[140px]">
                                <label className="text-xs font-medium text-muted-foreground">
                                    နေ့အရေအတွက်
                                </label>
                                <Select value={days} onValueChange={setDays}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="14" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="7">7 days</SelectItem>
                                        <SelectItem value="14">14 days</SelectItem>
                                        <SelectItem value="30">30 days</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button type="button" onClick={applyFilters}>
                                စစ်ထုတ်ရန်
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm text-muted-foreground">
                            Room Inventory Grid
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {!hasData ? (
                            <p className="text-sm text-muted-foreground">
                                အချက်အလက် မရှိသေးပါ
                            </p>
                        ) : (
                            <div className="overflow-x-auto">
                                <div className="min-w-[900px]">
                                    <div
                                        className="grid border border-border bg-muted/30 text-xs uppercase text-muted-foreground"
                                        style={{ gridTemplateColumns: columnsTemplate }}
                                    >
                                        <div className="sticky left-0 z-10 border-r border-border bg-muted/50 px-3 py-3">
                                            Room
                                        </div>
                                        {dates.map((date) => (
                                            <div key={date} className="border-r border-border px-3 py-3 text-center">
                                                <div className="font-semibold text-foreground">
                                                    {formatDateLabel(date)}
                                                </div>
                                                <div className="text-[10px] text-muted-foreground">
                                                    {formatWeekday(date)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {rooms.map((room) => {
                                        const roomReservations = reservationsByRoom.get(room.id) ?? [];
                                        return (
                                            <div
                                                key={room.id}
                                                className="grid border-x border-b border-border"
                                                style={{ gridTemplateColumns: columnsTemplate }}
                                            >
                                                <div className="sticky left-0 z-10 border-r border-border bg-background px-3 py-3">
                                                    <div className="text-sm font-semibold text-foreground">
                                                        Room {room.number}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {formatRoomType(room.room_type?.name)}
                                                    </div>
                                                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                                                        <span className={`rounded-full px-2 py-0.5 ${roomStatusTone(room.status)}`}>
                                                            {room.status}
                                                        </span>
                                                        {room.housekeeping_status && (
                                                            <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-amber-700">
                                                                {room.housekeeping_status}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                {dates.map((date) => {
                                                    const activeReservation = roomReservations.find(
                                                        (reservation) =>
                                                            reservation.check_in <= date && reservation.check_out > date,
                                                    );
                                                    return (
                                                        <div
                                                            key={`${room.id}-${date}`}
                                                            className="border-r border-border px-2 py-2"
                                                        >
                                                            {activeReservation ? (
                                                                <div className="rounded-md bg-emerald-500/10 px-2 py-1">
                                                                    <div className="text-xs font-semibold text-foreground">
                                                                        {activeReservation.guest_name ?? 'Guest'}
                                                                    </div>
                                                                    <div className="mt-1">
                                                                        <Badge variant={statusVariant(activeReservation.status)}>
                                                                            {activeReservation.status}
                                                                        </Badge>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="text-xs text-muted-foreground">—</div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
