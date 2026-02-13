import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type Folio = {
    id: number;
    currency: string;
    total: number;
    balance: number;
    status: string;
    closed_at?: string | null;
};

type Reservation = {
    id: number;
    code: string;
    guest: { id: number; name: string } | null;
};

type Charge = {
    id: number;
    type: string;
    description?: string | null;
    amount: number;
    currency: string;
    posted_at?: string | null;
    created_by: { id: number; name: string } | null;
};

type Payment = {
    id: number;
    method: string;
    amount: number;
    currency: string;
    reference?: string | null;
    card_last_four?: string | null;
    card_type?: string | null;
    bank_details?: string | null;
    wallet_type?: string | null;
    check_number?: string | null;
    received_at?: string | null;
};

type Props = {
    folio: Folio;
    reservation: Reservation;
    charges: Charge[];
    payments: Payment[];
};

const breadcrumbs = (reservation: Reservation, folio: Folio): BreadcrumbItem[] => [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Reservations', href: '/reservations' },
    { title: reservation.code, href: `/reservations/${reservation.id}` },
    { title: `Folio ${folio.id}`, href: `/folios/${folio.id}` },
];

function formatChargeType(type: string): string {
    return type
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

function formatPaymentMethod(method: string): string {
    const methodMap: Record<string, string> = {
        'cash': 'Cash',
        'card': 'Credit/Debit Card',
        'bank_transfer': 'Bank Transfer',
        'digital_wallet': 'Digital Wallet',
        'check': 'Check',
        'voucher': 'Voucher/Coupon',
        'other': 'Other',
    };
    return methodMap[method] || method.charAt(0).toUpperCase() + method.slice(1);
}

function formatPaymentDetails(payment: Payment): string {
    const details: string[] = [];

    if (payment.reference) {
        details.push(`Ref: ${payment.reference}`);
    }

    if (payment.method === 'card' && payment.card_last_four) {
        const cardType = payment.card_type ? payment.card_type.charAt(0).toUpperCase() + payment.card_type.slice(1) : '';
        details.push(`${cardType} ****${payment.card_last_four}`);
    }

    if (payment.method === 'bank_transfer' && payment.bank_details) {
        details.push(payment.bank_details);
    }

    if (payment.method === 'digital_wallet' && payment.wallet_type) {
        const walletMap: Record<string, string> = {
            'paypal': 'PayPal',
            'apple_pay': 'Apple Pay',
            'google_pay': 'Google Pay',
            'venmo': 'Venmo',
            'zelle': 'Zelle',
        };
        details.push(walletMap[payment.wallet_type] || payment.wallet_type);
    }

    if (payment.method === 'check' && payment.check_number) {
        details.push(`Check #${payment.check_number}`);
    }

    return details.length > 0 ? details.join(' · ') : '—';
}

export default function FolioShow({ folio, reservation, charges, payments }: Props) {
    const chargeForm = useForm({
        type: '',
        description: '',
        amount: '',
        currency: folio.currency,
        tax_amount: '',
    });
    const paymentForm = useForm({
        method: 'cash',
        amount: '',
        currency: folio.currency,
        exchange_rate: '',
        reference: '',
    });
    const isFolioOpen = folio.status === 'open';

    const handleChargeSubmit = () => {
        chargeForm.post(`/folios/${folio.id}/charges`);
    };

    const handlePaymentSubmit = () => {
        paymentForm.post(`/folios/${folio.id}/payments`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs(reservation, folio)}>
            <Head title={`Folio ${folio.id}`} />
            <div className="flex flex-1 flex-col gap-6 rounded-xl p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-foreground">
                            Folio #{folio.id}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Reservation {reservation.code} ·{' '}
                            {reservation.guest?.name ?? 'Unknown guest'}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant={statusVariant(folio.status)}>
                            {folio.status}
                        </Badge>
                        <Button asChild variant="ghost">
                            <Link href={`/reservations/${reservation.id}`}>
                                Back to reservation
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border border-border bg-card p-4">
                        <div className="text-xs uppercase text-muted-foreground">
                            Currency
                        </div>
                        <div className="text-lg font-semibold text-foreground">
                            {folio.currency}
                        </div>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-4">
                        <div className="text-xs uppercase text-muted-foreground">
                            Total
                        </div>
                        <div className="text-lg font-semibold text-foreground">
                            {folio.total}
                        </div>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-4">
                        <div className="text-xs uppercase text-muted-foreground">
                            Balance
                        </div>
                        <div className="text-lg font-semibold text-foreground">
                            {folio.balance}
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-xl border border-border bg-card p-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <h2 className="text-sm font-semibold text-foreground">
                                    Post Charge
                                </h2>
                                <p className="text-xs text-muted-foreground">
                                    Add incidental charges to this folio.
                                </p>
                            </div>
                            <Button
                                type="button"
                                disabled={!isFolioOpen || chargeForm.processing}
                                onClick={handleChargeSubmit}
                            >
                                Add Charge
                            </Button>
                        </div>
                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Input
                                    placeholder="Type (e.g. minibar)"
                                    value={chargeForm.data.type}
                                    onChange={(event) =>
                                        chargeForm.setData(
                                            'type',
                                            event.target.value,
                                        )
                                    }
                                    disabled={!isFolioOpen}
                                />
                                <InputError message={chargeForm.errors.type} />
                            </div>
                            <div className="space-y-2">
                                <Input
                                    placeholder="Description"
                                    value={chargeForm.data.description}
                                    onChange={(event) =>
                                        chargeForm.setData(
                                            'description',
                                            event.target.value,
                                        )
                                    }
                                    disabled={!isFolioOpen}
                                />
                                <InputError message={chargeForm.errors.description} />
                            </div>
                            <div className="space-y-2">
                                <Input
                                    type="number"
                                    min={0}
                                    placeholder="Amount"
                                    value={chargeForm.data.amount}
                                    onChange={(event) =>
                                        chargeForm.setData(
                                            'amount',
                                            event.target.value,
                                        )
                                    }
                                    disabled={!isFolioOpen}
                                />
                                <InputError message={chargeForm.errors.amount} />
                            </div>
                            <div className="space-y-2">
                                <Input
                                    type="number"
                                    min={0}
                                    placeholder="Tax amount"
                                    value={chargeForm.data.tax_amount}
                                    onChange={(event) =>
                                        chargeForm.setData(
                                            'tax_amount',
                                            event.target.value,
                                        )
                                    }
                                    disabled={!isFolioOpen}
                                />
                                <InputError message={chargeForm.errors.tax_amount} />
                            </div>
                            <div className="space-y-2 sm:col-span-2">
                                <Input
                                    placeholder="Currency"
                                    value={chargeForm.data.currency}
                                    onChange={(event) =>
                                        chargeForm.setData(
                                            'currency',
                                            event.target.value.toUpperCase(),
                                        )
                                    }
                                    disabled={!isFolioOpen}
                                />
                                <InputError message={chargeForm.errors.currency} />
                            </div>
                        </div>
                        {!isFolioOpen && (
                            <p className="mt-3 text-xs text-muted-foreground">
                                Charges cannot be added to closed folios.
                            </p>
                        )}
                    </div>

                    <div className="rounded-xl border border-border bg-card p-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <h2 className="text-sm font-semibold text-foreground">
                                    Record Payment
                                </h2>
                                <p className="text-xs text-muted-foreground">
                                    Apply guest payments to reduce the balance.
                                </p>
                            </div>
                            <Button
                                type="button"
                                variant="secondary"
                                disabled={!isFolioOpen || paymentForm.processing}
                                onClick={handlePaymentSubmit}
                            >
                                Add Payment
                            </Button>
                        </div>
                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Select
                                    value={paymentForm.data.method}
                                    onValueChange={(value) =>
                                        paymentForm.setData('method', value)
                                    }
                                    disabled={!isFolioOpen}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Payment method" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="cash">Cash</SelectItem>
                                        <SelectItem value="card">Credit/Debit Card</SelectItem>
                                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                        <SelectItem value="digital_wallet">Digital Wallet</SelectItem>
                                        <SelectItem value="check">Check</SelectItem>
                                        <SelectItem value="voucher">Voucher/Coupon</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={paymentForm.errors.method} />
                            </div>
                            <div className="space-y-2">
                                <Input
                                    type="number"
                                    min={0}
                                    placeholder="Amount"
                                    value={paymentForm.data.amount}
                                    onChange={(event) =>
                                        paymentForm.setData(
                                            'amount',
                                            event.target.value,
                                        )
                                    }
                                    disabled={!isFolioOpen}
                                />
                                <InputError message={paymentForm.errors.amount} />
                            </div>
                            <div className="space-y-2">
                                <Input
                                    placeholder="Currency"
                                    value={paymentForm.data.currency}
                                    onChange={(event) =>
                                        paymentForm.setData(
                                            'currency',
                                            event.target.value.toUpperCase(),
                                        )
                                    }
                                    disabled={!isFolioOpen}
                                />
                                <InputError message={paymentForm.errors.currency} />
                            </div>
                            <div className="space-y-2">
                                <Input
                                    type="number"
                                    min={0}
                                    step="0.000001"
                                    placeholder="Exchange rate"
                                    value={paymentForm.data.exchange_rate}
                                    onChange={(event) =>
                                        paymentForm.setData(
                                            'exchange_rate',
                                            event.target.value,
                                        )
                                    }
                                    disabled={!isFolioOpen}
                                />
                                <InputError message={paymentForm.errors.exchange_rate} />
                            </div>
                            <div className="space-y-2 sm:col-span-2">
                                <Input
                                    placeholder="Reference/Transaction ID"
                                    value={paymentForm.data.reference}
                                    onChange={(event) =>
                                        paymentForm.setData(
                                            'reference',
                                            event.target.value,
                                        )
                                    }
                                    disabled={!isFolioOpen}
                                />
                                <InputError message={paymentForm.errors.reference} />
                            </div>
                            {paymentForm.data.method === 'card' && (
                                <>
                                    <div className="space-y-2">
                                        <Input
                                            placeholder="Card last 4 digits"
                                            value={paymentForm.data.card_last_four || ''}
                                            onChange={(event) =>
                                                paymentForm.setData(
                                                    'card_last_four',
                                                    event.target.value,
                                                )
                                            }
                                            disabled={!isFolioOpen}
                                            maxLength={4}
                                        />
                                        <InputError message={paymentForm.errors.card_last_four} />
                                    </div>
                                    <div className="space-y-2">
                                        <Select
                                            value={paymentForm.data.card_type || ''}
                                            onValueChange={(value) =>
                                                paymentForm.setData('card_type', value)
                                            }
                                            disabled={!isFolioOpen}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Card type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="visa">Visa</SelectItem>
                                                <SelectItem value="mastercard">Mastercard</SelectItem>
                                                <SelectItem value="amex">American Express</SelectItem>
                                                <SelectItem value="discover">Discover</SelectItem>
                                                <SelectItem value="other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={paymentForm.errors.card_type} />
                                    </div>
                                </>
                            )}
                            {paymentForm.data.method === 'bank_transfer' && (
                                <div className="space-y-2 sm:col-span-2">
                                    <Input
                                        placeholder="Bank name & account details"
                                        value={paymentForm.data.bank_details || ''}
                                        onChange={(event) =>
                                            paymentForm.setData(
                                                'bank_details',
                                                event.target.value,
                                            )
                                        }
                                        disabled={!isFolioOpen}
                                    />
                                    <InputError message={paymentForm.errors.bank_details} />
                                </div>
                            )}
                            {paymentForm.data.method === 'digital_wallet' && (
                                <div className="space-y-2 sm:col-span-2">
                                    <Select
                                        value={paymentForm.data.wallet_type || ''}
                                        onValueChange={(value) =>
                                            paymentForm.setData('wallet_type', value)
                                        }
                                        disabled={!isFolioOpen}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Wallet type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="paypal">PayPal</SelectItem>
                                            <SelectItem value="apple_pay">Apple Pay</SelectItem>
                                            <SelectItem value="google_pay">Google Pay</SelectItem>
                                            <SelectItem value="venmo">Venmo</SelectItem>
                                            <SelectItem value="zelle">Zelle</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={paymentForm.errors.wallet_type} />
                                </div>
                            )}
                            {paymentForm.data.method === 'check' && (
                                <div className="space-y-2 sm:col-span-2">
                                    <Input
                                        placeholder="Check number"
                                        value={paymentForm.data.check_number || ''}
                                        onChange={(event) =>
                                            paymentForm.setData(
                                                'check_number',
                                                event.target.value,
                                            )
                                        }
                                        disabled={!isFolioOpen}
                                    />
                                    <InputError message={paymentForm.errors.check_number} />
                                </div>
                            )}
                        </div>
                        {!isFolioOpen && (
                            <p className="mt-3 text-xs text-muted-foreground">
                                Payments cannot be added to closed folios.
                            </p>
                        )}
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-xl border border-border bg-card">
                        <div className="border-b border-border px-4 py-3">
                            <h2 className="text-sm font-semibold text-foreground">
                                Charges
                            </h2>
                        </div>
                        <div className="w-full overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                                    <tr>
                                        <th className="px-4 py-3 text-left font-medium">
                                            Type
                                        </th>
                                        <th className="px-4 py-3 text-left font-medium">
                                            Description
                                        </th>
                                        <th className="px-4 py-3 text-left font-medium">
                                            Posted
                                        </th>
                                        <th className="px-4 py-3 text-left font-medium">
                                            Posted by
                                        </th>
                                        <th className="px-4 py-3 text-right font-medium">
                                            Amount
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {charges.length === 0 ? (
                                        <tr>
                                            <td
                                                className="px-4 py-6 text-center text-muted-foreground"
                                                colSpan={5}
                                            >
                                                No charges posted.
                                            </td>
                                        </tr>
                                    ) : (
                                        charges.map((charge) => (
                                            <tr key={charge.id}>
                                                <td className="px-4 py-3 text-foreground">
                                                    {formatChargeType(charge.type)}
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">
                                                    {charge.description ?? '—'}
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">
                                                    {charge.posted_at ?? '—'}
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">
                                                    {charge.created_by?.name ?? '—'}
                                                </td>
                                                <td className="px-4 py-3 text-right text-foreground">
                                                    {charge.amount} {charge.currency}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="rounded-xl border border-border bg-card">
                        <div className="border-b border-border px-4 py-3">
                            <h2 className="text-sm font-semibold text-foreground">
                                Payments
                            </h2>
                        </div>
                        <div className="w-full overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                                    <tr>
                                        <th className="px-4 py-3 text-left font-medium">
                                            Method
                                        </th>
                                        <th className="px-4 py-3 text-left font-medium">
                                            Details
                                        </th>
                                        <th className="px-4 py-3 text-left font-medium">
                                            Received
                                        </th>
                                        <th className="px-4 py-3 text-right font-medium">
                                            Amount
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {payments.length === 0 ? (
                                        <tr>
                                            <td
                                                className="px-4 py-6 text-center text-muted-foreground"
                                                colSpan={4}
                                            >
                                                No payments recorded.
                                            </td>
                                        </tr>
                                    ) : (
                                        payments.map((payment) => (
                                            <tr key={payment.id}>
                                                <td className="px-4 py-3 text-foreground">
                                                    {formatPaymentMethod(payment.method)}
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">
                                                    {formatPaymentDetails(payment)}
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">
                                                    {payment.received_at ?? '—'}
                                                </td>
                                                <td className="px-4 py-3 text-right text-foreground">
                                                    {payment.amount} {payment.currency}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                            <h2 className="text-lg font-semibold text-foreground">
                                Statement Actions
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Export or print for guest receipts.
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button asChild variant="secondary">
                                <Link href={`/invoices/${folio.id}`} target="_blank">
                                    View Invoice
                                </Link>
                            </Button>
                            <Button type="button" variant="secondary" disabled>
                                Export PDF
                            </Button>
                            <Button type="button" variant="secondary" disabled>
                                Export CSV
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
