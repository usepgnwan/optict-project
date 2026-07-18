<?php

namespace App\Services;

use App\Models\AuditLog;
use App\Models\BranchInventory;
use App\Models\Payment;
use App\Models\Reservation;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\StockMovement;
use Illuminate\Support\Facades\DB;

class POSService
{
    /**
     * Complete a POS cashier transaction (Option A or Option B).
     */
    public function checkout(array $data): Sale
    {
        return DB::transaction(function () use ($data) {
            $invoiceNumber = $data['invoice_number'] ?? $this->generateInvoiceNumber($data['branch_id']);

            $sale = Sale::create([
                'invoice_number' => $invoiceNumber,
                'customer_id' => $data['customer_id'] ?? null,
                'walkin_name' => $data['walkin_name'] ?? null,
                'walkin_phone' => $data['walkin_phone'] ?? null,
                'cashier_id' => $data['cashier_id'] ?? null,
                'branch_id' => $data['branch_id'],
                'reservation_id' => $data['reservation_id'] ?? null,
                'subtotal_products' => $data['subtotal_products'] ?? 0,
                'subtotal_services' => $data['subtotal_services'] ?? 0,
                'discount_amount' => $data['discount_amount'] ?? 0,
                'tax_amount' => $data['tax_amount'] ?? 0,
                'grand_total' => $data['grand_total'] ?? 0,
                'paid_amount' => $data['paid_amount'] ?? 0,
                'change_amount' => $data['change_amount'] ?? 0,
                'affiliate_code' => $data['affiliate_code'] ?? null,
                'status' => 'completed',
            ]);

            // 1. Create Sale Items & Deduct Branch Inventory for Products
            if (!empty($data['items'])) {
                foreach ($data['items'] as $item) {
                    SaleItem::create([
                        'sale_id' => $sale->id,
                        'item_type' => $item['item_type'], // 'service' or 'product'
                        'service_id' => $item['service_id'] ?? null,
                        'product_id' => $item['product_id'] ?? null,
                        'item_name' => $item['item_name'],
                        'qty' => $item['qty'] ?? 1,
                        'unit_price' => $item['unit_price'] ?? 0,
                        'discount' => $item['discount'] ?? 0,
                        'subtotal' => $item['subtotal'] ?? 0,
                    ]);

                    // Deduct stock if item is a product
                    if ($item['item_type'] === 'product' && !empty($item['product_id'])) {
                        $inv = BranchInventory::firstOrCreate(
                            [
                                'branch_id' => $data['branch_id'],
                                'product_id' => $item['product_id'],
                            ],
                            ['current_stock' => 0]
                        );

                        $qtySold = intval($item['qty'] ?? 1);
                        $qtyBefore = (int) $inv->current_stock;
                        $inv->decrement('current_stock', $qtySold);
                        $qtyAfter = (int) $inv->fresh()->current_stock;

                        // Record stock movement
                        StockMovement::create([
                            'product_id' => $item['product_id'],
                            'location_type' => 'branch',
                            'branch_id' => $data['branch_id'],
                            'movement_type' => 'sale',
                            'reference_type' => Sale::class,
                            'reference_id' => $sale->id,
                            'quantity_before' => $qtyBefore,
                            'quantity_change' => -$qtySold,
                            'quantity_after' => $qtyAfter,
                            'notes' => 'POS Sale Invoice ' . $invoiceNumber,
                            'user_id' => auth()->id() ?? 1,
                        ]);
                    }
                }
            }

            // 2. Create Multiple/Split Payment Records
            if (!empty($data['payments'])) {
                foreach ($data['payments'] as $payment) {
                    Payment::create([
                        'sale_id' => $sale->id,
                        'payment_method_id' => $payment['payment_method_id'] ?? null,
                        'payment_method_name' => $payment['payment_method_name'],
                        'amount' => $payment['amount'] ?? 0,
                        'reference_number' => $payment['reference_number'] ?? null,
                    ]);
                }
            }

            // 3. If linked to a reservation, complete it automatically (Business Rule 6)
            if (!empty($data['reservation_id'])) {
                $reservation = Reservation::find($data['reservation_id']);
                if ($reservation && $reservation->status !== 'Completed') {
                    $reservation->update(['status' => 'Completed']);
                    AuditLog::log(
                        'reservation.auto_completed',
                        Reservation::class,
                        $reservation->id,
                        ['status' => $reservation->status],
                        ['status' => 'Completed']
                    );
                }
            }

            AuditLog::log(
                'pos.checkout_completed',
                Sale::class,
                $sale->id,
                null,
                ['invoice_number' => $invoiceNumber, 'grand_total' => $sale->grand_total]
            );

            return $sale->load(['customer', 'branch', 'items', 'payments']);
        });
    }

    /**
     * Void a sale transaction with audit logging (Business Rule 7).
     */
    public function voidSale(Sale $sale, string $reason): Sale
    {
        return DB::transaction(function () use ($sale, $reason) {
            $oldStatus = $sale->status;

            $sale->update([
                'status' => 'voided',
                'void_reason' => $reason,
                'voided_by' => auth()->id() ?? 1,
                'voided_at' => now(),
            ]);

            // Restore product inventory
            foreach ($sale->items as $item) {
                if ($item->item_type === 'product' && $item->product_id) {
                    $inv = BranchInventory::where('branch_id', $sale->branch_id)
                        ->where('product_id', $item->product_id)
                        ->first();

                    if ($inv) {
                        $inv->increment('current_stock', $item->qty);
                    }

                    StockMovement::create([
                        'product_id' => $item->product_id,
                        'branch_id' => $sale->branch_id,
                        'movement_type' => 'in',
                        'quantity' => $item->qty,
                        'reference_type' => 'void_sale',
                        'reference_id' => $sale->id,
                        'notes' => 'Voided POS Sale ' . $sale->invoice_number . ' - Reason: ' . $reason,
                        'user_id' => auth()->id() ?? 1,
                    ]);
                }
            }

            AuditLog::log(
                'pos.sale_voided',
                Sale::class,
                $sale->id,
                ['status' => $oldStatus],
                ['status' => 'voided', 'reason' => $reason]
            );

            return $sale;
        });
    }

    /**
     * Generate unique Invoice Number scoped by branch and date.
     */
    public function generateInvoiceNumber(int $branchId): string
    {
        $prefix = 'INV-' . date('Ymd') . '-B' . $branchId . '-';
        $latest = Sale::where('invoice_number', 'like', $prefix . '%')
            ->orderBy('id', 'desc')
            ->first();

        $seq = 1;
        if ($latest) {
            $parts = explode('-', $latest->invoice_number);
            $seq = intval(end($parts)) + 1;
        }

        return $prefix . str_pad($seq, 4, '0', STR_PAD_LEFT);
    }
}
