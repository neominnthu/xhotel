import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { dashboard, frontDesk } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type Guest = {
    id: number;
    stay_id?: number;
    guest_name: string;
    room_number?: string;
    room_type: Record<string, string> | string;
    check_in?: string;
    check_out: string;
    status?: string;
    folio_balance: number;
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
                        <Button variant="outline" size="sm">
                            Quick Check-in
                        </Button>
                        <Button variant="outline" size="sm">
                            Room Status
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
                                                        <Link href={`/front-desk/check-in/${guest.id}`}>
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
                                                    <Button size="sm" asChild>
                                                        <Link href={`/front-desk/check-out/${guest.stay_id}`}>
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
                                                        <Link href={`/front-desk/check-out/${guest.stay_id}`}>
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
        </AppLayout>
    );
}