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
        $startDate = $request->get('start_date', now()->toDateString());
        $endDate = $request->get('end_date', now()->toDateString());

        // 1. KPI Cards
        $reservationsQuery = Reservation::query()->whereBetween('reservation_date', [$startDate, $endDate]);
        $salesQuery = Sale::where('status', 'completed')
            ->whereBetween('created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59']);

        if ($branchId && $branchId !== 'all') {
            $reservationsQuery->where('branch_id', $branchId);
            $salesQuery->where('branch_id', $branchId);
        }

        $periodReservations = (clone $reservationsQuery)->count();
        $periodRevenue = (clone $salesQuery)->sum('grand_total');
        $completedReservations = (clone $reservationsQuery)->where('status', 'Completed')->count();
        $cancelledReservations = (clone $reservationsQuery)->whereIn('status', ['Cancelled', 'No Show'])->count();

        // 2. Top Services
        $topServices = SaleItem::select('item_name', DB::raw('SUM(qty) as total_qty'), DB::raw('SUM(subtotal) as total_revenue'))
            ->where('item_type', 'service')
            ->whereHas('sale', function ($q) use ($branchId, $startDate, $endDate) {
                $q->where('status', 'completed')
                  ->whereBetween('created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59']);
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
            ->whereHas('sale', function ($q) use ($branchId, $startDate, $endDate) {
                $q->where('status', 'completed')
                  ->whereBetween('created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59']);
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
            ->whereBetween('sales.created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
            ->groupBy('branches.name')
            ->get();

        // 5. Recent completed reservations
        $recentReservations = Reservation::with(['customer', 'branch'])
            ->whereBetween('reservation_date', [$startDate, $endDate])
            ->orderBy('reservation_date', 'desc')
            ->orderBy('reservation_time', 'desc')
            ->take(8)
            ->get();

        // 6. Recent POS Sales
        $recentSalesQuery = Sale::with(['branch', 'customer', 'items.product', 'items.service', 'payments', 'affiliate.user'])
            ->whereBetween('created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
            ->orderBy('created_at', 'desc');
        if ($branchId && $branchId !== 'all') {
            $recentSalesQuery->where('branch_id', $branchId);
        }
        $recentSales = $recentSalesQuery->take(15)->get();

        // 7. Top Affiliates
        $topAffiliatesQuery = \App\Models\Affiliate::with('user')
            ->whereHas('sales', function ($query) use ($branchId, $startDate, $endDate) {
                $query->where('status', 'completed')
                      ->whereBetween('created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59']);
                if ($branchId && $branchId !== 'all') {
                    $query->where('branch_id', $branchId);
                }
            })
            ->withCount(['sales' => function ($query) use ($branchId, $startDate, $endDate) {
                $query->where('status', 'completed')
                      ->whereBetween('created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59']);
                if ($branchId && $branchId !== 'all') {
                    $query->where('branch_id', $branchId);
                }
            }])
            ->withSum(['sales as total_revenue' => function ($query) use ($branchId, $startDate, $endDate) {
                $query->where('status', 'completed')
                      ->whereBetween('created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59']);
                if ($branchId && $branchId !== 'all') {
                    $query->where('branch_id', $branchId);
                }
            }], 'grand_total')
            ->orderByDesc('total_revenue')
            ->take(5);

        $topAffiliates = $topAffiliatesQuery->get()->map(function ($affiliate) {
            $affiliate->estimated_commission = ($affiliate->total_revenue * $affiliate->commission_rate) / 100;
            return $affiliate;
        });

        return Inertia::render('Admin/POS/Dashboard', [
            'kpis' => [
                'period_reservations' => $periodReservations,
                'period_revenue' => (float) $periodRevenue,
                'completed_reservations' => $completedReservations,
                'cancelled_reservations' => $cancelledReservations,
            ],
            'topServices' => $topServices,
            'topProducts' => $topProducts,
            'salesByBranch' => $salesByBranch,
            'recentReservations' => $recentReservations,
            'recentSales' => $recentSales,
            'topAffiliates' => $topAffiliates,
            'branches' => Branch::active()->get(),
            'currentBranch' => $branchId ?: 'all',
            'startDate' => $startDate,
            'endDate' => $endDate,
        ]);
    }
}
