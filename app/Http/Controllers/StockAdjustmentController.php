<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAdjustmentRequest;
use App\Models\AuditLog;
use App\Models\Branch;
use App\Models\Product;
use App\Models\StockAdjustment;
use App\Services\StockService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StockAdjustmentController extends Controller
{
    public function __construct(
        protected StockService $stockService
    ) {}

    public function index(Request $request)
    {
        $query = StockAdjustment::with(['product', 'branch', 'user']);

        if ($reason = $request->input('reason')) {
            $query->where('reason', $reason);
        }

        $adjustments = $query->orderByDesc('created_at')->paginate(15)->withQueryString();

        return Inertia::render('Admin/Adjustments/Index', [
            'adjustments' => $adjustments,
            'filters' => $request->only(['reason']),
            'reasons' => StockAdjustment::getReasons(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Adjustments/Create', [
            'branches' => Branch::active()->get(),
            'products' => Product::active()->get(),
            'reasons' => StockAdjustment::getReasons(),
        ]);
    }

    public function store(StoreAdjustmentRequest $request)
    {
        $data = $request->validated();
        $user = $request->user();

        $before = $this->stockService->getStock(
            $data['product_id'],
            $data['location_type'],
            $data['branch_id'] ?? null
        );

        $after = $before + $data['adjustment_qty'];
        if ($after < 0) {
            return back()->withErrors(['adjustment_qty' => "Pengurangan stok tidak boleh melebihi stok saat ini ({$before})."]);
        }

        // Apply stock change
        if ($data['location_type'] === 'central') {
            $this->stockService->updateCentralStock(
                $data['product_id'],
                $data['adjustment_qty'],
                'adjustment',
                $user->id,
                StockAdjustment::class,
                null,
                $data['notes']
            );
        } else {
            $this->stockService->updateBranchStock(
                $data['branch_id'],
                $data['product_id'],
                $data['adjustment_qty'],
                'adjustment',
                $user->id,
                StockAdjustment::class,
                null,
                $data['notes']
            );
        }

        $adjustment = StockAdjustment::create([
            'adjustment_number' => StockAdjustment::generateAdjustmentNumber(),
            'location_type' => $data['location_type'],
            'branch_id' => $data['branch_id'] ?? null,
            'product_id' => $data['product_id'],
            'reason' => $data['reason'],
            'before_stock' => $before,
            'adjustment_qty' => $data['adjustment_qty'],
            'after_stock' => $after,
            'notes' => $data['notes'] ?? null,
            'user_id' => $user->id,
        ]);

        AuditLog::log('created', StockAdjustment::class, $adjustment->id, null, $adjustment->toArray());

        return redirect()->route('stock-adjustments.index')
            ->with('success', 'Penyesuaian stok berhasil dicatat.');
    }
}
