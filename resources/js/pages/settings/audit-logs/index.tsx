import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { dashboard } from '@/routes';
import { exportMethod as auditLogsExport, index as auditLogsIndex } from '@/routes/settings/audit-logs';
import { index as cancellationPoliciesIndex } from '@/routes/settings/cancellation-policies';
import { index as roomTypesIndex } from '@/routes/settings/room-types';
import { index as ratesIndex } from '@/routes/settings/rates';
import { t } from '@/lib/i18n';
import type { BreadcrumbItem } from '@/types';

type AuditLogRow = {
    id: number;
    action: string;
    resource: string;
    payload: Record<string, unknown> | null;
    ip_address: string | null;
    user_agent: string | null;
    created_at: string | null;
    user: {
        id: number;
        name: string;
        role: string | null;
    } | null;
};

type Props = {
    logs: AuditLogRow[];
    filters: {
        action?: string | null;
        resource?: string | null;
        user_id?: number | null;
        date_from?: string | null;
        date_to?: string | null;
        q?: string | null;
    };
    can_export: boolean;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Settings', href: auditLogsIndex().url },
];

const tabs = [
    { label: t('settings.cancellationPolicies.tabs.cancellationPolicies'), href: cancellationPoliciesIndex().url },
    { label: t('settings.roomTypes.title'), href: roomTypesIndex().url },
    { label: t('settings.rates.title'), href: ratesIndex().url },
    { label: 'Audit Logs', href: auditLogsIndex().url },
    { label: 'System Updates', href: '/settings/updates' },
];

export default function AuditLogsIndex({ logs, filters, can_export }: Props) {
    const filterForm = useForm({
        action: filters.action ?? '',
        resource: filters.resource ?? '',
        user_id: filters.user_id ? String(filters.user_id) : '',
        date_from: filters.date_from ?? '',
        date_to: filters.date_to ?? '',
        q: filters.q ?? '',
    });

    const applyFilters = () => {
        filterForm.get(auditLogsIndex().url, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const filterParams = Object.fromEntries(
        Object.entries({
            action: filterForm.data.action || undefined,
            resource: filterForm.data.resource || undefined,
            user_id: filterForm.data.user_id || undefined,
            date_from: filterForm.data.date_from || undefined,
            date_to: filterForm.data.date_to || undefined,
            q: filterForm.data.q || undefined,
        }).filter(([, value]) => value),
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Audit Logs" />
            <div className="flex flex-1 flex-col gap-6 rounded-xl p-6">
                <div>
                    <h1 className="text-2xl font-semibold text-foreground">Audit Logs</h1>
                    <p className="text-sm text-muted-foreground">
                        System actions များကို လေ့လာရန် log မှတ်တမ်းများ။
                    </p>
                </div>

                <div className="flex flex-wrap gap-2 text-sm">
                    {tabs.map((tab) => (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            className={`rounded-full border border-border px-3 py-1 ${tab.href === '/settings/audit-logs'
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            {tab.label}
                        </Link>
                    ))}
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Filters</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-muted-foreground">
                                    Action
                                </label>
                                <Input
                                    value={filterForm.data.action}
                                    onChange={(event) => filterForm.setData('action', event.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-muted-foreground">
                                    Resource
                                </label>
                                <Input
                                    value={filterForm.data.resource}
                                    onChange={(event) => filterForm.setData('resource', event.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-muted-foreground">
                                    User ID
                                </label>
                                <Input
                                    value={filterForm.data.user_id}
                                    onChange={(event) => filterForm.setData('user_id', event.target.value)}
                                />
                            </div>
                        </div>
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-muted-foreground">
                                    Date From
                                </label>
                                <Input
                                    type="date"
                                    value={filterForm.data.date_from}
                                    onChange={(event) => filterForm.setData('date_from', event.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-muted-foreground">
                                    Date To
                                </label>
                                <Input
                                    type="date"
                                    value={filterForm.data.date_to}
                                    onChange={(event) => filterForm.setData('date_to', event.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-muted-foreground">
                                    Search
                                </label>
                                <Input
                                    value={filterForm.data.q}
                                    onChange={(event) => filterForm.setData('q', event.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <Button onClick={applyFilters} disabled={filterForm.processing}>
                                Apply Filters
                            </Button>
                            {can_export && (
                                <Link
                                    href={auditLogsExport.url({ query: filterParams })}
                                    className="text-sm text-primary hover:underline"
                                >
                                    Export CSV
                                </Link>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {logs.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No audit logs yet.</p>
                        ) : (
                            <div className="space-y-4">
                                {logs.map((log) => (
                                    <div key={log.id} className="rounded-lg border border-border p-4">
                                        <div className="flex flex-wrap items-center justify-between gap-3">
                                            <div>
                                                <p className="text-sm font-semibold text-foreground">
                                                    {log.action}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {log.resource} • {log.created_at ?? '—'}
                                                </p>
                                            </div>
                                            <Badge variant="secondary">
                                                {log.user?.role ?? 'system'}
                                            </Badge>
                                        </div>
                                        <div className="mt-3 grid gap-2 text-xs text-muted-foreground md:grid-cols-2">
                                            <div>
                                                <p className="font-medium text-foreground">User</p>
                                                <p>{log.user?.name ?? 'System'}</p>
                                            </div>
                                            <div>
                                                <p className="font-medium text-foreground">IP Address</p>
                                                <p>{log.ip_address ?? '—'}</p>
                                            </div>
                                            <div className="md:col-span-2">
                                                <p className="font-medium text-foreground">Payload</p>
                                                <pre className="mt-1 max-h-40 overflow-auto rounded-md bg-muted p-3 text-xs text-foreground">
{JSON.stringify(log.payload ?? {}, null, 2)}
                                                </pre>
                                            </div>
                                        </div>
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
