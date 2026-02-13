import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';
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
    is_blacklisted?: boolean;
    total_stays: number;
    last_visit?: string;
    total_spent: number;
    created_at: string;
};

type Props = {
    guests: {
        data: Guest[];
        meta: {
            total: number;
            page: number;
            per_page: number;
        };
    };
    filters: {
        search?: string;
        vip_status?: string;
        blacklisted?: string | number;
        min_stays?: string | number;
    };
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
];

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'MMK',
        minimumFractionDigits: 0,
    }).format(amount);
}

export default function GuestsIndex({ guests, filters }: Props) {
    const { flash } = usePage<{ flash?: { success?: string; error?: string } }>().props;
    const [search, setSearch] = useState(filters.search || '');
    const [vipStatus, setVipStatus] = useState(filters.vip_status || '');
    const [blacklistedOnly, setBlacklistedOnly] = useState(Boolean(filters.blacklisted));
    const [minStays, setMinStays] = useState(filters.min_stays?.toString() || '');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const form = useForm({
        first_name: '',
        last_name: '',
        phone: '',
        phone_country_code: '95',
        email: '',
        date_of_birth: '',
        gender: '',
        nationality: '',
        id_type: '',
        id_number: '',
        passport_number: '',
        id_card_number: '',
        address: '',
        city: '',
        country: '',
        postal_code: '',
        company: '',
        vip_status: '',
        preferences: '',
        special_requests: '',
        notes: '',
        is_blacklisted: false,
        blacklist_reason: '',
    });

    const guestRows = useMemo(() => guests.data, [guests.data]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/guests',
            {
                search: search || undefined,
                vip_status: vipStatus || undefined,
                blacklisted: blacklistedOnly ? 1 : undefined,
                min_stays: minStays ? Number(minStays) : undefined,
            },
            {
                preserveScroll: true,
            },
        );
    };

    const buildPayload = () => {
        const preferences = form.data.preferences
            ? form.data.preferences
                .split(',')
                .map((value) => value.trim())
                .filter(Boolean)
            : [];

        return {
            first_name: form.data.first_name || null,
            last_name: form.data.last_name || null,
            phone: form.data.phone || null,
            phone_country_code: form.data.phone_country_code || null,
            email: form.data.email || null,
            date_of_birth: form.data.date_of_birth || null,
            gender: form.data.gender || null,
            nationality: form.data.nationality || null,
            id_type: form.data.id_type || null,
            id_number: form.data.id_number || null,
            passport_number: form.data.passport_number || null,
            id_card_number: form.data.id_card_number || null,
            address: form.data.address || null,
            city: form.data.city || null,
            country: form.data.country || null,
            postal_code: form.data.postal_code || null,
            company: form.data.company || null,
            vip_status: form.data.vip_status || null,
            preferences,
            special_requests: form.data.special_requests || null,
            notes: form.data.notes || null,
            is_blacklisted: form.data.is_blacklisted,
            blacklist_reason: form.data.is_blacklisted ? form.data.blacklist_reason || null : null,
        };
    };

    const submitCreate = () => {
        form.post('/guests', {
            data: buildPayload(),
            preserveScroll: true,
            onSuccess: () => {
                form.reset();
                setIsCreateOpen(false);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Guests" />

            <div className="flex flex-1 flex-col gap-6 rounded-xl p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-foreground">
                            Guest Management
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Manage guest profiles and view stay history
                        </p>
                    </div>
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button>Add Guest</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                            <DialogHeader>
                                <DialogTitle>ဧည့်သည် အသစ် ထည့်ရန်</DialogTitle>
                                <DialogDescription>
                                    အရေးကြီး အချက်အလက်များကို ဖြည့်ပါ။
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-muted-foreground">
                                        First name
                                    </label>
                                    <Input
                                        value={form.data.first_name}
                                        onChange={(event) =>
                                            form.setData('first_name', event.target.value)
                                        }
                                    />
                                    <InputError message={form.errors.first_name} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-muted-foreground">
                                        Last name
                                    </label>
                                    <Input
                                        value={form.data.last_name}
                                        onChange={(event) =>
                                            form.setData('last_name', event.target.value)
                                        }
                                    />
                                    <InputError message={form.errors.last_name} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-muted-foreground">
                                        Phone
                                    </label>
                                    <div className="flex gap-2">
                                        <Input
                                            className="w-20"
                                            value={form.data.phone_country_code}
                                            onChange={(event) =>
                                                form.setData('phone_country_code', event.target.value)
                                            }
                                        />
                                        <Input
                                            className="flex-1"
                                            value={form.data.phone}
                                            onChange={(event) =>
                                                form.setData('phone', event.target.value)
                                            }
                                        />
                                    </div>
                                    <InputError message={form.errors.phone} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-muted-foreground">
                                        Email
                                    </label>
                                    <Input
                                        type="email"
                                        value={form.data.email}
                                        onChange={(event) =>
                                            form.setData('email', event.target.value)
                                        }
                                    />
                                    <InputError message={form.errors.email} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-muted-foreground">
                                        Date of birth
                                    </label>
                                    <Input
                                        type="date"
                                        value={form.data.date_of_birth}
                                        onChange={(event) =>
                                            form.setData('date_of_birth', event.target.value)
                                        }
                                    />
                                    <InputError message={form.errors.date_of_birth} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-muted-foreground">
                                        Nationality
                                    </label>
                                    <Input
                                        value={form.data.nationality}
                                        onChange={(event) =>
                                            form.setData('nationality', event.target.value)
                                        }
                                    />
                                    <InputError message={form.errors.nationality} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-muted-foreground">
                                        ID type
                                    </label>
                                    <Select
                                        value={form.data.id_type}
                                        onValueChange={(value) => form.setData('id_type', value)}
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
                                    <InputError message={form.errors.id_type} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-muted-foreground">
                                        ID number
                                    </label>
                                    <Input
                                        value={form.data.id_number}
                                        onChange={(event) =>
                                            form.setData('id_number', event.target.value)
                                        }
                                    />
                                    <InputError message={form.errors.id_number} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-muted-foreground">
                                        Passport number
                                    </label>
                                    <Input
                                        value={form.data.passport_number}
                                        onChange={(event) =>
                                            form.setData('passport_number', event.target.value)
                                        }
                                    />
                                    <InputError message={form.errors.passport_number} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-muted-foreground">
                                        ID card number
                                    </label>
                                    <Input
                                        value={form.data.id_card_number}
                                        onChange={(event) =>
                                            form.setData('id_card_number', event.target.value)
                                        }
                                    />
                                    <InputError message={form.errors.id_card_number} />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-xs font-medium text-muted-foreground">
                                        Address
                                    </label>
                                    <Textarea
                                        value={form.data.address}
                                        onChange={(event) =>
                                            form.setData('address', event.target.value)
                                        }
                                    />
                                    <InputError message={form.errors.address} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-muted-foreground">
                                        City
                                    </label>
                                    <Input
                                        value={form.data.city}
                                        onChange={(event) =>
                                            form.setData('city', event.target.value)
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-muted-foreground">
                                        Country
                                    </label>
                                    <Input
                                        value={form.data.country}
                                        onChange={(event) =>
                                            form.setData('country', event.target.value)
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-muted-foreground">
                                        Postal code
                                    </label>
                                    <Input
                                        value={form.data.postal_code}
                                        onChange={(event) =>
                                            form.setData('postal_code', event.target.value)
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-muted-foreground">
                                        Company
                                    </label>
                                    <Input
                                        value={form.data.company}
                                        onChange={(event) =>
                                            form.setData('company', event.target.value)
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-muted-foreground">
                                        VIP status
                                    </label>
                                    <Select
                                        value={form.data.vip_status}
                                        onValueChange={(value) => form.setData('vip_status', value)}
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
                                        value={form.data.preferences}
                                        onChange={(event) =>
                                            form.setData('preferences', event.target.value)
                                        }
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-xs font-medium text-muted-foreground">
                                        Special requests
                                    </label>
                                    <Textarea
                                        value={form.data.special_requests}
                                        onChange={(event) =>
                                            form.setData('special_requests', event.target.value)
                                        }
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-xs font-medium text-muted-foreground">
                                        Notes
                                    </label>
                                    <Textarea
                                        value={form.data.notes}
                                        onChange={(event) =>
                                            form.setData('notes', event.target.value)
                                        }
                                    />
                                </div>
                                <div className="flex items-start gap-2 md:col-span-2">
                                    <Checkbox
                                        checked={form.data.is_blacklisted}
                                        onCheckedChange={(value) =>
                                            form.setData('is_blacklisted', Boolean(value))
                                        }
                                    />
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium">Blacklist</p>
                                        <p className="text-xs text-muted-foreground">
                                            အရေးကြီး သတိပေးချက်ရှိပါက အမှန်ခြစ်ပါ။
                                        </p>
                                    </div>
                                </div>
                                {form.data.is_blacklisted && (
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-xs font-medium text-muted-foreground">
                                            Blacklist reason
                                        </label>
                                        <Textarea
                                            value={form.data.blacklist_reason}
                                            onChange={(event) =>
                                                form.setData('blacklist_reason', event.target.value)
                                            }
                                        />
                                        <InputError message={form.errors.blacklist_reason} />
                                    </div>
                                )}
                            </div>
                            <DialogFooter className="mt-6">
                                <DialogClose asChild>
                                    <Button variant="secondary">Cancel</Button>
                                </DialogClose>
                                <Button onClick={submitCreate} disabled={form.processing}>
                                    Save Guest
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
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

                {/* Search and Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Search Guests</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch} className="space-y-4">
                            <div className="flex flex-col gap-4 md:flex-row">
                                <Input
                                    placeholder="Search by name, email, phone, or ID..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="flex-1"
                                />
                                <Button type="submit">Search</Button>
                            </div>
                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-muted-foreground">
                                        VIP အဆင့်
                                    </label>
                                    <Select
                                        value={vipStatus}
                                        onValueChange={setVipStatus}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="အားလုံး" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">အားလုံး</SelectItem>
                                            <SelectItem value="vip">VIP</SelectItem>
                                            <SelectItem value="vvip">VVIP</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-muted-foreground">
                                        အနည်းဆုံး တည်းခိုအကြိမ်
                                    </label>
                                    <Input
                                        type="number"
                                        min={0}
                                        value={minStays}
                                        onChange={(event) => setMinStays(event.target.value)}
                                    />
                                </div>
                                <div className="flex items-end gap-2">
                                    <Checkbox
                                        id="filter-blacklisted"
                                        checked={blacklistedOnly}
                                        onCheckedChange={(value) =>
                                            setBlacklistedOnly(Boolean(value))
                                        }
                                    />
                                    <label
                                        htmlFor="filter-blacklisted"
                                        className="text-sm text-muted-foreground"
                                    >
                                        Blacklist သာ
                                    </label>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Guest List */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Guests ({guests.meta.total})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {guests.data.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground">No guests found</p>
                                {filters.search && (
                                    <p className="text-sm text-muted-foreground mt-2">
                                        Try adjusting your search terms
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {guestRows.map((guest) => (
                                    <div
                                        key={guest.id}
                                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3">
                                                <h3 className="font-medium">{guest.name}</h3>
                                                {guest.vip_status && (
                                                    <Badge variant="secondary">VIP</Badge>
                                                )}
                                                {guest.is_blacklisted && (
                                                    <Badge variant="destructive">
                                                        Blacklist
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="text-sm text-muted-foreground mt-1">
                                                {guest.email} • {guest.phone}
                                            </div>
                                            {guest.identification_number && (
                                                <div className="text-sm text-muted-foreground">
                                                    ID: {guest.identification_number}
                                                </div>
                                            )}
                                            <div className="flex items-center gap-4 mt-2 text-sm">
                                                <span>{guest.total_stays} stays</span>
                                                <span>{formatCurrency(guest.total_spent)} total spent</span>
                                                {guest.last_visit && (
                                                    <span>Last visit: {guest.last_visit}</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={`/guests/${guest.id}`}>
                                                    View Profile
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Pagination would go here */}
                        {guests.meta.total > guests.meta.per_page && (
                            <div className="mt-6 text-center">
                                <p className="text-sm text-muted-foreground">
                                    Showing {guests.data.length} of {guests.meta.total} guests
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
