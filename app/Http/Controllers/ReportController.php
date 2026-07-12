<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\BranchInventory;
use App\Models\CentralInventory;
use App\Models\StockAdjustment;
use App\Models\StockMovement;
use App\Models\StockTransfer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Reports/Index');
    }

    public function stockReport(Request $request)
    {
        $branches = Branch::active()->get();
        $location = $request->input('location', 'all'); // all, central, branch_{id}

        $central = CentralInventory::with('product')->get();
        $branch = BranchInventory::with(['product', 'branch'])->get();

        return Inertia::render('Admin/Reports/StockReport', [
            'central' => $central,
            'branch' => $branch,
            'branches' => $branches,
            'filters' => $request->only(['location']),
        ]);
    }

    public function movementReport(Request $request)
    {
        $query = StockMovement::with(['product', 'branch', 'user']);

        if ($type = $request->input('movement_type')) {
            $query->where('movement_type', $type);
        }

        $movements = $query->orderByDesc('created_at')->paginate(25)->withQueryString();

        return Inertia::render('Admin/Reports/MovementReport', [
            'movements' => $movements,
            'filters' => $request->only(['movement_type']),
            'types' => StockMovement::getMovementTypes(),
        ]);
    }

    public function transferReport(Request $request)
    {
        $transfers = StockTransfer::with(['sourceBranch', 'destinationBranch', 'creator'])
            ->orderByDesc('created_at')
            ->paginate(25);

        return Inertia::render('Admin/Reports/TransferReport', [
            'transfers' => $transfers,
        ]);
    }

    public function adjustmentReport(Request $request)
    {
        $adjustments = StockAdjustment::with(['product', 'branch', 'user'])
            ->orderByDesc('created_at')
            ->paginate(25);

        return Inertia::render('Admin/Reports/AdjustmentReport', [
            'adjustments' => $adjustments,
        ]);
    }
}
