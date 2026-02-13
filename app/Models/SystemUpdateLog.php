<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SystemUpdateLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'system_update_id',
        'level',
        'message',
        'context',
        'created_at',
    ];

    protected $casts = [
        'context' => 'array',
        'created_at' => 'datetime',
    ];

    public function systemUpdate(): BelongsTo
    {
        return $this->belongsTo(SystemUpdate::class, 'system_update_id');
    }
}
