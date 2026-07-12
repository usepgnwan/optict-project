<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBranchRequest;
use App\Models\AuditLog;
use App\Models\Branch;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BranchController extends Controller
{
    public function index(Request $request)
    {
        $query = Branch::query();

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                  ->orWhere('city', 'ilike', "%{$search}%")
                  ->orWhere('address', 'ilike', "%{$search}%");
            });
        }

        if ($request->has('is_active') && $request->input('is_active') !== '') {
            $query->where('is_active', $request->boolean('is_active'));
        }

        $branches = $query->withCount('users')
            ->orderByDesc('created_at')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Branches/Index', [
            'branches' => $branches,
            'filters' => $request->only(['search', 'is_active']),
        ]);
    }

    public function store(StoreBranchRequest $request)
    {
        $branch = Branch::create($request->validated());
        AuditLog::log('created', Branch::class, $branch->id, null, $branch->toArray());

        return redirect()->route('branches.index')
            ->with('success', 'Cabang berhasil ditambahkan.');
    }

    public function show(Branch $branch)
    {
        $branch->load('inventory.product');
        $branch->loadCount('users');

        return Inertia::render('Admin/Branches/Show', [
            'branch' => $branch,
        ]);
    }

    public function update(StoreBranchRequest $request, Branch $branch)
    {
        $old = $branch->toArray();
        $branch->update($request->validated());
        AuditLog::log('updated', Branch::class, $branch->id, $old, $branch->fresh()->toArray());

        return redirect()->route('branches.index')
            ->with('success', 'Cabang berhasil diperbarui.');
    }

    public function destroy(Branch $branch)
    {
        $old = $branch->toArray();
        $branch->delete();
        AuditLog::log('deleted', Branch::class, $branch->id, $old);

        return redirect()->route('branches.index')
            ->with('success', 'Cabang berhasil dihapus.');
    }
}
