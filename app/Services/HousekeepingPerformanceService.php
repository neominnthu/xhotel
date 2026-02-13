<?php

namespace App\Services;

use App\Models\HousekeepingPerformance;
use App\Models\HousekeepingTask;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class HousekeepingPerformanceService
{
    /**
     * Calculate and update performance metrics for a user on a specific date.
     */
    public function calculateDailyPerformance(User $user, Carbon $date): HousekeepingPerformance
    {
        $startOfDay = $date->copy()->startOfDay();
        $endOfDay = $date->copy()->endOfDay();

        // Get tasks assigned to user for the day
        $tasks = HousekeepingTask::where('assigned_to', $user->id)
            ->whereBetween('created_at', [$startOfDay, $endOfDay])
            ->get();

        // Get completed tasks for the day
        $completedTasks = HousekeepingTask::where('assigned_to', $user->id)
            ->where('status', 'completed')
            ->whereBetween('completed_at', [$startOfDay, $endOfDay])
            ->get();

        // Calculate metrics
        $tasksAssigned = $tasks->count();
        $tasksCompleted = $completedTasks->count();
        $tasksCompletedOnTime = $completedTasks->filter(fn($task) => $task->isCompletedOnTime())->count();
        $tasksOverdue = $tasks->filter(fn($task) => $task->isOverdue())->count();

        // Quality scores
        $qualityScores = $completedTasks->pluck('quality_score')->filter()->values();
        $averageQualityScore = $qualityScores->isNotEmpty() ? $qualityScores->avg() : null;

        // Time tracking
        $totalMinutesWorked = $completedTasks->sum('actual_duration_minutes');

        // Task type breakdown
        $roomsCleaned = $completedTasks->where('type', 'clean')->count();
        $inspectionsCompleted = $completedTasks->where('type', 'inspect')->count();
        $maintenanceTasksCompleted = $completedTasks->where('type', 'maintenance')->count();

        // Calculate efficiency rating (0-100)
        $efficiencyRating = $this->calculateEfficiencyRating(
            $tasksAssigned,
            $tasksCompleted,
            $tasksCompletedOnTime,
            $averageQualityScore,
            $totalMinutesWorked
        );

        // Update or create performance record
        return HousekeepingPerformance::updateOrCreate(
            [
                'user_id' => $user->id,
                'performance_date' => $date->toDateString(),
            ],
            [
                'tasks_assigned' => $tasksAssigned,
                'tasks_completed' => $tasksCompleted,
                'tasks_completed_on_time' => $tasksCompletedOnTime,
                'tasks_overdue' => $tasksOverdue,
                'average_quality_score' => $averageQualityScore,
                'total_minutes_worked' => $totalMinutesWorked,
                'rooms_cleaned' => $roomsCleaned,
                'inspections_completed' => $inspectionsCompleted,
                'maintenance_tasks_completed' => $maintenanceTasksCompleted,
                'efficiency_rating' => $efficiencyRating,
            ]
        );
    }

    /**
     * Calculate efficiency rating based on multiple factors.
     */
    private function calculateEfficiencyRating(
        int $assigned,
        int $completed,
        int $onTime,
        ?float $qualityScore,
        int $minutesWorked
    ): ?float {
        if ($assigned === 0) {
            return null;
        }

        // Completion rate (40% weight)
        $completionRate = ($completed / $assigned) * 40;

        // On-time rate (30% weight)
        $onTimeRate = $completed > 0 ? (($onTime / $completed) * 30) : 0;

        // Quality score (20% weight)
        $qualityComponent = $qualityScore ? (($qualityScore / 5.0) * 20) : 10; // Default to 50% if no quality score

        // Time efficiency (10% weight) - assumes 8 hours = 480 minutes as baseline
        $expectedMinutes = $assigned * 60; // Assume 1 hour per task
        $timeEfficiency = $minutesWorked > 0 && $expectedMinutes > 0
            ? min(($expectedMinutes / $minutesWorked) * 10, 10)
            : 5;

        return round($completionRate + $onTimeRate + $qualityComponent + $timeEfficiency, 2);
    }

    /**
     * Get performance summary for a date range.
     */
    public function getPerformanceSummary(User $user, Carbon $startDate, Carbon $endDate): array
    {
        $performances = HousekeepingPerformance::where('user_id', $user->id)
            ->whereBetween('performance_date', [$startDate, $endDate])
            ->get();

        if ($performances->isEmpty()) {
            return [
                'total_days' => 0,
                'average_efficiency' => 0,
                'total_tasks_completed' => 0,
                'average_quality_score' => 0,
                'on_time_percentage' => 0,
                'total_minutes_worked' => 0,
            ];
        }

        return [
            'total_days' => $performances->count(),
            'average_efficiency' => round($performances->avg('efficiency_rating'), 2),
            'total_tasks_completed' => $performances->sum('tasks_completed'),
            'average_quality_score' => round($performances->whereNotNull('average_quality_score')->avg('average_quality_score'), 2),
            'on_time_percentage' => $this->calculateOnTimePercentage($performances),
            'total_minutes_worked' => $performances->sum('total_minutes_worked'),
            'performance_trend' => $this->calculatePerformanceTrend($performances),
        ];
    }

    /**
     * Calculate on-time completion percentage across all performances.
     */
    private function calculateOnTimePercentage(Collection $performances): float
    {
        $totalCompleted = $performances->sum('tasks_completed');
        $totalOnTime = $performances->sum('tasks_completed_on_time');

        return $totalCompleted > 0 ? round(($totalOnTime / $totalCompleted) * 100, 2) : 0;
    }

    /**
     * Calculate performance trend (improving, declining, stable).
     */
    private function calculatePerformanceTrend(Collection $performances): string
    {
        $sorted = $performances->sortBy('performance_date');
        $efficiencies = $sorted->pluck('efficiency_rating')->filter()->values();

        if ($efficiencies->count() < 2) {
            return 'insufficient_data';
        }

        $firstHalf = $efficiencies->take(floor($efficiencies->count() / 2))->avg();
        $secondHalf = $efficiencies->skip(floor($efficiencies->count() / 2))->avg();

        $difference = $secondHalf - $firstHalf;

        if ($difference > 5) {
            return 'improving';
        } elseif ($difference < -5) {
            return 'declining';
        } else {
            return 'stable';
        }
    }

    /**
     * Get top performers for a date range.
     */
    public function getTopPerformers(Carbon $startDate, Carbon $endDate, int $limit = 10): Collection
    {
        return HousekeepingPerformance::with('user')
            ->whereBetween('performance_date', [$startDate, $endDate])
            ->selectRaw('user_id, AVG(efficiency_rating) as avg_efficiency, SUM(tasks_completed) as total_tasks')
            ->groupBy('user_id')
            ->having('avg_efficiency', '>', 0)
            ->orderByDesc('avg_efficiency')
            ->orderByDesc('total_tasks')
            ->limit($limit)
            ->get();
    }

    /**
     * Update performance metrics when a task is completed.
     */
    public function updatePerformanceOnTaskCompletion(HousekeepingTask $task): void
    {
        if (!$task->completed_at || !$task->assigned_to) {
            return;
        }

        $performanceDate = $task->completed_at->toDateString();
        $this->calculateDailyPerformance($task->assignee, Carbon::parse($performanceDate));
    }

    /**
     * Get housekeeping staff workload distribution.
     */
    public function getWorkloadDistribution(Carbon $date): array
    {
        $housekeepingUsers = User::whereHas('roles', function ($query) {
            $query->whereIn('name', ['housekeeping-supervisor', 'housekeeper']);
        })->get();

        $distribution = [];

        foreach ($housekeepingUsers as $user) {
            $tasks = HousekeepingTask::where('assigned_to', $user->id)
                ->where('status', '!=', 'completed')
                ->whereDate('due_at', $date)
                ->count();

            $distribution[] = [
                'user_id' => $user->id,
                'user_name' => $user->name,
                'active_tasks' => $tasks,
                'role' => $user->roles->pluck('display_name')->first(),
            ];
        }

        return $distribution;
    }

    /**
     * Get staff performance summary for API response.
     */
    public function getStaffPerformanceSummary(User $user, string $startDate, string $endDate): array
    {
        $summary = $this->getPerformanceSummary($user, Carbon::parse($startDate), Carbon::parse($endDate));

        // Add additional metrics for API response
        $performances = HousekeepingPerformance::where('user_id', $user->id)
            ->whereBetween('performance_date', [$startDate, $endDate])
            ->get();

        return array_merge($summary, [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
            'period' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
            'detailed_metrics' => [
                'total_rooms_cleaned' => $performances->sum('rooms_cleaned'),
                'total_inspections' => $performances->sum('inspections_completed'),
                'total_maintenance' => $performances->sum('maintenance_tasks_completed'),
                'average_tasks_per_day' => $summary['total_days'] > 0
                    ? round($summary['total_tasks_completed'] / $summary['total_days'], 1)
                    : 0,
                'total_overdue_tasks' => $performances->sum('tasks_overdue'),
            ],
        ]);
    }

    /**
     * Get performance trends for a specific number of days.
     */
    public function getPerformanceTrends(User $user, int $days): array
    {
        $endDate = now();
        $startDate = now()->subDays($days - 1);

        $performances = HousekeepingPerformance::where('user_id', $user->id)
            ->whereBetween('performance_date', [$startDate->toDateString(), $endDate->toDateString()])
            ->orderBy('performance_date')
            ->get();

        $trends = [];
        foreach ($performances as $performance) {
            $trends[] = [
                'date' => $performance->performance_date,
                'efficiency_rating' => $performance->efficiency_rating,
                'tasks_completed' => $performance->tasks_completed,
                'tasks_completed_on_time' => $performance->tasks_completed_on_time,
                'average_quality_score' => $performance->average_quality_score,
                'total_minutes_worked' => $performance->total_minutes_worked,
            ];
        }

        return [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
            ],
            'period_days' => $days,
            'trends' => $trends,
        ];
    }

    /**
     * Get top performers for a specific period.
     */
    public function getTopPerformersForPeriod(int $limit = 10, string $period = 'month'): array
    {
        $startDate = match ($period) {
            'week' => now()->startOfWeek(),
            'quarter' => now()->startOfQuarter(),
            default => now()->startOfMonth(),
        };

        $endDate = now();

        $topPerformers = $this->getTopPerformers($startDate, $endDate, $limit);

        return [
            'period' => $period,
            'start_date' => $startDate->toDateString(),
            'end_date' => $endDate->toDateString(),
            'top_performers' => $topPerformers->map(function ($performance) {
                return [
                    'user' => [
                        'id' => $performance->user->id,
                        'name' => $performance->user->name,
                        'email' => $performance->user->email,
                    ],
                    'average_efficiency' => round($performance->avg_efficiency, 2),
                    'total_tasks' => $performance->total_tasks,
                    'rank' => $performance->rank ?? null,
                ];
            })->values(),
        ];
    }

    /**
     * Get overall housekeeping performance metrics.
     */
    public function getOverallMetrics(string $startDate, string $endDate): array
    {
        $performances = HousekeepingPerformance::whereBetween('performance_date', [$startDate, $endDate])
            ->with('user')
            ->get();

        if ($performances->isEmpty()) {
            return [
                'period' => ['start_date' => $startDate, 'end_date' => $endDate],
                'total_staff' => 0,
                'average_efficiency' => 0,
                'total_tasks_completed' => 0,
                'average_quality_score' => 0,
                'on_time_completion_rate' => 0,
                'total_minutes_worked' => 0,
            ];
        }

        $totalCompleted = $performances->sum('tasks_completed');
        $totalOnTime = $performances->sum('tasks_completed_on_time');

        return [
            'period' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
            'total_staff' => $performances->pluck('user_id')->unique()->count(),
            'average_efficiency' => round($performances->avg('efficiency_rating'), 2),
            'total_tasks_completed' => $totalCompleted,
            'average_quality_score' => round($performances->whereNotNull('average_quality_score')->avg('average_quality_score'), 2),
            'on_time_completion_rate' => $totalCompleted > 0 ? round(($totalOnTime / $totalCompleted) * 100, 2) : 0,
            'total_minutes_worked' => $performances->sum('total_minutes_worked'),
            'task_breakdown' => [
                'rooms_cleaned' => $performances->sum('rooms_cleaned'),
                'inspections_completed' => $performances->sum('inspections_completed'),
                'maintenance_tasks' => $performances->sum('maintenance_tasks_completed'),
            ],
        ];
    }

    /**
     * Get performance comparison between multiple staff members.
     */
    public function getPerformanceComparison(array $userIds, string $startDate, string $endDate): array
    {
        $comparisons = [];

        foreach ($userIds as $userId) {
            $user = User::find($userId);
            if (!$user) continue;

            $summary = $this->getStaffPerformanceSummary($user, $startDate, $endDate);
            $comparisons[] = $summary;
        }

        // Sort by average efficiency descending
        usort($comparisons, function ($a, $b) {
            return $b['average_efficiency'] <=> $a['average_efficiency'];
        });

        return [
            'period' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
            'comparisons' => $comparisons,
        ];
    }
}
