<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MarketingKit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class MarketingKitController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $isAffiliator = $user && $user->role && $user->role->name === 'affiliator';

        $query = MarketingKit::query();
        if ($isAffiliator) {
            $query->where('is_active', true);
        }

        return Inertia::render('Admin/MarketingKits/Index', [
            'marketingKits' => $query->latest()->get(),
            'isAffiliator'  => $isAffiliator,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'image' => 'nullable|image|max:2048',
            'video_url' => 'nullable|url|max:255',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            $validated['image_path'] = $request->file('image')->store('marketing_kits', 'public');
        }

        MarketingKit::create($validated);

        return back()->with('success', 'Materi promosi berhasil ditambahkan.');
    }

    public function update(Request $request, MarketingKit $marketingKit)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'image' => 'nullable|image|max:2048',
            'video_url' => 'nullable|url|max:255',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            if ($marketingKit->image_path) {
                Storage::disk('public')->delete($marketingKit->image_path);
            }
            $validated['image_path'] = $request->file('image')->store('marketing_kits', 'public');
        }

        $marketingKit->update($validated);

        return back()->with('success', 'Materi promosi berhasil diperbarui.');
    }

    public function destroy(MarketingKit $marketingKit)
    {
        if ($marketingKit->image_path) {
            Storage::disk('public')->delete($marketingKit->image_path);
        }
        $marketingKit->delete();

        return back()->with('success', 'Materi promosi berhasil dihapus.');
    }
}
