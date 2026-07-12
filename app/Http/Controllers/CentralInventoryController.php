<?php

namespace App\Http\Controllers;

use App\Models\CentralInventory;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CentralInventoryController extends Controller
{
    public function index(Request $request)
    {
        $query = CentralInventory::with('product');

        if ($search = $request->input('search')) {
            $query->whereHas('product', function ($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                  ->orWhere('sku', 'ilike', "%{$search}%")
                  ->orWhere('barcode', 'ilike', "%{$search}%")
                  ->orWhere('brand', 'ilike', "%{$search}%");
            });
        }

        if ($category = $request->input('category')) {
            $query->whereHas('product', function ($q) use ($category) {
                $q->where('category', $category);
            });
        }

        $inventories = $query->paginate(20)->withQueryString();

        return Inertia::render('Admin/Inventory/Central', [
            'inventories' => $inventories,
            'filters' => $request->only(['search', 'category']),
            'categories' => Product::getCategories(),
        ]);
    }
}
