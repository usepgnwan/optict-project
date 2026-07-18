<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Reservation extends Model
{
    protected $fillable = [
        'reservation_number',
        'reservation_type',
        'branch_id',
        'customer_id',
        'customer_name',
        'customer_phone',
        'reservation_date',
        'reservation_time',
        'assigned_staff_id',
        'status',
        'affiliate_code',
        'notes',
    ];

    protected $appends = ['display_name', 'display_phone'];

    public function getDisplayNameAttribute(): string
    {
        return $this->customer?->full_name ?: ($this->customer_name ?: 'Tamu / Walk In');
    }

    public function getDisplayPhoneAttribute(): string
    {
        return $this->customer?->phone_number ?: ($this->customer_phone ?: '-');
    }

    protected function casts(): array
    {
        return [
            'reservation_date' => 'date',
        ];
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function assignedStaff(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_staff_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(ReservationItem::class);
    }

    public function scopeForBranch($query, $branchId)
    {
        return $query->where('branch_id', $branchId);
    }
}
