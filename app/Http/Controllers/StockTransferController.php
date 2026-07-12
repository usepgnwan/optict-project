<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTransferRequest;
use App\Models\Branch;
use App\Models\Product;
use App\Models\StockTransfer;
use App\Services\TransferService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StockTransferController extends Controller
{
    public function __construct(
        protected TransferService $transferService
    ) {}

    public function index(Request $request)
    {
        $query = StockTransfer::with(['sourceBranch', 'destinationBranch', 'creator', 'approver']);

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        $transfers = $query->orderByDesc('created_at')->paginate(15)->withQueryString();

        return Inertia::render('Admin/Transfers/Index', [
            'transfers' => $transfers,
            'filters' => $request->only(['status']),
            'statuses' => StockTransfer::getStatuses(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Transfers/Create', [
            'branches' => Branch::active()->get(),
            'products' => Product::active()->with(['centralInventory', 'branchInventories'])->get(),
        ]);
    }

    public function store(StoreTransferRequest $request)
    {
        $data = $request->validated();
        $items = $data['items'];
        unset($data['items']);

        $transfer = $this->transferService->createTransfer($data, $items, $request->user()->id);

        return redirect()->route('stock-transfers.show', $transfer)
            ->with('success', 'Transfer stok berhasil dibuat dengan status Draft.');
    }

    public function show(StockTransfer $stockTransfer)
    {
        $stockTransfer->load(['items.product', 'sourceBranch', 'destinationBranch', 'creator', 'approver']);

        return Inertia::render('Admin/Transfers/Show', [
            'transfer' => $stockTransfer,
        ]);
    }

    public function approve(Request $request, StockTransfer $stockTransfer)
    {
        try {
            $this->transferService->approve($stockTransfer, $request->user()->id);
            return back()->with('success', 'Transfer berhasil disetujui.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function ship(StockTransfer $stockTransfer)
    {
        try {
            $this->transferService->ship($stockTransfer);
            return back()->with('success', 'Transfer ditandai sedang dikirim.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function receive(Request $request, StockTransfer $stockTransfer)
    {
        try {
            $this->transferService->receive($stockTransfer, $request->user()->id);
            return back()->with('success', 'Transfer berhasil diterima dan stok telah diperbarui.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function cancel(Request $request, StockTransfer $stockTransfer)
    {
        try {
            $this->transferService->cancel($stockTransfer, $request->user()->id);
            return back()->with('success', 'Transfer berhasil dibatalkan.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}
