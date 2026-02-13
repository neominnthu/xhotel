import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { BreadcrumbItem } from '@/types';

type RoleRow = {
    id: number;
    name: string;
    display_name: string;
};

type Permission = {
    id: number;
    name: string;
    display_name: string;
    group: string | null;
    description: string | null;
    is_system_permission: boolean;
    roles: RoleRow[];
};

type Props = {
    permission: Permission;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin' },
    { title: 'Permissions', href: '/admin/permissions' },
    { title: 'Permission Details', href: '/admin/permissions/{permission.id}' },
];

export default function ShowPermission({ permission }: Props) {
    const handleDelete = () => {
        if (permission.is_system_permission) {
            return;
        }

        if (window.confirm('Delete this permission?')) {
            router.delete(`/admin/permissions/${permission.id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Permission: ${permission.display_name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-foreground">
                            {permission.display_name}
                        </h1>
                        <p className="text-sm text-muted-foreground">{permission.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" asChild>
                            <Link href="/admin/permissions">Back to Permissions</Link>
                        </Button>
                        <Button variant="secondary" asChild disabled={permission.is_system_permission}>
                            <Link href={`/admin/permissions/${permission.id}/edit`}>Edit</Link>
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={permission.is_system_permission}
                        >
                            Delete
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Permission Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                            {permission.description || 'No description provided.'}
                        </p>
                        <Badge variant={permission.is_system_permission ? 'secondary' : 'outline'}>
                            {permission.is_system_permission ? 'System Permission' : 'Custom Permission'}
                        </Badge>
                        <p className="text-sm text-muted-foreground">
                            Group: {permission.group || 'General'}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Assigned Roles</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {permission.roles.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                No roles assigned.
                            </p>
                        ) : (
                            <div className="grid gap-2 sm:grid-cols-2">
                                {permission.roles.map((role) => (
                                    <div key={role.id} className="rounded-md border border-border p-3">
                                        <p className="text-sm font-medium text-foreground">
                                            {role.display_name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">{role.name}</p>
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
