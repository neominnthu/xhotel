import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';
import { dashboard } from '@/routes';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import type { BreadcrumbItem } from '@/types';

type ReservationDetail = {
    id: number;
    code: string;
    status: string;
    check_in: string;
    check_out: string;
    adults: number;
    children: number;
    special_requests?: string | null;
    guest: { id: number; name: string; phone?: string | null } | null;
    room: { id: number; number: string } | null;
    room_type: { id: number; name: Record<string, string> } | null;
    stay: {
        status: string;
        actual_check_in?: string | null;
        actual_check_out?: string | null;
    } | null;
    folio: {
        id: number;
        currency: string;
        total: number;
        balance: number;
        status: string;
    } | null;
    status_logs: Array<{
        id: number;
        status_from: string | null;
        status_to: string;
        changed_at: string | null;
        reason: string | null;
        actor: { id: number; name: string } | null;
    }>;
};

type Props = {
    reservation: ReservationDetail;
    cancellation_preview: {
        policy: {
            id: number;
            name: string;
            deadline_hours: number;
            penalty_type: string;
            penalty_amount: number;
            penalty_percent: number;
        } | null;
        deadline: string | null;
        applies: boolean;
        amount: number;
        currency: string;
    };
};

const breadcrumbs = (reservation: ReservationDetail): BreadcrumbItem[] => [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Reservations', href: '/reservations' },
    { title: reservation.code, href: `/reservations/${reservation.id}` },
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

export default function ReservationShow({ reservation, cancellation_preview }: Props) {
    const { data, setData, patch, processing, errors } = useForm({
        check_in: reservation.check_in,
        check_out: reservation.check_out,
        adults: reservation.adults.toString(),
        children: reservation.children.toString(),
        special_requests: reservation.special_requests ?? '',
    });
    const cancelForm = useForm({
        reason: '',
    });
    const canCancel = !['canceled', 'checked_out'].includes(reservation.status);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

    const handleUpdate = () => {
        patch(`/reservations/${reservation.id}`);
    };

    const handleCancel = () => {
        cancelForm.post(`/reservations/${reservation.id}/cancel`, {
            onSuccess: () => setIsCancelModalOpen(false),
        });
    };

    const penaltySummary = () => {
        if (!cancellation_preview.policy) {
            return 'No active cancellation policy.';
        }

        const policy = cancellation_preview.policy;
        if (policy.penalty_type === 'flat') {
            return `Flat ${policy.penalty_amount} ${cancellation_preview.currency}`;
        }

        if (policy.penalty_type === 'percent') {
            return `Percent ${policy.penalty_percent}%`;
        }

        return 'First night';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs(reservation)}>
            <Head title={`Reservation ${reservation.code}`} />
            <div className="flex flex-1 flex-col gap-6 rounded-xl p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-semibold text-foreground">
                                Reservation {reservation.code}
                            </h1>
                            <Badge variant={statusVariant(reservation.status)}>
                                {statusLabel(reservation.status)}
                            </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {reservation.check_in} to {reservation.check_out}
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Button
                            type="button"
                            variant="secondary"
                            disabled={processing}
                            onClick={handleUpdate}
                        >
                            Save Changes
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            disabled={!canCancel || cancelForm.processing}
                            onClick={() => setIsCancelModalOpen(true)}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                    <div className="rounded-xl border border-border bg-card p-4">
                        <h2 className="text-sm font-semibold text-muted-foreground">
                            Guest
                        </h2>
                        <div className="mt-3 space-y-1">
                            <div className="text-lg font-semibold text-foreground">
                                {reservation.guest?.name ?? '—'}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                {reservation.guest?.phone ?? 'No phone'}
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-4">
                        <h2 className="text-sm font-semibold text-muted-foreground">
                            Room
                        </h2>
                        <div className="mt-3 space-y-1">
                            <div className="text-lg font-semibold text-foreground">
                                {reservation.room?.number ?? 'Unassigned'}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                {reservation.room_type?.name?.en ?? '—'}
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-4">
                        <h2 className="text-sm font-semibold text-muted-foreground">
                            Stay
                        </h2>
                        <div className="mt-3 space-y-1">
                            <div className="text-lg font-semibold text-foreground">
                                {reservation.stay?.status ?? '—'}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Check-in: {reservation.stay?.actual_check_in ?? '—'}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Check-out: {reservation.stay?.actual_check_out ?? '—'}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-4">
                    <h2 className="text-sm font-semibold text-muted-foreground">
                        အခြေအနေ အပြောင်းအလဲမှတ်တမ်း
                    </h2>
                    <div className="mt-4 space-y-3">
                        {reservation.status_logs.length === 0 ? (
                            <div className="text-sm text-muted-foreground">
                                အချက်အလက် မရှိသေးပါ
                            </div>
                        ) : (
                            reservation.status_logs.map((log) => (
                                <div
                                    key={log.id}
                                    className="flex flex-col gap-1 rounded-lg border border-border bg-background p-3"
                                >
                                    <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-foreground">
                                        <span>
                                            {log.status_from
                                                ? log.status_from.replace('_', ' ')
                                                : 'start'}
                                        </span>
                                        <span>→</span>
                                        <span>
                                            {log.status_to.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {log.changed_at ?? '—'}
                                        {log.actor ? ` • ${log.actor.name}` : ''}
                                    </div>
                                    {log.reason && (
                                        <div className="text-xs text-muted-foreground">
                                            {log.reason}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-4">
                    <h2 className="text-sm font-semibold text-muted-foreground">
                        Edit Stay Details
                    </h2>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Input
                                type="date"
                                value={data.check_in}
                                onChange={(event) =>
                                    setData('check_in', event.target.value)
                                }
                            />
                            <InputError message={errors.check_in} />
                        </div>
                        <div className="space-y-2">
                            <Input
                                type="date"
                                value={data.check_out}
                                onChange={(event) =>
                                    setData('check_out', event.target.value)
                                }
                            />
                            <InputError message={errors.check_out} />
                        </div>
                        <div className="space-y-2">
                            <Input
                                type="number"
                                min={1}
                                value={data.adults}
                                onChange={(event) =>
                                    setData('adults', event.target.value)
                                }
                            />
                            <InputError message={errors.adults} />
                        </div>
                        <div className="space-y-2">
                            <Input
                                type="number"
                                min={0}
                                value={data.children}
                                onChange={(event) =>
                                    setData('children', event.target.value)
                                }
                            />
                            <InputError message={errors.children} />
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                            <Input
                                placeholder="Special requests"
                                value={data.special_requests}
                                onChange={(event) =>
                                    setData(
                                        'special_requests',
                                        event.target.value,
                                    )
                                }
                            />
                            <InputError message={errors.special_requests} />
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-foreground">
                                Folio
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Balance and charges overview
                            </p>
                        </div>
                        <Button asChild variant="outline" size="sm">
                            <Link href={`/folios/${reservation.folio?.id ?? ''}`}>
                                View Statement
                            </Link>
                        </Button>
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                        <div className="rounded-lg border border-border px-4 py-3">
                            <div className="text-xs uppercase text-muted-foreground">
                                Currency
                            </div>
                            <div className="text-sm font-semibold text-foreground">
                                {reservation.folio?.currency ?? '—'}
                            </div>
                        </div>
                        <div className="rounded-lg border border-border px-4 py-3">
                            <div className="text-xs uppercase text-muted-foreground">
                                Total
                            </div>
                            <div className="text-sm font-semibold text-foreground">
                                {reservation.folio?.total ?? 0}
                            </div>
                        </div>
                        <div className="rounded-lg border border-border px-4 py-3">
                            <div className="text-xs uppercase text-muted-foreground">
                                Balance
                            </div>
                            <div className="text-sm font-semibold text-foreground">
                                {reservation.folio?.balance ?? 0}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-foreground">
                            Actions
                        </h2>
                        <Button asChild variant="ghost">
                            <Link href="/reservations">Back to list</Link>
                        </Button>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                        <Button type="button" disabled>
                            Assign Room
                        </Button>
                        <Button type="button" variant="secondary" disabled>
                            Add Charge
                        </Button>
                        <Button type="button" variant="secondary" disabled>
                            Post Payment
                        </Button>
                    </div>
                    <div className="mt-6 grid gap-3 sm:grid-cols-3">
                        <div className="rounded-lg border border-border px-4 py-3">
                            <div className="text-xs uppercase text-muted-foreground">
                                Cancellation policy
                            </div>
                            <div className="text-sm font-semibold text-foreground">
                                {cancellation_preview.policy?.name ?? 'None'}
                            </div>
                            <div className="text-xs text-muted-foreground">
                                {penaltySummary()}
                            </div>
                        </div>
                        <div className="rounded-lg border border-border px-4 py-3">
                            <div className="text-xs uppercase text-muted-foreground">
                                Deadline
                            </div>
                            <div className="text-sm font-semibold text-foreground">
                                {cancellation_preview.deadline ?? '—'}
                            </div>
                        </div>
                        <div className="rounded-lg border border-border px-4 py-3">
                            <div className="text-xs uppercase text-muted-foreground">
                                Penalty now
                            </div>
                            <div className="text-sm font-semibold text-foreground">
                                {cancellation_preview.applies
                                    ? `${cancellation_preview.amount} ${cancellation_preview.currency}`
                                    : 'No penalty'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Dialog open={isCancelModalOpen} onOpenChange={setIsCancelModalOpen}>
                <DialogContent>
                    <DialogTitle>Confirm Reservation Cancellation</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to cancel this reservation? This action cannot be undone.
                    </DialogDescription>

                    <div className="space-y-4">
                        <div className="rounded-lg border border-border bg-muted/50 p-4">
                            <h3 className="font-semibold text-foreground mb-2">Cancellation Details</h3>
                            <div className="grid gap-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Policy:</span>
                                    <span className="font-medium">{cancellation_preview.policy?.name ?? 'None'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Deadline:</span>
                                    <span className="font-medium">{cancellation_preview.deadline ?? '—'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Penalty:</span>
                                    <span className="font-medium text-destructive">
                                        {cancellation_preview.applies
                                            ? `${cancellation_preview.amount} ${cancellation_preview.currency}`
                                            : 'No penalty'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="cancel-reason" className="text-sm font-medium">
                                Cancellation Reason <span className="text-destructive">*</span>
                            </label>
                            <Input
                                id="cancel-reason"
                                placeholder="Please provide a reason for cancellation"
                                value={cancelForm.data.reason}
                                onChange={(event) =>
                                    cancelForm.setData('reason', event.target.value)
                                }
                            />
                            <InputError message={cancelForm.errors.reason} />
                        </div>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="secondary" disabled={cancelForm.processing}>
                                Keep Reservation
                            </Button>
                        </DialogClose>
                        <Button
                            variant="destructive"
                            disabled={cancelForm.processing || !cancelForm.data.reason.trim()}
                            onClick={handleCancel}
                        >
                            {cancelForm.processing ? 'Canceling...' : 'Confirm Cancellation'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
