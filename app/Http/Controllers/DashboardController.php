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
    public function index(Request $request)
    {
        $user = auth()->user();
        if ($user && $user->role && $user->role->name === 'affiliator') {
            $affiliate = $user->affiliate;

            $startDate = $request->get('start_date', now()->startOfMonth()->toDateString());
            $endDate   = $request->get('end_date', now()->toDateString());

            // Helper komisi per item
            $calcItemComm = function (\App\Models\Sale $sale): float {
                $total = 0;
                foreach ($sale->items as $item) {
                    $comm = null;
                    if ($item->item_type === 'product' && $item->product_id) {
                        $comm = \App\Models\Product::find($item->product_id);
                    } elseif ($item->item_type === 'service' && $item->service_id) {
                        $comm = \App\Models\Service::find($item->service_id);
                    }
                    if ($comm && $comm->commission_amount > 0) {
                        if ($comm->commission_type === 'percentage') {
                            $total += ($item->subtotal * $comm->commission_amount) / 100;
                        } elseif ($comm->commission_type === 'fixed') {
                            $total += $comm->commission_amount * $item->qty;
                        }
                    }
                }
                return $total;
            };

            // Sales referral dengan pagination
            $salesQuery = \App\Models\Sale::with(['customer', 'items', 'branch'])
                ->where('affiliate_code', $affiliate->referral_code)
                ->where('status', 'completed')
                ->whereBetween('created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
                ->orderByDesc('created_at');

            $paginatedSales = $salesQuery->paginate(10)->withQueryString();

            // Map dengan komisi per transaksi
            $salesWithCommission = $paginatedSales->getCollection()->map(function ($sale) use ($calcItemComm) {
                $commission = $calcItemComm($sale);
                return [
                    'id'            => $sale->id,
                    'invoice'       => $sale->invoice_number,
                    'date'          => $sale->created_at->format('d M Y H:i'),
                    'customer'      => $sale->customer?->name ?? $sale->walkin_name ?? 'Walk-in',
                    'branch'        => $sale->branch?->name ?? '-',
                    'grand_total'   => $sale->grand_total,
                    'commission'    => $commission,
                    'status'        => $commission > 0 
                        ? ($sale->commission_status === 'paid' ? 'Lunas' : ($sale->commission_status === 'held' ? 'Ditahan' : 'Menunggu Pembayaran')) 
                        : 'Tanpa Komisi',
                    'items_summary' => $sale->items->map(fn($i) => $i->item_name . ' (x' . $i->qty . ')')->join(', '),
                ];
            });
            $paginatedSales->setCollection($salesWithCommission);

            // Summary stats
            $allSalesForStats = \App\Models\Sale::with(['items'])
                ->where('affiliate_code', $affiliate->referral_code)
                ->where('status', 'completed')
                ->whereBetween('created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
                ->get();
            $totalEarned = $allSalesForStats->sum(fn($s) => $calcItemComm($s));
            $totalRevenue = $allSalesForStats->sum('grand_total');
            $totalTransaksi = $allSalesForStats->count();

            // Click & Reservation Tracking Stats
            $totalClicks = \App\Models\AffiliateClick::where('affiliate_id', $affiliate->id)->count();
            $totalReservations = \App\Models\Reservation::where('affiliate_code', $affiliate->referral_code)->count();

            $clickHistory = \App\Models\AffiliateClick::where('affiliate_id', $affiliate->id)
                ->latest()
                ->take(15)
                ->get()
                ->map(fn($click) => [
                    'id' => $click->id,
                    'ip_address' => $click->ip_address ? substr($click->ip_address, 0, 7) . '***' : 'Unknown',
                    'user_agent' => $click->user_agent ? (str_contains($click->user_agent, 'Mobile') ? 'Mobile / Tablet' : 'Desktop') : 'Unknown',
                    'landing_page' => $click->landing_page ? '/' . $click->landing_page : '/',
                    'date' => $click->created_at->format('d M Y H:i'),
                ]);

            $reservationHistory = \App\Models\Reservation::where('affiliate_code', $affiliate->referral_code)
                ->latest()
                ->take(15)
                ->get()
                ->map(fn($res) => [
                    'id' => $res->id,
                    'reservation_number' => $res->reservation_number,
                    'customer_name' => substr($res->customer_name, 0, 1) . str_repeat('*', strlen($res->customer_name) - 1),
                    'branch' => $res->branch?->name ?? 'Online',
                    'date' => $res->reservation_date,
                    'time' => $res->reservation_time,
                    'status' => $res->status === 'Waiting' ? 'Menunggu' : ($res->status === 'Approved' ? 'Diterima' : 'Batal'),
                ]);

            $marketingKits = \App\Models\MarketingKit::where('is_active', true)->latest()->get();

            return Inertia::render('Affiliate/Dashboard', [
                'affiliate'        => $affiliate,
                'marketingKits'    => $marketingKits,
                'sales'            => $paginatedSales,
                'startDate'        => $startDate,
                'endDate'          => $endDate,
                'affiliateStats'   => [
                    'totalEarned'       => $totalEarned,
                    'totalRevenue'      => $totalRevenue,
                    'totalTransaksi'    => $totalTransaksi,
                    'totalClicks'       => $totalClicks,
                    'totalReservations' => $totalReservations,
                    'clickHistory'      => $clickHistory,
                    'reservationHistory'=> $reservationHistory,
                ],
            ]);
        }

        $branchId = $request->get('branch_id');
        $startDate = $request->get('start_date', now()->startOfMonth()->toDateString());
        $endDate = $request->get('end_date', now()->toDateString());

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

        // Actual Dashboard Data with Filters
        $salesQuery = \App\Models\Sale::where('status', 'completed')
            ->whereBetween('created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59']);
        if ($branchId && $branchId !== 'all') {
            $salesQuery->where('branch_id', $branchId);
        }
        
        $totalRevenue = (clone $salesQuery)->sum('grand_total');
        
        // Helper: hitung komisi dari item (commission_type & commission_amount di products/services)
        $calcSaleCommission = function (\App\Models\Sale $sale): float {
            $total = 0;
            foreach ($sale->items as $item) {
                $comm = null;
                if ($item->item_type === 'product' && $item->product_id) {
                    $comm = \App\Models\Product::find($item->product_id);
                } elseif ($item->item_type === 'service' && $item->service_id) {
                    $comm = \App\Models\Service::find($item->service_id);
                }
                if ($comm && $comm->commission_amount > 0) {
                    if ($comm->commission_type === 'percentage') {
                        $total += ($item->subtotal * $comm->commission_amount) / 100;
                    } elseif ($comm->commission_type === 'fixed') {
                        $total += $comm->commission_amount * $item->qty;
                    }
                }
            }
            return $total;
        };

        // Calculate total affiliate commission (per-item)
        $salesWithAffiliates = (clone $salesQuery)->whereNotNull('affiliate_code')->with('items')->get();
        $totalCommission = 0;
        foreach ($salesWithAffiliates as $sale) {
            $totalCommission += $calcSaleCommission($sale);
        }

        $netRevenue = $totalRevenue - $totalCommission;

        $reservationsQuery = \App\Models\Reservation::whereBetween('reservation_date', [$startDate, $endDate]);
        if ($branchId && $branchId !== 'all') {
            $reservationsQuery->where('branch_id', $branchId);
        }

        $completedReservations = (clone $reservationsQuery)->where('status', 'Completed')->count();
        $totalReservations = (clone $reservationsQuery)->count();

        // Trend Data (Kacamata, Layanan, Komisi)
        $start = \Carbon\Carbon::parse($startDate);
        $end = \Carbon\Carbon::parse($endDate);
        $diffInDays = $start->diffInDays($end);
        
        $trendData = collect();
        if ($diffInDays > 31) {
            $diffInMonths = $start->diffInMonths($end);
            for ($i = 0; $i <= $diffInMonths; $i++) {
                $date = $start->copy()->addMonths($i);
                $monthStart = $date->copy()->startOfMonth();
                $monthEnd = $date->copy()->endOfMonth();

                $sq = \App\Models\Sale::where('status', 'completed')
                    ->whereBetween('created_at', [$monthStart, $monthEnd]);
                if ($branchId && $branchId !== 'all') {
                    $sq->where('branch_id', $branchId);
                }
                $sales = $sq->with(['items'])->get();

                $kacamata = 0;
                $layanan = 0;
                $komisi = 0;
                foreach ($sales as $sale) {
                    $kacamata += $sale->items->where('item_type', 'product')->sum('subtotal');
                    $layanan += $sale->items->where('item_type', 'service')->sum('subtotal');
                    if ($sale->affiliate_code) {
                        $komisi += $calcSaleCommission($sale);
                    }
                }

                $trendData->push([
                    'label' => $date->translatedFormat('M Y'),
                    'kacamata' => $kacamata,
                    'layanan' => $layanan,
                    'komisi' => $komisi,
                ]);
            }
        } else {
            for ($i = 0; $i <= $diffInDays; $i++) {
                $date = $start->copy()->addDays($i);
                
                $sq = \App\Models\Sale::where('status', 'completed')
                    ->whereDate('created_at', $date->toDateString());
                if ($branchId && $branchId !== 'all') {
                    $sq->where('branch_id', $branchId);
                }
                $sales = $sq->with(['items'])->get();

                $kacamata = 0;
                $layanan = 0;
                $komisi = 0;
                foreach ($sales as $sale) {
                    $kacamata += $sale->items->where('item_type', 'product')->sum('subtotal');
                    $layanan += $sale->items->where('item_type', 'service')->sum('subtotal');
                    if ($sale->affiliate_code) {
                        $komisi += $calcSaleCommission($sale);
                    }
                }

                $trendData->push([
                    'label' => $date->format('d M'),
                    'kacamata' => $kacamata,
                    'layanan' => $layanan,
                    'komisi' => $komisi,
                ]);
            }
        }

        // Top 5 Products (Kacamata)
        $topProductsQuery = \App\Models\SaleItem::select('item_name', \Illuminate\Support\Facades\DB::raw('SUM(qty) as total_qty'), \Illuminate\Support\Facades\DB::raw('SUM(subtotal) as total_revenue'))
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
            ->take(5);

        // Top 5 Services (Layanan)
        $topServicesQuery = \App\Models\SaleItem::select('item_name', \Illuminate\Support\Facades\DB::raw('SUM(qty) as total_qty'), \Illuminate\Support\Facades\DB::raw('SUM(subtotal) as total_revenue'))
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
            ->take(5);

        // Status Distribution for Reservations
        $statuses = (clone $reservationsQuery)->select('status', \Illuminate\Support\Facades\DB::raw('count(*) as total'))
            ->groupBy('status')
            ->get();
        
        $statusDistribution = $statuses->map(function ($status) use ($totalReservations) {
            $colors = [
                'Pending' => ['color' => 'bg-amber-400', 'hex' => '#FBBF24'],
                'Confirmed' => ['color' => 'bg-blue-500', 'hex' => '#3B82F6'],
                'Completed' => ['color' => 'bg-emerald-500', 'hex' => '#10B981'],
                'Cancelled' => ['color' => 'bg-rose-500', 'hex' => '#F43F5E'],
                'No Show' => ['color' => 'bg-gray-500', 'hex' => '#6B7280'],
            ];
            $pct = $totalReservations > 0 ? round(($status->total / $totalReservations) * 100) : 0;
            $conf = $colors[$status->status] ?? ['color' => 'bg-gray-400', 'hex' => '#9CA3AF'];
            
            return [
                'name' => $status->status,
                'count' => $status->total,
                'pct' => $pct . '%',
                'color' => $conf['color'],
                'hex' => $conf['hex'],
            ];
        });

        // Recent Transactions (Sales with Affiliates)
        $recentTransactions = (clone $salesQuery)->with(['customer', 'items', 'affiliate.user'])
            ->orderByDesc('created_at')
            ->limit(10)
            ->get();

        // Affiliator commission list (per sale that has affiliate code)
        $affiliatorCommissions = (clone $salesQuery)->whereNotNull('affiliate_code')
            ->with(['customer', 'items', 'affiliate.user', 'branch'])
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($sale) use ($calcSaleCommission) {
                $commission = $calcSaleCommission($sale);
                return [
                    'id'           => $sale->id,
                    'invoice'      => $sale->invoice_number,
                    'date'         => $sale->created_at->format('d M Y'),
                    'customer'     => $sale->customer?->name ?? $sale->walkin_name ?? 'Walk-in',
                    'branch'       => $sale->branch?->name ?? '-',
                    'grand_total'  => $sale->grand_total,
                    'commission'   => $commission,
                    'affiliate_name' => $sale->affiliate?->user?->name ?? $sale->affiliate_code,
                    'referral_code'  => $sale->affiliate_code,
                    'status'         => $commission > 0 
                        ? ($sale->commission_status === 'paid' ? 'Lunas' : ($sale->commission_status === 'held' ? 'Ditahan' : 'Menunggu')) 
                        : 'Tanpa Komisi',
                ];
            });

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
            'financialStats' => [
                'totalRevenue' => $totalRevenue,
                'totalCommission' => $totalCommission,
                'netRevenue' => $netRevenue,
                'completedReservations' => $completedReservations,
                'totalReservations' => $totalReservations,
            ],
            'lowStockProducts' => $lowStockProducts,
            'outOfStockProducts' => $outOfStockProducts,
            'recentTransfers' => $recentTransfers,
            'recentAdjustments' => $recentAdjustments,
            'stockByBranch' => $stockByBranch,
            'chartData' => $trendData, // Dynamic trend data
            'topProducts' => $topProductsQuery->get(),
            'topServices' => $topServicesQuery->get(),
            'statusDistribution' => $statusDistribution,
            'recentTransactions' => $recentTransactions,
            'affiliatorCommissions' => $affiliatorCommissions,
            'branches' => Branch::active()->get(),
            'currentBranch' => $branchId ?: 'all',
            'startDate' => $startDate,
            'endDate' => $endDate,
        ]);
    }
}
