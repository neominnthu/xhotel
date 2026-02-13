<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SystemUpdate extends Model
{
    use HasFactory;

    protected $fillable = [
        'property_id',
        'initiated_by',
        'backup_id',
        'status',
        'version_from',
        'version_to',
        'release_tag',
        'release_url',
        'started_at',
        'completed_at',
        'failed_at',
        'rollback_started_at',
        'rollback_completed_at',
        'error_code',
        'error_message',
        'meta',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
        'failed_at' => 'datetime',
        'rollback_started_at' => 'datetime',
        'rollback_completed_at' => 'datetime',
        'meta' => 'array',
    ];

    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }

    public function initiatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'initiated_by');
    }

    public function backup(): BelongsTo
    {
        return $this->belongsTo(SystemBackup::class, 'backup_id');
    }

    public function logs(): HasMany
    {
        return $this->hasMany(SystemUpdateLog::class, 'system_update_id');
    }
}
