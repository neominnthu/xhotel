import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Users, UserPlus, Shield, Activity, Building } from 'lucide-react';
import type { BreadcrumbItem, PaginatedData } from '@/types';

type User = {
    id: number;
    name: string;
    email: string;
    role: string;
    property: {
        id: number;
        name: string;
    } | null;
    email_verified_at: string | null;
    created_at: string;
};

type Property = {
    id: number;
    name: string;
};

type Role = {
    [key: string]: string;
};

type AuditLog = {
    id: number;
    action: string;
    user_name: string;
    created_at: string;
};

type Stats = {
    total_users: number;
    active_users: number;
    total_properties: number;
    recent_audit_logs: AuditLog[];
};

type Props = {
    users: PaginatedData<User>;
    properties: Property[];
    roles: Role;
    stats: Stats;
    filters: {
        search?: string;
        role?: string;
        property_id?: string;
    };
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: '/admin',
    },
];

function getRoleBadgeVariant(role: string): "default" | "secondary" | "destructive" | "outline" {
    switch (role) {
        case 'admin':
            return 'destructive';
        case 'reservation_manager':
            return 'default';
        case 'housekeeping':
            return 'secondary';
        case 'front_desk':
            return 'outline';
        default:
            return 'outline';
    }
}

export default function AdminIndex({ users, properties, roles, stats, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [role, setRole] = useState(filters.role || 'all');
    const [propertyId, setPropertyId] = useState(filters.property_id || 'all');

    const applyFilters = () => {
        router.get('/admin', {
            search: search || undefined,
            role: role !== 'all' ? role : undefined,
            property_id: propertyId !== 'all' ? propertyId : undefined,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        setSearch('');
        setRole('all');
        setPropertyId('all');
        router.get('/admin', {}, { preserveState: true, replace: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Panel" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-foreground">
                            Admin Panel
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Manage users, roles, and system settings
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Button variant="outline" asChild>
                            <Link href="/admin/roles">
                                <Shield className="h-4 w-4 mr-2" />
                                Roles
                            </Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/admin/permissions">
                                <Shield className="h-4 w-4 mr-2" />
                                Permissions
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link href="/admin/users/create">
                                <UserPlus className="h-4 w-4 mr-2" />
                                Add User
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_users}</div>
                            <p className="text-xs text-muted-foreground">
                                Registered users
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                            <Shield className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.active_users}</div>
                            <p className="text-xs text-muted-foreground">
                                Verified accounts
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Properties</CardTitle>
                            <Building className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_properties}</div>
                            <p className="text-xs text-muted-foreground">
                                Hotel properties
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.recent_audit_logs.length}</div>
                            <p className="text-xs text-muted-foreground">
                                Recent actions
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Users Management */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>User Management</CardTitle>
                                <CardDescription>
                                    Manage system users and their roles
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {/* Filters */}
                                <div className="mb-4 flex flex-wrap gap-2">
                                    <Input
                                        placeholder="Search users..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="max-w-xs"
                                    />
                                    <Select value={role} onValueChange={setRole}>
                                        <SelectTrigger className="w-40">
                                            <SelectValue placeholder="All roles" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All roles</SelectItem>
                                            {Object.entries(roles).map(([key, label]) => (
                                                <SelectItem key={key} value={key}>
                                                    {label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Select value={propertyId} onValueChange={setPropertyId}>
                                        <SelectTrigger className="w-40">
                                            <SelectValue placeholder="All properties" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All properties</SelectItem>
                                            {properties.map((property) => (
                                                <SelectItem key={property.id} value={property.id.toString()}>
                                                    {property.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Button onClick={applyFilters} size="sm">
                                        Apply
                                    </Button>
                                    <Button onClick={clearFilters} variant="outline" size="sm">
                                        Clear
                                    </Button>
                                </div>

                                {/* Users Table */}
                                <div className="w-full overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                                            <tr>
                                                <th className="px-4 py-3 text-left font-medium">Name</th>
                                                <th className="px-4 py-3 text-left font-medium">Email</th>
                                                <th className="px-4 py-3 text-left font-medium">Role</th>
                                                <th className="px-4 py-3 text-left font-medium">Property</th>
                                                <th className="px-4 py-3 text-left font-medium">Status</th>
                                                <th className="px-4 py-3 text-left font-medium">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {users.data.length === 0 ? (
                                                <tr>
                                                    <td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">
                                                        No users found
                                                    </td>
                                                </tr>
                                            ) : (
                                                users.data.map((user) => (
                                                    <tr key={user.id}>
                                                        <td className="px-4 py-3 font-medium">
                                                            {user.name}
                                                        </td>
                                                        <td className="px-4 py-3 text-muted-foreground">
                                                            {user.email}
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <Badge variant={getRoleBadgeVariant(user.role)}>
                                                                {roles[user.role] || user.role}
                                                            </Badge>
                                                        </td>
                                                        <td className="px-4 py-3 text-muted-foreground">
                                                            {user.property?.name || '—'}
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <Badge variant={user.email_verified_at ? 'secondary' : 'outline'}>
                                                                {user.email_verified_at ? 'Active' : 'Pending'}
                                                            </Badge>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <Button asChild variant="outline" size="sm">
                                                                <Link href={`/admin/users/${user.id}`}>
                                                                    View
                                                                </Link>
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination would go here */}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent Activity */}
                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Activity</CardTitle>
                                <CardDescription>
                                    Latest system actions and changes
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {stats.recent_audit_logs.length === 0 ? (
                                        <p className="text-sm text-muted-foreground">
                                            No recent activity
                                        </p>
                                    ) : (
                                        stats.recent_audit_logs.map((log) => (
                                            <div key={log.id} className="flex items-start space-x-3">
                                                <div className="flex-1 space-y-1">
                                                    <p className="text-sm font-medium">
                                                        {log.user_name}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {log.action.replace(/_/g, ' ')}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {log.created_at}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
