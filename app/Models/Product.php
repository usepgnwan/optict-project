<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Product extends Model
{
    public const CATEGORY_FRAME = 'frame';
    public const CATEGORY_LENS = 'lens';
    public const CATEGORY_ACCESSORY = 'accessory';
    public const CATEGORY_PACKAGE = 'package';

    public const FRAME_FULL = 'full_frame';
    public const FRAME_HALF = 'half_frame';
    public const FRAME_RIMLESS = 'rimless';

    public const LENS_SINGLE_VISION = 'single_vision';
    public const LENS_BIFOCAL = 'bifocal';
    public const LENS_PROGRESSIVE = 'progressive';
    public const LENS_PHOTOCHROMIC = 'photochromic';

    protected $fillable = [
        'sku',
        'barcode',
        'name',
        'brand',
        'category',
        'frame_type',
        'frame_color',
        'lens_type',
        'selling_price',
        'cost_price',
        'description',
        'commission_type',
        'commission_amount',
        'image_path',
        'is_active',
    ];

    protected $appends = [
        'image_url',
    ];

    protected function casts(): array
    {
        return [
            'selling_price' => 'decimal:2',
            'cost_price' => 'decimal:2',
            'commission_amount' => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }

    public function getImageUrlAttribute(): ?string
    {
        if ($this->image_path) {
            return '/storage/' . $this->image_path;
        }
        return null;
    }

    public function centralInventory(): HasOne
    {
        return $this->hasOne(CentralInventory::class);
    }

    public function branchInventories(): HasMany
    {
        return $this->hasMany(BranchInventory::class);
    }

    public function stockMovements(): HasMany
    {
        return $this->hasMany(StockMovement::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function getFormattedSellingPriceAttribute(): string
    {
        return 'Rp ' . number_format($this->selling_price, 0, ',', '.');
    }

    public function getFormattedCostPriceAttribute(): string
    {
        return 'Rp ' . number_format($this->cost_price, 0, ',', '.');
    }

    public function getTotalStockAttribute(): int
    {
        $centralStock = $this->centralInventory?->quantity ?? 0;
        $branchStock = $this->branchInventories()->sum('current_stock');
        return $centralStock + $branchStock;
    }

    public static function getCategories(): array
    {
        return [
            self::CATEGORY_FRAME => 'Frame',
            self::CATEGORY_LENS => 'Lens',
            self::CATEGORY_ACCESSORY => 'Accessory',
            self::CATEGORY_PACKAGE => 'Package',
        ];
    }

    public static function getFrameTypes(): array
    {
        return [
            self::FRAME_FULL => 'Full Frame',
            self::FRAME_HALF => 'Half Frame',
            self::FRAME_RIMLESS => 'Rimless',
        ];
    }

    public static function getLensTypes(): array
    {
        return [
            self::LENS_SINGLE_VISION => 'Single Vision',
            self::LENS_BIFOCAL => 'Bifocal',
            self::LENS_PROGRESSIVE => 'Progressive',
            self::LENS_PHOTOCHROMIC => 'Photochromic',
        ];
    }
}
