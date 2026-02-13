<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Refund extends Model
{
    /** @use HasFactory<\Database\Factories\RefundFactory> */
    use HasFactory;

    use HasUuids;
    use SoftDeletes;

    protected $fillable = [
        'uuid',
        'folio_id',
        'payment_id',
        'method',
        'amount',
        'currency',
        'exchange_rate',
        'folio_amount',
        'status',
        'reference',
        'reason',
        'approved_at',
        'requested_by',
        'approved_by',
        'refunded_at',
    ];

    protected $casts = [
        'exchange_rate' => 'decimal:6',
        'approved_at' => 'datetime',
        'refunded_at' => 'datetime',
    ];

    public function uniqueIds(): array
    {
        return ['uuid'];
    }

    public function folio(): BelongsTo
    {
        return $this->belongsTo(Folio::class);
    }

    public function payment(): BelongsTo
    {
        return $this->belongsTo(Payment::class);
    }

    public function requestedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'requested_by');
    }

    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}
