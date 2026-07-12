<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class StockOpname extends Model
{
    public const STATUS_DRAFT = 'draft';
    public const STATUS_COUNTING = 'counting';
    public const STATUS_COMPARING = 'comparing';
    public const STATUS_APPROVED = 'approved';
    public const STATUS_COMPLETED = 'completed';

    protected $fillable = [
        'opname_number',
        'location_type',
        'branch_id',
        'status',
        'notes',
        'created_by',
        'approved_by',
        'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'completed_at' => 'datetime',
        ];
    }

    public function items(): HasMany
    {
        return $this->hasMany(StockOpnameItem::class);
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function getLocationNameAttribute(): string
    {
        if ($this->location_type === 'central') {
            return 'Gudang Pusat';
        }
        return $this->branch?->name ?? 'Unknown';
    }

    public static function generateOpnameNumber(): string
    {
        $prefix = 'OPN';
        $date = now()->format('Ymd');
        $last = static::where('opname_number', 'like', "{$prefix}-{$date}-%")
            ->orderByDesc('opname_number')
            ->first();

        if ($last) {
            $lastNumber = (int) substr($last->opname_number, -4);
            $nextNumber = str_pad($lastNumber + 1, 4, '0', STR_PAD_LEFT);
        } else {
            $nextNumber = '0001';
        }

        return "{$prefix}-{$date}-{$nextNumber}";
    }

    public static function getStatuses(): array
    {
        return [
            self::STATUS_DRAFT => 'Draft',
            self::STATUS_COUNTING => 'Counting',
            self::STATUS_COMPARING => 'Comparing',
            self::STATUS_APPROVED => 'Approved',
            self::STATUS_COMPLETED => 'Completed',
        ];
    }
}
