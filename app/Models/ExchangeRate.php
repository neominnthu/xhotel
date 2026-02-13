<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class ExchangeRate extends Model
{
    /** @use HasFactory<\Database\Factories\ExchangeRateFactory> */
    use HasFactory;

    use HasUuids;
    use SoftDeletes;

    protected $fillable = [
        'uuid',
        'property_id',
        'base_currency',
        'quote_currency',
        'rate',
        'effective_date',
        'source',
        'is_active',
    ];

    protected $casts = [
        'rate' => 'decimal:6',
        'effective_date' => 'date',
        'is_active' => 'boolean',
    ];

    public function uniqueIds(): array
    {
        return ['uuid'];
    }

    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }
}
