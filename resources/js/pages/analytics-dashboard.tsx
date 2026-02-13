import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type MetricCard = {
    title: string;
    value: string | number;
    change?: number;
    changeLabel?: string;
    icon?: string;
};

type ChartData = {
    date: string;
    value: number;
}[];

type Props = {
    overview: {
        occupancy: {
            current_rate: number;
            occupied_rooms: number;
            total_rooms: number;
            change_from_last_month: number;
        };
        revenue: {
            this_month: number;
            last_month: number;
            change_percentage: number;
            average_daily: number;
        };
        reservations: {
            today: number;
            this_month: number;
            confirmed_today: number;
            confirmation_rate: number;
        };
        performance: {
            avg_response_time: number;
            total_requests: number;
            error_rate: number;
            uptime_percentage: number;
        };
    };
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Analytics',
        href: '/dashboard/analytics',
    },
];

export default function AnalyticsDashboard({ overview }: Props) {
    const [realtimeData, setRealtimeData] = useState<any>(null);
    const [analyticsData, setAnalyticsData] = useState<any>(null);
    const [performanceData, setPerformanceData] = useState<any>(null);
    const [period, setPeriod] = useState('30d');

    useEffect(() => {
        // Fetch real-time data
        fetchRealtimeData();
        const interval = setInterval(fetchRealtimeData, 30000); // Update every 30 seconds

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        fetchAnalyticsData();
    }, [period]);

    useEffect(() => {
        fetchPerformanceData();
    }, []);

    const fetchRealtimeData = async () => {
        try {
            const response = await fetch('/api/v1/dashboard/realtime');
            const data = await response.json();
            setRealtimeData(data.data);
        } catch (error) {
            console.error('Failed to fetch realtime data:', error);
        }
    };

    const fetchAnalyticsData = async () => {
        try {
            const response = await fetch(`/api/v1/dashboard/analytics?period=${period}`);
            const data = await response.json();
            setAnalyticsData(data.data);
        } catch (error) {
            console.error('Failed to fetch analytics data:', error);
        }
    };

    const fetchPerformanceData = async () => {
        try {
            const response = await fetch('/api/v1/dashboard/performance');
            const data = await response.json();
            setPerformanceData(data.data);
        } catch (error) {
            console.error('Failed to fetch performance data:', error);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'MMK',
        }).format(amount);
    };

    const formatPercentage = (value: number) => {
        return `${value.toFixed(1)}%`;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Analytics Dashboard" />

            <div className="flex flex-1 flex-col gap-6 rounded-xl p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-foreground">
                            Analytics Dashboard
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Advanced insights and real-time metrics
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <Select value={period} onValueChange={setPeriod}>
                            <SelectTrigger className="w-32">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="7d">Last 7 days</SelectItem>
                                <SelectItem value="30d">Last 30 days</SelectItem>
                                <SelectItem value="90d">Last 90 days</SelectItem>
                                <SelectItem value="1y">Last year</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button onClick={() => {
                            fetchRealtimeData();
                            fetchAnalyticsData();
                            fetchPerformanceData();
                        }}>
                            Refresh
                        </Button>
                    </div>
                </div>

                <Tabs defaultValue="overview" className="space-y-6">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="realtime">Real-time</TabsTrigger>
                        <TabsTrigger value="analytics">Analytics</TabsTrigger>
                        <TabsTrigger value="performance">Performance</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6">
                        {/* Key Metrics Grid */}
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Occupancy Rate
                                    </CardTitle>
                                    <Badge variant={overview.occupancy.current_rate > 70 ? 'default' : 'secondary'}>
                                        {formatPercentage(overview.occupancy.current_rate)}
                                    </Badge>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {overview.occupancy.occupied_rooms}/{overview.occupancy.total_rooms}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {overview.occupancy.change_from_last_month > 0 ? '+' : ''}
                                        {overview.occupancy.change_from_last_month.toFixed(1)}% from last month
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Monthly Revenue
                                    </CardTitle>
                                    <Badge variant={overview.revenue.change_percentage > 0 ? 'default' : 'destructive'}>
                                        {overview.revenue.change_percentage > 0 ? '+' : ''}{overview.revenue.change_percentage.toFixed(1)}%
                                    </Badge>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {formatCurrency(overview.revenue.this_month)}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        vs {formatCurrency(overview.revenue.last_month)} last month
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Today's Reservations
                                    </CardTitle>
                                    <Badge variant="outline">
                                        {overview.reservations.confirmation_rate.toFixed(1)}% confirmed
                                    </Badge>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {overview.reservations.today}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {overview.reservations.confirmed_today} confirmed
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        System Performance
                                    </CardTitle>
                                    <Badge variant={overview.performance.error_rate < 1 ? 'default' : 'destructive'}>
                                        {overview.performance.uptime_percentage.toFixed(1)}% uptime
                                    </Badge>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {overview.performance.avg_response_time.toFixed(0)}ms
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Avg response time
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="realtime" className="space-y-6">
                        {realtimeData ? (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-sm font-medium">Current Occupancy</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">
                                            {realtimeData.current_occupancy.occupied}/{realtimeData.current_occupancy.total}
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            {realtimeData.current_occupancy.percentage.toFixed(1)}% occupied
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-sm font-medium">Today's Check-ins</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{realtimeData.today_checkins}</div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-sm font-medium">Today's Check-outs</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{realtimeData.today_checkouts}</div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{realtimeData.pending_tasks}</div>
                                        <p className="text-xs text-muted-foreground">Housekeeping tasks</p>
                                    </CardContent>
                                </Card>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-32">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="analytics" className="space-y-6">
                        {analyticsData ? (
                            <div className="grid gap-6 md:grid-cols-2">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Revenue Trends</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="h-64 flex items-center justify-center text-muted-foreground">
                                            Chart placeholder - Revenue trends over {period}
                                        </div>
                                        {analyticsData.revenue_trends && (
                                            <div className="mt-4 text-sm">
                                                Latest: {formatCurrency(analyticsData.revenue_trends.slice(-1)[0]?.revenue || 0)}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Occupancy Trends</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="h-64 flex items-center justify-center text-muted-foreground">
                                            Chart placeholder - Occupancy trends over {period}
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Booking Sources</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            {analyticsData.booking_sources?.map((source: any, index: number) => (
                                                <div key={index} className="flex justify-between">
                                                    <span>{source.source}</span>
                                                    <span className="font-medium">{source.count}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Top Performing Rooms</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            {analyticsData.room_performance?.map((room: any, index: number) => (
                                                <div key={index} className="flex justify-between">
                                                    <span>Room {room.room_number} ({room.room_type})</span>
                                                    <span className="font-medium">{room.total_stays} stays</span>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-32">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="performance" className="space-y-6">
                        {performanceData ? (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-sm font-medium">API Response Time</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">
                                            {performanceData.response_times?.avg_api_response?.toFixed(0) || 0}ms
                                        </div>
                                        <p className="text-xs text-muted-foreground">Average response time</p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-sm font-medium">Cache Hit Rate</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">
                                            {performanceData.cache_hit_rate?.toFixed(1) || 0}%
                                        </div>
                                        <p className="text-xs text-muted-foreground">Cache efficiency</p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-sm font-medium">Database Performance</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">
                                            {performanceData.database_performance?.avg_query_time?.toFixed(0) || 0}ms
                                        </div>
                                        <p className="text-xs text-muted-foreground">Avg query time</p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-sm font-medium">System Health</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">
                                            {performanceData.api_usage?.total_requests || 0}
                                        </div>
                                        <p className="text-xs text-muted-foreground">Total API requests</p>
                                    </CardContent>
                                </Card>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-32">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}