import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type AuditLog = {
    id: number;
    action: string;
    created_at: string | null;
    user: { id: number; name: string } | null;
    payload: Record<string, unknown> | null;
};

type Props = {
    logs: AuditLog[];
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Housekeeping', href: '/housekeeping' },
    { title: 'Audit Log', href: '/housekeeping/audit' },
];

function actionVariant(action: string) {
    if (action.includes('created')) {
        return 'default';
    }

    if (action.includes('updated')) {
        return 'secondary';
    }

    return 'outline';
}

export default function HousekeepingAudit({ logs }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Housekeeping Audit" />
            <div className="flex flex-1 flex-col gap-6 rounded-xl p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-foreground">
                            Housekeeping Audit Log
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Recent task creation and updates.
                        </p>
                    </div>
                    <Button asChild variant="ghost">
                        <Link href="/housekeeping">Back</Link>
                    </Button>
                </div>

                <div className="rounded-xl border border-border bg-card">
                    <div className="border-b border-border px-4 py-3">
                        <h2 className="text-sm font-semibold text-foreground">
                            Latest 200 entries
                        </h2>
                    </div>
                    <div className="w-full overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                                <tr>
                                    <th className="px-4 py-3 text-left font-medium">
                                        Timestamp
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium">
                                        Action
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium">
                                        User
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium">
                                        Details
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
                                            No audit entries yet.
                                        </td>
                                    </tr>
                                ) : (
                                    logs.map((log) => (
                                        <tr key={log.id}>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {log.created_at ?? '—'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge variant={actionVariant(log.action)}>
                                                    {log.action}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {log.user?.name ?? 'System'}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {log.payload
                                                    ? JSON.stringify(log.payload)
                                                    : '—'}
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
