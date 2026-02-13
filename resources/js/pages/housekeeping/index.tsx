import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type TaskRow = {
    id: number;
    type: string;
    status: string;
    priority: string;
    due_at?: string | null;
    completed_at?: string | null;
    sla_status?: string | null;
    room: { id: number; number: string; room_status: string } | null;
    assignee: { id: number; name: string } | null;
};

type AssigneeOption = {
    id: number;
    name: string;
};

type RoomOption = {
    id: number;
    number: string;
};

type PaginationMeta = {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
};

type Props = {
    tasks: TaskRow[];
    filters: {
        status?: string | null;
        priority?: string | null;
        type?: string | null;
        due_from?: string | null;
        due_to?: string | null;
        completed_from?: string | null;
        completed_to?: string | null;
        assigned_to?: string | null;
        room_status?: string | null;
        room_id?: string | null;
        overdue?: string | null;
        sort?: string | null;
        sort_dir?: string | null;
        page?: number | null;
    };
    assignees: AssigneeOption[];
    rooms: RoomOption[];
    current_user_id?: number | null;
    meta?: PaginationMeta | null;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Housekeeping', href: '/housekeeping' },
];

const statusOptions = [
    { value: 'all', label: 'All statuses' },
    { value: 'open', label: 'Open' },
    { value: 'in_progress', label: 'In progress' },
    { value: 'completed', label: 'Completed' },
];

const updateStatusOptions = statusOptions.filter(
    (option) => option.value !== 'all',
);

const taskTypeOptions = [
    { value: 'clean', label: 'Clean' },
    { value: 'inspect', label: 'Inspect' },
    { value: 'maintenance', label: 'Maintenance' },
];

const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'normal', label: 'Normal' },
    { value: 'high', label: 'High' },
];

const sortOptions = [
    { value: 'due_at', label: 'Due date' },
    { value: 'priority', label: 'Priority' },
    { value: 'room_number', label: 'Room number' },
];

const sortDirectionOptions = [
    { value: 'asc', label: 'Ascending' },
    { value: 'desc', label: 'Descending' },
];

const roomStatusOptions = [
    { value: 'clean', label: 'Clean' },
    { value: 'dirty', label: 'Dirty' },
    { value: 'inspected', label: 'Inspected' },
];

function statusVariant(status: string) {
    switch (status) {
        case 'completed':
            return 'secondary';
        case 'in_progress':
            return 'default';
        case 'open':
            return 'outline';
        default:
            return 'outline';
    }
}

function slaVariant(status?: string | null) {
    switch (status) {
        case 'overdue':
            return 'destructive';
        case 'due_soon':
            return 'secondary';
        case 'urgent':
            return 'default';
        case 'completed':
            return 'outline';
        default:
            return 'outline';
    }
}

function formatDateTime(value?: string | null) {
    if (!value) {
        return '—';
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleString();
}

export default function HousekeepingIndex({
    tasks,
    filters,
    assignees,
    rooms,
    current_user_id: currentUserId,
    meta: initialMeta,
}: Props) {
    const [status, setStatus] = useState(filters.status ?? 'all');
    const [priority, setPriority] = useState(filters.priority ?? 'all');
    const [type, setType] = useState(filters.type ?? 'all');
    const [dueFrom, setDueFrom] = useState(filters.due_from ?? '');
    const [dueTo, setDueTo] = useState(filters.due_to ?? '');
    const [completedFrom, setCompletedFrom] = useState(
        filters.completed_from ?? '',
    );
    const [completedTo, setCompletedTo] = useState(filters.completed_to ?? '');
    const [assignedTo, setAssignedTo] = useState(filters.assigned_to ?? 'all');
    const [roomStatus, setRoomStatus] = useState(filters.room_status ?? 'all');
    const [roomId, setRoomId] = useState(filters.room_id ?? 'all');
    const [overdue, setOverdue] = useState(filters.overdue === '1');
    const [sortBy, setSortBy] = useState(filters.sort ?? 'due_at');
    const [sortDir, setSortDir] = useState(filters.sort_dir ?? 'asc');
    const [page, setPage] = useState(filters.page ?? 1);
    const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
    const [taskRows, setTaskRows] = useState<TaskRow[]>(tasks);
    const [meta, setMeta] = useState<PaginationMeta | null>(
        initialMeta ?? null,
    );
    const [selectedTaskIds, setSelectedTaskIds] = useState<number[]>([]);
    const [bulkStatus, setBulkStatus] = useState('no_change');
    const [bulkAssignee, setBulkAssignee] = useState('no_change');
    const [isBulkUpdating, setIsBulkUpdating] = useState(false);
    const [bulkError, setBulkError] = useState<string | null>(null);
    const [isFiltering, setIsFiltering] = useState(false);
    const [filterError, setFilterError] = useState<string | null>(null);
    const [isExporting, setIsExporting] = useState(false);
    const [exportError, setExportError] = useState<string | null>(null);
    const [validationError, setValidationError] = useState<string | null>(null);
    const [autoApply, setAutoApply] = useState(false);
    const autoApplyRef = useRef(false);
    const createForm = useForm({
        room_id: '',
        type: 'clean',
        priority: 'normal',
        assigned_to: 'unassigned',
        due_at: '',
    });
    const updateForm = useForm({
        status: 'open',
        assigned_to: null as number | null,
    });
    const errorMessage =
        validationError ?? filterError ?? exportError ?? bulkError;
    const totalCount = meta?.total ?? taskRows.length;
    const currentPage = meta?.current_page ?? page;
    const lastPage = meta?.last_page ?? 1;
    const canPreviousPage = currentPage > 1;
    const canNextPage = currentPage < lastPage;
    const allSelected =
        taskRows.length > 0 && selectedTaskIds.length === taskRows.length;
    const selectAllState = allSelected
        ? true
        : selectedTaskIds.length > 0
          ? 'indeterminate'
          : false;

    const statusLabel =
        statusOptions.find((option) => option.value === status)?.label ?? status;
    const priorityLabel =
        priorityOptions.find((option) => option.value === priority)?.label ?? priority;
    const typeLabel =
        taskTypeOptions.find((option) => option.value === type)?.label ?? type;
    const roomStatusLabel =
        roomStatusOptions.find((option) => option.value === roomStatus)?.label ??
        roomStatus;
    const sortLabel =
        sortOptions.find((option) => option.value === sortBy)?.label ?? sortBy;
    const sortDirLabel =
        sortDirectionOptions.find((option) => option.value === sortDir)?.label ??
        sortDir;
    const assignedLabel = (() => {
        if (assignedTo === 'unassigned') {
            return 'Unassigned';
        }

        const match = assignees.find(
            (assignee) => assignee.id.toString() === assignedTo,
        );

        return match?.name ?? assignedTo;
    })();
    const roomLabel = (() => {
        const match = rooms.find((room) => room.id.toString() === roomId);
        return match?.number ?? roomId;
    })();

    const activeFilters: { key: string; label: string; onClear: () => void }[] = [];

    if (status !== 'all') {
        activeFilters.push({
            key: 'status',
            label: `Status: ${statusLabel}`,
            onClear: () => setStatus('all'),
        });
    }

    if (priority !== 'all') {
        activeFilters.push({
            key: 'priority',
            label: `Priority: ${priorityLabel}`,
            onClear: () => setPriority('all'),
        });
    }

    if (type !== 'all') {
        activeFilters.push({
            key: 'type',
            label: `Type: ${typeLabel}`,
            onClear: () => setType('all'),
        });
    }

    if (assignedTo !== 'all') {
        activeFilters.push({
            key: 'assigned_to',
            label: `Assignee: ${assignedLabel}`,
            onClear: () => setAssignedTo('all'),
        });
    }

    if (roomStatus !== 'all') {
        activeFilters.push({
            key: 'room_status',
            label: `Room status: ${roomStatusLabel}`,
            onClear: () => setRoomStatus('all'),
        });
    }

    if (roomId !== 'all') {
        activeFilters.push({
            key: 'room_id',
            label: `Room: ${roomLabel}`,
            onClear: () => setRoomId('all'),
        });
    }

    if (dueFrom || dueTo) {
        const rangeLabel = [dueFrom || 'Any', dueTo || 'Any'].join(' → ');
        activeFilters.push({
            key: 'due_range',
            label: `Due: ${rangeLabel}`,
            onClear: () => {
                setDueFrom('');
                setDueTo('');
            },
        });
    }

    if (completedFrom || completedTo) {
        const rangeLabel = [completedFrom || 'Any', completedTo || 'Any'].join(' → ');
        activeFilters.push({
            key: 'completed_range',
            label: `Completed: ${rangeLabel}`,
            onClear: () => {
                setCompletedFrom('');
                setCompletedTo('');
            },
        });
    }

    if (overdue) {
        activeFilters.push({
            key: 'overdue',
            label: 'Overdue',
            onClear: () => setOverdue(false),
        });
    }

    if (sortBy !== 'due_at' || sortDir !== 'asc') {
        activeFilters.push({
            key: 'sort',
            label: `Sort: ${sortLabel} (${sortDirLabel})`,
            onClear: () => {
                setSortBy('due_at');
                setSortDir('asc');
            },
        });
    }

    useEffect(() => {
        setTaskRows(tasks);
        setMeta(initialMeta ?? null);
        setPage(filters.page ?? initialMeta?.current_page ?? 1);
        setSelectedTaskIds([]);
        setBulkStatus('no_change');
        setBulkAssignee('no_change');
        setBulkError(null);
    }, [tasks, initialMeta, filters.page]);

    const buildFilterQuery = () => {
        const query: Record<string, string> = {};

        if (status !== 'all') {
            query.status = status;
        }

        if (priority !== 'all') {
            query.priority = priority;
        }

        if (type !== 'all') {
            query.type = type;
        }

        if (dueFrom) {
            query.due_from = dueFrom;
        }

        if (dueTo) {
            query.due_to = dueTo;
        }

        if (completedFrom) {
            query.completed_from = completedFrom;
        }

        if (completedTo) {
            query.completed_to = completedTo;
        }

        if (assignedTo !== 'all') {
            query.assigned_to = assignedTo;
        }

        if (roomStatus !== 'all') {
            query.room_status = roomStatus;
        }

        if (roomId !== 'all') {
            query.room_id = roomId;
        }

        if (overdue) {
            query.overdue = '1';
        }

        if (sortBy) {
            query.sort = sortBy;
        }

        if (sortDir) {
            query.sort_dir = sortDir;
        }

        return query;
    };

    const buildUrlQuery = (nextPage: number) => {
        const query = buildFilterQuery();

        if (nextPage > 1) {
            query.page = nextPage.toString();
        }

        return query;
    };

    const validateCompletedRange = () => {
        if (completedFrom && completedTo && completedFrom > completedTo) {
            return 'Completed from must be on or before completed to.';
        }

        return null;
    };

    const getCsrfToken = () => {
        const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
        return match ? decodeURIComponent(match[1]) : '';
    };

    const toggleTaskSelection = (taskId: number) => {
        setSelectedTaskIds((current) =>
            current.includes(taskId)
                ? current.filter((id) => id !== taskId)
                : [...current, taskId],
        );
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedTaskIds(taskRows.map((task) => task.id));
            return;
        }

        setSelectedTaskIds([]);
    };

    const fetchTasks = async (
        query: Record<string, string>,
        nextPage = 1,
    ): Promise<void> => {
        setIsFiltering(true);
        setFilterError(null);

        const perPage = meta?.per_page ?? 15;

        try {
            const params = new URLSearchParams();
            Object.entries(query).forEach(([key, value]) => {
                params.append(`filter[${key}]`, value);
            });
            params.set('page', nextPage.toString());
            params.set('per_page', perPage.toString());

            const response = await fetch(
                `/api/v1/housekeeping/tasks?${params.toString()}`,
                { headers: { Accept: 'application/json' } },
            );

            if (!response.ok) {
                setFilterError('Failed to load tasks.');
                setIsFiltering(false);
                return;
            }

            const payload = await response.json();
            setTaskRows(payload.data ?? []);
            setMeta(payload.meta ?? null);
            setPage(payload.meta?.current_page ?? nextPage);
            setIsFiltering(false);
        } catch {
            setFilterError('Failed to load tasks.');
            setIsFiltering(false);
        }
    };

    const applyFilters = (nextPage = 1) => {
        const validationMessage = validateCompletedRange();
        if (validationMessage) {
            setValidationError(validationMessage);
            return;
        }

        setValidationError(null);

        const query = buildFilterQuery();
        const urlQuery = buildUrlQuery(nextPage);

        const queryString = new URLSearchParams(urlQuery).toString();
        window.history.replaceState(
            null,
            '',
            `/housekeeping${queryString ? `?${queryString}` : ''}`,
        );

        setPage(nextPage);
        void fetchTasks(query, nextPage);
    };

    const resetFilters = () => {
        setStatus('all');
        setPriority('all');
        setType('all');
        setDueFrom('');
        setDueTo('');
        setCompletedFrom('');
        setCompletedTo('');
        setAssignedTo('all');
        setRoomStatus('all');
        setRoomId('all');
        setOverdue(false);
        setSortBy('due_at');
        setSortDir('asc');
        setPage(1);
        setValidationError(null);
        window.history.replaceState(null, '', '/housekeeping');
        void fetchTasks({}, 1);
    };

    const applyDuePreset = (daysFrom: number, daysTo = daysFrom) => {
        const start = new Date();
        start.setDate(start.getDate() + daysFrom);
        const end = new Date();
        end.setDate(end.getDate() + daysTo);

        const toDateString = (date: Date) =>
            date.toISOString().slice(0, 10);

        setDueFrom(toDateString(start));
        setDueTo(toDateString(end));
    };

    useEffect(() => {
        if (!autoApply) {
            autoApplyRef.current = true;
            return;
        }

        if (!autoApplyRef.current) {
            autoApplyRef.current = true;
        }

        const timeout = window.setTimeout(() => {
            applyFilters(1);
        }, 400);

        return () => window.clearTimeout(timeout);
    }, [
        autoApply,
        status,
        priority,
        type,
        dueFrom,
        dueTo,
        completedFrom,
        completedTo,
        assignedTo,
        roomStatus,
        roomId,
        overdue,
        sortBy,
        sortDir,
    ]);

    useEffect(() => {
        if (!validateCompletedRange()) {
            setValidationError(null);
        }
    }, [completedFrom, completedTo]);

    const startEdit = (task: TaskRow) => {
        setEditingTaskId(task.id);
        updateForm.setData('status', task.status);
        updateForm.setData('assigned_to', task.assignee?.id ?? null);
        updateForm.clearErrors();
    };

    const cancelEdit = () => {
        setEditingTaskId(null);
        updateForm.reset();
        updateForm.clearErrors();
    };

    const saveUpdate = () => {
        if (!editingTaskId) {
            return;
        }

        updateForm.patch(`/housekeeping/tasks/${editingTaskId}`, {
            onSuccess: () => {
                setEditingTaskId(null);
                updateForm.reset();
            },
        });
    };

    const handleCreate = () => {
        createForm
            .transform((data) => ({
                ...data,
                room_id: data.room_id ? Number(data.room_id) : data.room_id,
                assigned_to:
                    data.assigned_to === 'unassigned'
                        ? null
                        : Number(data.assigned_to),
            }))
            .post('/housekeeping/tasks', {
            onSuccess: () => {
                createForm.reset();
                createForm.setData('type', 'clean');
                createForm.setData('priority', 'normal');
                createForm.setData('assigned_to', 'unassigned');
                createForm.setData('due_at', '');
                void fetchTasks(buildFilterQuery(), page);
            },
        });
    };

    const buildExportQuery = () => {
        return buildFilterQuery();
    };

    const buildExportFilename = () => {
        const rangeStart = dueFrom || completedFrom || dueTo || completedTo;
        const rangeEnd = dueTo || completedTo;

        if (rangeStart && rangeEnd) {
            return `housekeeping-${rangeStart}_${rangeEnd}.csv`;
        }

        if (rangeStart) {
            return `housekeeping-${rangeStart}.csv`;
        }

        return 'housekeeping-tasks.csv';
    };

    const handleExport = async () => {
        setIsExporting(true);
        setExportError(null);

        try {
            const queryString = new URLSearchParams(buildExportQuery()).toString();
            const response = await fetch(
                `/housekeeping/tasks.csv${queryString ? `?${queryString}` : ''}`,
                { headers: { Accept: 'text/csv' } },
            );

            if (!response.ok) {
                setExportError('Failed to export tasks.');
                return;
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = buildExportFilename();
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(url);
        } catch {
            setExportError('Failed to export tasks.');
        } finally {
            setIsExporting(false);
        }
    };

    const handleBulkUpdate = async () => {
        if (selectedTaskIds.length === 0) {
            setBulkError('Select at least one task.');
            return;
        }

        if (bulkStatus === 'no_change' && bulkAssignee === 'no_change') {
            setBulkError('Choose a status or assignee for bulk update.');
            return;
        }

        setBulkError(null);
        setIsBulkUpdating(true);

        try {
            const payload: {
                task_ids: number[];
                status?: string;
                assigned_to?: number | null;
            } = {
                task_ids: selectedTaskIds,
            };

            if (bulkStatus !== 'no_change') {
                payload.status = bulkStatus;
            }

            if (bulkAssignee !== 'no_change') {
                payload.assigned_to =
                    bulkAssignee === 'unassigned'
                        ? null
                        : Number(bulkAssignee);
            }

            const response = await fetch('/api/v1/housekeeping/tasks/bulk', {
                method: 'PATCH',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': getCsrfToken(),
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                setBulkError('Failed to update tasks.');
                return;
            }

            setBulkStatus('no_change');
            setBulkAssignee('no_change');
            setSelectedTaskIds([]);
            void fetchTasks(buildFilterQuery(), page);
        } catch {
            setBulkError('Failed to update tasks.');
        } finally {
            setIsBulkUpdating(false);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Housekeeping" />
            <div className="flex flex-1 flex-col gap-6 rounded-xl p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-semibold text-foreground">
                            Housekeeping
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Track cleaning and maintenance tasks.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Button
                            type="button"
                            variant="secondary"
                            disabled={isExporting}
                            onClick={handleExport}
                        >
                            {isExporting ? 'Exporting...' : 'Export CSV'}
                        </Button>
                        <Button asChild variant="ghost">
                            <Link href="/housekeeping/audit">Audit log</Link>
                        </Button>
                        <Button
                            type="button"
                            disabled={createForm.processing}
                            onClick={handleCreate}
                        >
                            New Task
                        </Button>
                    </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h2 className="text-sm font-semibold text-foreground">
                                Create Task
                            </h2>
                            <p className="text-xs text-muted-foreground">
                                Assign cleaning, inspection, or maintenance.
                            </p>
                        </div>
                    </div>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                        <div className="space-y-2">
                            <Select
                                value={createForm.data.room_id}
                                onValueChange={(value) =>
                                    createForm.setData('room_id', value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Room" />
                                </SelectTrigger>
                                <SelectContent>
                                    {rooms.map((room) => (
                                        <SelectItem
                                            key={room.id}
                                            value={room.id.toString()}
                                        >
                                            {room.number}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={createForm.errors.room_id} />
                        </div>
                        <div className="space-y-2">
                            <Select
                                value={createForm.data.type}
                                onValueChange={(value) =>
                                    createForm.setData('type', value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {taskTypeOptions.map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={createForm.errors.type} />
                        </div>
                        <div className="space-y-2">
                            <Select
                                value={createForm.data.priority}
                                onValueChange={(value) =>
                                    createForm.setData('priority', value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    {priorityOptions.map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={createForm.errors.priority} />
                        </div>
                        <div className="space-y-2">
                            <Select
                                value={createForm.data.assigned_to}
                                onValueChange={(value) =>
                                    createForm.setData('assigned_to', value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Assignee" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="unassigned">
                                        Unassigned
                                    </SelectItem>
                                    {assignees.map((assignee) => (
                                        <SelectItem
                                            key={assignee.id}
                                            value={assignee.id.toString()}
                                        >
                                            {assignee.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={createForm.errors.assigned_to} />
                        </div>
                        <div className="space-y-2">
                            <Input
                                type="datetime-local"
                                value={createForm.data.due_at}
                                onChange={(event) =>
                                    createForm.setData('due_at', event.target.value)
                                }
                            />
                            <InputError message={createForm.errors.due_at} />
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-border bg-card">
                    {errorMessage ? (
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
                            <span>{errorMessage}</span>
                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                disabled={isFiltering}
                                onClick={() => applyFilters(page)}
                            >
                                Retry
                            </Button>
                        </div>
                    ) : null}
                    <div className="flex flex-wrap items-center gap-3 border-b border-border p-4">
                        <div className="w-full sm:max-w-[180px]">
                            <Select
                                value={status}
                                onValueChange={setStatus}
                                disabled={isFiltering}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {statusOptions.map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="w-full sm:max-w-[180px]">
                            <Select
                                value={priority}
                                onValueChange={setPriority}
                                disabled={isFiltering}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All priorities</SelectItem>
                                    {priorityOptions.map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="w-full sm:max-w-[180px]">
                            <Select
                                value={type}
                                onValueChange={setType}
                                disabled={isFiltering}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All types</SelectItem>
                                    {taskTypeOptions.map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="w-full sm:max-w-[200px]">
                            <Select
                                value={assignedTo}
                                onValueChange={setAssignedTo}
                                disabled={isFiltering}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Assignee" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All assignees</SelectItem>
                                    <SelectItem value="unassigned">
                                        Unassigned
                                    </SelectItem>
                                    {assignees.map((assignee) => (
                                        <SelectItem
                                            key={assignee.id}
                                            value={assignee.id.toString()}
                                        >
                                            {assignee.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="w-full sm:max-w-[200px]">
                            <Select
                                value={roomStatus}
                                onValueChange={setRoomStatus}
                                disabled={isFiltering}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Room status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All room statuses</SelectItem>
                                    {roomStatusOptions.map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="w-full sm:max-w-[200px]">
                            <Select
                                value={roomId}
                                onValueChange={setRoomId}
                                disabled={isFiltering}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Room" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All rooms</SelectItem>
                                    {rooms.map((room) => (
                                        <SelectItem
                                            key={room.id}
                                            value={room.id.toString()}
                                        >
                                            {room.number}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="w-full sm:max-w-[180px]">
                            <Input
                                type="date"
                                value={dueFrom}
                                disabled={isFiltering}
                                onChange={(event) => setDueFrom(event.target.value)}
                            />
                            <div className="mt-1 text-xs text-muted-foreground">
                                Due from
                            </div>
                        </div>
                        <div className="w-full sm:max-w-[180px]">
                            <Input
                                type="date"
                                value={dueTo}
                                disabled={isFiltering}
                                onChange={(event) => setDueTo(event.target.value)}
                            />
                            <div className="mt-1 text-xs text-muted-foreground">
                                Due to
                            </div>
                        </div>
                        <div className="w-full sm:max-w-[180px]">
                            <Input
                                type="date"
                                value={completedFrom}
                                disabled={isFiltering}
                                onChange={(event) =>
                                    setCompletedFrom(event.target.value)
                                }
                            />
                            <div className="mt-1 text-xs text-muted-foreground">
                                Completed from
                            </div>
                        </div>
                        <div className="w-full sm:max-w-[180px]">
                            <Input
                                type="date"
                                value={completedTo}
                                disabled={isFiltering}
                                onChange={(event) =>
                                    setCompletedTo(event.target.value)
                                }
                            />
                            <div className="mt-1 text-xs text-muted-foreground">
                                Completed to
                            </div>
                        </div>
                        <div className="w-full sm:max-w-[180px]">
                            <Select
                                value={sortBy}
                                onValueChange={setSortBy}
                                disabled={isFiltering}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    {sortOptions.map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="w-full sm:max-w-[180px]">
                            <Select
                                value={sortDir}
                                onValueChange={setSortDir}
                                disabled={isFiltering}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Direction" />
                                </SelectTrigger>
                                <SelectContent>
                                    {sortDirectionOptions.map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={isFiltering}
                                onClick={() => applyDuePreset(0)}
                            >
                                Today
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={isFiltering}
                                onClick={() => applyDuePreset(1)}
                            >
                                Tomorrow
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={isFiltering}
                                onClick={() => applyDuePreset(0, 6)}
                            >
                                Next 7 days
                            </Button>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="auto-apply"
                                    checked={autoApply}
                                    disabled={isFiltering}
                                    onCheckedChange={(value) =>
                                        setAutoApply(Boolean(value))
                                    }
                                />
                                <label
                                    htmlFor="auto-apply"
                                    className="text-xs font-medium text-muted-foreground"
                                >
                                    Auto apply
                                </label>
                            </div>
                            <Button
                                type="button"
                                disabled={isFiltering}
                                onClick={applyFilters}
                            >
                                Apply
                            </Button>
                            <Button
                                type="button"
                                variant="secondary"
                                disabled={isFiltering}
                                onClick={resetFilters}
                            >
                                Reset
                            </Button>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-semibold uppercase text-muted-foreground">
                                Quick filters
                            </span>
                            {currentUserId ? (
                                <Button
                                    type="button"
                                    size="sm"
                                    variant={
                                        assignedTo === currentUserId.toString()
                                            ? 'default'
                                            : 'outline'
                                    }
                                    disabled={isFiltering}
                                    onClick={() =>
                                        setAssignedTo(
                                            assignedTo === currentUserId.toString()
                                                ? 'all'
                                                : currentUserId.toString(),
                                        )
                                    }
                                >
                                    Only mine
                                </Button>
                            ) : null}
                            <Button
                                type="button"
                                size="sm"
                                variant={
                                    assignedTo === 'unassigned'
                                        ? 'default'
                                        : 'outline'
                                }
                                disabled={isFiltering}
                                onClick={() =>
                                    setAssignedTo(
                                        assignedTo === 'unassigned'
                                            ? 'all'
                                            : 'unassigned',
                                    )
                                }
                            >
                                Unassigned
                            </Button>
                            <Button
                                type="button"
                                size="sm"
                                variant={overdue ? 'default' : 'outline'}
                                disabled={isFiltering}
                                onClick={() => setOverdue((current) => !current)}
                            >
                                Overdue
                            </Button>
                            {roomStatusOptions.map((option) => (
                                <Button
                                    key={option.value}
                                    type="button"
                                    size="sm"
                                    variant={
                                        roomStatus === option.value
                                            ? 'default'
                                            : 'outline'
                                    }
                                    disabled={isFiltering}
                                    onClick={() =>
                                        setRoomStatus(
                                            roomStatus === option.value
                                                ? 'all'
                                                : option.value,
                                        )
                                    }
                                >
                                    {option.label}
                                </Button>
                            ))}
                        </div>
                        <div className="ml-auto text-sm text-muted-foreground">
                            Total: {totalCount}
                            {lastPage > 1 ? (
                                <span className="ml-2 text-xs text-muted-foreground">
                                    Page {currentPage} of {lastPage}
                                </span>
                            ) : null}
                            {isFiltering ? (
                                <span className="ml-2 text-xs text-muted-foreground">
                                    Loading...
                                </span>
                            ) : null}
                        </div>
                    </div>
                    {activeFilters.length > 0 ? (
                        <div className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-3">
                            <span className="text-xs font-semibold uppercase text-muted-foreground">
                                Active filters
                            </span>
                            {activeFilters.map((filter) => (
                                <Button
                                    key={filter.key}
                                    type="button"
                                    size="sm"
                                    variant="secondary"
                                    disabled={isFiltering}
                                    onClick={filter.onClear}
                                >
                                    {filter.label}
                                </Button>
                            ))}
                            <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                disabled={isFiltering}
                                onClick={resetFilters}
                            >
                                Clear all
                            </Button>
                        </div>
                    ) : null}
                    {selectedTaskIds.length > 0 ? (
                        <div className="flex flex-wrap items-center gap-3 border-b border-border px-4 py-3">
                            <span className="text-sm font-semibold text-foreground">
                                {selectedTaskIds.length} selected
                            </span>
                            <div className="w-full max-w-[180px]">
                                <Select
                                    value={bulkStatus}
                                    onValueChange={setBulkStatus}
                                    disabled={isFiltering || isBulkUpdating}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="no_change">
                                            No status change
                                        </SelectItem>
                                        {updateStatusOptions.map((option) => (
                                            <SelectItem
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="w-full max-w-[200px]">
                                <Select
                                    value={bulkAssignee}
                                    onValueChange={setBulkAssignee}
                                    disabled={isFiltering || isBulkUpdating}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Assignee" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="no_change">
                                            No assignee change
                                        </SelectItem>
                                        <SelectItem value="unassigned">
                                            Unassigned
                                        </SelectItem>
                                        {assignees.map((assignee) => (
                                            <SelectItem
                                                key={assignee.id}
                                                value={assignee.id.toString()}
                                            >
                                                {assignee.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button
                                type="button"
                                size="sm"
                                disabled={isFiltering || isBulkUpdating}
                                onClick={handleBulkUpdate}
                            >
                                {isBulkUpdating ? 'Updating...' : 'Apply'}
                            </Button>
                            <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                disabled={isFiltering || isBulkUpdating}
                                onClick={() => setSelectedTaskIds([])}
                            >
                                Clear selection
                            </Button>
                        </div>
                    ) : null}

                    <div className="w-full lg:hidden">
                        {isFiltering ? (
                            <div className="space-y-3 p-4">
                                {Array.from({ length: 4 }).map((_, index) => (
                                    <div
                                        key={`mobile-skeleton-${index}`}
                                        className="rounded-lg border border-border p-4"
                                    >
                                        <div className="h-4 w-24 rounded bg-muted/70 motion-safe:animate-pulse" />
                                        <div className="mt-3 h-4 w-40 rounded bg-muted/70 motion-safe:animate-pulse" />
                                        <div className="mt-3 h-4 w-28 rounded bg-muted/70 motion-safe:animate-pulse" />
                                    </div>
                                ))}
                            </div>
                        ) : taskRows.length === 0 ? (
                            <div className="px-4 py-8 text-center text-muted-foreground">
                                No tasks found.
                            </div>
                        ) : (
                            <div className="space-y-3 p-4">
                                {taskRows.map((task) => (
                                    <div
                                        key={task.id}
                                        className="rounded-lg border border-border p-4"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <Checkbox
                                                    checked={selectedTaskIds.includes(task.id)}
                                                    onCheckedChange={(value) => {
                                                        if (value === 'indeterminate') {
                                                            return;
                                                        }
                                                        toggleTaskSelection(task.id);
                                                    }}
                                                    disabled={isFiltering}
                                                    aria-label={`Select task ${task.id}`}
                                                />
                                                <div>
                                                    <div className="text-sm font-semibold text-foreground">
                                                        {task.room ? (
                                                            <Link
                                                                className="text-primary underline-offset-4 hover:underline"
                                                                href={`/housekeeping/rooms/${task.room.id}`}
                                                            >
                                                                Room {task.room.number}
                                                            </Link>
                                                        ) : (
                                                            'Room —'
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {task.type} • {task.priority}
                                                    </div>
                                                </div>
                                            </div>
                                            <Badge variant={statusVariant(task.status)}>
                                                {task.status.replace('_', ' ')}
                                            </Badge>
                                        </div>
                                        <div className="mt-3 grid gap-2 text-xs text-muted-foreground">
                                            <div>
                                                Assignee: {task.assignee?.name ?? 'Unassigned'}
                                            </div>
                                            <div>Due: {formatDateTime(task.due_at)}</div>
                                            <div>
                                                SLA:{' '}
                                                <Badge variant={slaVariant(task.sla_status)}>
                                                    {(task.sla_status ?? 'normal').replace('_', ' ')}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="mt-4 flex justify-end">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => startEdit(task)}
                                            >
                                                Update
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="hidden w-full overflow-x-auto lg:block">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                                <tr>
                                    <th className="px-4 py-3 text-left font-medium">
                                        <Checkbox
                                            checked={selectAllState}
                                            disabled={isFiltering || taskRows.length === 0}
                                            onCheckedChange={(value) =>
                                                handleSelectAll(Boolean(value))
                                            }
                                            aria-label="Select all tasks"
                                        />
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium">
                                        Room
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium">
                                        Type
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium">
                                        Assignee
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium">
                                        Priority
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium">
                                        Due
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium">
                                        SLA
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-right font-medium">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {isFiltering ? (
                                    Array.from({ length: 6 }).map((_, index) => (
                                        <tr key={`skeleton-${index}`}>
                                            <td className="px-4 py-3">
                                                <div className="h-4 w-4 rounded bg-muted/70 motion-safe:animate-pulse" />
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="h-4 w-16 rounded bg-muted/70 motion-safe:animate-pulse" />
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="h-4 w-24 rounded bg-muted/70 motion-safe:animate-pulse" />
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="h-4 w-16 rounded bg-muted/70 motion-safe:animate-pulse" />
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="h-4 w-20 rounded bg-muted/70 motion-safe:animate-pulse" />
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="h-4 w-24 rounded bg-muted/70 motion-safe:animate-pulse" />
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="h-4 w-16 rounded bg-muted/70 motion-safe:animate-pulse" />
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="h-4 w-20 rounded bg-muted/70 motion-safe:animate-pulse" />
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="ml-auto h-7 w-20 rounded bg-muted/70 motion-safe:animate-pulse" />
                                            </td>
                                        </tr>
                                    ))
                                ) : taskRows.length === 0 ? (
                                    <tr>
                                        <td
                                            className="px-4 py-8 text-center text-muted-foreground"
                                            colSpan={9}
                                        >
                                            No tasks found.
                                        </td>
                                    </tr>
                                ) : (
                                    taskRows.map((task) => (
                                        <tr
                                            key={task.id}
                                            className={
                                                task.sla_status === 'overdue'
                                                    ? 'bg-destructive/5'
                                                    : task.sla_status === 'urgent'
                                                      ? 'bg-amber-500/10'
                                                      : undefined
                                            }
                                        >
                                            <td className="px-4 py-3">
                                                <Checkbox
                                                    checked={selectedTaskIds.includes(task.id)}
                                                    onCheckedChange={(value) => {
                                                        if (value === 'indeterminate') {
                                                            return;
                                                        }
                                                        toggleTaskSelection(task.id);
                                                    }}
                                                    disabled={isFiltering}
                                                    aria-label={`Select task ${task.id}`}
                                                />
                                            </td>
                                            <td className="px-4 py-3 font-medium text-foreground">
                                                {task.room ? (
                                                    <Link
                                                        className="text-primary underline-offset-4 hover:underline"
                                                        href={`/housekeeping/rooms/${task.room.id}`}
                                                    >
                                                        {task.room.number}
                                                    </Link>
                                                ) : (
                                                    '—'
                                                )}
                                                {task.room?.room_status ? (
                                                    <Badge
                                                        className="ml-2"
                                                        variant="outline"
                                                    >
                                                        {task.room.room_status}
                                                    </Badge>
                                                ) : null}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {task.type}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {task.assignee?.name ?? 'Unassigned'}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {task.priority}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {formatDateTime(task.due_at)}
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge variant={slaVariant(task.sla_status)}>
                                                    {(task.sla_status ?? 'normal').replace('_', ' ')}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge
                                                    variant={statusVariant(
                                                        task.status,
                                                    )}
                                                >
                                                    {task.status.replace('_', ' ')}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                {editingTaskId === task.id ? (
                                                    <div className="flex flex-col items-end gap-2">
                                                        <div className="w-full max-w-[160px]">
                                                            <Select
                                                                value={updateForm.data.status}
                                                                onValueChange={(value) =>
                                                                    updateForm.setData(
                                                                        'status',
                                                                        value,
                                                                    )
                                                                }
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Status" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {updateStatusOptions.map(
                                                                        (option) => (
                                                                            <SelectItem
                                                                                key={option.value}
                                                                                value={option.value}
                                                                            >
                                                                                {option.label}
                                                                            </SelectItem>
                                                                        ),
                                                                    )}
                                                                </SelectContent>
                                                            </Select>
                                                            <InputError
                                                                message={
                                                                    updateForm.errors
                                                                        .status
                                                                }
                                                            />
                                                        </div>
                                                        <div className="w-full max-w-[160px]">
                                                            <Select
                                                                value={
                                                                    updateForm.data
                                                                        .assigned_to
                                                                        ? updateForm.data.assigned_to.toString()
                                                                        : 'unassigned'
                                                                }
                                                                onValueChange={(value) =>
                                                                    updateForm.setData(
                                                                        'assigned_to',
                                                                        value === 'unassigned'
                                                                            ? null
                                                                            : Number(value),
                                                                    )
                                                                }
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Assignee" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="unassigned">
                                                                        Unassigned
                                                                    </SelectItem>
                                                                    {assignees.map((assignee) => (
                                                                        <SelectItem
                                                                            key={assignee.id}
                                                                            value={assignee.id.toString()}
                                                                        >
                                                                            {assignee.name}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                            <InputError
                                                                message={
                                                                    updateForm.errors
                                                                        .assigned_to
                                                                }
                                                            />
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Button
                                                                type="button"
                                                                size="sm"
                                                                disabled={
                                                                    updateForm.processing
                                                                }
                                                                onClick={saveUpdate}
                                                            >
                                                                Save
                                                            </Button>
                                                            <Button
                                                                type="button"
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={cancelEdit}
                                                            >
                                                                Cancel
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => startEdit(task)}
                                                    >
                                                        Update
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border p-4 text-sm text-muted-foreground">
                        <span>
                            Page {currentPage} of {lastPage}
                        </span>
                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                disabled={!canPreviousPage || isFiltering}
                                onClick={() => applyFilters(currentPage - 1)}
                            >
                                Previous
                            </Button>
                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                disabled={!canNextPage || isFiltering}
                                onClick={() => applyFilters(currentPage + 1)}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
