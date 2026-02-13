import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type Room = {
    id: number;
    number: string;
    housekeeping_status: string;
};

type LogEntry = {
    id: number;
    from_status: string;
    to_status: string;
    changed_at: string | null;
    changed_by: { id: number; name: string } | null;
};

type Props = {
    room: Room;
    logs: LogEntry[];
};

const breadcrumbs = (room: Room): BreadcrumbItem[] => [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Housekeeping', href: '/housekeeping' },
    { title: `Room ${room.number}`, href: `/housekeeping/rooms/${room.id}` },
];

function statusVariant(status: string) {
    switch (status) {
        case 'clean':
            return 'default';
        case 'inspected':
            return 'secondary';
        case 'dirty':
            return 'destructive';
        default:
            return 'outline';
    }
}

export default function RoomHistory({ room, logs }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs(room)}>
            <Head title={`Room ${room.number} History`} />
            <div className="flex flex-1 flex-col gap-6 rounded-xl p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-foreground">
                            Room {room.number} Status History
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Current status: {room.housekeeping_status}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button asChild variant="secondary">
                            <a href={`/housekeeping/rooms/${room.id}/history.csv`}>
                                Export CSV
                            </a>
                        </Button>
                        <Badge variant={statusVariant(room.housekeeping_status)}>
                            {room.housekeeping_status}
                        </Badge>
                        <Button asChild variant="ghost">
                            <Link href="/housekeeping">Back</Link>
                        </Button>
                    </div>
                </div>

                <div className="rounded-xl border border-border bg-card">
                    <div className="border-b border-border px-4 py-3">
                        <h2 className="text-sm font-semibold text-foreground">
                            Status Changes
                        </h2>
                    </div>
                    <div className="w-full overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                                <tr>
                                    <th className="px-4 py-3 text-left font-medium">
                                        Changed At
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium">
                                        From
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium">
                                        To
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium">
                                        Changed By
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {logs.length === 0 ? (
                                    <tr>
                                        <td
                                            className="px-4 py-8 text-center text-muted-foreground"
                                            colSpan={4}
                                        >
                                            No history yet.
                                        </td>
                                    </tr>
                                ) : (
                                    logs.map((log) => (
                                        <tr key={log.id}>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {log.changed_at ?? '—'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge variant={statusVariant(log.from_status)}>
                                                    {log.from_status}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge variant={statusVariant(log.to_status)}>
                                                    {log.to_status}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {log.changed_by?.name ?? 'System'}
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
