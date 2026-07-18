<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\ServiceCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ServiceMasterController extends Controller
{
    public function index(Request $request)
    {
        $query = Service::with('category');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('service_code', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($request->filled('category_id')) {
            $query->where('service_category_id', $request->category_id);
        }

        $services = $query->orderBy('service_code')->paginate(15)->withQueryString();
        $categories = ServiceCategory::orderBy('name')->get();

        return Inertia::render('Admin/Services/Index', [
            'services' => $services,
            'categories' => $categories,
            'filters' => $request->only(['search', 'category_id']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'service_code' => 'required|string|unique:services,service_code',
            'name' => 'required|string|max:255',
            'service_category_id' => 'nullable|exists:service_categories,id',
            'description' => 'nullable|string',
            'duration_minutes' => 'required|integer|min:5',
            'price' => 'required|numeric|min:0',
            'is_active' => 'boolean',
            'commission_type' => 'nullable|in:percentage,fixed',
            'commission_amount' => 'nullable|numeric|min:0',
        ]);

        Service::create($validated);

        return redirect()->back()->with('success', 'Service created successfully.');
    }

    public function update(Request $request, Service $service)
    {
        $validated = $request->validate([
            'service_code' => 'required|string|unique:services,service_code,' . $service->id,
            'name' => 'required|string|max:255',
            'service_category_id' => 'nullable|exists:service_categories,id',
            'description' => 'nullable|string',
            'duration_minutes' => 'required|integer|min:5',
            'price' => 'required|numeric|min:0',
            'is_active' => 'boolean',
            'commission_type' => 'nullable|in:percentage,fixed',
            'commission_amount' => 'nullable|numeric|min:0',
        ]);

        $service->update($validated);

        return redirect()->back()->with('success', 'Service updated successfully.');
    }

    public function destroy(Service $service)
    {
        $service->delete();

        return redirect()->back()->with('success', 'Service deleted successfully.');
    }
}
