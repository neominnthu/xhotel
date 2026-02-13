<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Guest extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'uuid',
        'property_id',
        'name',
        'first_name',
        'last_name',
        'email',
        'phone',
        'phone_country_code',
        'date_of_birth',
        'gender',
        'nationality',
        'id_type',
        'id_number',
        'passport_number',
        'id_card_number',
        'address',
        'city',
        'country',
        'postal_code',
        'company',
        'vip_status',
        'preferences',
        'special_requests',
        'notes',
        'is_blacklisted',
        'blacklist_reason',
        'last_visit_at',
        'total_stays',
        'total_spent',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'preferences' => 'array',
        'is_blacklisted' => 'boolean',
        'last_visit_at' => 'datetime',
        'total_stays' => 'integer',
        'total_spent' => 'integer',
        'phone' => 'string',
    ];

    protected static function booted(): void
    {
        static::creating(function (Guest $guest): void {
            if (! $guest->uuid) {
                $guest->uuid = (string) Str::uuid7();
            }
        });
    }

    public function getFullNameAttribute(): string
    {
        $fullName = trim(($this->first_name ?? '') . ' ' . ($this->last_name ?? ''));

        return $fullName !== '' ? $fullName : ($this->name ?? '');
    }

    public function getFormattedPhoneAttribute(): string
    {
        if (! $this->phone) {
            return '';
        }

        if (! $this->phone_country_code) {
            return $this->phone;
        }

        return '+' . $this->phone_country_code . ' ' . $this->phone;
    }

    public function isVip(): bool
    {
        return in_array($this->vip_status, ['vip', 'vvip']);
    }

    public function isBlacklisted(): bool
    {
        return $this->is_blacklisted;
    }

    public function stays(): HasMany
    {
        return $this->hasMany(Stay::class, 'primary_guest_id');
    }

    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class, 'guest_id');
    }

    public function folios(): HasMany
    {
        return $this->hasMany(Folio::class, 'guest_id');
    }

    public function scopeVip($query)
    {
        return $query->whereIn('vip_status', ['vip', 'vvip']);
    }

    public function scopeBlacklisted($query)
    {
        return $query->where('is_blacklisted', true);
    }

    public function scopeFrequent($query, $minStays = 3)
    {
        return $query->where('total_stays', '>=', $minStays);
    }

    public function scopeSearch($query, string $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
                ->orWhere('first_name', 'like', "%{$search}%")
                ->orWhere('last_name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%")
                ->orWhere('phone', 'like', "%{$search}%")
                ->orWhere('id_number', 'like', "%{$search}%")
                ->orWhere('passport_number', 'like', "%{$search}%")
                ->orWhere('id_card_number', 'like', "%{$search}%");
        });
    }
}
