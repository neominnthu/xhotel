<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create permissions
        $permissions = [
            // User Management
            ['name' => 'view-users', 'display_name' => 'View Users', 'group' => 'User Management', 'description' => 'Can view user list and details'],
            ['name' => 'create-users', 'display_name' => 'Create Users', 'group' => 'User Management', 'description' => 'Can create new users'],
            ['name' => 'edit-users', 'display_name' => 'Edit Users', 'group' => 'User Management', 'description' => 'Can edit user information'],
            ['name' => 'delete-users', 'display_name' => 'Delete Users', 'group' => 'User Management', 'description' => 'Can delete users'],
            ['name' => 'manage-user-roles', 'display_name' => 'Manage User Roles', 'group' => 'User Management', 'description' => 'Can assign and remove user roles'],

            // Role Management
            ['name' => 'view-roles', 'display_name' => 'View Roles', 'group' => 'Role Management', 'description' => 'Can view roles and permissions'],
            ['name' => 'create-roles', 'display_name' => 'Create Roles', 'group' => 'Role Management', 'description' => 'Can create new roles'],
            ['name' => 'edit-roles', 'display_name' => 'Edit Roles', 'group' => 'Role Management', 'description' => 'Can edit role permissions'],
            ['name' => 'delete-roles', 'display_name' => 'Delete Roles', 'group' => 'Role Management', 'description' => 'Can delete roles'],

            // Reservation Management
            ['name' => 'view-reservations', 'display_name' => 'View Reservations', 'group' => 'Reservations', 'description' => 'Can view reservation list and details'],
            ['name' => 'create-reservations', 'display_name' => 'Create Reservations', 'group' => 'Reservations', 'description' => 'Can create new reservations'],
            ['name' => 'edit-reservations', 'display_name' => 'Edit Reservations', 'group' => 'Reservations', 'description' => 'Can modify existing reservations'],
            ['name' => 'cancel-reservations', 'display_name' => 'Cancel Reservations', 'group' => 'Reservations', 'description' => 'Can cancel reservations'],
            ['name' => 'check-in-guests', 'display_name' => 'Check-in Guests', 'group' => 'Reservations', 'description' => 'Can perform guest check-ins'],
            ['name' => 'check-out-guests', 'display_name' => 'Check-out Guests', 'group' => 'Reservations', 'description' => 'Can perform guest check-outs'],

            // Front Desk
            ['name' => 'view-front-desk', 'display_name' => 'Access Front Desk', 'group' => 'Front Desk', 'description' => 'Can access front desk interface'],
            ['name' => 'manage-walk-ins', 'display_name' => 'Manage Walk-ins', 'group' => 'Front Desk', 'description' => 'Can handle walk-in guests'],
            ['name' => 'process-payments', 'display_name' => 'Process Payments', 'group' => 'Front Desk', 'description' => 'Can process guest payments'],

            // Housekeeping
            ['name' => 'view-housekeeping', 'display_name' => 'View Housekeeping Tasks', 'group' => 'Housekeeping', 'description' => 'Can view housekeeping task list'],
            ['name' => 'assign-housekeeping-tasks', 'display_name' => 'Assign Housekeeping Tasks', 'group' => 'Housekeeping', 'description' => 'Can assign housekeeping tasks'],
            ['name' => 'update-room-status', 'display_name' => 'Update Room Status', 'group' => 'Housekeeping', 'description' => 'Can update room clean/dirty status'],
            ['name' => 'report-maintenance', 'display_name' => 'Report Maintenance Issues', 'group' => 'Housekeeping', 'description' => 'Can report maintenance issues'],

            // Billing & Finance
            ['name' => 'view-billing', 'display_name' => 'View Billing', 'group' => 'Billing', 'description' => 'Can view billing information'],
            ['name' => 'create-invoices', 'display_name' => 'Create Invoices', 'group' => 'Billing', 'description' => 'Can create invoices'],
            ['name' => 'process-refunds', 'display_name' => 'Process Refunds', 'group' => 'Billing', 'description' => 'Can process refunds'],
            ['name' => 'view-financial-reports', 'display_name' => 'View Financial Reports', 'group' => 'Billing', 'description' => 'Can view financial reports'],

            // Reports & Analytics
            ['name' => 'view-reports', 'display_name' => 'View Reports', 'group' => 'Reports', 'description' => 'Can view general reports'],
            ['name' => 'view-analytics', 'display_name' => 'View Analytics', 'group' => 'Reports', 'description' => 'Can view analytics dashboard'],
            ['name' => 'export-reports', 'display_name' => 'Export Reports', 'group' => 'Reports', 'description' => 'Can export reports to various formats'],

            // System Administration
            ['name' => 'view-audit-logs', 'display_name' => 'View Audit Logs', 'group' => 'System', 'description' => 'Can view system audit logs'],
            ['name' => 'export-audit-logs', 'display_name' => 'Export Audit Logs', 'group' => 'System', 'description' => 'Can export audit logs'],
            ['name' => 'view-system-updates', 'display_name' => 'View System Updates', 'group' => 'System', 'description' => 'Can view update history and status'],
            ['name' => 'apply-system-updates', 'display_name' => 'Apply System Updates', 'group' => 'System', 'description' => 'Can trigger system updates'],
            ['name' => 'rollback-system-updates', 'display_name' => 'Rollback System Updates', 'group' => 'System', 'description' => 'Can rollback system updates'],
            ['name' => 'view-system-backups', 'display_name' => 'View System Backups', 'group' => 'System', 'description' => 'Can view system backups'],
            ['name' => 'create-system-backups', 'display_name' => 'Create System Backups', 'group' => 'System', 'description' => 'Can create system backups'],
            ['name' => 'manage-system-settings', 'display_name' => 'Manage System Settings', 'group' => 'System', 'description' => 'Can modify system settings'],
            ['name' => 'manage-properties', 'display_name' => 'Manage Properties', 'group' => 'System', 'description' => 'Can manage property settings'],
            ['name' => 'manage-rates', 'display_name' => 'Manage Rates', 'group' => 'System', 'description' => 'Can manage room rates and pricing'],

            // Guest Management
            ['name' => 'view-guests', 'display_name' => 'View Guest Profiles', 'group' => 'Guests', 'description' => 'Can view guest information'],
            ['name' => 'create-guests', 'display_name' => 'Create Guest Profiles', 'group' => 'Guests', 'description' => 'Can create new guest profiles'],
            ['name' => 'edit-guests', 'display_name' => 'Edit Guest Profiles', 'group' => 'Guests', 'description' => 'Can edit guest information'],
            ['name' => 'manage-guest-preferences', 'display_name' => 'Manage Guest Preferences', 'group' => 'Guests', 'description' => 'Can manage guest preferences and history'],
        ];

        foreach ($permissions as $permissionData) {
            Permission::create(array_merge($permissionData, [
                'is_system_permission' => true,
            ]));
        }

        // Create roles
        $roles = [
            [
                'name' => 'super-admin',
                'display_name' => 'Super Administrator',
                'description' => 'Full system access with all permissions',
                'permissions' => array_column($permissions, 'name'), // All permissions
            ],
            [
                'name' => 'hotel-manager',
                'display_name' => 'Hotel Manager',
                'description' => 'Senior management role with broad access',
                'permissions' => [
                    'view-users', 'create-users', 'edit-users', 'view-roles',
                    'view-reservations', 'create-reservations', 'edit-reservations', 'cancel-reservations',
                    'check-in-guests', 'check-out-guests', 'view-front-desk', 'manage-walk-ins', 'process-payments',
                    'view-housekeeping', 'assign-housekeeping-tasks', 'update-room-status',
                    'view-billing', 'create-invoices', 'process-refunds', 'view-financial-reports',
                    'view-reports', 'view-analytics', 'export-reports',
                    'view-audit-logs', 'export-audit-logs', 'view-system-updates', 'apply-system-updates',
                    'rollback-system-updates', 'view-system-backups', 'create-system-backups',
                    'manage-properties', 'manage-rates',
                    'view-guests', 'create-guests', 'edit-guests', 'manage-guest-preferences',
                ],
            ],
            [
                'name' => 'front-desk-manager',
                'display_name' => 'Front Desk Manager',
                'description' => 'Manages front desk operations and reservations',
                'permissions' => [
                    'view-users', 'view-reservations', 'create-reservations', 'edit-reservations', 'cancel-reservations',
                    'check-in-guests', 'check-out-guests', 'view-front-desk', 'manage-walk-ins', 'process-payments',
                    'view-guests', 'create-guests', 'edit-guests', 'manage-guest-preferences',
                    'view-reports', 'export-reports',
                ],
            ],
            [
                'name' => 'front-desk-clerk',
                'display_name' => 'Front Desk Clerk',
                'description' => 'Handles daily front desk operations',
                'permissions' => [
                    'view-reservations', 'create-reservations', 'edit-reservations',
                    'check-in-guests', 'check-out-guests', 'view-front-desk', 'manage-walk-ins', 'process-payments',
                    'view-guests', 'create-guests', 'edit-guests',
                ],
            ],
            [
                'name' => 'housekeeping-supervisor',
                'display_name' => 'Housekeeping Supervisor',
                'description' => 'Supervises housekeeping staff and room maintenance',
                'permissions' => [
                    'view-housekeeping', 'assign-housekeeping-tasks', 'update-room-status', 'report-maintenance',
                    'view-guests',
                ],
            ],
            [
                'name' => 'housekeeper',
                'display_name' => 'Housekeeper',
                'description' => 'Performs cleaning and maintenance tasks',
                'permissions' => [
                    'view-housekeeping', 'update-room-status', 'report-maintenance',
                ],
            ],
            [
                'name' => 'accountant',
                'display_name' => 'Accountant',
                'description' => 'Handles billing and financial operations',
                'permissions' => [
                    'view-billing', 'create-invoices', 'process-refunds', 'view-financial-reports',
                    'view-reports', 'export-reports',
                ],
            ],
            [
                'name' => 'reservation-agent',
                'display_name' => 'Reservation Agent',
                'description' => 'Handles reservation bookings and modifications',
                'permissions' => [
                    'view-reservations', 'create-reservations', 'edit-reservations', 'cancel-reservations',
                    'view-guests', 'create-guests', 'edit-guests',
                ],
            ],
        ];

        foreach ($roles as $roleData) {
            $permissions = $roleData['permissions'];
            unset($roleData['permissions']);

            $role = Role::create(array_merge($roleData, [
                'is_system_role' => true,
            ]));

            $permissionIds = Permission::whereIn('name', $permissions)->pluck('id')->toArray();
            $role->permissions()->attach($permissionIds);
        }
    }
}
