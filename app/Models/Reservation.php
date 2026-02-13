<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Reservation extends Model
{
    use HasFactory;
    use HasUuids;
    use SoftDeletes;

    protected $fillable = [
        'uuid',
        'property_id',
        'guest_id',
        'code',
        'status',
        'source',
        'check_in',
        'check_out',
        'room_type_id',
        'room_id',
        'adults',
        'children',
        'special_requests',
        'canceled_reason',
    ];

    protected $casts = [
        'check_in' => 'date',
        'check_out' => 'date',
    ];

    public function uniqueIds(): array
    {
        return ['uuid'];
    }

    public function guest()
    {
        return $this->belongsTo(Guest::class);
    }

    public function roomType()
    {
        return $this->belongsTo(RoomType::class);
    }

    public function room()
    {
        return $this->belongsTo(Room::class);
    }

    public function stay()
    {
        return $this->hasOne(Stay::class);
    }

    public function folios()
    {
        return $this->hasMany(Folio::class);
    }

    public function statusLogs()
    {
        return $this->hasMany(ReservationStatusLog::class)->latest('changed_at');
    }
}
