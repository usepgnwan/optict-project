<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\Customer;
use App\Models\Discount;
use App\Models\PaymentMethod;
use App\Models\Product;
use App\Models\Reservation;
use App\Models\Sale;
use App\Models\Service;
use App\Services\POSService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class POSController extends Controller
{
    public function __construct(protected POSService $posService)
    {
    }

    public function index(Request $request)
    {
        $branchId = $request->get('branch_id', auth()->user()?->branch_id ?? Branch::first()?->id ?? 1);

        // Branch-scoped products with available inventory
        $products = Product::active()
            ->with(['branchInventories' => fn ($q) => $q->where('branch_id', $branchId)])
            ->get()
            ->map(function ($product) {
                $product->setAttribute('stock', (int) $product->branchInventories->sum('current_stock'));
                return $product;
            });

        // Branch-scoped active reservations for Option A
        $activeReservations = Reservation::with(['customer', 'items.service'])
            ->where('branch_id', $branchId)
            ->whereNotIn('status', ['Completed', 'Cancelled', 'No Show'])
            ->orderBy('reservation_date')
            ->orderBy('reservation_time')
            ->get();

        // Recent sales for reprint / void
        $recentSales = Sale::with(['customer', 'cashier', 'items', 'payments'])
            ->where('branch_id', $branchId)
            ->orderBy('created_at', 'desc')
            ->take(30)
            ->get();

        return Inertia::render('Admin/POS/Index', [
            'branches' => Branch::active()->get(),
            'currentBranchId' => (int) $branchId,
            'services' => Service::active()->with('category')->get(),
            'products' => $products,
            'customers' => Customer::orderBy('full_name')->get(),
            'reservations' => $activeReservations,
            'paymentMethods' => PaymentMethod::active()->get(),
            'discounts' => Discount::active()->get(),
            'recentSales' => $recentSales,
        ]);
    }

    public function checkout(Request $request)
    {
        $validated = $request->validate([
            'branch_id' => 'required|exists:branches,id',
            'customer_id' => 'nullable|exists:customers,id',
            'walkin_name' => 'nullable|string|max:255',
            'walkin_phone' => 'nullable|string|max:50',
            'reservation_id' => 'nullable|exists:reservations,id',
            'subtotal_products' => 'required|numeric|min:0',
            'subtotal_services' => 'required|numeric|min:0',
            'discount_amount' => 'required|numeric|min:0',
            'tax_amount' => 'required|numeric|min:0',
            'grand_total' => 'required|numeric|min:0',
            'paid_amount' => 'required|numeric|min:0',
            'change_amount' => 'required|numeric|min:0',
            'items' => 'required|array|min:1',
            'items.*.item_type' => 'required|in:service,product',
            'items.*.product_id' => 'nullable|exists:products,id',
            'items.*.service_id' => 'nullable|exists:services,id',
            'items.*.item_name' => 'required|string',
            'items.*.qty' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.discount' => 'nullable|numeric|min:0',
            'items.*.subtotal' => 'required|numeric|min:0',
            'payments' => 'required|array|min:1',
            'payments.*.payment_method_id' => 'nullable|exists:payment_methods,id',
            'payments.*.payment_method_name' => 'required|string',
            'payments.*.amount' => 'required|numeric|min:0',
            'payments.*.reference_number' => 'nullable|string',
        ]);

        $sale = $this->posService->checkout($validated);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'sale' => $sale,
                'message' => 'Transaction completed successfully.',
            ]);
        }

        return redirect()->back()->with([
            'success' => 'POS Transaction completed: ' . $sale->invoice_number,
            'completed_sale_id' => $sale->id,
        ]);
    }

    public function voidSale(Request $request, Sale $sale)
    {
        $request->validate([
            'reason' => 'required|string|min:5',
        ]);

        $this->posService->voidSale($sale, $request->reason);

        return redirect()->back()->with('success', 'Sale transaction ' . $sale->invoice_number . ' has been voided.');
    }
}
