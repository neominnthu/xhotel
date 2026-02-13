<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class RoomType extends Model
{
    use HasFactory;
    use HasUuids;
    use SoftDeletes;

    protected $fillable = [
        'uuid',
        'property_id',
        'name',
        'capacity',
        'overbooking_limit',
        'base_rate',
        'amenities_json',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'name' => 'array',
        'amenities_json' => 'array',
        'is_active' => 'boolean',
    ];

    public function uniqueIds(): array
    {
        return ['uuid'];
    }
}
