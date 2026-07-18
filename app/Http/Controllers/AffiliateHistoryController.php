<?php

namespace App\Http\Controllers;

use App\Models\Affiliate;
use App\Models\Branch;
use App\Models\Product;
use App\Models\Sale;
use App\Models\Service;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AffiliateHistoryController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
        $isAffiliator = $user && $user->role && $user->role->name === 'affiliator';

        $startDate  = $request->get('start_date', now()->startOfMonth()->toDateString());
        $endDate    = $request->get('end_date', now()->toDateString());
        
        if ($isAffiliator) {
            $affiliateId = $user->affiliate?->id;
        } else {
            $affiliateId = $request->get('affiliate_id', 'all');
        }

        $search     = $request->get('search', '');

        // Helper: hitung komisi dari item
        $calcSaleCommission = function (Sale $sale): float {
            $total = 0;
            foreach ($sale->items as $item) {
                $comm = null;
                if ($item->item_type === 'product' && $item->product_id) {
                    $comm = Product::find($item->product_id);
                } elseif ($item->item_type === 'service' && $item->service_id) {
                    $comm = Service::find($item->service_id);
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

        // Query sales yang ada affiliate_code
        $salesQuery = Sale::with(['customer', 'items', 'affiliate.user', 'branch'])
            ->whereNotNull('affiliate_code')
            ->where('status', 'completed')
            ->whereBetween('created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59']);

        if ($affiliateId && $affiliateId !== 'all') {
            $aff = Affiliate::find($affiliateId);
            if ($aff) {
                $salesQuery->where('affiliate_code', $aff->referral_code);
            }
        }

        if ($search) {
            $salesQuery->where(function ($q) use ($search) {
                $q->where('invoice_number', 'like', '%' . $search . '%')
                  ->orWhere('affiliate_code', 'like', '%' . $search . '%')
                  ->orWhereHas('customer', fn($q2) => $q2->where('name', 'like', '%' . $search . '%'));
            });
        }

        $salesQuery->orderByDesc('created_at');

        $paginated = $salesQuery->paginate(15)->withQueryString();

        // Map dengan komisi
        $mapped = $paginated->getCollection()->map(function ($sale) use ($calcSaleCommission) {
            $commission = $calcSaleCommission($sale);
            return [
                'id'             => $sale->id,
                'invoice'        => $sale->invoice_number,
                'date'           => $sale->created_at->format('d M Y H:i'),
                'customer'       => $sale->customer?->name ?? $sale->walkin_name ?? 'Walk-in',
                'branch'         => $sale->branch?->name ?? '-',
                'grand_total'    => $sale->grand_total,
                'commission'     => $commission,
                'affiliate_name' => $sale->affiliate?->user?->name ?? $sale->affiliate_code,
                'referral_code'  => $sale->affiliate_code,
                'affiliate_bank' => $sale->affiliate ? [
                    'bank_name' => $sale->affiliate->bank_name,
                    'account_number' => $sale->affiliate->bank_account_number,
                    'account_name' => $sale->affiliate->bank_account_name,
                    'phone' => $sale->affiliate->phone,
                ] : null,
                'items_summary'  => $sale->items->map(fn($i) => $i->item_name . ' (×' . $i->qty . ')')->join(', '),
                'status'         => $commission > 0 
                    ? ($sale->commission_status === 'paid' ? 'Lunas' : ($sale->commission_status === 'held' ? 'Ditahan' : 'Pending')) 
                    : 'Tanpa Komisi',
                'raw_status'     => $sale->commission_status,
            ];
        });
        $paginated->setCollection($mapped);

        // Summary stats untuk periode yang dipilih
        $allForStats = Sale::with(['items'])
            ->whereNotNull('affiliate_code')
            ->where('status', 'completed')
            ->whereBetween('created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
            ->when($affiliateId && $affiliateId !== 'all', function ($q) use ($affiliateId) {
                $aff = Affiliate::find($affiliateId);
                if ($aff) $q->where('affiliate_code', $aff->referral_code);
            })
            ->get();

        $totalCommission = $allForStats->sum(fn($s) => $calcSaleCommission($s));
        $totalRevenue    = $allForStats->sum('grand_total');
        $totalCount      = $allForStats->count();

        // Top affiliators
        $topAffiliates = $allForStats->groupBy('affiliate_code')->map(function ($group) use ($calcSaleCommission) {
            $aff = $group->first()->affiliate;
            return [
                'name'          => $aff?->user?->name ?? $group->first()->affiliate_code,
                'referral_code' => $group->first()->affiliate_code,
                'total_sales'   => $group->count(),
                'total_revenue' => $group->sum('grand_total'),
                'commission'    => $group->sum(fn($s) => $calcSaleCommission($s)),
            ];
        })->sortByDesc('commission')->values()->take(5);

        return Inertia::render('Admin/AffiliateHistory/Index', [
            'sales'           => $paginated,
            'affiliates'      => Affiliate::with('user')->where('status', 'active')->get(),
            'branches'        => Branch::active()->get(),
            'startDate'       => $startDate,
            'endDate'         => $endDate,
            'selectedAffiliate' => $affiliateId,
            'search'          => $search,
            'summary'         => [
                'totalCommission' => $totalCommission,
                'totalRevenue'    => $totalRevenue,
                'totalCount'      => $totalCount,
            ],
            'topAffiliates'   => $topAffiliates,
            'isAffiliator'    => $isAffiliator,
        ]);
    }

    public function updateStatus(Request $request, Sale $sale)
    {
        // Only admin/staff can update commission status
        $user = auth()->user();
        if ($user->role?->name === 'affiliator') {
            abort(403, 'Anda tidak memiliki izin untuk mengubah status komisi.');
        }

        $request->validate([
            'commission_status' => 'required|in:pending,paid,held',
        ]);

        $sale->update([
            'commission_status' => $request->commission_status,
        ]);

        return back()->with('success', 'Status komisi berhasil diperbarui.');
    }
}
