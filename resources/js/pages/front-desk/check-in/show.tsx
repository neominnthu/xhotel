import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { frontDesk } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type Room = {
    id: number;
    number: string;
    status: string;
    housekeeping_status: string;
};

type Props = {
    reservation: {
        id: number;
        code: string;
        status: string;
        check_in: string;
        check_out: string;
        guests: number;
        special_requests?: string;
        guest: {
            id: number;
            name: string;
            email: string;
            phone: string;
            identification_type?: string;
            identification_number?: string;
            address?: string;
        } | null;
        room_type: {
            id: number;
            name: Record<string, string>;
            capacity: number;
        } | null;
        assigned_room: {
            id: number;
            number: string;
            status: string;
        } | null;
        folio: {
            id: number;
            balance: number;
            total: number;
            charges: Array<{
                id: number;
                type: string;
                description: string;
                amount: number;
                posted_at: string;
            }>;
        } | null;
    };
    availableRooms: Room[];
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
        title: 'Check In',
        href: '/front-desk/check-in',
    },
];

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'MMK',
        minimumFractionDigits: 0,
    }).format(amount);
}

export default function CheckInShow({ reservation, availableRooms }: Props) {
    const [step, setStep] = useState<'guest-info' | 'room-assignment' | 'payment' | 'confirmation'>('guest-info');

    const { data, setData, post, processing, errors } = useForm({
        room_id: reservation.assigned_room?.id || '',
        deposit_amount: '',
        deposit_currency: 'MMK',
        id_verified: false,
        key_card_number: '',
        special_requests: reservation.special_requests || '',
        notes: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(`/api/v1/stays/${reservation.id}/check-in`, {
            onSuccess: () => {
                // Redirect to front desk or show success
                window.location.href = frontDesk().url;
            },
        });
    };

    const nextStep = () => {
        if (step === 'guest-info') setStep('room-assignment');
        else if (step === 'room-assignment') setStep('payment');
        else if (step === 'payment') setStep('confirmation');
    };

    const prevStep = () => {
        if (step === 'confirmation') setStep('payment');
        else if (step === 'payment') setStep('room-assignment');
        else if (step === 'room-assignment') setStep('guest-info');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Check In - ${reservation.code}`} />

            <div className="flex flex-1 flex-col gap-6 rounded-xl p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-foreground">
                            Check In - {reservation.code}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {reservation.guest?.name} • {reservation.check_in} to {reservation.check_out}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Badge variant="secondary">
                            {reservation.guests} Guest{reservation.guests !== 1 ? 's' : ''}
                        </Badge>
                        <Badge variant="outline">
                            {reservation.room_type?.name.en}
                        </Badge>
                    </div>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-center space-x-4">
                    {[
                        { key: 'guest-info', label: 'Guest Info' },
                        { key: 'room-assignment', label: 'Room Assignment' },
                        { key: 'payment', label: 'Payment' },
                        { key: 'confirmation', label: 'Confirmation' },
                    ].map((stepItem, index) => (
                        <div key={stepItem.key} className="flex items-center">
                            <div
                                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                                    step === stepItem.key
                                        ? 'bg-primary text-primary-foreground'
                                        : index < ['guest-info', 'room-assignment', 'payment', 'confirmation'].indexOf(step)
                                        ? 'bg-primary/20 text-primary'
                                        : 'bg-muted text-muted-foreground'
                                }`}
                            >
                                {index + 1}
                            </div>
                            {index < 3 && (
                                <div
                                    className={`h-px w-12 ${
                                        index < ['guest-info', 'room-assignment', 'payment', 'confirmation'].indexOf(step)
                                            ? 'bg-primary'
                                            : 'bg-muted'
                                    }`}
                                />
                            )}
                        </div>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Guest Information Step */}
                    {step === 'guest-info' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Guest Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="guest_name">Name</Label>
                                        <Input
                                            id="guest_name"
                                            value={reservation.guest?.name || ''}
                                            readOnly
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="guest_email">Email</Label>
                                        <Input
                                            id="guest_email"
                                            type="email"
                                            value={reservation.guest?.email || ''}
                                            readOnly
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="guest_phone">Phone</Label>
                                        <Input
                                            id="guest_phone"
                                            value={reservation.guest?.phone || ''}
                                            readOnly
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="identification">ID Verification</Label>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="id_verified"
                                                checked={data.id_verified}
                                                onCheckedChange={(checked) => setData('id_verified', checked as boolean)}
                                            />
                                            <Label htmlFor="id_verified">ID Verified</Label>
                                        </div>
                                    </div>
                                </div>

                                {reservation.guest?.identification_type && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label>ID Type</Label>
                                            <Input value={reservation.guest.identification_type} readOnly />
                                        </div>
                                        <div>
                                            <Label>ID Number</Label>
                                            <Input value={reservation.guest.identification_number} readOnly />
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <Label htmlFor="special_requests">Special Requests</Label>
                                    <Textarea
                                        id="special_requests"
                                        value={data.special_requests}
                                        onChange={(e) => setData('special_requests', e.target.value)}
                                        placeholder="Any special requests or notes..."
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Room Assignment Step */}
                    {step === 'room-assignment' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Room Assignment</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="room_id">Select Room</Label>
                                    <Select value={data.room_id} onValueChange={(value) => setData('room_id', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choose a room" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableRooms.map((room) => (
                                                <SelectItem key={room.id} value={room.id.toString()}>
                                                    Room {room.number} - {room.housekeeping_status}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.room_id && <p className="text-sm text-destructive">{errors.room_id}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="key_card_number">Key Card Number</Label>
                                    <Input
                                        id="key_card_number"
                                        value={data.key_card_number}
                                        onChange={(e) => setData('key_card_number', e.target.value)}
                                        placeholder="Enter key card number"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="notes">Check-in Notes</Label>
                                    <Textarea
                                        id="notes"
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        placeholder="Any additional notes..."
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Payment Step */}
                    {step === 'payment' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Deposit & Payment</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {reservation.folio && (
                                    <div className="space-y-2">
                                        <h4 className="font-medium">Current Folio</h4>
                                        <div className="flex justify-between">
                                            <span>Total Charges:</span>
                                            <span>{formatCurrency(reservation.folio.total)}</span>
                                        </div>
                                        <div className="flex justify-between font-medium">
                                            <span>Balance:</span>
                                            <span className={reservation.folio.balance > 0 ? 'text-destructive' : 'text-green-600'}>
                                                {formatCurrency(reservation.folio.balance)}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="deposit_amount">Deposit Amount</Label>
                                        <Input
                                            id="deposit_amount"
                                            type="number"
                                            step="0.01"
                                            value={data.deposit_amount}
                                            onChange={(e) => setData('deposit_amount', e.target.value)}
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="deposit_currency">Currency</Label>
                                        <Select value={data.deposit_currency} onValueChange={(value) => setData('deposit_currency', value)}>
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
                            </CardContent>
                        </Card>
                    )}

                    {/* Confirmation Step */}
                    {step === 'confirmation' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Check-in Confirmation</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <h4 className="font-medium">Reservation Details</h4>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-muted-foreground">Guest:</span>
                                            <p className="font-medium">{reservation.guest?.name}</p>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">Room:</span>
                                            <p className="font-medium">
                                                {availableRooms.find(r => r.id.toString() === data.room_id)?.number || 'Not assigned'}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">Check-in:</span>
                                            <p className="font-medium">{reservation.check_in}</p>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">Check-out:</span>
                                            <p className="font-medium">{reservation.check_out}</p>
                                        </div>
                                    </div>
                                </div>

                                {data.deposit_amount && (
                                    <div className="space-y-2">
                                        <h4 className="font-medium">Deposit</h4>
                                        <p className="text-sm">
                                            Amount: {formatCurrency(parseFloat(data.deposit_amount))} {data.deposit_currency}
                                        </p>
                                    </div>
                                )}

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="confirm_checkin"
                                        required
                                    />
                                    <Label htmlFor="confirm_checkin" className="text-sm">
                                        I confirm that all guest information has been verified and the room is ready for check-in.
                                    </Label>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={prevStep}
                            disabled={step === 'guest-info'}
                        >
                            Previous
                        </Button>

                        {step === 'confirmation' ? (
                            <Button type="submit" disabled={processing}>
                                Complete Check-in
                            </Button>
                        ) : (
                            <Button type="button" onClick={nextStep}>
                                Next
                            </Button>
                        )}
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}