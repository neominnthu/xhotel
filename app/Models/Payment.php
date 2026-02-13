<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    use HasFactory;
    use HasUuids;
    use SoftDeletes;

    protected $fillable = [
        'uuid',
        'folio_id',
        'method',
        'amount',
        'currency',
        'exchange_rate',
        'reference',
        'received_at',
        'created_by',
        'card_last_four',
        'card_type',
        'bank_details',
        'wallet_type',
        'check_number',
    ];

    protected $casts = [
        'received_at' => 'datetime',
        'exchange_rate' => 'decimal:6',
    ];

    public function uniqueIds(): array
    {
        return ['uuid'];
    }

    public function folio(): BelongsTo
    {
        return $this->belongsTo(Folio::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
