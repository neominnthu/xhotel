import { Head, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type User = {
    id: number;
    name: string;
    email: string;
};

type OverallMetrics = {
    period: {
        start_date: string;
        end_date: string;
    };
    total_staff: number;
    average_efficiency: number;
    total_tasks_completed: number;
    average_quality_score: number;
    on_time_completion_rate: number;
    total_minutes_worked: number;
    task_breakdown: {
        rooms_cleaned: number;
        inspections_completed: number;
        maintenance_tasks: number;
    };
};

type TopPerformer = {
    user: User;
    average_efficiency: number;
    total_tasks: number;
    rank?: number;
};

type TopPerformersData = {
    period: string;
    start_date: string;
    end_date: string;
    top_performers: TopPerformer[];
};

type Props = {
    housekeepingStaff: User[];
    currentMonthMetrics: OverallMetrics;
    topPerformers: TopPerformersData;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard,
    },
    {
        title: 'Housekeeping',
        href: '/housekeeping',
    },
    {
        title: 'Performance Dashboard',
        href: '/housekeeping/performance',
    },
];

export default function HousekeepingPerformance({ housekeepingStaff, currentMonthMetrics, topPerformers }: Props) {
    const { auth } = usePage().props as any;
    const [selectedStaff, setSelectedStaff] = useState<User | null>(null);
    const [staffPerformance, setStaffPerformance] = useState<any>(null);
    const [performancePeriod, setPerformancePeriod] = useState('month');
    const [loading, setLoading] = useState(false);

    const fetchStaffPerformance = async (userId: number, period: string = 'month') => {
        setLoading(true);
        try {
            const startDate = getPeriodStartDate(period);
            const endDate = new Date().toISOString().split('T')[0];

            const response = await fetch(`/api/v1/housekeeping/performance/staff/${userId}?start_date=${startDate}&end_date=${endDate}`);
            const data = await response.json();
            setStaffPerformance(data);
        } catch (error) {
            console.error('Failed to fetch staff performance:', error);
        } finally {
            setLoading(false);
        }
    };

    const getPeriodStartDate = (period: string): string => {
        const now = new Date();
        switch (period) {
            case 'week':
                const weekStart = new Date(now);
                weekStart.setDate(now.getDate() - now.getDay());
                return weekStart.toISOString().split('T')[0];
            case 'month':
                return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
            case 'quarter':
                const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
                return quarterStart.toISOString().split('T')[0];
            default:
                return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
        }
    };

    const handleStaffSelect = (userId: string) => {
        const user = housekeepingStaff.find(u => u.id === parseInt(userId));
        setSelectedStaff(user || null);
        if (user) {
            fetchStaffPerformance(user.id, performancePeriod);
        }
    };

    const handlePeriodChange = (period: string) => {
        setPerformancePeriod(period);
        if (selectedStaff) {
            fetchStaffPerformance(selectedStaff.id, period);
        }
    };

    const formatTime = (minutes: number): string => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Housekeeping Performance Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Housekeeping Performance</h1>
                        <p className="text-muted-foreground">
                            Monitor staff performance and efficiency metrics
                        </p>
                    </div>
                </div>

                <Tabs defaultValue="overview" className="flex-1">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="staff">Staff Performance</TabsTrigger>
                        <TabsTrigger value="comparison">Comparison</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{currentMonthMetrics.total_staff}</div>
                                    <p className="text-xs text-muted-foreground">
                                        Active housekeeping staff
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Avg Efficiency</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{currentMonthMetrics.average_efficiency}%</div>
                                    <p className="text-xs text-muted-foreground">
                                        Performance rating
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{currentMonthMetrics.total_tasks_completed}</div>
                                    <p className="text-xs text-muted-foreground">
                                        This month
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">On-Time Rate</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{currentMonthMetrics.on_time_completion_rate}%</div>
                                    <p className="text-xs text-muted-foreground">
                                        Completion accuracy
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Task Breakdown</CardTitle>
                                    <CardDescription>Distribution of completed tasks this month</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-4 md:grid-cols-3">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-blue-600">
                                                {currentMonthMetrics.task_breakdown.rooms_cleaned}
                                            </div>
                                            <p className="text-sm text-muted-foreground">Rooms Cleaned</p>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-green-600">
                                                {currentMonthMetrics.task_breakdown.inspections_completed}
                                            </div>
                                            <p className="text-sm text-muted-foreground">Inspections</p>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-orange-600">
                                                {currentMonthMetrics.task_breakdown.maintenance_tasks}
                                            </div>
                                            <p className="text-sm text-muted-foreground">Maintenance</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Top Performers</CardTitle>
                                    <CardDescription>Highest performing staff this month</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {topPerformers.top_performers.slice(0, 5).map((performer, index) => (
                                            <div key={performer.user.id} className="flex items-center justify-between">
                                                <div className="flex items-center space-x-4">
                                                    <Badge variant="outline">{index + 1}</Badge>
                                                    <div>
                                                        <p className="font-medium">{performer.user.name}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {performer.total_tasks} tasks completed
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold">{performer.average_efficiency}%</p>
                                                    <p className="text-sm text-muted-foreground">Efficiency</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="staff" className="space-y-4">
                        <div className="flex gap-4">
                            <div className="w-64">
                                <Select onValueChange={handleStaffSelect}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select staff member" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {housekeepingStaff.map((staff) => (
                                            <SelectItem key={staff.id} value={staff.id.toString()}>
                                                {staff.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="w-32">
                                <Select value={performancePeriod} onValueChange={handlePeriodChange}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="week">This Week</SelectItem>
                                        <SelectItem value="month">This Month</SelectItem>
                                        <SelectItem value="quarter">This Quarter</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {selectedStaff && staffPerformance && (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium">Efficiency Rating</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{staffPerformance.average_efficiency}%</div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{staffPerformance.total_tasks_completed}</div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium">Quality Score</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{staffPerformance.average_quality_score}/5</div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium">Time Worked</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{formatTime(staffPerformance.total_minutes_worked)}</div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {loading && (
                            <div className="text-center py-4">
                                <p className="text-muted-foreground">Loading performance data...</p>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="comparison" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Staff Comparison</CardTitle>
                                <CardDescription>Compare performance across all housekeeping staff</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {topPerformers.top_performers.map((performer, index) => (
                                        <div key={performer.user.id} className="flex items-center justify-between p-4 border rounded-lg">
                                            <div className="flex items-center space-x-4">
                                                <Badge variant={index < 3 ? "default" : "outline"}>
                                                    #{index + 1}
                                                </Badge>
                                                <div>
                                                    <p className="font-medium">{performer.user.name}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {performer.total_tasks} tasks
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-bold">{performer.average_efficiency}%</p>
                                                <p className="text-sm text-muted-foreground">Efficiency</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}