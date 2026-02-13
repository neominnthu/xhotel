import type { ReactNode } from 'react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import RoomTypesIndex from '@/pages/settings/room-types/index';
import RatesIndex from '@/pages/settings/rates/index';
import CancellationPoliciesIndex from '@/pages/settings/cancellation-policies/index';

const mockDelete = vi.fn();
let flashState: { success?: string; error?: string } = {};

vi.mock('@inertiajs/react', () => ({
    Head: () => null,
    Link: ({ href, children }: { href: string; children: ReactNode }) => (
        <a href={href}>{children}</a>
    ),
    router: {
        delete: (...args: unknown[]) => mockDelete(...args),
        get: vi.fn(),
    },
    usePage: () => ({
        props: {
            flash: flashState,
            auth: {
                user: {
                    name: 'Test User',
                    email: 'test@example.com',
                    role: 'admin',
                },
            },
        },
    }),
    useForm: () => ({
        data: {
            name_en: '',
            name_my: '',
            capacity: '2',
            overbooking_limit: '0',
            base_rate: '0',
            sort_order: '0',
            is_active: true,
            room_type_id: '',
            name: '',
            type: 'base',
            start_date: '',
            end_date: '',
            rate: '0',
            min_stay: '1',
            days_of_week: [] as number[],
            length_of_stay_min: '',
            length_of_stay_max: '',
            adjustment_type: 'none',
            adjustment_value: '',
            deadline_hours: '24',
            penalty_type: 'flat',
            penalty_amount: '0',
            penalty_percent: '0',
        },
        setData: vi.fn(),
        post: vi.fn(),
        patch: vi.fn(),
        reset: vi.fn(),
        clearErrors: vi.fn(),
        processing: false,
        errors: {},
    }),
}));

const confirmMock = vi.spyOn(window, 'confirm');

describe('Settings delete confirmations', () => {
    beforeEach(() => {
        mockDelete.mockClear();
        confirmMock.mockReturnValue(true);
        flashState = {};
        // ensure english translations during tests
        document.documentElement.lang = 'en';
    });

    afterEach(() => {
        confirmMock.mockReset();
    });

    it('confirms and deletes a room type', () => {
        render(
            <RoomTypesIndex
                roomTypes={[
                    {
                        id: 1,
                        name: { en: 'Deluxe', my: 'ဒီလက်စ်' },
                        capacity: 2,
                        overbooking_limit: 1,
                        base_rate: 150000,
                        sort_order: 0,
                        is_active: true,
                    },
                ]}
            />,
        );

        fireEvent.click(screen.getByRole('button', { name: /delete|ဖျက်/i }));

        expect(confirmMock).toHaveBeenCalledOnce();
        expect(mockDelete).toHaveBeenCalledWith('/settings/room-types/1', {
            preserveScroll: true,
        });
    });

    it('confirms and deletes a rate', () => {
        render(
            <RatesIndex
                roomTypes={[{ id: 1, name: { en: 'Deluxe', my: 'ဒီလက်စ်' } }]}
                rates={[
                    {
                        id: 5,
                        room_type_id: 1,
                        name: 'Base Rate',
                        type: 'base',
                        start_date: '2026-02-10',
                        end_date: '2026-02-12',
                        rate: 150000,
                        min_stay: 1,
                        days_of_week: [],
                        length_of_stay_min: null,
                        length_of_stay_max: null,
                        adjustment_type: null,
                        adjustment_value: null,
                        is_active: true,
                    },
                ]}
            />,
        );

        fireEvent.click(screen.getByRole('button', { name: /delete|ဖျက်/i }));

        expect(confirmMock).toHaveBeenCalledOnce();
        expect(mockDelete).toHaveBeenCalledWith('/settings/rates/5', {
            preserveScroll: true,
        });
    });

    it('does not delete when confirmation is cancelled', () => {
        confirmMock.mockReturnValue(false);

        render(
            <RoomTypesIndex
                roomTypes={[
                    {
                        id: 2,
                        name: { en: 'Standard', my: 'စံ' },
                        capacity: 2,
                        overbooking_limit: 0,
                        base_rate: 120000,
                        sort_order: 0,
                        is_active: true,
                    },
                ]}
            />,
        );

        fireEvent.click(screen.getByRole('button', { name: /delete/i }));

        expect(mockDelete).not.toHaveBeenCalled();
    });

    it('confirms and deletes a cancellation policy', () => {
        render(
            <CancellationPoliciesIndex
                roomTypes={[{ id: 1, name: { en: 'Deluxe', my: 'ဒီလက်စ်' } }]}
                policies={[
                    {
                        id: 7,
                        name: 'Standard policy',
                        room_type_id: 1,
                        deadline_hours: 24,
                        penalty_type: 'flat',
                        penalty_amount: 50000,
                        penalty_percent: 0,
                        is_active: true,
                    },
                ]}
            />,
        );

        fireEvent.click(screen.getByRole('button', { name: /delete|ဖျက်/i }));

        expect(confirmMock).toHaveBeenCalledOnce();
        expect(mockDelete).toHaveBeenCalledWith('/settings/cancellation-policies/7', {
            preserveScroll: true,
        });
    });

    it('enters edit mode and cancels for a cancellation policy', () => {
        render(
            <CancellationPoliciesIndex
                roomTypes={[{ id: 1, name: { en: 'Deluxe', my: 'ဒီလက်စ်' } }]}
                policies={[
                    {
                        id: 8,
                        name: 'Editable policy',
                        room_type_id: 1,
                        deadline_hours: 48,
                        penalty_type: 'percent',
                        penalty_amount: 0,
                        penalty_percent: 10,
                        is_active: true,
                    },
                ]}
            />,
        );

        fireEvent.click(screen.getByRole('button', { name: 'Edit' }));
        expect(screen.getByText('Edit Policy')).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
        expect(screen.getByText('Create policy')).toBeInTheDocument();
    });

    it('does not delete a cancellation policy when confirmation is cancelled', () => {
        confirmMock.mockReturnValue(false);

        render(
            <CancellationPoliciesIndex
                roomTypes={[{ id: 2, name: { en: 'Suite', my: 'စွစ်' } }]}
                policies={[
                    {
                        id: 9,
                        name: 'Strict policy',
                        room_type_id: null,
                        deadline_hours: 12,
                        penalty_type: 'percent',
                        penalty_amount: 0,
                        penalty_percent: 50,
                        is_active: true,
                    },
                ]}
            />,
        );

        fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

        expect(mockDelete).not.toHaveBeenCalled();
    });

    it('shows success flash messages', () => {
        flashState = { success: 'Saved.' };

        render(
            <RoomTypesIndex
                roomTypes={[
                    {
                        id: 3,
                        name: { en: 'Suite', my: 'စွစ်' },
                        capacity: 2,
                        overbooking_limit: 0,
                        base_rate: 180000,
                        sort_order: 0,
                        is_active: true,
                    },
                ]}
            />,
        );

        expect(screen.getByText('Saved.')).toBeInTheDocument();
    });

    it('renders cancellation policy form bounds', () => {
        render(
            <CancellationPoliciesIndex
                roomTypes={[{ id: 1, name: { en: 'Deluxe', my: 'ဒီလက်စ်' } }]}
                policies={[]}
            />,
        );

        const deadlineInput = document.querySelector(
            'input[type="number"][max="720"]',
        ) as HTMLInputElement | null;
        const percentInput = document.querySelector(
            'input[type="number"][max="100"]',
        ) as HTMLInputElement | null;

        expect(deadlineInput).not.toBeNull();
        expect(deadlineInput?.getAttribute('min')).toBe('0');
        expect(percentInput).not.toBeNull();
        expect(percentInput?.getAttribute('min')).toBe('0');
    });

    it('renders required form fields for cancellation policy create', () => {
        render(
            <CancellationPoliciesIndex
                roomTypes={[{ id: 1, name: { en: 'Deluxe', my: 'ဒီလက်စ်' } }]}
                policies={[]}
            />,
        );

        expect(screen.getByText('Create policy')).toBeInTheDocument();
        expect(screen.getByText('Policy name')).toBeInTheDocument();
    });

    it('enters edit mode and shows save/cancel controls for a cancellation policy', () => {
        const policies = [
            {
                id: 5,
                name: 'Editable policy',
                room_type_id: 1,
                deadline_hours: 48,
                penalty_type: 'flat',
                penalty_amount: 1000,
                penalty_percent: 0,
                is_active: true,
            },
        ];

        render(
            <CancellationPoliciesIndex
                roomTypes={[{ id: 1, name: { en: 'Deluxe', my: 'ဒီလက်စ်' } }]}
                policies={policies}
            />,
        );

        // click Edit and assert edit-mode controls are present
        fireEvent.click(screen.getByRole('button', { name: 'Edit' }));

        expect(screen.getByText('Edit Policy')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Save changes' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();

        // Cancel should hide edit state (button text goes back to 'Create policy')
        fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
        expect(screen.getByText('Create policy')).toBeInTheDocument();
    });
});
