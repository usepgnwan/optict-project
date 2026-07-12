<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\BranchInventory;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BranchInventoryController extends Controller
{
    public function index(Request $request)
    {
        $branches = Branch::active()->get();
        $selectedBranchId = $request->input('branch_id', $branches->first()?->id);

        $query = BranchInventory::with(['product', 'branch'])
            ->when($selectedBranchId, function ($q) use ($selectedBranchId) {
                $q->where('branch_id', $selectedBranchId);
            });

        if ($search = $request->input('search')) {
            $query->whereHas('product', function ($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                  ->orWhere('sku', 'ilike', "%{$search}%")
                  ->orWhere('barcode', 'ilike', "%{$search}%");
            });
        }

        $inventories = $query->paginate(20)->withQueryString();

        return Inertia::render('Admin/Inventory/Branch', [
            'inventories' => $inventories,
            'branches' => $branches,
            'selectedBranchId' => (int) $selectedBranchId,
            'filters' => $request->only(['search', 'branch_id']),
        ]);
    }
}
