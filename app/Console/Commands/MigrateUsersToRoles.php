<?php

namespace App\Console\Commands;

use App\Models\Role;
use App\Models\User;
use Illuminate\Console\Command;

class MigrateUsersToRoles extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'users:migrate-to-roles {--dry-run : Show what would be migrated without making changes}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Migrate existing users from old role field to new role-based system';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $isDryRun = $this->option('dry-run');

        if ($isDryRun) {
            $this->info('DRY RUN MODE - No changes will be made');
        }

        // Define role mapping from old system to new system
        $roleMapping = [
            'admin' => 'super-admin',
            'reservation_manager' => 'hotel-manager',
            'housekeeping' => 'housekeeping-supervisor',
            'front_desk' => 'front-desk-manager',
        ];

        $users = User::whereNotNull('role')->get();
        $migrated = 0;
        $skipped = 0;

        $this->info("Found {$users->count()} users with roles to migrate");

        foreach ($users as $user) {
            $oldRole = $user->role;
            $newRoleName = $roleMapping[$oldRole] ?? null;

            if (!$newRoleName) {
                $this->warn("Unknown role '{$oldRole}' for user {$user->email} - skipping");
                $skipped++;
                continue;
            }

            $role = Role::where('name', $newRoleName)->first();

            if (!$role) {
                $this->error("Role '{$newRoleName}' not found - skipping user {$user->email}");
                $skipped++;
                continue;
            }

            if ($isDryRun) {
                $this->line("Would migrate: {$user->email} ({$oldRole} -> {$newRoleName})");
            } else {
                $user->roles()->attach($role->id, [
                    'assigned_by' => 1, // System user
                    'assigned_at' => now(),
                ]);
                $this->line("Migrated: {$user->email} ({$oldRole} -> {$newRoleName})");
            }

            $migrated++;
        }

        if ($isDryRun) {
            $this->info("DRY RUN COMPLETE: Would migrate {$migrated} users, skip {$skipped} users");
        } else {
            $this->info("MIGRATION COMPLETE: Migrated {$migrated} users, skipped {$skipped} users");
        }

        return Command::SUCCESS;
    }
}
