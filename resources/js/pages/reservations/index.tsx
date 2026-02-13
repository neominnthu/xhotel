import { Head, Link, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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

type ReservationRow = {
    id: number;
    code: string;
    status: string;
    check_in: string;
    check_out: string;
    guest: { id: number; name: string } | null;
    room_type_id: number | null;
    room_id: number | null;
};

type Props = {
    reservations: {
        data: ReservationRow[];
        meta: { total: number; page: number; per_page: number };
    };
    filters: {
        search?: string | null;
        status?: string | null;
    };
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Reservations',
        href: '/reservations',
    },
];

const statusOptions = [
    { value: 'all', label: 'All statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'checked_in', label: 'Checked in' },
    { value: 'checked_out', label: 'Checked out' },
    { value: 'canceled', label: 'Canceled' },
    { value: 'no_show', label: 'No show' },
];

function statusVariant(status: string) {
    switch (status) {
        case 'confirmed':
        case 'checked_in':
            return 'default';
        case 'pending':
            return 'secondary';
        case 'canceled':
        case 'no_show':
            return 'destructive';
        default:
            return 'outline';
    }
}

function statusLabel(status: string) {
    return status.replace('_', ' ');
}

export default function ReservationsIndex({ reservations, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? 'all');

    const rows = useMemo(() => reservations.data, [reservations.data]);

    const applyFilters = () => {
        const query: Record<string, string> = {};

        if (search.trim()) {
            query.search = search.trim();
        }

        if (status !== 'all') {
            query.status = status;
        }

        router.get('/reservations', query, {
            preserveState: true,
            replace: true,
        });
    };

    const resetFilters = () => {
        setSearch('');
        setStatus('all');
        router.get('/reservations', {}, { preserveState: true, replace: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reservations" />
            <div className="flex flex-1 flex-col gap-6 rounded-xl p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-semibold text-foreground">
                            Reservations
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Manage bookings, statuses, and assigned rooms.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Button asChild variant="secondary">
                            <Link href="/reservations/import">Import CSV</Link>
                        </Button>
                        <Button asChild>
                            <Link href="/reservations/create">New Reservation</Link>
                        </Button>
                    </div>
                </div>

                <div className="rounded-xl border border-border bg-card">
                    <div className="flex flex-wrap items-center gap-3 border-b border-border p-4">
                        <div className="w-full sm:max-w-xs">
                            <Input
                                placeholder="Search guest or code"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                            />
                        </div>
                        <div className="w-full sm:max-w-[180px]">
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {statusOptions.map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <Button type="button" onClick={applyFilters}>
                                Apply
                            </Button>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={resetFilters}
                            >
                                Reset
                            </Button>
                        </div>
                        <div className="ml-auto text-sm text-muted-foreground">
                            Total: {reservations.meta.total}
                        </div>
                    </div>

                    <div className="w-full overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                                <tr>
                                    <th className="px-4 py-3 text-left font-medium">
                                        Code
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium">
                                        Guest
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium">
                                        Check in
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium">
                                        Check out
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium">
                                        Room
                                    </th>
                                    <th className="px-4 py-3 text-right font-medium">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {rows.length === 0 ? (
                                    <tr>
                                        <td
                                            className="px-4 py-8 text-center text-muted-foreground"
                                            colSpan={7}
                                        >
                                            No reservations found.
                                        </td>
                                    </tr>
                                ) : (
                                    rows.map((reservation) => (
                                        <tr key={reservation.id}>
                                            <td className="px-4 py-3 font-medium text-foreground">
                                                {reservation.code}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {reservation.guest?.name ?? '—'}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {reservation.check_in}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {reservation.check_out}
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge
                                                    variant={statusVariant(
                                                        reservation.status,
                                                    )}
                                                >
                                                    {statusLabel(
                                                        reservation.status,
                                                    )}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {reservation.room_id ?? '—'}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <Button
                                                    asChild
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    <Link
                                                        href={`/reservations/${reservation.id}`}
                                                    >
                                                        View
                                                    </Link>
                                                </Button>
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
