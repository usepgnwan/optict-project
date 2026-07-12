<?php

use App\Http\Controllers\BranchController;
use App\Http\Controllers\BranchInventoryController;
use App\Http\Controllers\CentralInventoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\StockAdjustmentController;
use App\Http\Controllers\StockOpnameController;
use App\Http\Controllers\StockTransferController;
use App\Http\Controllers\UserManagementController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home', [
        'dbProducts' => \App\Models\Product::active()->with(['centralInventory', 'branchInventories.branch'])->get(),
        'branches' => \App\Models\Branch::active()->get(),
    ]);
});

Route::get('/katalog-kacamata', function () {
    return Inertia::render('Catalog', [
        'dbProducts' => \App\Models\Product::active()->with(['centralInventory', 'branchInventories.branch'])->get(),
        'branches' => \App\Models\Branch::active()->get(),
    ]);
})->name('catalog');

Route::get('/katalog-kacamata/{slug}', function ($slug) {
    $products = \App\Models\Product::active()->with(['centralInventory', 'branchInventories.branch'])->get();
    $dbProduct = $products->first(function ($p) use ($slug) {
        return \Illuminate\Support\Str::slug($p->name) === $slug
            || \Illuminate\Support\Str::slug($p->sku) === $slug
            || (string) $p->id === $slug;
    });

    return Inertia::render('CatalogDetail', [
        'slug' => $slug,
        'dbProduct' => $dbProduct,
        'dbProducts' => $products,
        'branches' => \App\Models\Branch::active()->get(),
    ]);
})->name('catalog.show');

// Authenticated & Verified Management System Routes
Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Master Data
    Route::resource('branches', BranchController::class);
    Route::resource('products', ProductController::class);

    // Inventory
    Route::get('/central-inventory', [CentralInventoryController::class, 'index'])->name('central-inventory.index');
    Route::get('/branch-inventory', [BranchInventoryController::class, 'index'])->name('branch-inventory.index');

    // Stock Operations
    Route::resource('stock-transfers', StockTransferController::class)->except(['edit', 'update']);
    Route::post('/stock-transfers/{stock_transfer}/approve', [StockTransferController::class, 'approve'])->name('stock-transfers.approve');
    Route::post('/stock-transfers/{stock_transfer}/ship', [StockTransferController::class, 'ship'])->name('stock-transfers.ship');
    Route::post('/stock-transfers/{stock_transfer}/receive', [StockTransferController::class, 'receive'])->name('stock-transfers.receive');
    Route::post('/stock-transfers/{stock_transfer}/cancel', [StockTransferController::class, 'cancel'])->name('stock-transfers.cancel');

    Route::resource('stock-adjustments', StockAdjustmentController::class)->only(['index', 'create', 'store']);

    Route::resource('stock-opnames', StockOpnameController::class)->only(['index', 'create', 'store', 'show']);
    Route::post('/stock-opnames/{stock_opname}/start', [StockOpnameController::class, 'startCounting'])->name('stock-opnames.start');
    Route::post('/stock-opnames/{stock_opname}/counts', [StockOpnameController::class, 'updateCounts'])->name('stock-opnames.counts');
    Route::post('/stock-opnames/{stock_opname}/approve', [StockOpnameController::class, 'approve'])->name('stock-opnames.approve');

    // Reports
    Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
    Route::get('/reports/stock', [ReportController::class, 'stockReport'])->name('reports.stock');
    Route::get('/reports/movements', [ReportController::class, 'movementReport'])->name('reports.movements');
    Route::get('/reports/transfers', [ReportController::class, 'transferReport'])->name('reports.transfers');
    Route::get('/reports/adjustments', [ReportController::class, 'adjustmentReport'])->name('reports.adjustments');

    // User Management
    Route::resource('users', UserManagementController::class)->except(['create', 'edit', 'show']);

    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
