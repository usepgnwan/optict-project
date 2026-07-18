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
        'complaintTypes' => \App\Models\ComplaintType::active()->ordered()->get(),
        'faqs' => \App\Models\Faq::active()->ordered()->get(),
        'specialistServices' => \App\Models\SpecialistService::active()->ordered()->take(4)->get(),
    ]);
});

Route::get('/booking', function () {
    return Inertia::render('Booking', [
        'branches' => \App\Models\Branch::active()->get(),
        'complaintTypes' => \App\Models\ComplaintType::active()->ordered()->get(),
    ]);
})->name('booking');

Route::post('/booking', [\App\Http\Controllers\BookingSubmissionController::class, 'store'])->name('booking.store');

Route::get('/reservasi', function () {
    return redirect('/booking');
});

Route::get('/katalog-kacamata', function () {
    return Inertia::render('Catalog', [
        'dbProducts' => \App\Models\Product::active()->with(['centralInventory', 'branchInventories.branch'])->get(),
        'branches' => \App\Models\Branch::active()->get(),
    ]);
})->name('catalog');

// Public Layanan Spesialis Routes
Route::get('/layanan', [\App\Http\Controllers\SpecialistServiceController::class, 'publicIndex'])->name('layanan.index');
Route::get('/layanan/{slug}', [\App\Http\Controllers\SpecialistServiceController::class, 'publicShow'])->name('layanan.show');

Route::get('/affiliate', function () {
    $products = \App\Models\Product::active()
        ->whereNotNull('commission_amount')
        ->where('commission_amount', '>', 0)
        ->get(['name', 'category', 'commission_amount', 'commission_type']);
        
    $services = \App\Models\Service::active()
        ->whereNotNull('commission_amount')
        ->where('commission_amount', '>', 0)
        ->get(['name', 'commission_amount', 'commission_type']);

    return Inertia::render('Affiliate', [
        'products' => $products,
        'services' => $services,
    ]);
})->name('affiliate');
Route::post('/affiliate', [\App\Http\Controllers\AffiliateController::class, 'store'])->name('affiliate.store');

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

// ═══════════════════════════════════════════════════════════════
// AFFILIATOR ROUTES — accessible by affiliator role only
// ═══════════════════════════════════════════════════════════════
Route::middleware(['auth', 'verified', 'role:affiliator'])->group(function () {
    Route::get('/affiliate/settings', [ProfileController::class, 'edit'])->name('affiliate.settings');
    Route::patch('/affiliate/settings', [ProfileController::class, 'update'])->name('affiliate.settings.update');
});

// ═══════════════════════════════════════════════════════════════
// AUTHENTICATED ROUTES — ALL LOGGED-IN USERS
// ═══════════════════════════════════════════════════════════════
Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard (role-adaptive: shows different content based on role)
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Profile (accessible by ALL roles)
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Affiliate commission history — RBAC handled inside the controller
    Route::get('/riwayat/affiliate', [\App\Http\Controllers\AffiliateHistoryController::class, 'index'])->name('riwayat.affiliate');

    // Marketing Kits index — RBAC handled inside the controller (read-only for affiliators)
    Route::get('/marketing-kits', [\App\Http\Controllers\Admin\MarketingKitController::class, 'index'])->name('marketing-kits.index');
});


// ═══════════════════════════════════════════════════════════════
// ADMIN/STAFF ROUTES — accessible by all non-affiliator roles
// ═══════════════════════════════════════════════════════════════
Route::middleware(['auth', 'verified', 'role:super_admin,warehouse_admin,branch_admin,manager'])->group(function () {
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

    // Affiliate Management (Admin manages affiliates)
    Route::get('/affiliates', [\App\Http\Controllers\Admin\AffiliateManagementController::class, 'index'])->name('admin.affiliates.index');
    Route::post('/affiliates/{affiliate}/approve', [\App\Http\Controllers\Admin\AffiliateManagementController::class, 'approve'])->name('admin.affiliates.approve');
    Route::post('/affiliates/{affiliate}/reject', [\App\Http\Controllers\Admin\AffiliateManagementController::class, 'reject'])->name('admin.affiliates.reject');

    // Affiliate commission history status updates (Admin side)
    Route::post('/riwayat/affiliate/{sale}/status', [\App\Http\Controllers\AffiliateHistoryController::class, 'updateStatus'])->name('riwayat.affiliate.status');

    // Marketing Kits — Admin actions (store, update, destroy)
    Route::post('/marketing-kits', [\App\Http\Controllers\Admin\MarketingKitController::class, 'store'])->name('marketing-kits.store');
    Route::put('/marketing-kits/{marketing_kit}', [\App\Http\Controllers\Admin\MarketingKitController::class, 'update'])->name('marketing-kits.update');
    Route::delete('/marketing-kits/{marketing_kit}', [\App\Http\Controllers\Admin\MarketingKitController::class, 'destroy'])->name('marketing-kits.destroy');

    // Reservation & POS Module Routes
    Route::resource('service-categories', \App\Http\Controllers\ServiceCategoryController::class);
    Route::resource('services', \App\Http\Controllers\ServiceMasterController::class);
    Route::resource('customers', \App\Http\Controllers\CustomerController::class);
    Route::get('/api/customers/search', [\App\Http\Controllers\CustomerController::class, 'search'])->name('customers.search');

    Route::resource('complaint-types', \App\Http\Controllers\ComplaintTypeController::class);
    Route::resource('faqs', \App\Http\Controllers\FaqController::class)->except(['create', 'edit', 'show']);
    Route::resource('specialist-services', \App\Http\Controllers\SpecialistServiceController::class)->except(['create', 'edit', 'show']);
    Route::resource('reservations', \App\Http\Controllers\ReservationController::class);
    Route::post('/reservations/{reservation}/status', [\App\Http\Controllers\ReservationController::class, 'updateStatus'])->name('reservations.status');

    Route::get('/pos', [\App\Http\Controllers\POSController::class, 'index'])->name('pos.index');
    Route::post('/pos/checkout', [\App\Http\Controllers\POSController::class, 'checkout'])->name('pos.checkout');
    Route::post('/pos/sales/{sale}/void', [\App\Http\Controllers\POSController::class, 'voidSale'])->name('pos.void');
    Route::get('/pos/dashboard', [\App\Http\Controllers\POSDashboardController::class, 'index'])->name('pos.dashboard');
});

require __DIR__.'/auth.php';

