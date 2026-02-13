import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { BreadcrumbItem } from '@/types';

type Permission = {
    id: number;
    name: string;
    display_name: string;
    group: string | null;
};

type RoleRow = {
    id: number;
    name: string;
    display_name: string;
    description: string | null;
    is_system_role: boolean;
    users_count: number;
    permissions: Permission[];
};

type Paginated<T> = {
    data: T[];
};

type Props = {
    roles: Paginated<RoleRow>;
    filters: {
        search?: string | null;
    };
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin' },
    { title: 'Roles', href: '/admin/roles' },
];

export default function RolesIndex({ roles, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');

    const applyFilters = () => {
        router.get(
            '/admin/roles',
            { search: search || undefined },
            { preserveState: true, replace: true },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-foreground">Roles</h1>
                        <p className="text-sm text-muted-foreground">
                            Manage role permissions and access.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/roles/create">Create Role</Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Filters</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-wrap items-center gap-2">
                        <Input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search roles..."
                            className="max-w-xs"
                        />
                        <Button onClick={applyFilters} size="sm">
                            Apply
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Role List</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="w-full overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                                    <tr>
                                        <th className="px-4 py-3 text-left font-medium">Name</th>
                                        <th className="px-4 py-3 text-left font-medium">Display Name</th>
                                        <th className="px-4 py-3 text-left font-medium">Users</th>
                                        <th className="px-4 py-3 text-left font-medium">Permissions</th>
                                        <th className="px-4 py-3 text-left font-medium">Status</th>
                                        <th className="px-4 py-3 text-right font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {roles.data.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="px-4 py-6 text-center text-muted-foreground"
                                            >
                                                No roles found.
                                            </td>
                                        </tr>
                                    ) : (
                                        roles.data.map((role) => (
                                            <tr key={role.id}>
                                                <td className="px-4 py-3 font-medium">
                                                    {role.name}
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">
                                                    {role.display_name}
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">
                                                    {role.users_count}
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">
                                                    {role.permissions.length}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <Badge variant={role.is_system_role ? 'secondary' : 'outline'}>
                                                        {role.is_system_role ? 'System' : 'Custom'}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button variant="outline" size="sm" asChild>
                                                            <Link href={`/admin/roles/${role.id}`}>
                                                                View
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            variant="secondary"
                                                            size="sm"
                                                            asChild
                                                            disabled={role.is_system_role}
                                                        >
                                                            <Link href={`/admin/roles/${role.id}/edit`}>
                                                                Edit
                                                            </Link>
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
