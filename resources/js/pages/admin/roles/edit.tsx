import { Head, Link, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { BreadcrumbItem } from '@/types';

type Permission = {
    id: number;
    name: string;
    display_name: string;
    group: string | null;
};

type Role = {
    id: number;
    name: string;
    display_name: string;
    description: string | null;
    is_system_role: boolean;
    permissions: Permission[];
};

type Props = {
    role: Role;
    permissions: Record<string, Permission[]>;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin' },
    { title: 'Roles', href: '/admin/roles' },
    { title: 'Edit Role', href: '/admin/roles/{role.id}/edit' },
];

export default function EditRole({ role, permissions }: Props) {
    const { data, setData, patch, processing, errors } = useForm({
        name: role.name,
        display_name: role.display_name,
        description: role.description ?? '',
        permissions: role.permissions.map((permission) => permission.id),
    });

    const togglePermission = (permissionId: number) => {
        const next = data.permissions.includes(permissionId)
            ? data.permissions.filter((id) => id !== permissionId)
            : [...data.permissions, permissionId];
        setData('permissions', next);
    };

    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        patch(`/admin/roles/${role.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Role: ${role.display_name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-foreground">
                            Edit Role: {role.display_name}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Update role details and permissions.
                        </p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href={`/admin/roles/${role.id}`}>Back to Role</Link>
                    </Button>
                </div>

                <form onSubmit={submit} className="max-w-3xl">
                    <Card>
                        <CardHeader>
                            <CardTitle>Role Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Role name *</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(event) => setData('name', event.target.value)}
                                        disabled={role.is_system_role}
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-destructive">{errors.name}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="display_name">Display name *</Label>
                                    <Input
                                        id="display_name"
                                        value={data.display_name}
                                        onChange={(event) =>
                                            setData('display_name', event.target.value)
                                        }
                                        disabled={role.is_system_role}
                                    />
                                    {errors.display_name && (
                                        <p className="text-sm text-destructive">{errors.display_name}</p>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(event) =>
                                        setData('description', event.target.value)
                                    }
                                    rows={3}
                                    disabled={role.is_system_role}
                                />
                                {errors.description && (
                                    <p className="text-sm text-destructive">{errors.description}</p>
                                )}
                            </div>

                            <div className="space-y-4">
                                <Label>Permissions</Label>
                                <div className="space-y-4">
                                    {Object.entries(permissions).map(([group, items]) => (
                                        <div key={group} className="rounded-lg border border-border p-4">
                                            <h3 className="text-sm font-semibold text-foreground">
                                                {group || 'General'}
                                            </h3>
                                            <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                                {items.map((permission) => (
                                                    <label
                                                        key={permission.id}
                                                        className="flex items-center gap-2 text-sm text-muted-foreground"
                                                    >
                                                        <Checkbox
                                                            checked={data.permissions.includes(permission.id)}
                                                            onCheckedChange={() =>
                                                                togglePermission(permission.id)
                                                            }
                                                            disabled={role.is_system_role}
                                                        />
                                                        {permission.display_name}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {errors.permissions && (
                                    <p className="text-sm text-destructive">{errors.permissions}</p>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <Button type="submit" disabled={processing || role.is_system_role}>
                                    Save Changes
                                </Button>
                                <Button type="button" variant="outline" asChild>
                                    <Link href={`/admin/roles/${role.id}`}>Cancel</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </AppLayout>
    );
}
