<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class HousekeepingPerformance extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'performance_date',
        'tasks_assigned',
        'tasks_completed',
        'tasks_completed_on_time',
        'tasks_overdue',
        'average_quality_score',
        'total_minutes_worked',
        'rooms_cleaned',
        'inspections_completed',
        'maintenance_tasks_completed',
        'efficiency_rating',
        'performance_metadata',
    ];

    protected $casts = [
        'performance_date' => 'date',
        'average_quality_score' => 'decimal:2',
        'efficiency_rating' => 'decimal:2',
        'performance_metadata' => 'array',
    ];

    /**
     * Get the user that this performance record belongs to.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Calculate the completion rate.
     */
    public function getCompletionRateAttribute(): float
    {
        if ($this->tasks_assigned === 0) {
            return 0.0;
        }

        return round(($this->tasks_completed / $this->tasks_assigned) * 100, 2);
    }

    /**
     * Calculate the on-time completion rate.
     */
    public function getOnTimeRateAttribute(): float
    {
        if ($this->tasks_completed === 0) {
            return 0.0;
        }

        return round(($this->tasks_completed_on_time / $this->tasks_completed) * 100, 2);
    }

    /**
     * Calculate the overdue rate.
     */
    public function getOverdueRateAttribute(): float
    {
        if ($this->tasks_assigned === 0) {
            return 0.0;
        }

        return round(($this->tasks_overdue / $this->tasks_assigned) * 100, 2);
    }

    /**
     * Calculate average minutes per task.
     */
    public function getAverageMinutesPerTaskAttribute(): ?float
    {
        if ($this->tasks_completed === 0 || $this->total_minutes_worked === 0) {
            return null;
        }

        return round($this->total_minutes_worked / $this->tasks_completed, 2);
    }

    /**
     * Get performance rating based on metrics.
     */
    public function getPerformanceRatingAttribute(): string
    {
        $completionRate = $this->completion_rate;
        $onTimeRate = $this->on_time_rate;
        $qualityScore = $this->average_quality_score;

        if ($completionRate >= 95 && $onTimeRate >= 90 && $qualityScore >= 4.5) {
            return 'excellent';
        } elseif ($completionRate >= 85 && $onTimeRate >= 80 && $qualityScore >= 4.0) {
            return 'good';
        } elseif ($completionRate >= 75 && $onTimeRate >= 70 && $qualityScore >= 3.5) {
            return 'satisfactory';
        } elseif ($completionRate >= 60 && $onTimeRate >= 50) {
            return 'needs_improvement';
        } else {
            return 'poor';
        }
    }

    /**
     * Scope for date range.
     */
    public function scopeDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('performance_date', [$startDate, $endDate]);
    }

    /**
     * Scope for specific user.
     */
    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Scope for high performers.
     */
    public function scopeHighPerformers($query, $minRating = 4.0)
    {
        return $query->where('average_quality_score', '>=', $minRating)
                    ->whereRaw('tasks_completed >= tasks_assigned * 0.9');
    }
}
