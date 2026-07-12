<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOpnameRequest;
use App\Models\Branch;
use App\Models\StockOpname;
use App\Services\OpnameService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StockOpnameController extends Controller
{
    public function __construct(
        protected OpnameService $opnameService
    ) {}

    public function index(Request $request)
    {
        $query = StockOpname::with(['branch', 'creator', 'approver']);

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        $opnames = $query->orderByDesc('created_at')->paginate(15)->withQueryString();

        return Inertia::render('Admin/Opnames/Index', [
            'opnames' => $opnames,
            'filters' => $request->only(['status']),
            'statuses' => StockOpname::getStatuses(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Opnames/Create', [
            'branches' => Branch::active()->get(),
        ]);
    }

    public function store(StoreOpnameRequest $request)
    {
        $opname = $this->opnameService->create($request->validated(), $request->user()->id);

        return redirect()->route('stock-opnames.show', $opname)
            ->with('success', 'Sesi Stock Opname berhasil dibuat.');
    }

    public function show(StockOpname $stockOpname)
    {
        $stockOpname->load(['items.product', 'branch', 'creator', 'approver']);

        return Inertia::render('Admin/Opnames/Show', [
            'opname' => $stockOpname,
        ]);
    }

    public function startCounting(StockOpname $stockOpname)
    {
        $this->opnameService->startCounting($stockOpname);

        return back()->with('success', 'Penghitungan fisik dimulai.');
    }

    public function updateCounts(Request $request, StockOpname $stockOpname)
    {
        $request->validate(['counts' => 'required|array']);

        $this->opnameService->updateCounts($stockOpname, $request->input('counts'));

        return back()->with('success', 'Hasil penghitungan fisik berhasil disimpan.');
    }

    public function approve(Request $request, StockOpname $stockOpname)
    {
        $this->opnameService->approve($stockOpname, $request->user()->id);

        return back()->with('success', 'Stock Opname disetujui & penyesuaian otomatis telah diterapkan.');
    }
}
