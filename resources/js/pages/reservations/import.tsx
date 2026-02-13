import { Head, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type ImportError = {
    row: number;
    errors: Record<string, string[]>;
};

type ImportResults = {
    created: number;
    failed: number;
    errors: ImportError[];
};

type Props = {
    results: ImportResults | null;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Reservations', href: '/reservations' },
    { title: 'Import', href: '/reservations/import' },
];

export default function ReservationImport({ results }: Props) {
    const { flash } = usePage<{ flash: { success?: string; error?: string } }>()
        .props;
    const { data, setData, post, processing, errors } = useForm({
        file: null as File | null,
    });

    const handleSubmit = () => {
        post('/reservations/import', {
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Import Reservations" />
            <div className="flex flex-1 flex-col gap-6 rounded-xl p-6">
                <div>
                    <h1 className="text-2xl font-semibold text-foreground">
                        ကြိုတင်စာရင်းများ တင်သွင်းမှု
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        CSV ဖိုင်မှ ဧည့်သည် အချက်အလက်များကို တင်သွင်းပါ။
                    </p>
                </div>

                {flash?.success && (
                    <Alert className="border-emerald-200 bg-emerald-50 text-emerald-900">
                        <AlertTitle>အောင်မြင်ပါသည်</AlertTitle>
                        <AlertDescription>{flash.success}</AlertDescription>
                    </Alert>
                )}

                {flash?.error && (
                    <Alert variant="destructive">
                        <AlertTitle>အမှားရှိသည်</AlertTitle>
                        <AlertDescription>{flash.error}</AlertDescription>
                    </Alert>
                )}

                <div className="rounded-xl border border-border bg-card p-5">
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-foreground">
                            CSV ဖိုင်ရွေးပါ
                        </label>
                        <Input
                            type="file"
                            accept=".csv"
                            onChange={(event) =>
                                setData('file', event.target.files?.[0] ?? null)
                            }
                        />
                        <InputError message={errors.file} />
                        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                            <span>လိုအပ်သော Column များ:</span>
                            <span>guest_name, guest_phone, guest_email,</span>
                            <span>check_in, check_out, room_type_id,</span>
                            <span>adults, children, source, special_requests</span>
                        </div>
                        <Button
                            type="button"
                            onClick={handleSubmit}
                            disabled={processing}
                        >
                            တင်သွင်းရန်
                        </Button>
                    </div>
                </div>

                {results && (
                    <div className="rounded-xl border border-border bg-card p-5">
                        <h2 className="text-sm font-semibold text-muted-foreground">
                            တင်သွင်းမှု ရလဒ်
                        </h2>
                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                            <div className="rounded-lg border border-border bg-background p-4">
                                <div className="text-xs text-muted-foreground">
                                    အောင်မြင်သော အရေအတွက်
                                </div>
                                <div className="text-2xl font-semibold text-foreground">
                                    {results.created}
                                </div>
                            </div>
                            <div className="rounded-lg border border-border bg-background p-4">
                                <div className="text-xs text-muted-foreground">
                                    မအောင်မြင်သော အရေအတွက်
                                </div>
                                <div className="text-2xl font-semibold text-foreground">
                                    {results.failed}
                                </div>
                            </div>
                        </div>

                        {results.errors.length > 0 && (
                            <div className="mt-6 overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                                        <tr>
                                            <th className="px-4 py-3 text-left font-medium">
                                                Row
                                            </th>
                                            <th className="px-4 py-3 text-left font-medium">
                                                အမှားများ
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {results.errors.map((error) => (
                                            <tr key={error.row}>
                                                <td className="px-4 py-3">
                                                    {error.row}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {Object.values(error.errors)
                                                        .flat()
                                                        .join(', ')}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
