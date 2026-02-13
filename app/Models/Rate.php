<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Rate extends Model
{
    use HasFactory;

    protected $fillable = [
        'property_id',
        'room_type_id',
        'name',
        'type',
        'start_date',
        'end_date',
        'rate',
        'min_stay',
        'days_of_week',
        'length_of_stay_min',
        'length_of_stay_max',
        'adjustment_type',
        'adjustment_value',
        'is_active',
        'conditions',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'is_active' => 'boolean',
        'conditions' => 'array',
        'days_of_week' => 'array',
    ];

    public function roomType(): BelongsTo
    {
        return $this->belongsTo(RoomType::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeForDateRange($query, $checkIn, $checkOut)
    {
        return $query->where(function ($q) use ($checkIn, $checkOut) {
            $q->where('start_date', '<=', $checkOut)
              ->where('end_date', '>=', $checkIn);
        });
    }

    public function scopeForRoomType($query, $roomTypeId)
    {
        return $query->where('room_type_id', $roomTypeId);
    }
}
