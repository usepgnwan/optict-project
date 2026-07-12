<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class StockTransfer extends Model
{
    public const STATUS_DRAFT = 'draft';
    public const STATUS_APPROVED = 'approved';
    public const STATUS_SHIPPED = 'shipped';
    public const STATUS_RECEIVED = 'received';
    public const STATUS_CANCELLED = 'cancelled';

    public const TYPE_CENTRAL = 'central';
    public const TYPE_BRANCH = 'branch';

    protected $fillable = [
        'transfer_number',
        'source_type',
        'source_branch_id',
        'destination_type',
        'destination_branch_id',
        'status',
        'notes',
        'created_by',
        'approved_by',
        'shipped_at',
        'received_at',
    ];

    protected function casts(): array
    {
        return [
            'shipped_at' => 'datetime',
            'received_at' => 'datetime',
        ];
    }

    public function items(): HasMany
    {
        return $this->hasMany(StockTransferItem::class);
    }

    public function sourceBranch(): BelongsTo
    {
        return $this->belongsTo(Branch::class, 'source_branch_id');
    }

    public function destinationBranch(): BelongsTo
    {
        return $this->belongsTo(Branch::class, 'destination_branch_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function getSourceNameAttribute(): string
    {
        if ($this->source_type === self::TYPE_CENTRAL) {
            return 'Gudang Pusat';
        }
        return $this->sourceBranch?->name ?? 'Unknown';
    }

    public function getDestinationNameAttribute(): string
    {
        if ($this->destination_type === self::TYPE_CENTRAL) {
            return 'Gudang Pusat';
        }
        return $this->destinationBranch?->name ?? 'Unknown';
    }

    public function canBeApproved(): bool
    {
        return $this->status === self::STATUS_DRAFT;
    }

    public function canBeShipped(): bool
    {
        return $this->status === self::STATUS_APPROVED;
    }

    public function canBeReceived(): bool
    {
        return $this->status === self::STATUS_SHIPPED;
    }

    public function canBeCancelled(): bool
    {
        return in_array($this->status, [self::STATUS_DRAFT, self::STATUS_APPROVED]);
    }

    public static function generateTransferNumber(): string
    {
        $prefix = 'TRF';
        $date = now()->format('Ymd');
        $lastTransfer = static::where('transfer_number', 'like', "{$prefix}-{$date}-%")
            ->orderByDesc('transfer_number')
            ->first();

        if ($lastTransfer) {
            $lastNumber = (int) substr($lastTransfer->transfer_number, -4);
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
            self::STATUS_APPROVED => 'Approved',
            self::STATUS_SHIPPED => 'Shipped',
            self::STATUS_RECEIVED => 'Received',
            self::STATUS_CANCELLED => 'Cancelled',
        ];
    }
}
