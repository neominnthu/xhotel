<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Property extends Model
{
    use HasFactory;
    use HasUuids;
    use SoftDeletes;

    protected $fillable = [
        'uuid',
        'name',
        'address',
        'timezone',
        'default_currency',
        'default_language',
        'receipt_header',
        'tax_id',
        'phone',
    ];

    public function uniqueIds(): array
    {
        return ['uuid'];
    }
}
