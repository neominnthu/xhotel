import { Link, usePage } from '@inertiajs/react';
import { BarChart3, BookOpen, CalendarDays, Cog, Folder, LayoutGrid, Sparkles } from 'lucide-react';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { index as auditLogsIndex } from '@/routes/settings/audit-logs';
import calendar from '@/routes/calendar';
import type { NavItem } from '@/types';
import AppLogo from './app-logo';

const baseNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Reservations',
        href: '/reservations',
        icon: CalendarDays,
    },
    {
        title: 'Rate Calendar',
        href: calendar.index().url,
        icon: CalendarDays,
    },
    {
        title: 'Housekeeping',
        href: '/housekeeping',
        icon: Sparkles,
    },
    {
        title: 'Reports',
        href: '/reports',
        icon: BarChart3,
    },
    {
        title: 'Settings',
        href: '/settings/updates',
        icon: Cog,
    },
    {
        title: 'Audit Logs',
        href: auditLogsIndex(),
        icon: BookOpen,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { auth } = usePage<{
        auth: {
            user?: { role?: string | null } | null;
        };
    }>().props;
    const role = auth?.user?.role ?? '';
    const canManageSettings = ['admin', 'reservation_manager'].includes(role);
    const isAdmin = role === 'admin';
    const mainNavItems = baseNavItems.filter((item) => {
        if (item.title === 'Settings') {
            return canManageSettings;
        }

        if (item.title === 'Audit Logs') {
            return isAdmin;
        }

        return true;
    });

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
