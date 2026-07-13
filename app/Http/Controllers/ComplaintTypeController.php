<?php

namespace App\Http\Controllers;

use App\Models\ComplaintType;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ComplaintTypeController extends Controller
{
    public function index(Request $request)
    {
        $query = ComplaintType::query();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $complaintTypes = $query->orderBy('sort_order', 'asc')
            ->orderBy('id', 'asc')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/ComplaintTypes/Index', [
            'complaintTypes' => $complaintTypes,
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'sort_order' => 'required|integer|min:0',
            'is_active' => 'boolean',
        ]);

        ComplaintType::create($validated);

        return redirect()->back()->with('success', 'Tipe keluhan berhasil ditambahkan.');
    }

    public function update(Request $request, ComplaintType $complaintType)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'sort_order' => 'required|integer|min:0',
            'is_active' => 'boolean',
        ]);

        $complaintType->update($validated);

        return redirect()->back()->with('success', 'Tipe keluhan berhasil diperbarui.');
    }

    public function destroy(ComplaintType $complaintType)
    {
        $complaintType->delete();

        return redirect()->back()->with('success', 'Tipe keluhan berhasil dihapus.');
    }
}
