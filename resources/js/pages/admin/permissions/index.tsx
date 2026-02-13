import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { BreadcrumbItem } from '@/types';

type PermissionRow = {
    id: number;
    name: string;
    display_name: string;
    group: string | null;
    description: string | null;
    is_system_permission: boolean;
    roles_count: number;
};

type Paginated<T> = {
    data: T[];
};

type Props = {
    permissions: Paginated<PermissionRow>;
    groups: string[];
    filters: {
        search?: string | null;
        group?: string | null;
    };
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin' },
    { title: 'Permissions', href: '/admin/permissions' },
];

export default function PermissionsIndex({ permissions, groups, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [group, setGroup] = useState(filters.group ?? 'all');

    const applyFilters = () => {
        router.get(
            '/admin/permissions',
            {
                search: search || undefined,
                group: group !== 'all' ? group : undefined,
            },
            { preserveState: true, replace: true },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Permissions" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-foreground">Permissions</h1>
                        <p className="text-sm text-muted-foreground">
                            Manage system permission definitions.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/permissions/create">Create Permission</Link>
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
                            placeholder="Search permissions..."
                            className="max-w-xs"
                        />
                        <Select value={group} onValueChange={setGroup}>
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder="All groups" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All groups</SelectItem>
                                {groups.map((groupName) => (
                                    <SelectItem key={groupName} value={groupName}>
                                        {groupName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button onClick={applyFilters} size="sm">
                            Apply
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Permission List</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="w-full overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                                    <tr>
                                        <th className="px-4 py-3 text-left font-medium">Name</th>
                                        <th className="px-4 py-3 text-left font-medium">Display Name</th>
                                        <th className="px-4 py-3 text-left font-medium">Group</th>
                                        <th className="px-4 py-3 text-left font-medium">Roles</th>
                                        <th className="px-4 py-3 text-left font-medium">Status</th>
                                        <th className="px-4 py-3 text-right font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {permissions.data.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="px-4 py-6 text-center text-muted-foreground"
                                            >
                                                No permissions found.
                                            </td>
                                        </tr>
                                    ) : (
                                        permissions.data.map((permission) => (
                                            <tr key={permission.id}>
                                                <td className="px-4 py-3 font-medium">
                                                    {permission.name}
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">
                                                    {permission.display_name}
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">
                                                    {permission.group ?? 'General'}
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">
                                                    {permission.roles_count}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <Badge
                                                        variant={
                                                            permission.is_system_permission
                                                                ? 'secondary'
                                                                : 'outline'
                                                        }
                                                    >
                                                        {permission.is_system_permission
                                                            ? 'System'
                                                            : 'Custom'}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button variant="outline" size="sm" asChild>
                                                            <Link href={`/admin/permissions/${permission.id}`}>
                                                                View
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            variant="secondary"
                                                            size="sm"
                                                            asChild
                                                            disabled={permission.is_system_permission}
                                                        >
                                                            <Link href={`/admin/permissions/${permission.id}/edit`}>
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
