<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use App\Models\Reservation;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Stay extends Model
{
    use HasFactory;
    use HasUuids;
    use SoftDeletes;

    protected $fillable = [
        'uuid',
        'reservation_id',
        'status',
        'actual_check_in',
        'actual_check_out',
        'assigned_room_id',
        'primary_guest_id',
        'checked_in_by',
        'checked_in_at',
        'check_in_notes',
        'checked_out_by',
        'checked_out_at',
        'check_out_notes',
        'room_assignments',
        'adult_count',
        'child_count',
        'id_document_type',
        'id_document_number',
        'id_document_issued_by',
        'id_document_expiry',
        'security_deposit_amount',
        'security_deposit_currency',
        'security_deposit_status',
        'key_card_number',
        'key_card_issued_at',
        'key_card_returned_at',
        'special_requests',
        'guest_preferences',
        'early_check_in_requested',
        'late_check_out_requested',
        'early_check_in_approved_at',
        'late_check_out_approved_at',
    ];

    protected $casts = [
        'actual_check_in' => 'datetime',
        'actual_check_out' => 'datetime',
        'checked_in_at' => 'datetime',
        'checked_out_at' => 'datetime',
        'id_document_expiry' => 'date',
        'key_card_issued_at' => 'datetime',
        'key_card_returned_at' => 'datetime',
        'room_assignments' => 'array',
        'guest_preferences' => 'array',
        'security_deposit_amount' => 'decimal:2',
        'early_check_in_requested' => 'boolean',
        'late_check_out_requested' => 'boolean',
        'early_check_in_approved_at' => 'datetime',
        'late_check_out_approved_at' => 'datetime',
        'adult_count' => 'integer',
        'child_count' => 'integer',
    ];

    public function uniqueIds(): array
    {
        return ['uuid'];
    }

    public function reservation(): BelongsTo
    {
        return $this->belongsTo(Reservation::class);
    }

    public function assignedRoom()
    {
        return $this->belongsTo(Room::class, 'assigned_room_id');
    }

    public function primaryGuest()
    {
        return $this->belongsTo(Guest::class, 'primary_guest_id');
    }

    public function checkedInBy()
    {
        return $this->belongsTo(User::class, 'checked_in_by');
    }

    public function checkedOutBy()
    {
        return $this->belongsTo(User::class, 'checked_out_by');
    }

    public function folios()
    {
        return $this->hasMany(Folio::class);
    }

    public function housekeepingTasks()
    {
        return $this->hasMany(HousekeepingTask::class, 'room_id', 'assigned_room_id');
    }

    /**
     * Check if the stay is currently checked in.
     */
    public function isCheckedIn(): bool
    {
        return $this->status === 'checked_in';
    }

    /**
     * Check if the stay is checked out.
     */
    public function isCheckedOut(): bool
    {
        return $this->status === 'checked_out';
    }

    /**
     * Check if the stay is expected (not yet checked in).
     */
    public function isExpected(): bool
    {
        return $this->status === 'expected';
    }

    /**
     * Get the total number of guests.
     */
    public function getTotalGuestsAttribute(): int
    {
        return $this->adult_count + $this->child_count;
    }

    /**
     * Check if security deposit is collected.
     */
    public function hasSecurityDeposit(): bool
    {
        return $this->security_deposit_status === 'collected';
    }

    /**
     * Check if key card is issued.
     */
    public function hasKeyCard(): bool
    {
        return !is_null($this->key_card_number) && is_null($this->key_card_returned_at);
    }

    /**
     * Get the current room assignment.
     */
    public function getCurrentRoom()
    {
        return $this->assignedRoom;
    }

    /**
     * Check if early check-in is approved.
     */
    public function isEarlyCheckInApproved(): bool
    {
        return !is_null($this->early_check_in_approved_at);
    }

    /**
     * Check if late check-out is approved.
     */
    public function isLateCheckOutApproved(): bool
    {
        return !is_null($this->late_check_out_approved_at);
    }

    /**
     * Scope for currently checked-in stays.
     */
    public function scopeCheckedIn($query)
    {
        return $query->where('status', 'checked_in');
    }

    /**
     * Scope for expected arrivals today.
     */
    public function scopeExpectedToday($query)
    {
        return $query->where('status', 'expected')
                    ->whereHas('reservation', function ($q) {
                        $q->whereDate('check_in', today());
                    });
    }

    /**
     * Scope for expected departures today.
     */
    public function scopeDepartingToday($query)
    {
        return $query->where('status', 'checked_in')
                    ->whereHas('reservation', function ($q) {
                        $q->whereDate('check_out', today());
                    });
    }
}
