<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductRequest;
use App\Models\AuditLog;
use App\Models\CentralInventory;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\Encoders\WebpEncoder;

class ProductController extends Controller
{
    private function uploadAndCompressImage($file): string
    {
        $manager = new ImageManager(new Driver());
        $image = $manager->decodePath($file->getPathname());

        // Resize image if larger than 1200px width while keeping aspect ratio
        $image->scaleDown(width: 1200);

        // Encode as webp with 80% compression quality
        $encoded = $image->encode(new WebpEncoder(quality: 80));

        $filename = 'products/' . uniqid('prod_') . '_' . time() . '.webp';
        Storage::disk('public')->put($filename, (string) $encoded);

        return $filename;
    }

    public function index(Request $request)
    {
        $query = Product::query();

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                  ->orWhere('sku', 'ilike', "%{$search}%")
                  ->orWhere('barcode', 'ilike', "%{$search}%")
                  ->orWhere('brand', 'ilike', "%{$search}%");
            });
        }

        if ($category = $request->input('category')) {
            $query->where('category', $category);
        }

        if ($request->has('is_active') && $request->input('is_active') !== '') {
            $query->where('is_active', $request->boolean('is_active'));
        }

        $products = $query->with(['centralInventory'])
            ->orderByDesc('created_at')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Products/Index', [
            'products' => $products,
            'filters' => $request->only(['search', 'category', 'is_active']),
            'categories' => Product::getCategories(),
        ]);
    }

    public function store(StoreProductRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            $data['image_path'] = $this->uploadAndCompressImage($request->file('image'));
        }

        $product = Product::create($data);

        // Initialize central inventory with 0
        CentralInventory::create([
            'product_id' => $product->id,
            'quantity' => 0,
        ]);

        AuditLog::log('created', Product::class, $product->id, null, $product->toArray());

        return redirect()->route('products.index')
            ->with('success', 'Produk berhasil ditambahkan.');
    }

    public function show(Product $product)
    {
        $product->load(['centralInventory', 'branchInventories.branch']);

        return Inertia::render('Admin/Products/Show', [
            'product' => $product,
        ]);
    }

    public function update(StoreProductRequest $request, Product $product)
    {
        $data = $request->validated();
        $old = $product->toArray();

        if ($request->hasFile('image')) {
            if ($product->image_path) {
                Storage::disk('public')->delete($product->image_path);
            }
            $data['image_path'] = $this->uploadAndCompressImage($request->file('image'));
        }

        $product->update($data);

        AuditLog::log('updated', Product::class, $product->id, $old, $product->fresh()->toArray());

        return redirect()->route('products.index')
            ->with('success', 'Produk berhasil diperbarui.');
    }

    public function destroy(Product $product)
    {
        $old = $product->toArray();
        if ($product->image_path) {
            Storage::disk('public')->delete($product->image_path);
        }

        $product->delete();

        AuditLog::log('deleted', Product::class, $product->id, $old);

        return redirect()->route('products.index')
            ->with('success', 'Produk berhasil dihapus.');
    }
}
