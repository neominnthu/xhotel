<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::command('room-status-logs:prune')->daily();
Schedule::command('reports:rollup')->dailyAt('01:10');
Schedule::command('availability-holds:prune')->hourly();

if (config('updates.scheduled_backups.enabled')) {
    $backupTime = config('updates.scheduled_backups.time', '02:00');
    Schedule::command('system:backup --source=scheduled')->dailyAt($backupTime);
    Schedule::command('system:backup-prune')->dailyAt('02:30');
}
