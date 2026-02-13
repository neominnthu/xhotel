import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Printer } from 'lucide-react';

type Refund = {
    id: number;
    method: string;
    amount: number;
    currency: string;
    status: string;
    reference?: string | null;
    reason?: string | null;
    approved_at?: string | null;
    refunded_at?: string | null;
    requested_by: { id: number; name: string } | null;
    approved_by: { id: number; name: string } | null;
};

type Folio = {
    id: number;
    currency: string;
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
    } | null;
};

type Props = {
    refund: Refund;
    folio: Folio;
    reservation: Reservation;
};

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

function refundBadge(status: string): 'secondary' | 'outline' | 'destructive' {
    if (status === 'approved') {
        return 'secondary';
    }

    if (status === 'rejected') {
        return 'destructive';
    }

    return 'outline';
}

export default function RefundReceipt({ refund, folio, reservation }: Props) {
    return (
        <>
            <Head title={`Refund Receipt - ${reservation.code}`} />

            <div className="print:hidden flex items-center justify-between p-4 border-b bg-background">
                <div className="flex items-center gap-4">
                    <Button variant="outline" onClick={() => window.history.back()}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                    <div>
                        <h1 className="text-xl font-semibold">Refund Receipt</h1>
                        <p className="text-sm text-muted-foreground">
                            Reservation {reservation.code}
                        </p>
                    </div>
                </div>
                <Button variant="outline" onClick={() => window.print()}>
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                </Button>
            </div>

            <div className="max-w-3xl mx-auto p-8 bg-white print:p-0">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">REFUND RECEIPT</h1>
                        <p className="text-gray-600">Refund #{refund.id.toString().padStart(6, '0')}</p>
                        <p className="text-gray-600">Date: {new Date().toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-xl font-semibold text-gray-900">XHotel PMS</h2>
                        <p className="text-gray-600">Your Hotel Name</p>
                        <p className="text-gray-600">Address Line 1</p>
                        <p className="text-gray-600">City, State, ZIP</p>
                        <p className="text-gray-600">Phone: (123) 456-7890</p>
                    </div>
                </div>

                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Guest</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="font-semibold text-gray-900">{reservation.guest?.name || 'Guest'}</p>
                        {reservation.guest?.email && <p className="text-gray-600">{reservation.guest.email}</p>}
                        {reservation.guest?.phone && <p className="text-gray-600">{reservation.guest.phone}</p>}
                    </div>
                </div>

                <div className="mb-8 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg border border-gray-200 p-4">
                        <p className="text-sm text-gray-600">Reservation Code</p>
                        <p className="font-semibold text-gray-900">{reservation.code}</p>
                    </div>
                    <div className="rounded-lg border border-gray-200 p-4">
                        <p className="text-sm text-gray-600">Folio</p>
                        <p className="font-semibold text-gray-900">#{folio.id}</p>
                    </div>
                    <div className="rounded-lg border border-gray-200 p-4">
                        <p className="text-sm text-gray-600">Check-in</p>
                        <p className="font-semibold text-gray-900">{reservation.check_in_date || '—'}</p>
                    </div>
                    <div className="rounded-lg border border-gray-200 p-4">
                        <p className="text-sm text-gray-600">Check-out</p>
                        <p className="font-semibold text-gray-900">{reservation.check_out_date || '—'}</p>
                    </div>
                </div>

                <div className="mb-6 rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Refund Status</p>
                            <Badge variant={refundBadge(refund.status)}>{refund.status}</Badge>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-600">Refund Amount</p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {refund.amount} {refund.currency}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-3 text-sm text-gray-700">
                    <div className="flex items-center justify-between">
                        <span>Refund Method</span>
                        <span className="font-medium text-gray-900">{formatPaymentMethod(refund.method)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span>Reference</span>
                        <span className="font-medium text-gray-900">{refund.reference || '—'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span>Reason</span>
                        <span className="font-medium text-gray-900">{refund.reason || '—'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span>Requested By</span>
                        <span className="font-medium text-gray-900">{refund.requested_by?.name || '—'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span>Approved By</span>
                        <span className="font-medium text-gray-900">{refund.approved_by?.name || '—'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span>Approved At</span>
                        <span className="font-medium text-gray-900">{refund.approved_at || '—'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span>Refunded At</span>
                        <span className="font-medium text-gray-900">{refund.refunded_at || '—'}</span>
                    </div>
                </div>

                <div className="mt-10 border-t border-gray-200 pt-6 text-sm text-gray-600">
                    Thank you. Please keep this receipt for your records.
                </div>
            </div>
        </>
    );
}
