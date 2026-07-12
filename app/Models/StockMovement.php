<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StockMovement extends Model
{
    public const TYPE_TRANSFER_IN = 'transfer_in';
    public const TYPE_TRANSFER_OUT = 'transfer_out';
    public const TYPE_ADJUSTMENT = 'adjustment';
    public const TYPE_OPNAME = 'opname';
    public const TYPE_INITIAL = 'initial';

    protected $fillable = [
        'product_id',
        'location_type',
        'branch_id',
        'movement_type',
        'reference_type',
        'reference_id',
        'quantity_before',
        'quantity_change',
        'quantity_after',
        'notes',
        'user_id',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
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

    /**
     * Prevent deletion of stock movement records (business rule #5).
     */
    public function delete(): bool|null
    {
        throw new \RuntimeException('Stock movement records cannot be deleted.');
    }

    /**
     * Prevent mass update of stock movement records.
     */
    public static function boot(): void
    {
        parent::boot();

        static::updating(function () {
            throw new \RuntimeException('Stock movement records cannot be modified.');
        });

        static::deleting(function () {
            throw new \RuntimeException('Stock movement records cannot be deleted.');
        });
    }

    public static function getMovementTypes(): array
    {
        return [
            self::TYPE_TRANSFER_IN => 'Transfer Masuk',
            self::TYPE_TRANSFER_OUT => 'Transfer Keluar',
            self::TYPE_ADJUSTMENT => 'Penyesuaian',
            self::TYPE_OPNAME => 'Stock Opname',
            self::TYPE_INITIAL => 'Stok Awal',
        ];
    }
}
