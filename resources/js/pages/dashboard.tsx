import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboard, frontDesk } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type Arrival = {
    id: number;
    code: string;
    guest_name: string;
    room_type: string;
    check_in: string;
};

type Departure = {
    id: number;
    code: string;
    guest_name: string;
    room_number: string;
    check_out: string;
};

type Activity = {
    id: number;
    type: string;
    description: string;
    created_at: string;
};

type Props = {
    today_arrivals: Arrival[];
    today_departures: Departure[];
    current_occupancy: {
        occupied: number;
        total: number;
        percentage: number;
    };
    pending_housekeeping: number;
    unpaid_folios: number;
    recent_activity: Activity[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard({
    today_arrivals,
    today_departures,
    current_occupancy,
    pending_housekeeping,
    unpaid_folios,
    recent_activity,
}: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex flex-1 flex-col gap-6 rounded-xl p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-foreground">
                            Dashboard
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Overview of today's operations
                        </p>
                    </div>

                    <Button asChild>
                        <Link href={frontDesk().url}>
                            Go to Front Desk
                        </Link>
                    </Button>
                </div>

                {/* Key Metrics */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Today's Arrivals
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{today_arrivals.length}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Today's Departures
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{today_departures.length}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Current Occupancy
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {current_occupancy.occupied}/{current_occupancy.total}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {current_occupancy.percentage}% occupied
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Pending Tasks
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{pending_housekeeping}</div>
                            <p className="text-xs text-muted-foreground">
                                Housekeeping tasks
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Today's Activity */}
                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Today's Arrivals</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {today_arrivals.length === 0 ? (
                                <p className="text-center text-muted-foreground py-4">
                                    No arrivals today
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {today_arrivals.slice(0, 5).map((arrival) => (
                                        <div key={arrival.id} className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">{arrival.guest_name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {arrival.room_type} • {arrival.code}
                                                </p>
                                            </div>
                                            <Badge variant="secondary">
                                                {arrival.check_in}
                                            </Badge>
                                        </div>
                                    ))}
                                    {today_arrivals.length > 5 && (
                                        <p className="text-center text-sm text-muted-foreground">
                                            +{today_arrivals.length - 5} more arrivals
                                        </p>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Today's Departures</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {today_departures.length === 0 ? (
                                <p className="text-center text-muted-foreground py-4">
                                    No departures today
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {today_departures.slice(0, 5).map((departure) => (
                                        <div key={departure.id} className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">{departure.guest_name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Room {departure.room_number} • {departure.code}
                                                </p>
                                            </div>
                                            <Badge variant="outline">
                                                {departure.check_out}
                                            </Badge>
                                        </div>
                                    ))}
                                    {today_departures.length > 5 && (
                                        <p className="text-center text-sm text-muted-foreground">
                                            +{today_departures.length - 5} more departures
                                        </p>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Activity */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {recent_activity.length === 0 ? (
                            <p className="text-center text-muted-foreground py-4">
                                No recent activity
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {recent_activity.slice(0, 10).map((activity) => (
                                    <div key={activity.id} className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">{activity.type}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {activity.description}
                                            </p>
                                        </div>
                                        <span className="text-xs text-muted-foreground">
                                            {activity.created_at}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
