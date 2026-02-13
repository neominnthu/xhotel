import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Printer, Download, ArrowLeft } from 'lucide-react';
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
    check_in_date?: string | null;
    check_out_date?: string | null;
    guest: {
        id: number;
        name: string;
        email?: string | null;
        phone?: string | null;
        address?: string | null;
    } | null;
};

type Charge = {
    id: number;
    type: string;
    description?: string | null;
    amount: number;
    tax_amount: number;
    currency: string;
    posted_at?: string | null;
    created_by: {
        id: number;
        name: string;
    } | null;
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
    created_by: {
        id: number;
        name: string;
    } | null;
};

type Props = {
    folio: Folio;
    reservation: Reservation;
    charges: Charge[];
    payments: Payment[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Invoice',
        href: '#',
    },
];

function formatCurrency(amount: number, currency: string): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
    }).format(amount);
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

function formatChargeType(type: string): string {
    return type
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
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

export default function InvoiceShow({ folio, reservation, charges, payments }: Props) {
    const handlePrint = () => {
        window.print();
    };

    const subtotal = charges.reduce((sum, charge) => sum + charge.amount, 0);
    const taxTotal = charges.reduce((sum, charge) => sum + charge.tax_amount, 0);
    const totalPayments = payments.reduce((sum, payment) => sum + payment.amount, 0);

    return (
        <>
            <Head title={`Invoice - ${reservation.code}`} />

            {/* Print Controls - Hidden when printing */}
            <div className="print:hidden flex items-center justify-between p-4 border-b bg-background">
                <div className="flex items-center gap-4">
                    <Button variant="outline" onClick={() => window.history.back()}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                    <div>
                        <h1 className="text-xl font-semibold">Invoice</h1>
                        <p className="text-sm text-muted-foreground">
                            Reservation {reservation.code}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handlePrint}>
                        <Printer className="h-4 w-4 mr-2" />
                        Print
                    </Button>
                    <Button variant="outline" disabled>
                        <Download className="h-4 w-4 mr-2" />
                        Export PDF
                    </Button>
                </div>
            </div>

            {/* Invoice Content */}
            <div className="max-w-4xl mx-auto p-8 bg-white print:p-0">
                {/* Header */}
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">INVOICE</h1>
                        <p className="text-gray-600">Invoice #{folio.id.toString().padStart(6, '0')}</p>
                        <p className="text-gray-600">Date: {new Date().toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-xl font-semibold text-gray-900">XHotel PMS</h2>
                        <p className="text-gray-600">Your Hotel Name</p>
                        <p className="text-gray-600">Address Line 1</p>
                        <p className="text-gray-600">City, State, ZIP</p>
                        <p className="text-gray-600">Phone: (123) 456-7890</p>
                        <p className="text-gray-600">Email: info@xhotel.com</p>
                    </div>
                </div>

                {/* Guest Information */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Bill To:</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="font-semibold text-gray-900">{reservation.guest?.name || 'Guest'}</p>
                        {reservation.guest?.email && <p className="text-gray-600">{reservation.guest.email}</p>}
                        {reservation.guest?.phone && <p className="text-gray-600">{reservation.guest.phone}</p>}
                        {reservation.guest?.address && <p className="text-gray-600">{reservation.guest.address}</p>}
                    </div>
                </div>

                {/* Reservation Details */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Reservation Details:</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-600">Reservation Code</p>
                            <p className="font-semibold">{reservation.code}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Status</p>
                            <Badge variant={folio.status === 'closed' ? 'secondary' : 'default'}>
                                {folio.status}
                            </Badge>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Check-in Date</p>
                            <p className="font-semibold">{reservation.check_in_date || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Check-out Date</p>
                            <p className="font-semibold">{reservation.check_out_date || 'N/A'}</p>
                        </div>
                    </div>
                </div>

                {/* Charges Table */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Charges:</h3>
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-300 px-4 py-2 text-left">Type</th>
                                <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                                <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                                <th className="border border-gray-300 px-4 py-2 text-right">Amount</th>
                                <th className="border border-gray-300 px-4 py-2 text-right">Tax</th>
                                <th className="border border-gray-300 px-4 py-2 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {charges.map((charge) => (
                                <tr key={charge.id}>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {formatChargeType(charge.type)}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {charge.description || '—'}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {charge.posted_at || '—'}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-right">
                                        {formatCurrency(charge.amount, charge.currency)}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-right">
                                        {formatCurrency(charge.tax_amount, charge.currency)}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-right font-semibold">
                                        {formatCurrency(charge.amount + charge.tax_amount, charge.currency)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Payments Table */}
                {payments.length > 0 && (
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payments:</h3>
                        <table className="w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border border-gray-300 px-4 py-2 text-left">Method</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Details</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                                    <th className="border border-gray-300 px-4 py-2 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.map((payment) => (
                                    <tr key={payment.id}>
                                        <td className="border border-gray-300 px-4 py-2">
                                            {formatPaymentMethod(payment.method)}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            {formatPaymentDetails(payment)}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            {payment.received_at || '—'}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2 text-right">
                                            {formatCurrency(payment.amount, payment.currency)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Summary */}
                <div className="flex justify-end">
                    <div className="w-64">
                        <div className="border-t border-gray-300 pt-4">
                            <div className="flex justify-between mb-2">
                                <span className="font-semibold">Subtotal:</span>
                                <span>{formatCurrency(subtotal, folio.currency)}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span className="font-semibold">Tax:</span>
                                <span>{formatCurrency(taxTotal, folio.currency)}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span className="font-semibold">Total:</span>
                                <span>{formatCurrency(folio.total, folio.currency)}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span className="font-semibold">Payments:</span>
                                <span>-{formatCurrency(totalPayments, folio.currency)}</span>
                            </div>
                            <Separator className="my-2" />
                            <div className="flex justify-between text-lg font-bold">
                                <span>Balance Due:</span>
                                <span>{formatCurrency(folio.balance, folio.currency)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-12 pt-8 border-t border-gray-300 text-center text-gray-600">
                    <p>Thank you for staying with us!</p>
                    <p className="text-sm mt-2">
                        For questions about this invoice, please contact us at info@xhotel.com or (123) 456-7890
                    </p>
                </div>
            </div>

            {/* Print Styles */}
            <style jsx>{`
                @media print {
                    .print\\:hidden {
                        display: none !important;
                    }
                    body {
                        font-size: 12px;
                    }
                    .max-w-4xl {
                        max-width: none;
                    }
                }
            `}</style>
        </>
    );
}