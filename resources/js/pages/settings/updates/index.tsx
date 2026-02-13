import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { dashboard } from '@/routes';
import {
    apply as applyUpdate,
    backups as createBackup,
    reports as createReport,
    rollback as rollbackUpdate,
} from '@/routes/settings/updates';
import type { BreadcrumbItem } from '@/types';

type UpdateRow = {
    id: number;
    status: string;
    version_from: string | null;
    version_to: string | null;
    release_tag?: string | null;
    release_url?: string | null;
    started_at?: string | null;
    completed_at?: string | null;
    failed_at?: string | null;
    error_message?: string | null;
};

type BackupRow = {
    id: number;
    status: string;
    driver: string;
    file_path: string;
    size_bytes: number;
    completed_at?: string | null;
};

type ReportRow = {
    id: number;
    title: string;
    severity: string;
    status: string;
    github_issue_url?: string | null;
    created_at?: string | null;
};

type UpdateLogRow = {
    id: number;
    level: string;
    message: string;
    created_at?: string | null;
};

type Props = {
    update_status: {
        current_version: string;
        latest_version: string | null;
        has_update: boolean;
        release?: {
            tag_name?: string | null;
            html_url?: string | null;
            body?: string | null;
            published_at?: string | null;
        } | null;
    };
    prechecks: {
        active_update: boolean;
        active_stays: boolean;
        open_folios: boolean;
        health: Record<string, string>;
        has_unhealthy: boolean;
    };
    updates: UpdateRow[];
    backups: BackupRow[];
    reports: ReportRow[];
    update_logs: UpdateLogRow[];
    updates_enabled: boolean;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Settings', href: '/settings/updates' },
];

const severityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' },
];

export default function UpdatesIndex({ update_status, prechecks, updates, backups, reports, update_logs, updates_enabled }: Props) {
    const { flash } = usePage<{ flash?: { success?: string; error?: string } }>().props;
    const updateForm = useForm({
        release_tag: '',
        version_to: '',
        notes: '',
    });
    const rollbackForm = useForm({
        update_id: updates[0]?.id ?? null,
        confirm_db_restore: false,
    });
    const backupForm = useForm({
        reason: '',
    });
    const reportForm = useForm({
        title: '',
        severity: 'medium',
        message: '',
        url: typeof window !== 'undefined' ? window.location.href : '',
        app_version: update_status.current_version,
        payload: {},
    });
    const [isRollbackOpen, setIsRollbackOpen] = useState(false);
    const [rollbackConfirmText, setRollbackConfirmText] = useState('');
    const confirmPhrase = 'ROLLBACK';
    const hasActiveUpdate = updates.some((update) =>
        ['queued', 'running', 'rollback_running'].includes(update.status),
    );
    const releaseNotes = update_status.release?.body ?? '';

    useEffect(() => {
        if (!hasActiveUpdate) {
            return undefined;
        }

        const interval = setInterval(() => {
            router.reload({
                only: ['updates', 'update_logs', 'backups', 'reports', 'update_status'],
                preserveScroll: true,
            });
        }, 10000);

        return () => clearInterval(interval);
    }, [hasActiveUpdate]);

    const submitUpdate = () => {
        updateForm.post(applyUpdate().url, {
            preserveScroll: true,
        });
    };

    const submitRollback = () => {
        rollbackForm.post(rollbackUpdate().url, {
            preserveScroll: true,
            onSuccess: () => {
                setRollbackConfirmText('');
                setIsRollbackOpen(false);
            },
        });
    };

    const submitBackup = () => {
        backupForm.post(createBackup().url, {
            preserveScroll: true,
            onSuccess: () => backupForm.reset(),
        });
    };

    const submitReport = () => {
        reportForm.post(createReport().url, {
            preserveScroll: true,
            onSuccess: () => reportForm.reset(),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="System Updates" />
            <div className="flex flex-1 flex-col gap-6 rounded-xl p-6">
                <div>
                    <h1 className="text-2xl font-semibold text-foreground">
                        System Updates
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Update, backup, rollback နှင့် error report များကို စီမံပါ။
                    </p>
                </div>

                {flash?.success && (
                    <Alert className="border-emerald-200 bg-emerald-50 text-emerald-900">
                        <AlertTitle>အောင်မြင်ပါသည်</AlertTitle>
                        <AlertDescription>{flash.success}</AlertDescription>
                    </Alert>
                )}

                {flash?.error && (
                    <Alert variant="destructive">
                        <AlertTitle>အမှားရှိသည်</AlertTitle>
                        <AlertDescription>{flash.error}</AlertDescription>
                    </Alert>
                )}

                {!updates_enabled && (
                    <Alert variant="destructive">
                        <AlertTitle>Updates ပိတ်ထားပါသည်</AlertTitle>
                        <AlertDescription>
                            Update feature ကို အလုပ်လုပ်ရန် UPDATES_ENABLED ကို ဖွင့်ပါ။
                        </AlertDescription>
                    </Alert>
                )}

                {hasActiveUpdate && (
                    <Alert className="border-amber-200 bg-amber-50 text-amber-900">
                        <AlertTitle>Update လုပ်နေပါသည်</AlertTitle>
                        <AlertDescription>
                            Update လုပ်နေစဉ် အခြား update/rollback လုပ်ခြင်းကို ရှောင်ကြဉ်ပါ။
                        </AlertDescription>
                    </Alert>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle>Update Progress</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        {update_logs.length === 0 ? (
                            <p className="text-muted-foreground">No progress logs yet.</p>
                        ) : (
                            <ol className="space-y-4 border-l border-border pl-4">
                                {update_logs.map((log) => (
                                    <li key={log.id} className="relative">
                                        <span className="absolute -left-[9px] top-2 h-3 w-3 rounded-full border border-border bg-background" />
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <p className="text-sm font-medium text-foreground">
                                                    {log.message}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {log.created_at ?? '—'}
                                                </p>
                                            </div>
                                            <Badge variant={log.level === 'error' ? 'destructive' : 'secondary'}>
                                                {log.level}
                                            </Badge>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        )}
                    </CardContent>
                </Card>

                <div className="grid gap-6 lg:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Update Status</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div className="flex items-center justify-between">
                                <span>Current version</span>
                                <Badge variant="secondary">
                                    {update_status.current_version}
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Latest version</span>
                                <Badge variant={update_status.has_update ? 'default' : 'outline'}>
                                    {update_status.latest_version ?? 'N/A'}
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Updates enabled</span>
                                <Badge variant={updates_enabled ? 'default' : 'outline'}>
                                    {updates_enabled ? 'Enabled' : 'Disabled'}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Start Update</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-muted-foreground">
                                    Release tag
                                </label>
                                <Input
                                    value={updateForm.data.release_tag}
                                    onChange={(event) => updateForm.setData('release_tag', event.target.value)}
                                />
                                <InputError message={updateForm.errors.release_tag} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-muted-foreground">
                                    Target version
                                </label>
                                <Input
                                    value={updateForm.data.version_to}
                                    onChange={(event) => updateForm.setData('version_to', event.target.value)}
                                />
                                <InputError message={updateForm.errors.version_to} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-muted-foreground">
                                    Notes
                                </label>
                                <Textarea
                                    value={updateForm.data.notes}
                                    onChange={(event) => updateForm.setData('notes', event.target.value)}
                                />
                            </div>
                            <Button onClick={submitUpdate} disabled={updateForm.processing || !updates_enabled}>
                                Update Start
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Rollback</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-muted-foreground">
                                    Update ID
                                </label>
                                <Input
                                    type="number"
                                    value={rollbackForm.data.update_id ?? ''}
                                    onChange={(event) =>
                                        rollbackForm.setData('update_id', event.target.value ? Number(event.target.value) : null)
                                    }
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    checked={rollbackForm.data.confirm_db_restore}
                                    onCheckedChange={(value) =>
                                        rollbackForm.setData('confirm_db_restore', Boolean(value))
                                    }
                                />
                                <span className="text-sm text-muted-foreground">
                                    DB restore ကို အတည်ပြုသည်
                                </span>
                            </div>
                            <Dialog open={isRollbackOpen} onOpenChange={setIsRollbackOpen}>
                                <DialogTrigger asChild>
                                    <Button
                                        variant="destructive"
                                        disabled={rollbackForm.processing}
                                    >
                                        Rollback Start
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Rollback ကို အတည်ပြုပါ</DialogTitle>
                                        <DialogDescription>
                                            Rollback လုပ်ပါက လက်ရှိ update ကို ပြန်ဖယ်ရှားပြီး အရင် release သို့ ပြန်သွားပါမည်။
                                            အတည်ပြုရန် "{confirmPhrase}" ဟု ရိုက်ထည့်ပါ။
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-muted-foreground">
                                            Confirmation
                                        </label>
                                        <Input
                                            value={rollbackConfirmText}
                                            onChange={(event) => setRollbackConfirmText(event.target.value)}
                                        />
                                    </div>
                                    <DialogFooter className="gap-2">
                                        <DialogClose asChild>
                                            <Button variant="outline">Cancel</Button>
                                        </DialogClose>
                                        <Button
                                            variant="destructive"
                                            onClick={submitRollback}
                                            disabled={
                                                rollbackForm.processing ||
                                                rollbackConfirmText.trim() !== confirmPhrase
                                            }
                                        >
                                            Confirm Rollback
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Precheck Report</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="flex items-center justify-between">
                                <span>Active update</span>
                                <Badge variant={prechecks.active_update ? 'destructive' : 'secondary'}>
                                    {prechecks.active_update ? 'Blocked' : 'OK'}
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Active check-ins</span>
                                <Badge variant={prechecks.active_stays ? 'destructive' : 'secondary'}>
                                    {prechecks.active_stays ? 'Blocked' : 'OK'}
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Open folios</span>
                                <Badge variant={prechecks.open_folios ? 'destructive' : 'secondary'}>
                                    {prechecks.open_folios ? 'Blocked' : 'OK'}
                                </Badge>
                            </div>
                            {Object.entries(prechecks.health).map(([key, value]) => (
                                <div key={key} className="flex items-center justify-between">
                                    <span className="capitalize">{key}</span>
                                    <Badge variant={value === 'healthy' ? 'secondary' : 'destructive'}>
                                        {value}
                                    </Badge>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Release Notes</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            {update_status.release?.html_url && (
                                <a
                                    href={update_status.release.html_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-sm text-blue-600"
                                >
                                    View Release
                                </a>
                            )}
                            <div className="rounded-md border border-border bg-muted p-3 text-xs text-foreground whitespace-pre-wrap">
                                {releaseNotes || 'No release notes available.'}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Database Backup</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-muted-foreground">
                                    Reason
                                </label>
                                <Input
                                    value={backupForm.data.reason}
                                    onChange={(event) => backupForm.setData('reason', event.target.value)}
                                />
                                <InputError message={backupForm.errors.reason} />
                            </div>
                            <Button onClick={submitBackup} disabled={backupForm.processing}>
                                Backup Start
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Error Report</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-muted-foreground">
                                    Title
                                </label>
                                <Input
                                    value={reportForm.data.title}
                                    onChange={(event) => reportForm.setData('title', event.target.value)}
                                />
                                <InputError message={reportForm.errors.title} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-muted-foreground">
                                    Severity
                                </label>
                                <Select
                                    value={reportForm.data.severity}
                                    onValueChange={(value) => reportForm.setData('severity', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select severity" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {severityOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-muted-foreground">
                                    Message
                                </label>
                                <Textarea
                                    value={reportForm.data.message}
                                    onChange={(event) => reportForm.setData('message', event.target.value)}
                                />
                            </div>
                            <Button onClick={submitReport} disabled={reportForm.processing}>
                                Send Report
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Updates</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            {updates.length === 0 ? (
                                <p className="text-muted-foreground">No updates yet.</p>
                            ) : (
                                updates.map((update) => (
                                    <div key={update.id} className="rounded-lg border border-border p-3">
                                        <div className="flex items-center justify-between">
                                            <span>#{update.id}</span>
                                            <Badge variant={update.status === 'failed' ? 'destructive' : 'secondary'}>
                                                {update.status}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            {update.version_from ?? '—'} → {update.version_to ?? '—'}
                                        </p>
                                        {update.release_tag && (
                                            <p className="text-xs text-muted-foreground">
                                                Tag: {update.release_tag}
                                            </p>
                                        )}
                                        {update.release_url && (
                                            <a
                                                href={update.release_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-xs text-blue-600"
                                            >
                                                Release notes
                                            </a>
                                        )}
                                        {update.error_message && (
                                            <p className="text-xs text-red-600">{update.error_message}</p>
                                        )}
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Backups</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            {backups.length === 0 ? (
                                <p className="text-muted-foreground">No backups yet.</p>
                            ) : (
                                backups.map((backup) => (
                                    <div key={backup.id} className="rounded-lg border border-border p-3">
                                        <div className="flex items-center justify-between">
                                            <span>#{backup.id}</span>
                                            <Badge variant="secondary">{backup.status}</Badge>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            {backup.driver} • {backup.size_bytes.toLocaleString()} bytes
                                        </p>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Reports</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            {reports.length === 0 ? (
                                <p className="text-muted-foreground">No reports yet.</p>
                            ) : (
                                reports.map((report) => (
                                    <div key={report.id} className="rounded-lg border border-border p-3">
                                        <div className="flex items-center justify-between">
                                            <span>{report.title}</span>
                                            <Badge variant="secondary">{report.severity}</Badge>
                                        </div>
                                        {report.github_issue_url && (
                                            <a
                                                href={report.github_issue_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-xs text-blue-600"
                                            >
                                                GitHub Issue
                                            </a>
                                        )}
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
