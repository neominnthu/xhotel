import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Edit, Trash2, User, Mail, Shield, Building, Calendar, Clock } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

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
    updated_at: string;
};

type AuditLog = {
    id: number;
    action: string;
    details: string | null;
    ip_address: string | null;
    user_agent: string | null;
    created_at: string;
};

type Role = {
    [key: string]: string;
};

type Props = {
    user: User;
    auditLogs: AuditLog[];
    roles: Role;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: '/admin',
    },
    {
        title: 'Users',
        href: '/admin',
    },
    {
        title: 'User Details',
        href: '/admin/users/{user.id}',
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

function formatAction(action: string): string {
    return action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

export default function ShowUser({ user, auditLogs, roles }: Props) {
    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            router.delete(`/admin/users/${user.id}`, {
                onSuccess: () => {
                    router.visit('/admin');
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`User: ${user.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/admin">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Admin
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-semibold text-foreground">
                                {user.name}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                User details and activity history
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/users/${user.id}/edit`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                            </Link>
                        </Button>
                        <Button variant="destructive" size="sm" onClick={handleDelete}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* User Information */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    User Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-muted-foreground">Full Name</Label>
                                        <p className="text-sm">{user.name}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-muted-foreground">Email Address</Label>
                                        <div className="flex items-center gap-2">
                                            <Mail className="h-4 w-4 text-muted-foreground" />
                                            <p className="text-sm">{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-muted-foreground">Role</Label>
                                        <Badge variant={getRoleBadgeVariant(user.role)}>
                                            {roles[user.role] || user.role}
                                        </Badge>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-muted-foreground">Property</Label>
                                        <div className="flex items-center gap-2">
                                            <Building className="h-4 w-4 text-muted-foreground" />
                                            <p className="text-sm">{user.property?.name || 'Not assigned'}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                                        <Badge variant={user.email_verified_at ? 'secondary' : 'outline'}>
                                            {user.email_verified_at ? 'Active' : 'Pending Verification'}
                                        </Badge>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-muted-foreground">Created</Label>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <p className="text-sm">{new Date(user.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>

                                {user.created_at !== user.updated_at && (
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-muted-foreground">Last Updated</Label>
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                            <p className="text-sm">{new Date(user.updated_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Quick Actions */}
                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button variant="outline" className="w-full justify-start" asChild>
                                    <Link href={`/admin/users/${user.id}/edit`}>
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit User
                                    </Link>
                                </Button>
                                <Button
                                    variant="destructive"
                                    className="w-full justify-start"
                                    onClick={handleDelete}
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete User
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Audit Log */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            Activity History
                        </CardTitle>
                        <CardDescription>
                            Recent actions performed by this user
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {auditLogs.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                No activity recorded for this user
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {auditLogs.map((log) => (
                                    <div key={log.id} className="flex items-start space-x-4 pb-4 last:pb-0">
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="text-xs">
                                                    {formatAction(log.action)}
                                                </Badge>
                                                <span className="text-xs text-muted-foreground">
                                                    {new Date(log.created_at).toLocaleString()}
                                                </span>
                                            </div>
                                            {log.details && (
                                                <p className="text-sm text-muted-foreground">
                                                    {log.details}
                                                </p>
                                            )}
                                            {log.ip_address && (
                                                <p className="text-xs text-muted-foreground">
                                                    IP: {log.ip_address}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}