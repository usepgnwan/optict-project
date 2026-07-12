<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StockAdjustment extends Model
{
    public const REASON_LOST = 'lost';
    public const REASON_BROKEN = 'broken';
    public const REASON_DAMAGED = 'damaged';
    public const REASON_STOCK_OPNAME = 'stock_opname';
    public const REASON_OTHER = 'other';

    protected $fillable = [
        'adjustment_number',
        'location_type',
        'branch_id',
        'product_id',
        'reason',
        'before_stock',
        'adjustment_qty',
        'after_stock',
        'notes',
        'user_id',
    ];

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getLocationNameAttribute(): string
    {
        if ($this->location_type === 'central') {
            return 'Gudang Pusat';
        }
        return $this->branch?->name ?? 'Unknown';
    }

    public static function generateAdjustmentNumber(): string
    {
        $prefix = 'ADJ';
        $date = now()->format('Ymd');
        $last = static::where('adjustment_number', 'like', "{$prefix}-{$date}-%")
            ->orderByDesc('adjustment_number')
            ->first();

        if ($last) {
            $lastNumber = (int) substr($last->adjustment_number, -4);
            $nextNumber = str_pad($lastNumber + 1, 4, '0', STR_PAD_LEFT);
        } else {
            $nextNumber = '0001';
        }

        return "{$prefix}-{$date}-{$nextNumber}";
    }

    public static function getReasons(): array
    {
        return [
            self::REASON_LOST => 'Hilang',
            self::REASON_BROKEN => 'Rusak',
            self::REASON_DAMAGED => 'Cacat',
            self::REASON_STOCK_OPNAME => 'Stock Opname',
            self::REASON_OTHER => 'Lainnya',
        ];
    }
}
