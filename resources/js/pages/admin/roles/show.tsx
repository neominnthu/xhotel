import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { BreadcrumbItem } from '@/types';

type Permission = {
    id: number;
    name: string;
    display_name: string;
    group: string | null;
};

type UserRow = {
    id: number;
    name: string;
    email: string;
};

type Role = {
    id: number;
    name: string;
    display_name: string;
    description: string | null;
    is_system_role: boolean;
    permissions: Permission[];
    users?: UserRow[];
};

type Props = {
    role: Role;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin' },
    { title: 'Roles', href: '/admin/roles' },
    { title: 'Role Details', href: '/admin/roles/{role.id}' },
];

export default function ShowRole({ role }: Props) {
    const handleDelete = () => {
        if (role.is_system_role) {
            return;
        }

        if (window.confirm('Delete this role?')) {
            router.delete(`/admin/roles/${role.id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Role: ${role.display_name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-foreground">
                            {role.display_name}
                        </h1>
                        <p className="text-sm text-muted-foreground">{role.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" asChild>
                            <Link href="/admin/roles">Back to Roles</Link>
                        </Button>
                        <Button variant="secondary" asChild disabled={role.is_system_role}>
                            <Link href={`/admin/roles/${role.id}/edit`}>Edit</Link>
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={role.is_system_role}
                        >
                            Delete
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Role Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                            {role.description || 'No description provided.'}
                        </p>
                        <Badge variant={role.is_system_role ? 'secondary' : 'outline'}>
                            {role.is_system_role ? 'System Role' : 'Custom Role'}
                        </Badge>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Permissions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {role.permissions.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No permissions assigned.</p>
                        ) : (
                            <div className="grid gap-2 sm:grid-cols-2">
                                {role.permissions.map((permission) => (
                                    <div key={permission.id} className="rounded-md border border-border p-3">
                                        <p className="text-sm font-medium text-foreground">
                                            {permission.display_name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {permission.name}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {role.users && role.users.length > 0 ? (
                            <div className="space-y-2">
                                {role.users.map((user) => (
                                    <div key={user.id} className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-foreground">
                                                {user.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">{user.email}</p>
                                        </div>
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={`/admin/users/${user.id}`}>View</Link>
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">No users assigned.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
