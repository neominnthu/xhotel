<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(PmsSeeder::class);

        // Seed E2E user for Playwright tests (CI/local-e2e)
        if (app()->environment('local') || env('RUN_E2E_SEEDS', false)) {
            $this->call(E2eUserSeeder::class);
        }
    }
}
