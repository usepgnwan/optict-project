<?php

namespace App\Services;

use App\Models\BranchInventory;
use App\Models\CentralInventory;
use App\Models\StockMovement;
use Illuminate\Support\Facades\DB;

class StockService
{
    /**
     * Update central warehouse stock and create a movement record.
     *
     * @throws \RuntimeException if stock would become negative
     */
    public function updateCentralStock(
        int $productId,
        int $quantityChange,
        string $movementType,
        int $userId,
        ?string $referenceType = null,
        ?int $referenceId = null,
        ?string $notes = null,
    ): StockMovement {
        return DB::transaction(function () use ($productId, $quantityChange, $movementType, $userId, $referenceType, $referenceId, $notes) {
            $inventory = CentralInventory::lockForUpdate()->firstOrCreate(
                ['product_id' => $productId],
                ['quantity' => 0]
            );

            $before = $inventory->quantity;
            $after = $before + $quantityChange;

            if ($after < 0) {
                throw new \RuntimeException(
                    "Stok gudang pusat tidak boleh negatif. Stok saat ini: {$before}, perubahan: {$quantityChange}"
                );
            }

            $inventory->update(['quantity' => $after]);

            return StockMovement::create([
                'product_id' => $productId,
                'location_type' => 'central',
                'branch_id' => null,
                'movement_type' => $movementType,
                'reference_type' => $referenceType,
                'reference_id' => $referenceId,
                'quantity_before' => $before,
                'quantity_change' => $quantityChange,
                'quantity_after' => $after,
                'notes' => $notes,
                'user_id' => $userId,
            ]);
        });
    }

    /**
     * Update branch stock and create a movement record.
     *
     * @throws \RuntimeException if stock would become negative
     */
    public function updateBranchStock(
        int $branchId,
        int $productId,
        int $quantityChange,
        string $movementType,
        int $userId,
        ?string $referenceType = null,
        ?int $referenceId = null,
        ?string $notes = null,
    ): StockMovement {
        return DB::transaction(function () use ($branchId, $productId, $quantityChange, $movementType, $userId, $referenceType, $referenceId, $notes) {
            $inventory = BranchInventory::lockForUpdate()->firstOrCreate(
                ['branch_id' => $branchId, 'product_id' => $productId],
                ['current_stock' => 0, 'minimum_stock' => 0, 'reserved_stock' => 0]
            );

            $before = $inventory->current_stock;
            $after = $before + $quantityChange;

            if ($after < 0) {
                throw new \RuntimeException(
                    "Stok cabang tidak boleh negatif. Stok saat ini: {$before}, perubahan: {$quantityChange}"
                );
            }

            $inventory->update(['current_stock' => $after]);

            return StockMovement::create([
                'product_id' => $productId,
                'location_type' => 'branch',
                'branch_id' => $branchId,
                'movement_type' => $movementType,
                'reference_type' => $referenceType,
                'reference_id' => $referenceId,
                'quantity_before' => $before,
                'quantity_change' => $quantityChange,
                'quantity_after' => $after,
                'notes' => $notes,
                'user_id' => $userId,
            ]);
        });
    }

    /**
     * Get current stock for a product at a location.
     */
    public function getStock(int $productId, string $locationType, ?int $branchId = null): int
    {
        if ($locationType === 'central') {
            return CentralInventory::where('product_id', $productId)->value('quantity') ?? 0;
        }

        return BranchInventory::where('branch_id', $branchId)
            ->where('product_id', $productId)
            ->value('current_stock') ?? 0;
    }
}
