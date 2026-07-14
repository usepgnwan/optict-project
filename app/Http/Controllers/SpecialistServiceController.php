<?php

namespace App\Http\Controllers;

use App\Models\SpecialistService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SpecialistServiceController extends Controller
{
    // ─── Admin CRUD ───────────────────────────────────────────────

    public function index(Request $request)
    {
        $query = SpecialistService::query();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('slug', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $services = $query->orderBy('sort_order', 'asc')
            ->orderBy('id', 'asc')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/SpecialistServices/Index', [
            'services' => $services,
            'filters'  => $request->only(['search']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'thumbnail'   => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'is_active'   => 'boolean',
        ]);

        $validated['slug']       = SpecialistService::generateSlug($validated['title']);
        $validated['sort_order'] = SpecialistService::max('sort_order') + 1;

        if ($request->hasFile('thumbnail')) {
            $validated['thumbnail'] = $request->file('thumbnail')->store('specialist-services', 'public');
        }

        SpecialistService::create($validated);

        return redirect()->back()->with('success', 'Layanan spesialis berhasil ditambahkan.');
    }

    public function update(Request $request, SpecialistService $specialistService)
    {
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'thumbnail'   => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'is_active'   => 'boolean',
        ]);

        // Regenerate slug only when title changes
        if ($validated['title'] !== $specialistService->title) {
            $validated['slug'] = SpecialistService::generateSlug($validated['title'], $specialistService->id);
        }

        if ($request->hasFile('thumbnail')) {
            if ($specialistService->thumbnail) {
                Storage::disk('public')->delete($specialistService->thumbnail);
            }
            $validated['thumbnail'] = $request->file('thumbnail')->store('specialist-services', 'public');
        } else {
            unset($validated['thumbnail']);
        }

        $specialistService->update($validated);

        return redirect()->back()->with('success', 'Layanan spesialis berhasil diperbarui.');
    }

    public function destroy(SpecialistService $specialistService)
    {
        if ($specialistService->thumbnail) {
            Storage::disk('public')->delete($specialistService->thumbnail);
        }
        $specialistService->delete();

        return redirect()->back()->with('success', 'Layanan spesialis berhasil dihapus.');
    }

    // ─── Public Pages ─────────────────────────────────────────────

    public function publicIndex()
    {
        $services = SpecialistService::active()->ordered()->get();

        return Inertia::render('Layanan/Index', [
            'services' => $services,
        ]);
    }

    public function publicShow(string $slug)
    {
        $service = SpecialistService::where('slug', $slug)->where('is_active', true)->firstOrFail();
        $otherServices = SpecialistService::active()->ordered()->where('id', '!=', $service->id)->get();

        return Inertia::render('Layanan/Show', [
            'service'       => $service,
            'otherServices' => $otherServices,
        ]);
    }
}
