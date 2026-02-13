<?php

namespace App\Console\Commands;

use App\Models\HousekeepingTask;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class HousekeepingDailySummary extends Command
{
    protected $signature = 'housekeeping:daily-summary {--date=today : Date for the summary}';

    protected $description = 'Generate daily housekeeping summary report';

    public function handle()
    {
        $date = $this->option('date') === 'today' ? today() : \Carbon\Carbon::parse($this->option('date'));

        $this->info("Generating housekeeping summary for {$date->toDateString()}");

        // Get tasks created today
        $tasksCreated = HousekeepingTask::whereDate('created_at', $date)->count();

        // Get tasks completed today
        $tasksCompleted = HousekeepingTask::whereDate('completed_at', $date)->count();

        // Get overdue tasks
        $overdueTasks = HousekeepingTask::overdue()->count();

        // Get tasks by priority
        $highPriorityTasks = HousekeepingTask::where('priority', 'high')
            ->where('status', '!=', 'completed')
            ->count();

        // Get tasks by assignee
        $assigneeStats = User::where('role', 'housekeeping')
            ->withCount(['housekeepingTasks' => function ($query) use ($date) {
                $query->whereDate('completed_at', $date);
            }])
            ->get()
            ->map(fn ($user) => [
                'name' => $user->name,
                'completed_today' => $user->housekeeping_tasks_count,
            ]);

        $summary = [
            'date' => $date->toDateString(),
            'tasks_created' => $tasksCreated,
            'tasks_completed' => $tasksCompleted,
            'overdue_tasks' => $overdueTasks,
            'high_priority_pending' => $highPriorityTasks,
            'assignee_performance' => $assigneeStats,
        ];

        // Log the summary
        Log::info('Housekeeping Daily Summary', $summary);

        // Output to console
        $this->table(
            ['Metric', 'Value'],
            [
                ['Tasks Created Today', $tasksCreated],
                ['Tasks Completed Today', $tasksCompleted],
                ['Overdue Tasks', $overdueTasks],
                ['High Priority Pending', $highPriorityTasks],
            ]
        );

        $this->info('Assignee Performance:');
        $this->table(
            ['Assignee', 'Completed Today'],
            $assigneeStats->map(fn ($stat) => [$stat['name'], $stat['completed_today']])
        );

        return self::SUCCESS;
    }
}
