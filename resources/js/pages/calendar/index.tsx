import { Head, usePage } from '@inertiajs/react';
import { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type RoomType = {
    id: number;
    name: Record<string, string>;
    capacity: number;
    base_rate: number;
};

type CalendarDay = {
    date: string;
    day: number;
    availability: {
        total_rooms: number;
        booked_rooms: number;
        available_rooms: number;
        status: 'available' | 'limited' | 'unavailable';
    };
    rate: {
        amount: number;
        currency: string;
        rate_type: string;
        rate_name: string;
    };
};

type CalendarRoomType = {
    id: number;
    name: Record<string, string>;
    capacity: number;
    days: CalendarDay[];
};

type CalendarData = {
    data: CalendarRoomType[];
    meta: {
        year: number;
        month: number;
        room_type_id: number | null;
    };
};

type Props = {
    roomTypes: RoomType[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Rate Calendar',
        href: '/calendar',
    },
];

function getDaysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
    return new Date(year, month, 1).getDay();
}

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'MMK',
        minimumFractionDigits: 0,
    }).format(amount);
}

export default function CalendarIndex({ roomTypes }: Props) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedRoomType, setSelectedRoomType] = useState<number | null>(null);
    const [calendarData, setCalendarData] = useState<CalendarData | null>(null);
    const [loading, setLoading] = useState(false);

    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    // Fetch calendar data when date or room type filter changes
    useEffect(() => {
        const fetchCalendarData = async () => {
            setLoading(true);
            try {
                const response = await axios.get('/api/v1/calendar', {
                    params: {
                        year: currentYear,
                        month: currentMonth + 1, // JS months are 0-based, API expects 1-based
                        room_type_id: selectedRoomType,
                    },
                });
                setCalendarData(response.data);
            } catch (error) {
                console.error('Failed to fetch calendar data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCalendarData();
    }, [currentYear, currentMonth, selectedRoomType]);

    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);

    const calendarDays = useMemo(() => {
        const days = [];
        const prevMonthDays = getDaysInMonth(currentYear, currentMonth - 1);

        // Previous month days
        for (let i = firstDayOfMonth - 1; i >= 0; i--) {
            days.push({
                date: new Date(currentYear, currentMonth - 1, prevMonthDays - i),
                isCurrentMonth: false,
                isToday: false,
                calendarData: null,
            });
        }

        // Current month days
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentYear, currentMonth, day);
            const today = new Date();
            const isToday = date.toDateString() === today.toDateString();

            // Find calendar data for this day
            let dayData = null;
            if (calendarData?.data) {
                // If we have filtered data, use it; otherwise use the first room type's data
                const roomTypeData = selectedRoomType
                    ? calendarData.data.find(rt => rt.id === selectedRoomType)
                    : calendarData.data[0];

                if (roomTypeData) {
                    dayData = roomTypeData.days.find(d => d.day === day);
                }
            }

            days.push({
                date,
                isCurrentMonth: true,
                isToday,
                calendarData: dayData,
            });
        }

        // Next month days to fill the grid
        const remainingCells = 42 - days.length; // 6 rows * 7 days
        for (let day = 1; day <= remainingCells; day++) {
            days.push({
                date: new Date(currentYear, currentMonth + 1, day),
                isCurrentMonth: false,
                isToday: false,
                calendarData: null,
            });
        }

        return days;
    }, [currentYear, currentMonth, calendarData, selectedRoomType]);

    const navigateMonth = (direction: 'prev' | 'next') => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            if (direction === 'prev') {
                newDate.setMonth(prev.getMonth() - 1);
            } else {
                newDate.setMonth(prev.getMonth() + 1);
            }
            return newDate;
        });
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    const filteredRoomTypes = selectedRoomType
        ? calendarData?.data.filter(rt => rt.id === selectedRoomType) || []
        : calendarData?.data || [];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Rate Calendar" />

            <div className="flex flex-1 flex-col gap-6 rounded-xl p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-foreground">
                            Rate Calendar
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Visual availability and pricing overview
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Select
                            value={selectedRoomType ? selectedRoomType.toString() : 'all'}
                            onValueChange={(value) =>
                                setSelectedRoomType(value === 'all' ? null : parseInt(value))
                            }
                        >
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder="All Room Types" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Room Types</SelectItem>
                                {calendarData?.data.map((roomType) => (
                                    <SelectItem key={roomType.id} value={roomType.id.toString()}>
                                        {roomType.name.my || roomType.name.en}
                                    </SelectItem>
                                )) || roomTypes.map((roomType) => (
                                    <SelectItem key={roomType.id} value={roomType.id.toString()}>
                                        {roomType.name.my || roomType.name.en}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Button variant="outline" size="sm" onClick={goToToday}>
                            Today
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>
                                {currentDate.toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                })}
                            </CardTitle>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => navigateMonth('prev')}
                                >
                                    ‹
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => navigateMonth('next')}
                                >
                                    ›
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-7 gap-1">
                            {/* Day headers */}
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                                <div
                                    key={day}
                                    className="p-2 text-center text-sm font-medium text-muted-foreground"
                                >
                                    {day}
                                </div>
                            ))}

                            {/* Calendar days */}
                            {calendarDays.map((day, index) => {
                                const getAvailabilityColor = (status: string) => {
                                    switch (status) {
                                        case 'available':
                                            return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
                                        case 'limited':
                                            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
                                        case 'unavailable':
                                            return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
                                        default:
                                            return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
                                    }
                                };

                                return (
                                    <div
                                        key={index}
                                        className={`
                                            min-h-24 p-2 border border-border rounded-md
                                            ${day.isCurrentMonth ? 'bg-background' : 'bg-muted/30'}
                                            ${day.isToday ? 'ring-2 ring-primary' : ''}
                                        `}
                                    >
                                        <div className="text-sm font-medium mb-1">
                                            {day.date.getDate()}
                                        </div>

                                        <div className="space-y-1">
                                            {day.isCurrentMonth && day.calendarData ? (
                                                <div
                                                    className={`text-xs p-1 rounded ${getAvailabilityColor(day.calendarData.availability.status)}`}
                                                >
                                                    <div className="font-medium">
                                                        {formatCurrency(day.calendarData.rate.amount)}
                                                    </div>
                                                    <div className="text-xs opacity-75">
                                                        {day.calendarData.availability.available_rooms}/{day.calendarData.availability.total_rooms} available
                                                    </div>
                                                </div>
                                            ) : day.isCurrentMonth && loading ? (
                                                <div className="text-xs p-1 rounded bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                                                    Loading...
                                                </div>
                                            ) : day.isCurrentMonth ? (
                                                <div className="text-xs p-1 rounded bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                                                    No data
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-green-100 dark:bg-green-900"></div>
                        <span>Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-yellow-100 dark:bg-yellow-900"></div>
                        <span>Limited</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-red-100 dark:bg-red-900"></div>
                        <span>Unavailable</span>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
