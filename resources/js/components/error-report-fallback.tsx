import { useForm } from '@inertiajs/react';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

type Props = {
    error: Error;
    reset: () => void;
};

const severityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' },
];

export default function ErrorReportFallback({ error, reset }: Props) {
    const traceId = useMemo(() => {
        if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
            return crypto.randomUUID();
        }

        return `trace-${Date.now()}`;
    }, []);

    const form = useForm({
        title: error.name || 'Client error',
        severity: 'high',
        message: error.message,
        trace_id: traceId,
        url: typeof window !== 'undefined' ? window.location.href : '',
        app_version: '',
        payload: {
            stack: error.stack,
        },
    });

    const submit = () => {
        form.post('/settings/updates/reports', {
            preserveScroll: true,
        });
    };

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="mx-auto max-w-3xl space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>System Error</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        <p className="text-muted-foreground">
                            မမျှော်လင့်ထားသော error ဖြစ်ပွားပါသည်။ Report ပို့နိုင်ပါသည်။
                        </p>
                        <p className="rounded-md bg-muted p-3 text-xs">{error.message}</p>
                        <div className="flex gap-2">
                            <Button variant="secondary" onClick={reset}>
                                Try Again
                            </Button>
                            <Button variant="outline" onClick={() => (window.location.href = '/dashboard')}>
                                Go Dashboard
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Send Error Report</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground">Title</label>
                            <Input
                                value={form.data.title}
                                onChange={(event) => form.setData('title', event.target.value)}
                            />
                            <InputError message={form.errors.title} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground">Severity</label>
                            <Select
                                value={form.data.severity}
                                onValueChange={(value) => form.setData('severity', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select severity" />
                                </SelectTrigger>
                                <SelectContent>
                                    {severityOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground">Message</label>
                            <Textarea
                                value={form.data.message}
                                onChange={(event) => form.setData('message', event.target.value)}
                            />
                        </div>
                        <Button onClick={submit} disabled={form.processing}>
                            Send Report
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
