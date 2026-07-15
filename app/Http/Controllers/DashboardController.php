<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\BranchInventory;
use App\Models\CentralInventory;
use App\Models\Product;
use App\Models\StockAdjustment;
use App\Models\StockTransfer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        if ($user && $user->role && $user->role->name === 'affiliator') {
            $affiliate = $user->affiliate;
            return Inertia::render('Affiliate/Dashboard', [
                'affiliate' => $affiliate,
            ]);
        }

        $totalProducts = Product::count();
        $activeProducts = Product::active()->count();
        $totalBranches = Branch::active()->count();
        $centralStock = CentralInventory::sum('quantity');
        $branchStock = BranchInventory::sum('current_stock');

        $lowStockProducts = BranchInventory::whereColumn('current_stock', '<=', 'minimum_stock')
            ->where('current_stock', '>', 0)
            ->with(['product', 'branch'])
            ->limit(10)
            ->get();

        $outOfStockProducts = BranchInventory::where('current_stock', 0)
            ->with(['product', 'branch'])
            ->limit(10)
            ->get();

        $recentTransfers = StockTransfer::with(['creator', 'sourceBranch', 'destinationBranch'])
            ->orderByDesc('created_at')
            ->limit(5)
            ->get();

        $recentAdjustments = StockAdjustment::with(['product', 'user', 'branch'])
            ->orderByDesc('created_at')
            ->limit(5)
            ->get();

        // Stock by branch chart data
        $stockByBranch = Branch::active()->get()->map(function ($branch) {
            return [
                'name' => $branch->name,
                'stock' => $branch->inventory()->sum('current_stock'),
            ];
        });

        // Inventory value
        $centralValue = CentralInventory::join('products', 'central_inventory.product_id', '=', 'products.id')
            ->selectRaw('SUM(central_inventory.quantity * products.cost_price) as total_value')
            ->value('total_value') ?? 0;

        $branchValue = BranchInventory::join('products', 'branch_inventory.product_id', '=', 'products.id')
            ->selectRaw('SUM(branch_inventory.current_stock * products.cost_price) as total_value')
            ->value('total_value') ?? 0;

        return Inertia::render('Dashboard', [
            'stats' => [
                'totalProducts' => $totalProducts,
                'activeProducts' => $activeProducts,
                'totalBranches' => $totalBranches,
                'centralStock' => $centralStock,
                'branchStock' => $branchStock,
                'totalStock' => $centralStock + $branchStock,
                'centralValue' => $centralValue,
                'branchValue' => $branchValue,
                'totalValue' => $centralValue + $branchValue,
            ],
            'lowStockProducts' => $lowStockProducts,
            'outOfStockProducts' => $outOfStockProducts,
            'recentTransfers' => $recentTransfers,
            'recentAdjustments' => $recentAdjustments,
            'stockByBranch' => $stockByBranch,
        ]);
    }
}
