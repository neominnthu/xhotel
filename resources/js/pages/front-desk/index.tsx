import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { dashboard, frontDesk } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type Guest = {
    id: number;
    stay_id?: number;
    reservation_id?: number;
    guest_name: string;
    room_number?: string;
    room_type: Record<string, string> | string;
    room_type_id?: number;
    reservation_check_in?: string;
    check_in?: string;
    check_out: string;
    status?: string;
    folio_balance: number;
};

type RoomOption = {
    id: number;
    number: string;
    room_type?: Record<string, string> | string;
    floor?: string | number | null;
    room_status?: string;
    housekeeping_status?: string;
};

type Props = {
    expectedArrivals: Guest[];
    inHouseGuests: Guest[];
    expectedDepartures: Guest[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Front Desk',
        href: frontDesk().url,
    },
];

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'MMK',
        minimumFractionDigits: 0,
    }).format(amount);
}

function getStatusBadge(status: string) {
    const variants = {
        expected: 'secondary',
        checked_in: 'default',
        checked_out: 'outline',
    } as const;

    return (
        <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
            {status.replace('_', ' ').toUpperCase()}
        </Badge>
    );
}

export default function FrontDeskIndex({ expectedArrivals, inHouseGuests, expectedDepartures }: Props) {
    const [activeTab, setActiveTab] = useState('arrivals');
    const [extendStay, setExtendStay] = useState<Guest | null>(null);
    const [extendCheckOut, setExtendCheckOut] = useState('');
    const [extendError, setExtendError] = useState<string | null>(null);
    const [extendSaving, setExtendSaving] = useState(false);
    const [moveStay, setMoveStay] = useState<Guest | null>(null);
    const [availableRooms, setAvailableRooms] = useState<RoomOption[]>([]);
    const [moveRoomId, setMoveRoomId] = useState('');
    const [moveError, setMoveError] = useState<string | null>(null);
    const [roomsLoading, setRoomsLoading] = useState(false);
    const [moveSaving, setMoveSaving] = useState(false);

    const quickCheckInId = expectedArrivals[0]?.reservation_id;
    const quickCheckOutId = expectedDepartures[0]?.stay_id ?? expectedDepartures[0]?.id;

    const getCsrfToken = () => {
        const token = document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute('content');
        return token ?? '';
    };

    useEffect(() => {
        if (!moveStay) {
            return;
        }

        const checkInDate = moveStay.reservation_check_in ?? moveStay.check_in;
        const checkOutDate = moveStay.check_out;

        if (!checkInDate || !checkOutDate) {
            setMoveError('ရွေးချယ်ထားသော တည်းခိုမှု၏ နေ့စွဲကို မတွေ့ပါ။');
            setAvailableRooms([]);
            return;
        }

        const controller = new AbortController();
        const fetchRooms = async () => {
            setRoomsLoading(true);
            setMoveError(null);
            setAvailableRooms([]);
            setMoveRoomId('');

            const params = new URLSearchParams({
                check_in_date: checkInDate,
                check_out_date: checkOutDate,
            });

            if (moveStay.room_type_id) {
                params.append('room_type_id', String(moveStay.room_type_id));
            }

            try {
                const response = await fetch(`/api/v1/front-desk/rooms/available?${params.toString()}`, {
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    signal: controller.signal,
                });

                if (!response.ok) {
                    const payload = await response.json();
                    setMoveError(payload?.message ?? 'အခန်းများကို မယူနိုင်ပါ။');
                    return;
                }

                const payload = await response.json();
                setAvailableRooms(payload?.available_rooms ?? []);
            } catch (error) {
                if (!(error instanceof DOMException && error.name === 'AbortError')) {
                    setMoveError('အခန်းများကို မယူနိုင်ပါ။');
                }
            } finally {
                setRoomsLoading(false);
            }
        };

        fetchRooms();

        return () => controller.abort();
    }, [moveStay]);

    const submitExtendStay = async () => {
        if (!extendStay) {
            return;
        }

        const stayId = extendStay.stay_id ?? extendStay.id;

        setExtendSaving(true);
        setExtendError(null);

        const response = await fetch(`/api/v1/front-desk/stays/${stayId}/extend`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': getCsrfToken(),
                'X-Requested-With': 'XMLHttpRequest',
            },
            body: JSON.stringify({
                check_out: extendCheckOut,
            }),
        });

        if (!response.ok) {
            const payload = await response.json();
            setExtendError(payload?.message ?? 'တည်းခိုချိန် တိုးမရပါ။');
            setExtendSaving(false);
            return;
        }

        window.location.reload();
    };

    const submitMoveRoom = async () => {
        if (!moveStay) {
            return;
        }

        const stayId = moveStay.stay_id ?? moveStay.id;

        setMoveSaving(true);
        setMoveError(null);

        const response = await fetch(`/api/v1/front-desk/stays/${stayId}/assign-room`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': getCsrfToken(),
                'X-Requested-With': 'XMLHttpRequest',
            },
            body: JSON.stringify({
                room_id: Number(moveRoomId),
            }),
        });

        if (!response.ok) {
            const payload = await response.json();
            setMoveError(payload?.message ?? 'အခန်းပြောင်းမရပါ။');
            setMoveSaving(false);
            return;
        }

        window.location.reload();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Front Desk" />

            <div className="flex flex-1 flex-col gap-6 rounded-xl p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-foreground">
                            Front Desk
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Manage check-ins, check-outs, and current guests
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        {quickCheckInId ? (
                            <Button asChild variant="outline" size="sm">
                                <Link href={`/front-desk/check-in/${quickCheckInId}`}>
                                    Quick Check-in
                                </Link>
                            </Button>
                        ) : (
                            <Button variant="outline" size="sm" disabled>
                                Quick Check-in
                            </Button>
                        )}
                        {quickCheckOutId ? (
                            <Button asChild variant="outline" size="sm">
                                <Link href={`/front-desk/check-out/${quickCheckOutId}`}>
                                    Quick Check-out
                                </Link>
                            </Button>
                        ) : (
                            <Button variant="outline" size="sm" disabled>
                                Quick Check-out
                            </Button>
                        )}
                        <Button asChild variant="outline" size="sm">
                            <Link href="/housekeeping">Room Status</Link>
                        </Button>
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="arrivals" className="flex items-center gap-2">
                            Arrivals
                            <Badge variant="secondary">{expectedArrivals.length}</Badge>
                        </TabsTrigger>
                        <TabsTrigger value="in-house" className="flex items-center gap-2">
                            In House
                            <Badge variant="secondary">{inHouseGuests.length}</Badge>
                        </TabsTrigger>
                        <TabsTrigger value="departures" className="flex items-center gap-2">
                            Departures
                            <Badge variant="secondary">{expectedDepartures.length}</Badge>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="arrivals" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Today's Expected Arrivals</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {expectedArrivals.length === 0 ? (
                                    <p className="text-center text-muted-foreground py-8">
                                        No arrivals expected today
                                    </p>
                                ) : (
                                    <div className="space-y-4">
                                        {expectedArrivals.map((guest) => (
                                            <div
                                                key={guest.id}
                                                className="flex items-center justify-between p-4 border rounded-lg"
                                            >
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3">
                                                        <h3 className="font-medium">{guest.guest_name}</h3>
                                                        {getStatusBadge(guest.status || 'expected')}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground mt-1">
                                                        {typeof guest.room_type === 'object' ? guest.room_type.en : guest.room_type}
                                                        {guest.room_number && ` • Room ${guest.room_number}`}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        Check-in: {guest.check_in} • Check-out: {guest.check_out}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {guest.folio_balance > 0 && (
                                                        <Badge variant="destructive">
                                                            Balance: {formatCurrency(guest.folio_balance)}
                                                        </Badge>
                                                    )}
                                                    <Button size="sm" asChild>
                                                        <Link
                                                            href={`/front-desk/check-in/${guest.reservation_id ?? guest.id}`}
                                                        >
                                                            Check In
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="in-house" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Current In-House Guests</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {inHouseGuests.length === 0 ? (
                                    <p className="text-center text-muted-foreground py-8">
                                        No guests currently checked in
                                    </p>
                                ) : (
                                    <div className="space-y-4">
                                        {inHouseGuests.map((guest) => (
                                            <div
                                                key={guest.id}
                                                className="flex items-center justify-between p-4 border rounded-lg"
                                            >
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3">
                                                        <h3 className="font-medium">{guest.guest_name}</h3>
                                                        <Badge variant="default">Checked In</Badge>
                                                    </div>
                                                    <div className="text-sm text-muted-foreground mt-1">
                                                        Room {guest.room_number} • {typeof guest.room_type === 'object' ? guest.room_type.en : guest.room_type}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        Checked in: {guest.check_in} • Check-out: {guest.check_out}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {guest.folio_balance > 0 && (
                                                        <Badge variant="destructive">
                                                            Balance: {formatCurrency(guest.folio_balance)}
                                                        </Badge>
                                                    )}
                                                    <Button variant="outline" size="sm">
                                                        View Folio
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            setExtendStay(guest);
                                                            setExtendCheckOut(guest.check_out);
                                                            setExtendError(null);
                                                        }}
                                                    >
                                                        Extend Stay
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            setMoveStay(guest);
                                                            setMoveError(null);
                                                        }}
                                                    >
                                                        Move Room
                                                    </Button>
                                                    <Button size="sm" asChild>
                                                        <Link
                                                            href={`/front-desk/check-out/${guest.stay_id ?? guest.id}`}
                                                        >
                                                            Check Out
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="departures" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Today's Expected Departures</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {expectedDepartures.length === 0 ? (
                                    <p className="text-center text-muted-foreground py-8">
                                        No departures expected today
                                    </p>
                                ) : (
                                    <div className="space-y-4">
                                        {expectedDepartures.map((guest) => (
                                            <div
                                                key={guest.id}
                                                className="flex items-center justify-between p-4 border rounded-lg"
                                            >
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3">
                                                        <h3 className="font-medium">{guest.guest_name}</h3>
                                                        <Badge variant="secondary">Departing</Badge>
                                                    </div>
                                                    <div className="text-sm text-muted-foreground mt-1">
                                                        Room {guest.room_number} • {typeof guest.room_type === 'object' ? guest.room_type.en : guest.room_type}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        Check-out: {guest.check_out}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {guest.folio_balance > 0 && (
                                                        <Badge variant="destructive">
                                                            Balance: {formatCurrency(guest.folio_balance)}
                                                        </Badge>
                                                    )}
                                                    <Button variant="outline" size="sm">
                                                        View Folio
                                                    </Button>
                                                    <Button size="sm" asChild>
                                                        <Link
                                                            href={`/front-desk/check-out/${guest.stay_id ?? guest.id}`}
                                                        >
                                                            Check Out
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            <Dialog
                open={Boolean(extendStay)}
                onOpenChange={(open) => {
                    if (!open) {
                        setExtendStay(null);
                        setExtendError(null);
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Extend Stay</DialogTitle>
                        <DialogDescription>
                            Extend the check-out date for the current stay.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium" htmlFor="extend-check-out">
                                New check-out date
                            </label>
                            <Input
                                id="extend-check-out"
                                type="date"
                                value={extendCheckOut}
                                onChange={(event) => setExtendCheckOut(event.target.value)}
                            />
                        </div>

                        {extendError && (
                            <p className="text-sm text-destructive">
                                {extendError}
                            </p>
                        )}
                    </div>

                    <DialogFooter className="gap-2">
                        <Button
                            variant="secondary"
                            onClick={() => setExtendStay(null)}
                            disabled={extendSaving}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={submitExtendStay}
                            disabled={extendSaving || !extendCheckOut}
                        >
                            {extendSaving ? 'Extending...' : 'Extend Stay'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog
                open={Boolean(moveStay)}
                onOpenChange={(open) => {
                    if (!open) {
                        setMoveStay(null);
                        setMoveError(null);
                        setAvailableRooms([]);
                        setMoveRoomId('');
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Move Room</DialogTitle>
                        <DialogDescription>
                            Assign a new room for the current stay.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium" htmlFor="move-room">
                                Available rooms
                            </label>
                            <Select value={moveRoomId} onValueChange={setMoveRoomId}>
                                <SelectTrigger id="move-room">
                                    <SelectValue
                                        placeholder={
                                            roomsLoading
                                                ? 'Loading rooms...'
                                                : 'Select a room'
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableRooms.map((room) => (
                                        <SelectItem key={room.id} value={String(room.id)}>
                                            Room {room.number}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {moveError && (
                            <p className="text-sm text-destructive">{moveError}</p>
                        )}
                    </div>

                    <DialogFooter className="gap-2">
                        <Button
                            variant="secondary"
                            onClick={() => setMoveStay(null)}
                            disabled={moveSaving}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={submitMoveRoom}
                            disabled={moveSaving || !moveRoomId}
                        >
                            {moveSaving ? 'Moving...' : 'Move Room'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}