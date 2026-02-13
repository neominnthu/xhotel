import { Head, useForm, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { Checkbox } from '@/components/ui/checkbox';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type Reservation = {
    id: number;
    code: string;
    check_in: string;
    check_out: string;
    status: string;
    room_type: string | null;
    room_number?: string | null;
    total_amount: number;
};

type Guest = {
    id: number;
    name: string;
    email: string;
    phone: string;
    identification_type?: string;
    identification_number?: string;
    address?: string;
    date_of_birth?: string;
    nationality?: string;
    vip_status?: string;
    preferences?: string[] | string;
    notes?: string;
    special_requests?: string;
    first_name?: string;
    last_name?: string;
    gender?: string;
    phone_country_code?: string;
    passport_number?: string;
    id_card_number?: string;
    city?: string;
    country?: string;
    postal_code?: string;
    company?: string;
    is_blacklisted?: boolean;
    blacklist_reason?: string;
    total_stays: number;
    total_spent: number;
    created_at: string;
};

type Props = {
    guest: Guest;
    reservations: Reservation[];
    merge_candidates: Array<{
        id: number;
        name: string;
        email?: string | null;
        phone?: string | null;
    }>;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Guests',
        href: '/guests',
    },
    {
        title: 'Guest Profile',
        href: '#',
    },
];

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'MMK',
        minimumFractionDigits: 0,
    }).format(amount);
}

function formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

function getStatusBadge(status: string): JSX.Element {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
        confirmed: 'default',
        checked_in: 'secondary',
        checked_out: 'outline',
        cancelled: 'destructive',
    };

    return (
        <Badge variant={variants[status] || 'outline'}>
            {status.replace('_', ' ').toUpperCase()}
        </Badge>
    );
}

export default function GuestsShow({ guest, reservations, merge_candidates }: Props) {
    const { flash } = usePage<{ flash?: { success?: string; error?: string } }>().props;
    const preferencesText = Array.isArray(guest.preferences)
        ? guest.preferences.join(', ')
        : guest.preferences;
    const lastVisit = reservations[0]?.check_out;
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isMergeOpen, setIsMergeOpen] = useState(false);
    const [mergeSearch, setMergeSearch] = useState('');
    const editForm = useForm({
        first_name: guest.first_name ?? '',
        last_name: guest.last_name ?? '',
        phone: guest.phone ?? '',
        phone_country_code: guest.phone_country_code ?? '95',
        email: guest.email ?? '',
        date_of_birth: guest.date_of_birth ?? '',
        gender: guest.gender ?? '',
        nationality: guest.nationality ?? '',
        id_type: guest.identification_type ?? '',
        id_number: guest.identification_number ?? '',
        passport_number: guest.passport_number ?? '',
        id_card_number: guest.id_card_number ?? '',
        address: guest.address ?? '',
        city: guest.city ?? '',
        country: guest.country ?? '',
        postal_code: guest.postal_code ?? '',
        company: guest.company ?? '',
        vip_status: guest.vip_status ?? '',
        preferences: preferencesText ?? '',
        special_requests: guest.special_requests ?? '',
        notes: guest.notes ?? '',
        is_blacklisted: Boolean(guest.is_blacklisted),
        blacklist_reason: guest.blacklist_reason ?? '',
    });
    const mergeForm = useForm({
        merge_ids: [] as number[],
    });
    const mergeCandidates = useMemo(
        () =>
            merge_candidates.filter((candidate) =>
                candidate.name.toLowerCase().includes(mergeSearch.toLowerCase())
            ),
        [merge_candidates, mergeSearch]
    );

    const buildPayload = () => {
        const preferences = editForm.data.preferences
            ? editForm.data.preferences
                .split(',')
                .map((value) => value.trim())
                .filter(Boolean)
            : [];

        return {
            first_name: editForm.data.first_name || null,
            last_name: editForm.data.last_name || null,
            phone: editForm.data.phone || null,
            phone_country_code: editForm.data.phone_country_code || null,
            email: editForm.data.email || null,
            date_of_birth: editForm.data.date_of_birth || null,
            gender: editForm.data.gender || null,
            nationality: editForm.data.nationality || null,
            id_type: editForm.data.id_type || null,
            id_number: editForm.data.id_number || null,
            passport_number: editForm.data.passport_number || null,
            id_card_number: editForm.data.id_card_number || null,
            address: editForm.data.address || null,
            city: editForm.data.city || null,
            country: editForm.data.country || null,
            postal_code: editForm.data.postal_code || null,
            company: editForm.data.company || null,
            vip_status: editForm.data.vip_status || null,
            preferences,
            special_requests: editForm.data.special_requests || null,
            notes: editForm.data.notes || null,
            is_blacklisted: editForm.data.is_blacklisted,
            blacklist_reason: editForm.data.is_blacklisted
                ? editForm.data.blacklist_reason || null
                : null,
        };
    };

    const submitUpdate = () => {
        editForm.patch(`/guests/${guest.id}`, {
            data: buildPayload(),
            preserveScroll: true,
            onSuccess: () => setIsEditOpen(false),
        });
    };

    const toggleMergeId = (guestId: number) => {
        const current = mergeForm.data.merge_ids;
        if (current.includes(guestId)) {
            mergeForm.setData('merge_ids', current.filter((id) => id !== guestId));
            return;
        }

        mergeForm.setData('merge_ids', [...current, guestId]);
    };

    const submitMerge = () => {
        mergeForm.post(`/guests/${guest.id}/merge`, {
            preserveScroll: true,
            onSuccess: () => {
                mergeForm.reset();
                setIsMergeOpen(false);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${guest.name} - Guest Profile`} />

            <div className="flex flex-1 flex-col gap-6 rounded-xl p-6">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-foreground">
                            {guest.name}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Guest Profile & Stay History
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline">Edit Profile</Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl">
                                <DialogHeader>
                                    <DialogTitle>ဧည့်သည် အချက်အလက် ပြင်ရန်</DialogTitle>
                                    <DialogDescription>
                                        လိုအပ်သလို အချက်အလက်များကို ပြင်ဆင်နိုင်ပါသည်။
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-muted-foreground">
                                            First name
                                        </label>
                                        <Input
                                            value={editForm.data.first_name}
                                            onChange={(event) =>
                                                editForm.setData('first_name', event.target.value)
                                            }
                                        />
                                        <InputError message={editForm.errors.first_name} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-muted-foreground">
                                            Last name
                                        </label>
                                        <Input
                                            value={editForm.data.last_name}
                                            onChange={(event) =>
                                                editForm.setData('last_name', event.target.value)
                                            }
                                        />
                                        <InputError message={editForm.errors.last_name} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-muted-foreground">
                                            Phone
                                        </label>
                                        <div className="flex gap-2">
                                            <Input
                                                className="w-20"
                                                value={editForm.data.phone_country_code}
                                                onChange={(event) =>
                                                    editForm.setData('phone_country_code', event.target.value)
                                                }
                                            />
                                            <Input
                                                className="flex-1"
                                                value={editForm.data.phone}
                                                onChange={(event) =>
                                                    editForm.setData('phone', event.target.value)
                                                }
                                            />
                                        </div>
                                        <InputError message={editForm.errors.phone} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-muted-foreground">
                                            Email
                                        </label>
                                        <Input
                                            type="email"
                                            value={editForm.data.email}
                                            onChange={(event) =>
                                                editForm.setData('email', event.target.value)
                                            }
                                        />
                                        <InputError message={editForm.errors.email} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-muted-foreground">
                                            Date of birth
                                        </label>
                                        <Input
                                            type="date"
                                            value={editForm.data.date_of_birth}
                                            onChange={(event) =>
                                                editForm.setData('date_of_birth', event.target.value)
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-muted-foreground">
                                            Nationality
                                        </label>
                                        <Input
                                            value={editForm.data.nationality}
                                            onChange={(event) =>
                                                editForm.setData('nationality', event.target.value)
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-muted-foreground">
                                            ID type
                                        </label>
                                        <Select
                                            value={editForm.data.id_type}
                                            onValueChange={(value) => editForm.setData('id_type', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select ID type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="passport">Passport</SelectItem>
                                                <SelectItem value="nrc">NRC</SelectItem>
                                                <SelectItem value="other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-muted-foreground">
                                            ID number
                                        </label>
                                        <Input
                                            value={editForm.data.id_number}
                                            onChange={(event) =>
                                                editForm.setData('id_number', event.target.value)
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-muted-foreground">
                                            Passport number
                                        </label>
                                        <Input
                                            value={editForm.data.passport_number}
                                            onChange={(event) =>
                                                editForm.setData('passport_number', event.target.value)
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-muted-foreground">
                                            ID card number
                                        </label>
                                        <Input
                                            value={editForm.data.id_card_number}
                                            onChange={(event) =>
                                                editForm.setData('id_card_number', event.target.value)
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-xs font-medium text-muted-foreground">
                                            Address
                                        </label>
                                        <Textarea
                                            value={editForm.data.address}
                                            onChange={(event) =>
                                                editForm.setData('address', event.target.value)
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-muted-foreground">
                                            City
                                        </label>
                                        <Input
                                            value={editForm.data.city}
                                            onChange={(event) =>
                                                editForm.setData('city', event.target.value)
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-muted-foreground">
                                            Country
                                        </label>
                                        <Input
                                            value={editForm.data.country}
                                            onChange={(event) =>
                                                editForm.setData('country', event.target.value)
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-muted-foreground">
                                            Postal code
                                        </label>
                                        <Input
                                            value={editForm.data.postal_code}
                                            onChange={(event) =>
                                                editForm.setData('postal_code', event.target.value)
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-muted-foreground">
                                            Company
                                        </label>
                                        <Input
                                            value={editForm.data.company}
                                            onChange={(event) =>
                                                editForm.setData('company', event.target.value)
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-muted-foreground">
                                            VIP status
                                        </label>
                                        <Select
                                            value={editForm.data.vip_status}
                                            onValueChange={(value) => editForm.setData('vip_status', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="">None</SelectItem>
                                                <SelectItem value="vip">VIP</SelectItem>
                                                <SelectItem value="vvip">VVIP</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-muted-foreground">
                                            Preferences (comma separated)
                                        </label>
                                        <Input
                                            value={editForm.data.preferences}
                                            onChange={(event) =>
                                                editForm.setData('preferences', event.target.value)
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-xs font-medium text-muted-foreground">
                                            Special requests
                                        </label>
                                        <Textarea
                                            value={editForm.data.special_requests}
                                            onChange={(event) =>
                                                editForm.setData('special_requests', event.target.value)
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-xs font-medium text-muted-foreground">
                                            Notes
                                        </label>
                                        <Textarea
                                            value={editForm.data.notes}
                                            onChange={(event) =>
                                                editForm.setData('notes', event.target.value)
                                            }
                                        />
                                    </div>
                                    <div className="flex items-start gap-2 md:col-span-2">
                                        <Checkbox
                                            checked={editForm.data.is_blacklisted}
                                            onCheckedChange={(value) =>
                                                editForm.setData('is_blacklisted', Boolean(value))
                                            }
                                        />
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium">Blacklist</p>
                                            <p className="text-xs text-muted-foreground">
                                                သတိပေးချက် ရှိပါက အမှန်ခြစ်ပါ။
                                            </p>
                                        </div>
                                    </div>
                                    {editForm.data.is_blacklisted && (
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-xs font-medium text-muted-foreground">
                                                Blacklist reason
                                            </label>
                                            <Textarea
                                                value={editForm.data.blacklist_reason}
                                                onChange={(event) =>
                                                    editForm.setData('blacklist_reason', event.target.value)
                                                }
                                            />
                                            <InputError message={editForm.errors.blacklist_reason} />
                                        </div>
                                    )}
                                </div>
                                <DialogFooter className="mt-6">
                                    <DialogClose asChild>
                                        <Button variant="secondary">Cancel</Button>
                                    </DialogClose>
                                    <Button onClick={submitUpdate} disabled={editForm.processing}>
                                        Save Changes
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        <Dialog open={isMergeOpen} onOpenChange={setIsMergeOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline">Merge Profile</Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                    <DialogTitle>ဧည့်သည် ပေါင်းစည်းရန်</DialogTitle>
                                    <DialogDescription>
                                        ပေါင်းစည်းမည့် ဧည့်သည်များကို ရွေးချယ်ပါ။
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-muted-foreground">
                                            Search guest
                                        </label>
                                        <Input
                                            value={mergeSearch}
                                            onChange={(event) => setMergeSearch(event.target.value)}
                                        />
                                    </div>
                                    <div className="max-h-56 space-y-2 overflow-auto rounded-lg border border-border p-3">
                                        {mergeCandidates.length === 0 ? (
                                            <p className="text-sm text-muted-foreground">
                                                မူရင်း ဧည့်သည်အပြင် အခြား ဧည့်သည် မရှိပါ။
                                            </p>
                                        ) : (
                                            mergeCandidates.map((candidate) => (
                                                <label
                                                    key={candidate.id}
                                                    className="flex items-center gap-3 rounded-md border border-border p-2"
                                                >
                                                    <Checkbox
                                                        checked={mergeForm.data.merge_ids.includes(candidate.id)}
                                                        onCheckedChange={() => toggleMergeId(candidate.id)}
                                                    />
                                                    <div>
                                                        <div className="text-sm font-medium">
                                                            {candidate.name}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {candidate.email || candidate.phone || 'No contact'}
                                                        </div>
                                                    </div>
                                                </label>
                                            ))
                                        )}
                                    </div>
                                    <InputError message={mergeForm.errors.merge_ids} />
                                </div>
                                <DialogFooter className="mt-6">
                                    <DialogClose asChild>
                                        <Button variant="secondary">Cancel</Button>
                                    </DialogClose>
                                    <Button
                                        onClick={submitMerge}
                                        disabled={mergeForm.processing || mergeForm.data.merge_ids.length === 0}
                                    >
                                        Merge Guests
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {flash?.success && (
                    <Card>
                        <CardContent className="py-3 text-sm text-emerald-700">
                            {flash.success}
                        </CardContent>
                    </Card>
                )}
                {flash?.error && (
                    <Card>
                        <CardContent className="py-3 text-sm text-red-600">
                            {flash.error}
                        </CardContent>
                    </Card>
                )}

                <Tabs defaultValue="profile" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="profile">Profile</TabsTrigger>
                        <TabsTrigger value="reservations">Reservations</TabsTrigger>
                        <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    </TabsList>

                    <TabsContent value="profile" className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Personal Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Personal Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium">Full Name</label>
                                        <p className="text-sm text-muted-foreground">{guest.name}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Email</label>
                                        <p className="text-sm text-muted-foreground">{guest.email}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Phone</label>
                                        <p className="text-sm text-muted-foreground">{guest.phone}</p>
                                    </div>
                                    {guest.date_of_birth && (
                                        <div>
                                            <label className="text-sm font-medium">Date of Birth</label>
                                            <p className="text-sm text-muted-foreground">
                                                {formatDate(guest.date_of_birth)}
                                            </p>
                                        </div>
                                    )}
                                    {guest.nationality && (
                                        <div>
                                            <label className="text-sm font-medium">Nationality</label>
                                            <p className="text-sm text-muted-foreground">{guest.nationality}</p>
                                        </div>
                                    )}
                                    {guest.vip_status && (
                                        <div>
                                            <label className="text-sm font-medium">VIP Status</label>
                                            <Badge variant="secondary">{guest.vip_status}</Badge>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Identification & Address */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Identification & Address</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {guest.identification_type && guest.identification_number && (
                                        <div>
                                            <label className="text-sm font-medium">Identification</label>
                                            <p className="text-sm text-muted-foreground">
                                                {guest.identification_type}: {guest.identification_number}
                                            </p>
                                        </div>
                                    )}
                                    {guest.address && (
                                        <div>
                                            <label className="text-sm font-medium">Address</label>
                                            <p className="text-sm text-muted-foreground">{guest.address}</p>
                                        </div>
                                    )}
                                    <div>
                                        <label className="text-sm font-medium">Member Since</label>
                                        <p className="text-sm text-muted-foreground">
                                            {formatDate(guest.created_at)}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Preferences & Notes */}
                        {(guest.preferences || guest.notes) && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Preferences & Notes</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {preferencesText && (
                                        <div>
                                            <label className="text-sm font-medium">Preferences</label>
                                            <p className="text-sm text-muted-foreground">{preferencesText}</p>
                                        </div>
                                    )}
                                    {guest.notes && (
                                        <div>
                                            <label className="text-sm font-medium">Notes</label>
                                            <p className="text-sm text-muted-foreground">{guest.notes}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    <TabsContent value="reservations" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Reservation History</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {reservations.length === 0 ? (
                                    <p className="text-muted-foreground">No reservations found</p>
                                ) : (
                                    <div className="space-y-4">
                                        {reservations.map((reservation) => (
                                            <div key={reservation.id} className="border rounded-lg p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="font-medium">
                                                        Reservation #{reservation.code}
                                                    </h4>
                                                    {getStatusBadge(reservation.status)}
                                                </div>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                    <div>
                                                        <span className="text-muted-foreground">Check-in:</span>
                                                        <p>{reservation.check_in}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-muted-foreground">Check-out:</span>
                                                        <p>{reservation.check_out}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-muted-foreground">Room:</span>
                                                        <p>{reservation.room_type || 'Unassigned'}</p>
                                                        {reservation.room_number && (
                                                            <p className="text-xs">Room {reservation.room_number}</p>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <span className="text-muted-foreground">Total:</span>
                                                        <p>{formatCurrency(reservation.total_amount)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="analytics" className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-3">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Total Stays</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{guest.total_stays}</div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Total Spent</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{formatCurrency(guest.total_spent)}</div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Average per Stay</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {guest.total_stays > 0
                                            ? formatCurrency(guest.total_spent / guest.total_stays)
                                            : formatCurrency(0)
                                        }
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {lastVisit && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Last Visit</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-lg">{lastVisit}</p>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}