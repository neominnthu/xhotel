import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { frontDesk } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type Charge = {
    id: number;
    type: string;
    description: string;
    amount: number;
    currency: string;
    posted_at: string;
};

type Payment = {
    id: number;
    method: string;
    amount: number;
    currency: string;
    reference?: string;
    received_at: string;
};

type Props = {
    stay: {
        id: number;
        status: string;
        actual_check_in: string;
        reservation: {
            id: number;
            code: string;
            check_in: string;
            check_out: string;
            guest: {
                id: number;
                name: string;
                email: string;
                phone: string;
            } | null;
            room: {
                id: number;
                number: string;
            } | null;
            room_type: {
                name: Record<string, string>;
            } | null;
        };
    };
    folio: {
        id: number;
        balance: number;
        total: number;
        charges: Charge[];
        payments: Payment[];
    } | null;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Front Desk',
        href: frontDesk().url,
    },
    {
        title: 'Check Out',
        href: '/front-desk/check-out',
    },
];

function formatCurrency(amount: number, currency: string = 'MMK'): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
    }).format(amount);
}

export default function CheckOutShow({ stay, folio }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        payment_method: 'cash',
        payment_amount: folio?.balance || 0,
        payment_currency: 'MMK',
        payment_reference: '',
        exchange_rate: 1,
        feedback_rating: '',
        feedback_comments: '',
        key_returned: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(`/api/v1/stays/${stay.id}/check-out`, {
            onSuccess: () => {
                window.location.href = frontDesk().url;
            },
        });
    };

    const totalPaid = folio?.payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
    const remainingBalance = (folio?.balance || 0) - data.payment_amount;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Check Out - ${stay.reservation.code}`} />

            <div className="flex flex-1 flex-col gap-6 rounded-xl p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-foreground">
                            Check Out - {stay.reservation.code}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {stay.reservation.guest?.name} • Room {stay.reservation.room?.number}
                        </p>
                    </div>

                    <Badge variant="secondary">Checked In</Badge>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Folio Summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Folio Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Total Charges:</span>
                                    <span>{formatCurrency(folio?.total || 0)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Total Payments:</span>
                                    <span className="text-green-600">-{formatCurrency(totalPaid)}</span>
                                </div>
                                <div className="flex justify-between font-medium text-lg border-t pt-2">
                                    <span>Balance Due:</span>
                                    <span className={folio?.balance && folio.balance > 0 ? 'text-destructive' : 'text-green-600'}>
                                        {formatCurrency(folio?.balance || 0)}
                                    </span>
                                </div>
                            </div>

                            {folio?.charges && folio.charges.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="font-medium">Charges</h4>
                                    <div className="space-y-1">
                                        {folio.charges.map((charge) => (
                                            <div key={charge.id} className="flex justify-between text-sm">
                                                <span>{charge.description}</span>
                                                <span>{formatCurrency(charge.amount, charge.currency)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {folio?.payments && folio.payments.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="font-medium">Payments</h4>
                                    <div className="space-y-1">
                                        {folio.payments.map((payment) => (
                                            <div key={payment.id} className="flex justify-between text-sm text-green-600">
                                                <span>{payment.method} {payment.reference && `(${payment.reference})`}</span>
                                                <span>-{formatCurrency(payment.amount, payment.currency)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Check-out Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Check-out Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <Label htmlFor="payment_method">Payment Method</Label>
                                    <Select value={data.payment_method} onValueChange={(value) => setData('payment_method', value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="cash">Cash</SelectItem>
                                            <SelectItem value="card">Credit/Debit Card</SelectItem>
                                            <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                            <SelectItem value="digital_wallet">Digital Wallet</SelectItem>
                                            <SelectItem value="check">Check</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="payment_amount">Payment Amount</Label>
                                        <Input
                                            id="payment_amount"
                                            type="number"
                                            step="0.01"
                                            value={data.payment_amount}
                                            onChange={(e) => setData('payment_amount', parseFloat(e.target.value) || 0)}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="payment_currency">Currency</Label>
                                        <Select value={data.payment_currency} onValueChange={(value) => setData('payment_currency', value)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="MMK">MMK</SelectItem>
                                                <SelectItem value="USD">USD</SelectItem>
                                                <SelectItem value="EUR">EUR</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="payment_reference">Reference/Receipt Number</Label>
                                    <Input
                                        id="payment_reference"
                                        value={data.payment_reference}
                                        onChange={(e) => setData('payment_reference', e.target.value)}
                                        placeholder="Optional reference number"
                                    />
                                </div>

                                {remainingBalance > 0 && (
                                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                                        <p className="text-sm text-yellow-800">
                                            Remaining balance after payment: {formatCurrency(remainingBalance)}
                                        </p>
                                    </div>
                                )}

                                {remainingBalance < 0 && (
                                    <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                                        <p className="text-sm text-green-800">
                                            Change due: {formatCurrency(Math.abs(remainingBalance))}
                                        </p>
                                    </div>
                                )}

                                <div>
                                    <Label htmlFor="feedback_rating">Guest Satisfaction (Optional)</Label>
                                    <Select value={data.feedback_rating} onValueChange={(value) => setData('feedback_rating', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Rate your stay" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="5">⭐⭐⭐⭐⭐ Excellent</SelectItem>
                                            <SelectItem value="4">⭐⭐⭐⭐ Very Good</SelectItem>
                                            <SelectItem value="3">⭐⭐⭐ Good</SelectItem>
                                            <SelectItem value="2">⭐⭐ Fair</SelectItem>
                                            <SelectItem value="1">⭐ Poor</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="feedback_comments">Comments</Label>
                                    <Textarea
                                        id="feedback_comments"
                                        value={data.feedback_comments}
                                        onChange={(e) => setData('feedback_comments', e.target.value)}
                                        placeholder="Any feedback or comments..."
                                        rows={3}
                                    />
                                </div>

                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="key_returned"
                                        checked={data.key_returned}
                                        onChange={(e) => setData('key_returned', e.target.checked)}
                                        className="rounded"
                                    />
                                    <Label htmlFor="key_returned">Key card returned</Label>
                                </div>

                                <Button type="submit" className="w-full" disabled={processing || (folio?.balance || 0) > 0 && data.payment_amount < (folio?.balance || 0)}>
                                    Complete Check-out
                                </Button>

                                {folio?.balance && folio.balance > 0 && data.payment_amount < folio.balance && (
                                    <p className="text-sm text-destructive text-center">
                                        Payment amount must cover the outstanding balance
                                    </p>
                                )}
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}