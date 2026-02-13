<?php

namespace App\Models;

use App\Models\Room;
use App\Models\User;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class HousekeepingTask extends Model
{
    use HasFactory;
    use HasUuids;
    use SoftDeletes;

    protected $fillable = [
        'uuid',
        'room_id',
        'type',
        'status',
        'assigned_to',
        'due_at',
        'priority',
        'completed_at',
        'started_at',
        'estimated_duration_minutes',
        'actual_duration_minutes',
        'quality_score',
        'completion_notes',
        'completed_by',
        'quality_reviewed_at',
        'quality_reviewed_by',
        'maintenance_category',
        'maintenance_description',
        'reported_by_name',
        'reported_by_contact',
        'maintenance_photos',
        'estimated_cost',
        'approved_by',
        'approved_at',
        'vendor_assigned',
        'actual_cost',
        'resolution_notes',
    ];

    protected $casts = [
        'due_at' => 'datetime',
        'completed_at' => 'datetime',
        'started_at' => 'datetime',
        'quality_reviewed_at' => 'datetime',
        'approved_at' => 'datetime',
        'estimated_cost' => 'decimal:2',
        'actual_cost' => 'decimal:2',
        'quality_score' => 'decimal:1',
        'maintenance_photos' => 'array',
    ];

    public function uniqueIds(): array
    {
        return ['uuid'];
    }

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }

    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function completedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'completed_by');
    }

    public function qualityReviewedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'quality_reviewed_by');
    }

    public function scopeOverdue($query)
    {
        return $query->whereNotNull('due_at')
            ->whereDate('due_at', '<', today())
            ->where('status', '!=', 'completed');
    }

    public function scopeHighPriority($query)
    {
        return $query->where('priority', 'high');
    }

    public function isOverdue(): bool
    {
        return $this->due_at && $this->due_at->isPast() && $this->status !== 'completed';
    }

    public function getSlaStatus(): string
    {
        if ($this->status === 'completed') {
            return 'completed';
        }

        if ($this->isOverdue()) {
            return 'overdue';
        }

        if ($this->priority === 'urgent' || $this->priority === 'critical') {
            return 'urgent';
        }

        $hoursUntilDue = $this->due_at ? now()->diffInHours($this->due_at, false) : null;
        if ($hoursUntilDue !== null && $hoursUntilDue <= 2) {
            return 'due_soon';
        }

        return 'normal';
    }

    /**
     * Check if task was completed on time.
     */
    public function isCompletedOnTime(): bool
    {
        if ($this->status !== 'completed' || !$this->completed_at || !$this->due_at) {
            return false;
        }

        return $this->completed_at->lte($this->due_at);
    }

    /**
     * Calculate actual duration in minutes.
     */
    public function getActualDuration(): ?int
    {
        if (!$this->started_at || !$this->completed_at) {
            return null;
        }

        return $this->started_at->diffInMinutes($this->completed_at);
    }

    /**
     * Check if task is maintenance type.
     */
    public function isMaintenanceTask(): bool
    {
        return $this->type === 'maintenance';
    }

    /**
     * Get maintenance priority level.
     */
    public function getMaintenancePriorityLevel(): int
    {
        return match($this->priority) {
            'critical' => 5,
            'urgent' => 4,
            'high' => 3,
            'normal' => 2,
            'low' => 1,
            default => 2,
        };
    }

    /**
     * Mark task as started.
     */
    public function markAsStarted(): void
    {
        if (!$this->started_at) {
            $this->update(['started_at' => now()]);
        }
    }

    /**
     * Mark task as completed with performance data.
     */
    public function markAsCompleted(?User $completedBy = null, ?int $actualDuration = null, ?string $notes = null): void
    {
        $updateData = [
            'status' => 'completed',
            'completed_at' => now(),
            'completed_by' => $completedBy?->id,
            'completion_notes' => $notes,
        ];

        if ($actualDuration !== null) {
            $updateData['actual_duration_minutes'] = $actualDuration;
        } elseif ($this->started_at) {
            $updateData['actual_duration_minutes'] = $this->getActualDuration();
        }

        $this->update($updateData);
    }

    /**
     * Add quality review.
     */
    public function addQualityReview(float $score, ?User $reviewedBy = null): void
    {
        $this->update([
            'quality_score' => $score,
            'quality_reviewed_at' => now(),
            'quality_reviewed_by' => $reviewedBy?->id,
        ]);
    }
}
