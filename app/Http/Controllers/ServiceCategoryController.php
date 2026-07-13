<?php

namespace App\Http\Controllers;

use App\Models\ServiceCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ServiceCategoryController extends Controller
{
    public function index(Request $request)
    {
        $query = ServiceCategory::withCount('services');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('code', 'like', "%{$search}%")
                  ->orWhere('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $categories = $query->orderBy('code', 'asc')->paginate(15)->withQueryString();

        return Inertia::render('Admin/ServiceCategories/Index', [
            'categories' => $categories,
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:50|unique:service_categories,code',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ], [
            'code.unique' => 'Kode kategori sudah digunakan, silakan pilih kode lain.',
        ]);

        ServiceCategory::create($validated);

        return redirect()->back()->with('success', 'Kategori layanan berhasil ditambahkan.');
    }

    public function update(Request $request, ServiceCategory $serviceCategory)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:50|unique:service_categories,code,' . $serviceCategory->id,
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ], [
            'code.unique' => 'Kode kategori sudah digunakan, silakan pilih kode lain.',
        ]);

        $serviceCategory->update($validated);

        return redirect()->back()->with('success', 'Kategori layanan berhasil diperbarui.');
    }

    public function destroy(ServiceCategory $serviceCategory)
    {
        if ($serviceCategory->services()->exists()) {
            return redirect()->back()->with('error', 'Kategori layanan tidak dapat dihapus karena masih digunakan oleh ' . $serviceCategory->services()->count() . ' layanan.');
        }

        $serviceCategory->delete();

        return redirect()->back()->with('success', 'Kategori layanan berhasil dihapus.');
    }
}
