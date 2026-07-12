<?php

namespace App\Services;

use App\Models\AuditLog;
use App\Models\StockTransfer;
use App\Models\StockTransferItem;
use Illuminate\Support\Facades\DB;

class TransferService
{
    public function __construct(
        protected StockService $stockService,
    ) {}

    /**
     * Create a new transfer with items.
     */
    public function createTransfer(array $data, array $items, int $userId): StockTransfer
    {
        return DB::transaction(function () use ($data, $items, $userId) {
            $transfer = StockTransfer::create([
                'transfer_number' => StockTransfer::generateTransferNumber(),
                'source_type' => $data['source_type'],
                'source_branch_id' => $data['source_branch_id'] ?? null,
                'destination_type' => $data['destination_type'],
                'destination_branch_id' => $data['destination_branch_id'] ?? null,
                'status' => StockTransfer::STATUS_DRAFT,
                'notes' => $data['notes'] ?? null,
                'created_by' => $userId,
            ]);

            foreach ($items as $item) {
                StockTransferItem::create([
                    'stock_transfer_id' => $transfer->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                ]);
            }

            AuditLog::log('created', StockTransfer::class, $transfer->id, null, $transfer->toArray());

            return $transfer->load('items.product');
        });
    }

    /**
     * Approve a transfer (Manager/Super Admin only).
     */
    public function approve(StockTransfer $transfer, int $userId): StockTransfer
    {
        if (!$transfer->canBeApproved()) {
            throw new \RuntimeException('Transfer ini tidak dapat disetujui dari status saat ini.');
        }

        $old = $transfer->toArray();
        $transfer->update([
            'status' => StockTransfer::STATUS_APPROVED,
            'approved_by' => $userId,
        ]);

        AuditLog::log('status_changed', StockTransfer::class, $transfer->id, $old, $transfer->fresh()->toArray());

        return $transfer->fresh();
    }

    /**
     * Mark transfer as shipped.
     */
    public function ship(StockTransfer $transfer): StockTransfer
    {
        if (!$transfer->canBeShipped()) {
            throw new \RuntimeException('Transfer ini belum disetujui untuk dikirim.');
        }

        $old = $transfer->toArray();
        $transfer->update([
            'status' => StockTransfer::STATUS_SHIPPED,
            'shipped_at' => now(),
        ]);

        AuditLog::log('status_changed', StockTransfer::class, $transfer->id, $old, $transfer->fresh()->toArray());

        return $transfer->fresh();
    }

    /**
     * Receive a transfer — update both sender and receiver inventory.
     */
    public function receive(StockTransfer $transfer, int $userId): StockTransfer
    {
        if (!$transfer->canBeReceived()) {
            throw new \RuntimeException('Transfer ini belum dikirim.');
        }

        return DB::transaction(function () use ($transfer, $userId) {
            $old = $transfer->toArray();
            $transfer->update([
                'status' => StockTransfer::STATUS_RECEIVED,
                'received_at' => now(),
            ]);

            // Process each item: deduct from source, add to destination
            foreach ($transfer->items as $item) {
                // Deduct from source
                if ($transfer->source_type === 'central') {
                    $this->stockService->updateCentralStock(
                        $item->product_id,
                        -$item->quantity,
                        'transfer_out',
                        $userId,
                        StockTransfer::class,
                        $transfer->id,
                        "Transfer keluar ke {$transfer->destination_name} ({$transfer->transfer_number})"
                    );
                } else {
                    $this->stockService->updateBranchStock(
                        $transfer->source_branch_id,
                        $item->product_id,
                        -$item->quantity,
                        'transfer_out',
                        $userId,
                        StockTransfer::class,
                        $transfer->id,
                        "Transfer keluar ke {$transfer->destination_name} ({$transfer->transfer_number})"
                    );
                }

                // Add to destination
                if ($transfer->destination_type === 'central') {
                    $this->stockService->updateCentralStock(
                        $item->product_id,
                        $item->quantity,
                        'transfer_in',
                        $userId,
                        StockTransfer::class,
                        $transfer->id,
                        "Transfer masuk dari {$transfer->source_name} ({$transfer->transfer_number})"
                    );
                } else {
                    $this->stockService->updateBranchStock(
                        $transfer->destination_branch_id,
                        $item->product_id,
                        $item->quantity,
                        'transfer_in',
                        $userId,
                        StockTransfer::class,
                        $transfer->id,
                        "Transfer masuk dari {$transfer->source_name} ({$transfer->transfer_number})"
                    );
                }
            }

            AuditLog::log('status_changed', StockTransfer::class, $transfer->id, $old, $transfer->fresh()->toArray());

            return $transfer->fresh();
        });
    }

    /**
     * Cancel a transfer.
     */
    public function cancel(StockTransfer $transfer, int $userId): StockTransfer
    {
        if (!$transfer->canBeCancelled()) {
            throw new \RuntimeException('Transfer ini tidak dapat dibatalkan dari status saat ini.');
        }

        $old = $transfer->toArray();
        $transfer->update([
            'status' => StockTransfer::STATUS_CANCELLED,
        ]);

        AuditLog::log('status_changed', StockTransfer::class, $transfer->id, $old, $transfer->fresh()->toArray());

        return $transfer->fresh();
    }
}
