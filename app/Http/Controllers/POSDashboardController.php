<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\Reservation;
use App\Models\Sale;
use App\Models\SaleItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class POSDashboardController extends Controller
{
    public function index(Request $request)
    {
        $branchId = $request->get('branch_id');

        $today = now()->toDateString();

        // 1. KPI Cards
        $reservationsQuery = Reservation::query();
        $salesQuery = Sale::where('status', 'completed');

        if ($branchId && $branchId !== 'all') {
            $reservationsQuery->where('branch_id', $branchId);
            $salesQuery->where('branch_id', $branchId);
        }

        $todaysReservations = (clone $reservationsQuery)->whereDate('reservation_date', $today)->count();
        $todaysRevenue = (clone $salesQuery)->whereDate('created_at', $today)->sum('grand_total');
        $completedReservations = (clone $reservationsQuery)->where('status', 'Completed')->count();
        $cancelledReservations = (clone $reservationsQuery)->whereIn('status', ['Cancelled', 'No Show'])->count();

        // 2. Top Services
        $topServices = SaleItem::select('item_name', DB::raw('SUM(qty) as total_qty'), DB::raw('SUM(subtotal) as total_revenue'))
            ->where('item_type', 'service')
            ->whereHas('sale', function ($q) use ($branchId) {
                $q->where('status', 'completed');
                if ($branchId && $branchId !== 'all') {
                    $q->where('branch_id', $branchId);
                }
            })
            ->groupBy('item_name')
            ->orderByDesc('total_qty')
            ->take(5)
            ->get();

        // 3. Top Products
        $topProducts = SaleItem::select('item_name', DB::raw('SUM(qty) as total_qty'), DB::raw('SUM(subtotal) as total_revenue'))
            ->where('item_type', 'product')
            ->whereHas('sale', function ($q) use ($branchId) {
                $q->where('status', 'completed');
                if ($branchId && $branchId !== 'all') {
                    $q->where('branch_id', $branchId);
                }
            })
            ->groupBy('item_name')
            ->orderByDesc('total_qty')
            ->take(5)
            ->get();

        // 4. Sales by Branch
        $salesByBranch = Sale::select('branches.name as branch_name', DB::raw('SUM(sales.grand_total) as revenue'), DB::raw('COUNT(sales.id) as transactions'))
            ->join('branches', 'sales.branch_id', '=', 'branches.id')
            ->where('sales.status', 'completed')
            ->groupBy('branches.name')
            ->get();

        // 5. Recent completed reservations
        $recentReservations = Reservation::with(['customer', 'branch'])
            ->orderBy('reservation_date', 'desc')
            ->orderBy('reservation_time', 'desc')
            ->take(8)
            ->get();

        // 6. Recent POS Sales
        $recentSalesQuery = Sale::with(['branch', 'customer', 'items', 'payments'])->orderBy('created_at', 'desc');
        if ($branchId && $branchId !== 'all') {
            $recentSalesQuery->where('branch_id', $branchId);
        }
        $recentSales = $recentSalesQuery->take(15)->get();

        return Inertia::render('Admin/POS/Dashboard', [
            'kpis' => [
                'todays_reservations' => $todaysReservations,
                'todays_revenue' => (float) $todaysRevenue,
                'completed_reservations' => $completedReservations,
                'cancelled_reservations' => $cancelledReservations,
            ],
            'topServices' => $topServices,
            'topProducts' => $topProducts,
            'salesByBranch' => $salesByBranch,
            'recentReservations' => $recentReservations,
            'recentSales' => $recentSales,
            'branches' => Branch::active()->get(),
            'currentBranch' => $branchId ?: 'all',
        ]);
    }
}
