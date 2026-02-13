<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReportDailyKpi extends Model
{
    /** @use HasFactory<\Database\Factories\ReportDailyKpiFactory> */
    use HasFactory;

    protected $fillable = [
        'property_id',
        'report_date',
        'total_rooms',
        'occupied_rooms',
        'room_nights',
        'total_revenue',
        'adr',
        'revpar',
        'currency',
    ];

    protected $casts = [
        'report_date' => 'date',
    ];

    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }
}
