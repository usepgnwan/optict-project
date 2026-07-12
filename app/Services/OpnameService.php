<?php

namespace App\Services;

use App\Models\AuditLog;
use App\Models\BranchInventory;
use App\Models\CentralInventory;
use App\Models\StockAdjustment;
use App\Models\StockOpname;
use App\Models\StockOpnameItem;
use Illuminate\Support\Facades\DB;

class OpnameService
{
    public function __construct(
        protected StockService $stockService,
    ) {}

    /**
     * Create a new stock opname and populate items with current system stock.
     */
    public function create(array $data, int $userId): StockOpname
    {
        return DB::transaction(function () use ($data, $userId) {
            $opname = StockOpname::create([
                'opname_number' => StockOpname::generateOpnameNumber(),
                'location_type' => $data['location_type'],
                'branch_id' => $data['branch_id'] ?? null,
                'status' => StockOpname::STATUS_DRAFT,
                'notes' => $data['notes'] ?? null,
                'created_by' => $userId,
            ]);

            // Populate items with all products at this location
            if ($data['location_type'] === 'central') {
                $inventories = CentralInventory::with('product')->get();
                foreach ($inventories as $inv) {
                    StockOpnameItem::create([
                        'stock_opname_id' => $opname->id,
                        'product_id' => $inv->product_id,
                        'system_stock' => $inv->quantity,
                    ]);
                }
            } else {
                $inventories = BranchInventory::where('branch_id', $data['branch_id'])->with('product')->get();
                foreach ($inventories as $inv) {
                    StockOpnameItem::create([
                        'stock_opname_id' => $opname->id,
                        'product_id' => $inv->product_id,
                        'system_stock' => $inv->current_stock,
                    ]);
                }
            }

            AuditLog::log('created', StockOpname::class, $opname->id);

            return $opname->load('items.product');
        });
    }

    /**
     * Start counting — change status to counting.
     */
    public function startCounting(StockOpname $opname): StockOpname
    {
        if ($opname->status !== StockOpname::STATUS_DRAFT) {
            throw new \RuntimeException('Stock opname harus berstatus draft untuk mulai penghitungan.');
        }

        $opname->update(['status' => StockOpname::STATUS_COUNTING]);
        return $opname->fresh();
    }

    /**
     * Update physical stock counts for items.
     */
    public function updateCounts(StockOpname $opname, array $counts): StockOpname
    {
        if (!in_array($opname->status, [StockOpname::STATUS_COUNTING, StockOpname::STATUS_COMPARING])) {
            throw new \RuntimeException('Stock opname harus dalam tahap penghitungan.');
        }

        DB::transaction(function () use ($opname, $counts) {
            foreach ($counts as $itemId => $physicalStock) {
                $item = StockOpnameItem::where('stock_opname_id', $opname->id)
                    ->where('id', $itemId)
                    ->first();

                if ($item) {
                    $item->update([
                        'physical_stock' => (int) $physicalStock,
                        'difference' => (int) $physicalStock - $item->system_stock,
                    ]);
                }
            }

            $opname->update(['status' => StockOpname::STATUS_COMPARING]);
        });

        return $opname->fresh()->load('items.product');
    }

    /**
     * Approve opname and auto-generate adjustments for differences.
     */
    public function approve(StockOpname $opname, int $userId): StockOpname
    {
        if ($opname->status !== StockOpname::STATUS_COMPARING) {
            throw new \RuntimeException('Stock opname harus dalam tahap perbandingan untuk disetujui.');
        }

        return DB::transaction(function () use ($opname, $userId) {
            // Process items with differences
            $itemsWithDiff = $opname->items()->where('difference', '!=', 0)->whereNotNull('difference')->get();

            foreach ($itemsWithDiff as $item) {
                // Create stock adjustment
                $adjustment = StockAdjustment::create([
                    'adjustment_number' => StockAdjustment::generateAdjustmentNumber(),
                    'location_type' => $opname->location_type,
                    'branch_id' => $opname->branch_id,
                    'product_id' => $item->product_id,
                    'reason' => StockAdjustment::REASON_STOCK_OPNAME,
                    'before_stock' => $item->system_stock,
                    'adjustment_qty' => $item->difference,
                    'after_stock' => $item->physical_stock,
                    'notes' => "Auto-adjustment dari Stock Opname {$opname->opname_number}",
                    'user_id' => $userId,
                ]);

                // Update actual stock
                if ($opname->location_type === 'central') {
                    $this->stockService->updateCentralStock(
                        $item->product_id,
                        $item->difference,
                        'opname',
                        $userId,
                        StockOpname::class,
                        $opname->id,
                        "Penyesuaian Stock Opname {$opname->opname_number}"
                    );
                } else {
                    $this->stockService->updateBranchStock(
                        $opname->branch_id,
                        $item->product_id,
                        $item->difference,
                        'opname',
                        $userId,
                        StockOpname::class,
                        $opname->id,
                        "Penyesuaian Stock Opname {$opname->opname_number}"
                    );
                }
            }

            $opname->update([
                'status' => StockOpname::STATUS_COMPLETED,
                'approved_by' => $userId,
                'completed_at' => now(),
            ]);

            AuditLog::log('approved', StockOpname::class, $opname->id);

            return $opname->fresh()->load('items.product');
        });
    }
}
