import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { BreadcrumbItem } from '@/types';

type Props = {
    groups: string[];
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin' },
    { title: 'Permissions', href: '/admin/permissions' },
    { title: 'Create Permission', href: '/admin/permissions/create' },
];

export default function CreatePermission({ groups }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        display_name: '',
        group: groups[0] ?? '',
        description: '',
    });

    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        post('/admin/permissions');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Permission" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-foreground">Create Permission</h1>
                        <p className="text-sm text-muted-foreground">
                            Define a new permission entry.
                        </p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href="/admin/permissions">Back to Permissions</Link>
                    </Button>
                </div>

                <form onSubmit={submit} className="max-w-2xl">
                    <Card>
                        <CardHeader>
                            <CardTitle>Permission Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Permission name *</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(event) => setData('name', event.target.value)}
                                        placeholder="permission-name"
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
                                        placeholder="Permission display name"
                                    />
                                    {errors.display_name && (
                                        <p className="text-sm text-destructive">{errors.display_name}</p>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="group">Group *</Label>
                                <Input
                                    id="group"
                                    value={data.group}
                                    onChange={(event) => setData('group', event.target.value)}
                                    placeholder="Group name"
                                />
                                {errors.group && (
                                    <p className="text-sm text-destructive">{errors.group}</p>
                                )}
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
                                />
                                {errors.description && (
                                    <p className="text-sm text-destructive">{errors.description}</p>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <Button type="submit" disabled={processing}>
                                    Create Permission
                                </Button>
                                <Button type="button" variant="outline" asChild>
                                    <Link href="/admin/permissions">Cancel</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </AppLayout>
    );
}
