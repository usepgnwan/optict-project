import React, { useState, useMemo, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import ReceiptModal from './ReceiptModal';

interface Branch {
    id: number;
    name: string;
    city: string;
}

interface Service {
    id: number;
    service_code: string;
    name: string;
    price: number;
    duration_minutes: number;
    category?: { id: number; name: string };
}

interface Product {
    id: number;
    sku: string;
    name: string;
    selling_price: number;
    stock?: number;
    image_path?: string | null;
    image_url?: string | null;
    branch_inventories?: { current_stock: number }[];
}

interface Customer {
    id: number;
    customer_code: string;
    full_name: string;
    phone_number: string;
}

interface Reservation {
    id: number;
    reservation_number: string;
    reservation_date: string;
    reservation_time: string;
    customer?: Customer;
    items?: {
        id: number;
        service_id: number;
        qty: number;
        price: number;
        service?: Service;
    }[];
    affiliate_code?: string | null;
}

interface PaymentMethod {
    id: number;
    code: string;
    name: string;
    type: string;
}

interface Discount {
    id: number;
    code: string;
    name: string;
    type: string;
    value: number;
}

interface CartItem {
    id: string;
    item_type: 'service' | 'product';
    service_id?: number;
    product_id?: number;
    item_name: string;
    qty: number;
    unit_price: number;
    discount: number;
    subtotal: number;
}

interface PaymentEntry {
    payment_method_name: string;
    amount: number;
    reference_number?: string;
}

interface ConfirmPopupState {
    show: boolean;
    title: string;
    message: string;
    confirmText: string;
    variant: 'danger' | 'warning' | 'primary';
    onConfirm: () => void;
}

interface POSPageProps {
    branches: Branch[];
    currentBranchId: number;
    services: Service[];
    products: Product[];
    customers: Customer[];
    reservations: Reservation[];
    paymentMethods: PaymentMethod[];
    discounts: Discount[];
    recentSales: any[];
}

export default function POSIndex({
    branches,
    currentBranchId,
    services,
    products,
    customers,
    reservations,
    paymentMethods,
    discounts,
    recentSales,
}: POSPageProps) {
    const currentBranch = branches.find((b) => b.id === currentBranchId);
    const currentBranchName = currentBranch ? `${currentBranch.name}` : 'Cabang Optik';

    // Active tab in catalog: 'services' | 'products'
    const [catalogTab, setCatalogTab] = useState<'services' | 'products'>('services');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [barcodeInput, setBarcodeInput] = useState('');

    // Customer mode: 'walkin' | 'reservation'
    const [customerMode, setCustomerMode] = useState<'walkin' | 'reservation'>('walkin');
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [walkinName, setWalkinName] = useState('');
    const [walkinPhone, setWalkinPhone] = useState('');
    const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
    const [affiliateCode, setAffiliateCode] = useState('');

    // Cart State
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [globalDiscount, setGlobalDiscount] = useState<number>(0);
    const [taxRate, setTaxRate] = useState<number>(0);
    const [selectedBranchId, setSelectedBranchId] = useState<number>(currentBranchId || (branches[0]?.id ?? 1));

    // Clear cart automatically when branch switches to ensure accurate stock
    useEffect(() => {
        setSelectedBranchId(currentBranchId);
        setCartItems([]);
    }, [currentBranchId]);

    // Checkout Modal State
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentEntries, setPaymentEntries] = useState<PaymentEntry[]>([
        { payment_method_name: paymentMethods[0]?.name || 'Cash', amount: 0 },
    ]);

    // Receipt Modal State
    const [completedSale, setCompletedSale] = useState<any>(null);

    // Void Modal State
    const [showVoidModal, setShowVoidModal] = useState(false);
    const [voidSaleTarget, setVoidSaleTarget] = useState<any>(null);
    const [voidReason, setVoidReason] = useState('');

    // Held Transactions
    const [heldCarts, setHeldCarts] = useState<{ id: string; name: string; items: CartItem[] }[]>([]);

    // Custom Confirm Popup Modal State
    const [confirmPopup, setConfirmPopup] = useState<ConfirmPopupState>({
        show: false,
        title: '',
        message: '',
        confirmText: 'Ya, Lanjutkan',
        variant: 'warning',
        onConfirm: () => { },
    });

    const formatRupiah = (val: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(val);
    };

    // Subtotal & Grand Total calculations
    const subtotalServices = useMemo(
        () => cartItems.filter((i) => i.item_type === 'service').reduce((sum, i) => sum + i.subtotal, 0),
        [cartItems]
    );

    const subtotalProducts = useMemo(
        () => cartItems.filter((i) => i.item_type === 'product').reduce((sum, i) => sum + i.subtotal, 0),
        [cartItems]
    );

    const subtotalBeforeDiscount = subtotalServices + subtotalProducts;
    const netSubtotal = Math.max(0, subtotalBeforeDiscount - globalDiscount);
    const taxAmount = netSubtotal * taxRate;
    const grandTotal = netSubtotal + taxAmount;

    const outOfStockCartItems = useMemo(() => {
        return cartItems.filter((cartItem) => {
            if (cartItem.item_type !== 'product') return false;
            const matchingProduct = products.find((p) => p.id === cartItem.product_id);
            if (!matchingProduct) return false;
            const currentStock = matchingProduct.stock !== undefined
                ? Number(matchingProduct.stock)
                : (matchingProduct.branch_inventories?.reduce((sum, inv) => sum + Number(inv.current_stock || 0), 0) ?? 0);
            return currentStock <= 0 || cartItem.qty > currentStock;
        });
    }, [cartItems, products]);

    const hasOutOfStockCartItems = outOfStockCartItems.length > 0;

    // Handle Barcode enter
    const handleBarcodeSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!barcodeInput.trim()) return;

        const foundProd = products.find(
            (p) => p.sku.toLowerCase() === barcodeInput.trim().toLowerCase()
        );
        if (foundProd) {
            addItemToCart({
                id: `prod-${foundProd.id}`,
                item_type: 'product',
                product_id: foundProd.id,
                item_name: foundProd.name,
                qty: 1,
                unit_price: Number(foundProd.selling_price),
                discount: 0,
                subtotal: Number(foundProd.selling_price),
            });
            setBarcodeInput('');
        } else {
            alert('Produk dengan SKU/Barcode tersebut tidak ditemukan di cabang ini.');
        }
    };

    const addItemToCart = (item: CartItem) => {
        setCartItems((prev) => {
            const existing = prev.find((x) => x.id === item.id);
            if (existing) {
                const updatedQty = existing.qty + item.qty;
                const updatedSubtotal = updatedQty * (existing.unit_price - existing.discount);
                return prev.map((x) =>
                    x.id === item.id ? { ...x, qty: updatedQty, subtotal: updatedSubtotal } : x
                );
            }
            return [...prev, item];
        });
    };

    const updateItemQty = (cartId: string, delta: number) => {
        setCartItems((prev) =>
            prev
                .map((x) => {
                    if (x.id === cartId) {
                        const newQty = Math.max(0, x.qty + delta);
                        return {
                            ...x,
                            qty: newQty,
                            subtotal: newQty * (x.unit_price - x.discount),
                        };
                    }
                    return x;
                })
                .filter((x) => x.qty > 0)
        );
    };

    const removeItemFromCart = (cartId: string) => {
        setCartItems((prev) => prev.filter((x) => x.id !== cartId));
    };

    // Load Existing Reservation
    const handleSelectReservation = (resId: number) => {
        const res = reservations.find((r) => r.id === resId);
        if (!res) return;

        setSelectedReservation(res);
        if (res.customer) setSelectedCustomer(res.customer);

        if (res.affiliate_code) {
            setAffiliateCode(res.affiliate_code);
        } else {
            setAffiliateCode('');
        }

        const newCart: CartItem[] = [];
        res.items?.forEach((item) => {
            newCart.push({
                id: `srv-${item.service_id}`,
                item_type: 'service',
                service_id: item.service_id,
                item_name: item.service?.name || 'Layanan Reservasi',
                qty: item.qty,
                unit_price: Number(item.price),
                discount: 0,
                subtotal: item.qty * Number(item.price),
            });
        });
        setCartItems(newCart);
    };

    // Hold & Resume
    const holdCurrentCart = () => {
        if (cartItems.length === 0) return;
        const holdName = `${selectedCustomer?.full_name || 'Walk-In'} (${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })})`;
        setHeldCarts([...heldCarts, { id: String(Date.now()), name: holdName, items: cartItems }]);
        setCartItems([]);
    };

    const resumeCart = (heldId: string) => {
        const found = heldCarts.find((h) => h.id === heldId);
        if (found) {
            setCartItems(found.items);
            setHeldCarts(heldCarts.filter((h) => h.id !== heldId));
        }
    };

    // Multi payment helpers
    const addPaymentEntry = () => {
        const currentPaid = paymentEntries.reduce((sum, p) => sum + Number(p.amount || 0), 0);
        const remaining = Math.max(0, grandTotal - currentPaid);
        setPaymentEntries([
            ...paymentEntries,
            { payment_method_name: paymentMethods[0]?.name || 'Cash', amount: remaining },
        ]);
    };

    const removePaymentEntry = (index: number) => {
        if (paymentEntries.length <= 1) return;
        setPaymentEntries(paymentEntries.filter((_, idx) => idx !== index));
    };

    const totalPaidAmount = paymentEntries.reduce((sum, p) => sum + Number(p.amount || 0), 0);
    const remainingToPay = Math.max(0, grandTotal - totalPaidAmount);
    const changeAmount = Math.max(0, totalPaidAmount - grandTotal);

    const setQuickCashAmount = (amount: number) => {
        const updated = [...paymentEntries];
        updated[0] = { ...updated[0], amount };
        setPaymentEntries(updated);
    };

    // Final Checkout
    const handleProcessCheckout = () => {
        if (cartItems.length === 0) {
            alert('Keranjang kasir masih kosong.');
            return;
        }
        if (totalPaidAmount < grandTotal) {
            alert(`Pembayaran masih kurang ${formatRupiah(remainingToPay)}.`);
            return;
        }

        router.post(
            route('pos.checkout'),
            {
                branch_id: currentBranchId,
                customer_id: selectedCustomer?.id || null,
                walkin_name: !selectedCustomer ? (walkinName || 'Pelanggan Walk-In') : null,
                walkin_phone: !selectedCustomer ? (walkinPhone || null) : null,
                reservation_id: selectedReservation?.id || null,
                subtotal_products: subtotalProducts,
                subtotal_services: subtotalServices,
                discount_amount: globalDiscount,
                tax_amount: taxAmount,
                grand_total: grandTotal,
                paid_amount: totalPaidAmount,
                change_amount: changeAmount,
                affiliate_code: affiliateCode || null,
                items: cartItems.map((i) => ({
                    item_type: i.item_type,
                    service_id: i.service_id || null,
                    product_id: i.product_id || null,
                    item_name: i.item_name,
                    qty: i.qty,
                    unit_price: i.unit_price,
                    discount: i.discount,
                    subtotal: i.subtotal,
                })),
                payments: paymentEntries.map((p) => {
                    const foundMethod = paymentMethods.find((m) => m.name === p.payment_method_name);
                    return {
                        payment_method_id: foundMethod?.id || null,
                        payment_method_name: p.payment_method_name,
                        amount: Number(p.amount),
                        reference_number: p.reference_number || null,
                    };
                }),
            },
            {
                onSuccess: (page: any) => {
                    setShowPaymentModal(false);
                    setCartItems([]);
                    setSelectedReservation(null);
                    setWalkinName('');
                    setWalkinPhone('');
                    setAffiliateCode('');

                    if (page?.props?.flash?.completed_sale_id) {
                        router.reload();
                    }
                },
            }
        );
    };

    // Void submission
    const handleSubmitVoid = (e: React.FormEvent) => {
        e.preventDefault();
        if (!voidSaleTarget || !voidReason.trim()) return;

        router.post(
            route('pos.void', voidSaleTarget.id),
            { reason: voidReason },
            {
                onSuccess: () => {
                    setShowVoidModal(false);
                    setVoidSaleTarget(null);
                    setVoidReason('');
                },
            }
        );
    };

    // Filter catalog
    const filteredServices = services.filter((s) => {
        const matchesSearch =
            s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.service_code.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory =
            selectedCategory === 'all' || String(s.category?.id) === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const filteredProducts = products.filter(
        (p) =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Categories distinct list
    const serviceCategories = useMemo(() => {
        const map = new Map<number, string>();
        services.forEach((s) => {
            if (s.category) map.set(s.category.id, s.category.name);
        });
        return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
    }, [services]);

    return (
        <AdminLayout>
            <Head title="POS Kasir (Point of Sale) - Harmoni by Phoeinx Sehat" />

            <div className="space-y-6 w-full min-w-0">
                {/* 1. TOP TOOLBAR HEADER */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface p-4 rounded-2xl border border-outline-variant shadow-xs">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-[24px]">point_of_sale</span>
                        </div>
                        <div className="min-w-0">
                            <h1 className="text-xl font-black text-on-surface tracking-tight truncate">
                                Kasir POS (Point of Sale)
                            </h1>
                            <p className="text-xs text-on-surface-variant flex flex-wrap items-center gap-1.5 mt-0.5">
                                <span>Cabang Aktif:</span>
                                <span className="font-bold text-primary">{currentBranchName}</span>
                                <span className="hidden sm:inline">•</span>
                                <span className="hidden sm:inline">Terminal Kasir & Reservasi</span>
                            </p>
                        </div>
                    </div>

                    {/* Quick Tools */}
                    <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                        {/* Branch Switcher */}
                        <div className="flex items-center gap-2 bg-surface-variant px-3.5 py-2 rounded-xl border border-outline-variant text-xs font-bold">
                            <span className="material-symbols-outlined text-[18px] text-primary">storefront</span>
                            <select
                                value={currentBranchId}
                                onChange={(e) => {
                                    setCartItems([]);
                                    router.get(route('pos.index'), { branch_id: e.target.value }, { preserveState: false });
                                }}
                                className="bg-transparent font-bold text-on-surface focus:outline-none cursor-pointer"
                            >
                                {branches.map((b) => (
                                    <option key={b.id} value={b.id}>
                                        {b.name} ({b.city})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Held Carts Button */}
                        {heldCarts.length > 0 && (
                            <div className="relative group">
                                <button className="px-3.5 py-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs border border-amber-500/30 flex items-center gap-1.5 cursor-pointer shadow-2xs">
                                    <span className="material-symbols-outlined text-[18px]">pause_circle</span>
                                    <span>{heldCarts.length} Tertahan</span>
                                </button>
                                <div className="absolute right-0 mt-1.5 w-72 bg-surface rounded-2xl shadow-2xl border border-outline-variant p-3 hidden group-hover:block z-30">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                                        Transaksi Tertahan (Hold)
                                    </p>
                                    <div className="space-y-1.5 max-h-48 overflow-y-auto">
                                        {heldCarts.map((h) => (
                                            <div
                                                key={h.id}
                                                onClick={() => resumeCart(h.id)}
                                                className="p-2.5 rounded-xl bg-surface-variant/60 hover:bg-primary/10 hover:text-primary transition-all cursor-pointer text-xs flex justify-between items-center"
                                            >
                                                <div className="truncate">
                                                    <p className="font-bold truncate">{h.name}</p>
                                                    <p className="text-[10px] text-on-surface-variant">{h.items.length} item</p>
                                                </div>
                                                <span className="text-xs font-black text-primary px-2.5 py-1 rounded-lg bg-primary/10">
                                                    Buka
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Reprint Last Receipt */}
                        <button
                            onClick={() => {
                                if (recentSales.length > 0) {
                                    setCompletedSale(recentSales[0]);
                                } else {
                                    alert('Belum ada riwayat transaksi selesai.');
                                }
                            }}
                            title="Cetak ulang struk transaksi terakhir"
                            className="px-3.5 py-2 rounded-xl bg-surface-variant text-on-surface-variant hover:text-primary hover:bg-tertiary/40 font-bold text-xs border border-outline-variant transition-all cursor-pointer flex items-center gap-1.5"
                        >
                            <span className="material-symbols-outlined text-[18px]">print</span>
                            <span>Reprint Struk</span>
                        </button>

                        {/* Void Transaction */}
                        <button
                            onClick={() => setShowVoidModal(true)}
                            title="Batalkan (Void) Transaksi POS"
                            className="px-3.5 py-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 font-bold text-xs border border-rose-500/30 transition-all cursor-pointer flex items-center gap-1.5"
                        >
                            <span className="material-symbols-outlined text-[18px]">remove_circle_outline</span>
                            <span>Void Transaksi</span>
                        </button>
                    </div>
                </div>

                {/* 2. CUSTOMER & RESERVATION WORKFLOW BANNER */}
                <div className="bg-surface rounded-2xl border border-outline-variant p-4 shadow-xs">
                    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                        {/* Mode Toggles */}
                        <div className="flex flex-wrap items-center gap-2">
                            <button
                                onClick={() => {
                                    setCustomerMode('walkin');
                                    setSelectedReservation(null);
                                }}
                                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${customerMode === 'walkin'
                                    ? 'bg-primary text-on-primary shadow-md shadow-primary/20'
                                    : 'bg-surface-variant text-on-surface-variant hover:text-on-surface'
                                    }`}
                            >
                                <span className="material-symbols-outlined text-[18px]">directions_walk</span>
                                <span>Opsi B: Pelanggan Walk-In</span>
                            </button>
                            <button
                                onClick={() => setCustomerMode('reservation')}
                                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${customerMode === 'reservation'
                                    ? 'bg-primary text-on-primary shadow-md shadow-primary/20'
                                    : 'bg-surface-variant text-on-surface-variant hover:text-on-surface'
                                    }`}
                            >
                                <span className="material-symbols-outlined text-[18px]">event</span>
                                <span>Opsi A: Pilih Reservasi ({reservations.length})</span>
                            </button>
                        </div>

                        {/* Selector Area */}
                        <div className="flex-1 xl:max-w-xl">
                            {customerMode === 'walkin' ? (
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-[20px]">person</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <select
                                            value={selectedCustomer?.id || ''}
                                            onChange={(e) => {
                                                const found = customers.find((c) => c.id === Number(e.target.value));
                                                setSelectedCustomer(found || null);
                                            }}
                                            className="w-full px-3.5 py-2.5 rounded-xl bg-surface-variant/60 border border-outline-variant text-sm font-bold text-on-surface focus:outline-none focus:border-primary truncate"
                                        >
                                            <option value="">-- Pelanggan Umum / Walk-In (Tanpa Member) --</option>
                                            {customers.map((c) => (
                                                <option key={c.id} value={c.id}>
                                                    {c.full_name} ({c.phone_number})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-[20px]">bookmark_added</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <select
                                            value={selectedReservation?.id || ''}
                                            onChange={(e) => handleSelectReservation(Number(e.target.value))}
                                            className="w-full px-3.5 py-2.5 rounded-xl bg-surface-variant/60 border border-outline-variant text-sm font-bold text-on-surface focus:outline-none focus:border-primary truncate"
                                        >
                                            <option value="">-- Pilih Reservasi Menunggu --</option>
                                            {reservations.map((res) => (
                                                <option key={res.id} value={res.id}>
                                                    {res.reservation_number} — {res.customer?.full_name} ({res.reservation_date} {res.reservation_time})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Affiliate Code Area */}
                        <div className="w-full xl:w-56 shrink-0 border-t xl:border-t-0 xl:border-l border-outline-variant pt-3 xl:pt-0 xl:pl-4 mt-2 xl:mt-0 flex flex-col justify-center">
                            <label className="block text-[10px] uppercase tracking-wider font-bold text-on-surface-variant mb-1">
                                Kode Affiliate
                            </label>
                            <input
                                type="text"
                                value={affiliateCode}
                                onChange={(e) => setAffiliateCode(e.target.value.toUpperCase())}
                                placeholder="Kosong / Cth: REF-01"
                                className="w-full px-3 py-2 rounded-xl bg-surface-variant/50 border border-outline-variant text-sm font-bold uppercase focus:outline-none focus:border-primary"
                            />
                        </div>
                    </div>
                </div>

                {/* 3. MAIN WORKSPACE: KATALOG DI KIRI & KERANJANG/DATA TRANSAKSI DI KANAN (PERSIS REFERENSI) */}
                <div className="flex flex-col lg:flex-row gap-6 items-start w-full min-w-0">
                    {/* LEFT COLUMN: CATALOG WORKSTATION (PRODUK & LAYANAN DI KIRI) */}
                    <div className="w-full lg:flex-1 min-w-0 space-y-5">
                        {/* SLEEK SEARCH & BARCODE SCANNER BAR */}
                        <div className="bg-surface rounded-2xl border border-outline-variant p-2 shadow-xs flex flex-col sm:flex-row items-center gap-2">
                            <div className="relative flex-1 w-full min-w-0">
                                <span className="material-symbols-outlined absolute left-3.5 top-2.5 text-[20px] text-on-surface-variant">
                                    search
                                </span>
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Cari produk atau layanan optik..."
                                    className="w-full pl-10 pr-4 py-2 bg-transparent border-none text-sm font-medium focus:outline-none focus:ring-0 text-on-surface"
                                />
                            </div>

                            <form onSubmit={handleBarcodeSubmit} className="flex items-center gap-2 w-full sm:w-auto border-t sm:border-t-0 pt-2 sm:pt-0 sm:border-l border-outline-variant sm:pl-3">
                                <div className="relative flex-1 sm:w-56">
                                    <span className="material-symbols-outlined absolute left-3 top-2 text-[18px] text-primary">
                                        barcode_scanner
                                    </span>
                                    <input
                                        type="text"
                                        value={barcodeInput}
                                        onChange={(e) => setBarcodeInput(e.target.value)}
                                        placeholder="Scan SKU Barcode..."
                                        className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-surface-variant/50 border border-outline-variant text-xs font-mono focus:outline-none focus:border-primary"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="px-3.5 py-1.5 rounded-xl bg-primary text-on-primary font-bold text-xs hover:bg-primary/90 transition-colors cursor-pointer shrink-0"
                                >
                                    Scan
                                </button>
                            </form>
                        </div>

                        {/* TAB SWITCHER & CATEGORY PILLS */}
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-2 bg-surface-variant/40 p-1 rounded-2xl border border-outline-variant">
                                <button
                                    onClick={() => setCatalogTab('products')}
                                    className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${catalogTab === 'products'
                                        ? 'bg-primary text-on-primary shadow-sm'
                                        : 'text-on-surface-variant hover:text-on-surface'
                                        }`}
                                >
                                    <span>Produk ({products.length})</span>
                                </button>
                                <button
                                    onClick={() => {
                                        setCatalogTab('services');
                                        setSelectedCategory('all');
                                    }}
                                    className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${catalogTab === 'services'
                                        ? 'bg-primary text-on-primary shadow-sm'
                                        : 'text-on-surface-variant hover:text-on-surface'
                                        }`}
                                >
                                    <span>Layanan ({services.length})</span>
                                </button>
                            </div>

                            {/* Category filter pills for services */}
                            {catalogTab === 'services' && serviceCategories.length > 0 && (
                                <div className="flex items-center gap-1.5 overflow-x-auto max-w-full">
                                    <button
                                        onClick={() => setSelectedCategory('all')}
                                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${selectedCategory === 'all'
                                            ? 'bg-primary text-on-primary shadow-xs'
                                            : 'bg-surface border border-outline-variant text-on-surface-variant hover:border-primary/50'
                                            }`}
                                    >
                                        Semua
                                    </button>
                                    {serviceCategories.map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => setSelectedCategory(String(cat.id))}
                                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${selectedCategory === String(cat.id)
                                                ? 'bg-primary text-on-primary shadow-xs'
                                                : 'bg-surface border border-outline-variant text-on-surface-variant hover:border-primary/50'
                                                }`}
                                        >
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 max-h-[640px] overflow-y-auto pr-1">
                            {catalogTab === 'products'
                                ? filteredProducts.map((prod) => {
                                    const stock =
                                        prod.stock !== undefined
                                            ? Number(prod.stock)
                                            : prod.branch_inventories?.reduce(
                                                (sum, inv) => sum + Number(inv.current_stock || 0),
                                                0
                                            ) ?? 0;
                                    const isOutOfStock = stock <= 0;
                                    const isLowStock = stock > 0 && stock <= 3;

                                    return (
                                        <div
                                            key={prod.id}
                                            onClick={() => {
                                                if (isOutOfStock) {
                                                    setConfirmPopup({
                                                        show: true,
                                                        title: 'Stok Produk Habis',
                                                        message: `Produk "${prod.name}" saat ini tidak memiliki stok di cabang ini (Stok: 0).`,
                                                        confirmText: 'Mengerti',
                                                        variant: 'warning',
                                                        onConfirm: () =>
                                                            setConfirmPopup((prev) => ({
                                                                ...prev,
                                                                show: false,
                                                            })),
                                                    });
                                                    return;
                                                }
                                                addItemToCart({
                                                    id: `prod-${prod.id}`,
                                                    item_type: 'product',
                                                    product_id: prod.id,
                                                    item_name: prod.name,
                                                    qty: 1,
                                                    unit_price: Number(prod.selling_price),
                                                    discount: 0,
                                                    subtotal: Number(prod.selling_price),
                                                });
                                            }}
                                            className={`rounded-2xl border overflow-hidden transition-all flex flex-col justify-between group ${isOutOfStock
                                                ? 'bg-surface-variant/20 border-rose-500/30 opacity-75 cursor-not-allowed'
                                                : 'bg-surface border-outline-variant hover:border-primary hover:shadow-lg cursor-pointer'
                                                }`}
                                        >
                                            {/* Card Top Illustration Box */}
                                            <div className="h-36 bg-gradient-to-br from-emerald-500/10 via-primary/5 to-surface-variant/30 relative flex flex-col items-center justify-center p-3 text-center overflow-hidden">
                                                {(() => {
                                                    const imageUrl = prod.image_path
                                                        ? `/storage/${prod.image_path}`
                                                        : (prod.image_url || null);

                                                    return imageUrl ? (
                                                        <img
                                                            src={imageUrl}
                                                            alt={prod.name}
                                                            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                                                        />
                                                    ) : (
                                                        <div className="flex flex-col items-center justify-center text-on-surface-variant/40 gap-1.5">
                                                            <span className="material-symbols-outlined text-4xl">
                                                                image_not_supported
                                                            </span>
                                                            <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/60">
                                                                Belum Ada Foto
                                                            </span>
                                                        </div>
                                                    );
                                                })()}

                                                <div className="absolute top-2.5 left-2.5 z-10">
                                                    <span className="font-mono text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-surface/90 text-primary shadow-2xs">
                                                        {prod.sku}
                                                    </span>
                                                </div>

                                                {isOutOfStock && (
                                                    <div className="absolute top-2.5 right-2.5 z-10">
                                                        <span className="font-black text-[9px] uppercase tracking-wider px-2 py-1 rounded-lg bg-rose-600 text-white shadow-md flex items-center gap-1">
                                                            <span className="material-symbols-outlined text-[12px]">
                                                                remove_shopping_cart
                                                            </span>
                                                            HABIS
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Card Bottom Details Block */}
                                            <div className="p-3.5 bg-surface space-y-1.5 flex-1 flex flex-col justify-between border-t border-outline-variant/50">
                                                <div>
                                                    <h4 className="font-black text-xs text-on-surface uppercase tracking-tight line-clamp-2 group-hover:text-primary transition-colors">
                                                        {prod.name}
                                                    </h4>
                                                    <p className="font-black text-sm text-emerald-600 dark:text-emerald-400 mt-1">
                                                        {formatRupiah(Number(prod.selling_price))}
                                                    </p>
                                                </div>

                                                <div className="flex items-center justify-between pt-1.5">
                                                    {isOutOfStock ? (
                                                        <span className="text-[11px] font-black text-rose-600 dark:text-rose-400 flex items-center gap-1">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
                                                            Stok: 0 (Habis)
                                                        </span>
                                                    ) : (
                                                        <span
                                                            className={`text-[11px] font-medium ${isLowStock
                                                                ? 'text-amber-500 font-bold'
                                                                : 'text-on-surface-variant'
                                                                }`}
                                                        >
                                                            Stok: {stock}
                                                        </span>
                                                    )}
                                                    <span
                                                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold shadow-xs transition-transform ${isOutOfStock
                                                            ? 'bg-surface-variant text-on-surface-variant/30 cursor-not-allowed'
                                                            : 'bg-primary text-on-primary group-hover:scale-110'
                                                            }`}
                                                    >
                                                        +
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                                : filteredServices.map((srv) => (
                                    <div
                                        key={srv.id}
                                        onClick={() =>
                                            addItemToCart({
                                                id: `srv-${srv.id}`,
                                                item_type: 'service',
                                                service_id: srv.id,
                                                item_name: srv.name,
                                                qty: 1,
                                                unit_price: Number(srv.price),
                                                discount: 0,
                                                subtotal: Number(srv.price),
                                            })
                                        }
                                        className="bg-surface rounded-2xl border border-outline-variant overflow-hidden hover:border-primary hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between group"
                                    >
                                        {/* Card Top Illustration Box */}
                                        <div className="h-36 bg-gradient-to-br from-blue-500/10 via-primary/5 to-surface-variant/30 relative flex flex-col items-center justify-center p-3 text-center">
                                            <span className="material-symbols-outlined text-[48px] text-blue-600/70 group-hover:scale-110 transition-transform">
                                                medical_services
                                            </span>
                                            <div className="absolute top-2.5 left-2.5">
                                                <span className="font-mono text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-surface/90 text-blue-600 shadow-2xs">
                                                    {srv.service_code}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Card Bottom Details Block */}
                                        <div className="p-3.5 bg-surface space-y-1.5 flex-1 flex flex-col justify-between border-t border-outline-variant/50">
                                            <div>
                                                <h4 className="font-black text-xs text-on-surface uppercase tracking-tight line-clamp-2 group-hover:text-primary transition-colors">
                                                    {srv.name}
                                                </h4>
                                                <p className="font-black text-sm text-emerald-600 dark:text-emerald-400 mt-1">
                                                    {formatRupiah(Number(srv.price))}
                                                </p>
                                            </div>

                                            <div className="flex items-center justify-between pt-1.5">
                                                <span className="text-[11px] font-medium text-on-surface-variant">
                                                    Durasi: {srv.duration_minutes}m
                                                </span>
                                                <span className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold shadow-xs group-hover:scale-110 transition-transform">
                                                    +
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: STACKED CART & TRANSACTION CARDS (EXACT REFERENCE DESIGN) */}
                    <div className="w-full lg:w-[360px] xl:w-[390px] 2xl:w-[420px] shrink-0 space-y-4 lg:sticky lg:top-20">
                        {/* CARD 1: KERANJANG POS */}
                        <div className="bg-surface rounded-2xl border border-outline-variant p-5 shadow-sm space-y-4">
                            <div className="flex items-center justify-between border-b border-outline-variant pb-3">
                                <div>
                                    <h3 className="font-black text-sm uppercase tracking-wider text-on-surface flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary text-[20px]">shopping_cart</span>
                                        <span>KERANJANG POS</span>
                                    </h3>
                                    <p className="text-xs text-on-surface-variant mt-0.5">
                                        {cartItems.length === 0
                                            ? 'Belum ada item dipilih'
                                            : `${cartItems.length} jenis item di keranjang`}
                                    </p>
                                </div>

                                <div className="flex items-center gap-1.5">
                                    <button
                                        onClick={holdCurrentCart}
                                        disabled={cartItems.length === 0}
                                        className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-600 font-bold text-xs hover:bg-amber-500/20 disabled:opacity-40 transition-colors cursor-pointer"
                                        title="Hold"
                                    >
                                        Hold
                                    </button>
                                    {cartItems.length > 0 && (
                                        <button
                                            onClick={() => {
                                                setConfirmPopup({
                                                    show: true,
                                                    title: 'Kosongkan Keranjang POS?',
                                                    message: 'Semua item dan layanan dalam keranjang kasir akan dihapus dari transaksi saat ini.',
                                                    confirmText: 'Ya, Kosongkan',
                                                    variant: 'danger',
                                                    onConfirm: () => {
                                                        setCartItems([]);
                                                        setConfirmPopup((prev) => ({ ...prev, show: false }));
                                                    },
                                                });
                                            }}
                                            className="p-1 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition-colors cursor-pointer"
                                            title="Kosongkan"
                                        >
                                            <span className="material-symbols-outlined text-[16px]">delete</span>
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Cart List or Empty State */}
                            {cartItems.length === 0 ? (
                                <div className="py-10 text-center space-y-2">
                                    <span className="material-symbols-outlined text-[48px] text-on-surface-variant/20 block mx-auto">
                                        shopping_cart
                                    </span>
                                    <h4 className="font-bold text-sm text-on-surface-variant">Keranjang kosong</h4>
                                    <p className="text-xs text-on-surface-variant/70">
                                        Klik item di kiri untuk menambahkan
                                    </p>
                                </div>
                            ) : (
                                <div className="max-h-[240px] overflow-y-auto space-y-2.5 pr-1">
                                    {cartItems.map((item) => (
                                        <div
                                            key={item.id}
                                            className="p-3 rounded-xl bg-surface-variant/30 border border-outline-variant flex items-center justify-between gap-3"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-xs text-on-surface truncate">
                                                    {item.item_name}
                                                </p>
                                                <p className="text-[11px] text-on-surface-variant mt-0.5">
                                                    {formatRupiah(item.unit_price)}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-1 shrink-0">
                                                <button
                                                    onClick={() => updateItemQty(item.id, -1)}
                                                    className="w-6 h-6 rounded-md bg-surface border border-outline-variant font-bold text-xs flex items-center justify-center hover:bg-rose-500/10 hover:text-rose-500 cursor-pointer"
                                                >
                                                    -
                                                </button>
                                                <span className="w-5 text-center font-bold text-xs">{item.qty}</span>
                                                <button
                                                    onClick={() => updateItemQty(item.id, 1)}
                                                    className="w-6 h-6 rounded-md bg-surface border border-outline-variant font-bold text-xs flex items-center justify-center hover:bg-emerald-500/10 hover:text-emerald-500 cursor-pointer"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <div className="text-right shrink-0">
                                                <p className="font-black text-xs text-on-surface">
                                                    {formatRupiah(item.subtotal)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Cart Summary Card Inside Card 1 */}
                            <div className="bg-surface-variant/30 rounded-2xl p-4 border border-outline-variant space-y-2 text-xs">
                                <div className="flex justify-between text-on-surface-variant">
                                    <span>Jumlah Item</span>
                                    <span className="font-bold text-on-surface">{cartItems.length} jenis</span>
                                </div>
                                <div className="flex justify-between text-on-surface-variant">
                                    <span>Total Qty</span>
                                    <span className="font-bold text-on-surface">
                                        {cartItems.reduce((acc, i) => acc + i.qty, 0)} pcs
                                    </span>
                                </div>
                                <div className="flex justify-between text-on-surface-variant">
                                    <span>Subtotal</span>
                                    <span className="font-bold text-on-surface">{formatRupiah(subtotalBeforeDiscount)}</span>
                                </div>

                                {globalDiscount > 0 && (
                                    <div className="flex justify-between text-rose-600 dark:text-rose-400 font-medium">
                                        <span>Diskon Voucher</span>
                                        <span>-{formatRupiah(globalDiscount)}</span>
                                    </div>
                                )}

                                <div className="flex justify-between text-on-surface-variant">
                                    <span>PPN ({Math.round(taxRate * 100)}%)</span>
                                    <span className="font-bold text-on-surface">
                                        {taxRate > 0 ? formatRupiah(taxAmount) : 'Rp 0'}
                                    </span>
                                </div>

                                <div className="border-t border-outline-variant pt-2 flex items-center justify-between">
                                    <span className="font-black text-sm text-on-surface">Estimasi Total</span>
                                    <span className="font-black text-base text-emerald-600 dark:text-emerald-400">
                                        {formatRupiah(grandTotal)}
                                    </span>
                                </div>
                                <p className="text-[10px] text-on-surface-variant/70 leading-tight">
                                    Diskon voucher dan PPN dihitung otomatis saat submit.
                                </p>
                            </div>
                        </div>

                        {/* CARD 2: DATA TRANSAKSI */}
                        <div className="bg-surface rounded-2xl border border-outline-variant p-5 shadow-sm space-y-4">
                            <div className="border-b border-outline-variant pb-3">
                                <h3 className="font-black text-sm uppercase tracking-wider text-on-surface flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary text-[20px]">receipt_long</span>
                                    <span>DATA TRANSAKSI</span>
                                </h3>
                                <p className="text-xs text-on-surface-variant mt-0.5">
                                    Input Offline Sale / POS Kasir Optik
                                </p>
                                <p className="text-[11px] text-on-surface-variant/80 mt-1.5 leading-relaxed">
                                    Lengkapi sumber transaksi, data customer, metode pembayaran, dan promo voucher bila tersedia.
                                </p>
                            </div>

                            {/* Form Fields Grid matching reference */}
                            <div className="grid grid-cols-2 gap-3 text-xs">
                                <div>
                                    <label className="block font-bold text-[11px] uppercase text-on-surface-variant mb-1">
                                        Pelanggan
                                    </label>
                                    <select
                                        value={customerMode}
                                        onChange={(e) => setCustomerMode(e.target.value as 'walkin' | 'reservation')}
                                        className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant font-bold text-xs focus:outline-none focus:border-primary cursor-pointer"
                                    >
                                        <option value="walkin">Walk-In Customer</option>
                                        <option value="reservation">Dari Reservasi</option>
                                    </select>
                                    <p className="text-[10px] text-on-surface-variant mt-1">
                                        {selectedCustomer
                                            ? `Member: ${selectedCustomer.full_name}`
                                            : walkinName
                                                ? `Walk-In: ${walkinName} ${walkinPhone ? `(${walkinPhone})` : ''}`
                                                : '• Pelanggan Umum (Tanpa Member)'}
                                    </p>
                                </div>

                                <div>
                                    <label className="block font-bold text-[11px] uppercase text-on-surface-variant mb-1">
                                        Diskon Voucher
                                    </label>
                                    <select
                                        value={globalDiscount}
                                        onChange={(e) => setGlobalDiscount(Number(e.target.value))}
                                        className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant font-bold text-xs focus:outline-none focus:border-primary cursor-pointer"
                                    >
                                        <option value={0}>Tanpa Voucher</option>
                                        {discounts.map((d) => (
                                            <option key={d.id} value={d.value}>
                                                {d.name} (-{formatRupiah(Number(d.value))})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block font-bold text-[11px] uppercase text-on-surface-variant mb-1 flex items-center justify-between">
                                        <span>Cabang Optik</span>
                                        <span className="text-[9px] text-amber-600 font-bold">(Terkunci)</span>
                                    </label>
                                    <select
                                        value={selectedBranchId ?? ''}
                                        disabled
                                        onChange={(e) => setSelectedBranchId(Number(e.target.value))}
                                        className="w-full px-3 py-2 rounded-xl bg-surface-variant/50 border border-outline-variant font-bold text-xs opacity-75 cursor-not-allowed"
                                    >
                                        {branches.map((b) => (
                                            <option key={b.id} value={b.id}>
                                                {b.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block font-bold text-[11px] uppercase text-on-surface-variant mb-1">
                                        PPN / Pajak
                                    </label>
                                    <select
                                        value={taxRate}
                                        onChange={(e) => setTaxRate(Number(e.target.value))}
                                        className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant font-bold text-xs focus:outline-none focus:border-primary cursor-pointer"
                                    >
                                        <option value={0}>0% (Non-PPN)</option>
                                        <option value={0.11}>11% PPN</option>
                                    </select>
                                </div>
                            </div>

                            {customerMode === 'walkin' && !selectedCustomer && (
                                <div className="pt-3 border-t border-dashed border-outline-variant space-y-2.5">
                                    <div className="flex items-center justify-between">
                                        <p className="text-[10px] font-black uppercase tracking-wider text-primary">
                                            Data Pelanggan Walk-In (Tanpa Member)
                                        </p>
                                        <span className="text-[10px] text-on-surface-variant italic">Opsional</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2.5">
                                        <div>
                                            <label className="block font-bold text-[10px] uppercase text-on-surface-variant mb-1">
                                                Nama Pelanggan
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Contoh: Budi Santoso"
                                                value={walkinName}
                                                onChange={(e) => setWalkinName(e.target.value)}
                                                className="w-full px-3 py-2 rounded-xl bg-surface-variant/40 border border-outline-variant font-bold text-xs focus:outline-none focus:border-primary placeholder:font-normal placeholder:text-on-surface-variant/60"
                                            />
                                        </div>
                                        <div>
                                            <label className="block font-bold text-[10px] uppercase text-on-surface-variant mb-1">
                                                No. Telepon / WA
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Contoh: 08123456789"
                                                value={walkinPhone}
                                                onChange={(e) => setWalkinPhone(e.target.value)}
                                                className="w-full px-3 py-2 rounded-xl bg-surface-variant/40 border border-outline-variant font-bold text-xs focus:outline-none focus:border-primary placeholder:font-normal placeholder:text-on-surface-variant/60"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* OUT OF STOCK WARNING WHEN SWITCHING BRANCH */}
                            {hasOutOfStockCartItems && (
                                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-start gap-2">
                                    <span className="material-symbols-outlined text-[18px] shrink-0">warning</span>
                                    <span>
                                        Tombol bayar dinonaktifkan: Ada produk di keranjang yang stoknya habis/tidak mencukupi di cabang ini ({outOfStockCartItems.map((i) => i.item_name).join(', ')}).
                                    </span>
                                </div>
                            )}

                            {/* MAIN SUBMIT BUTTON */}
                            <button
                                onClick={() => {
                                    setPaymentEntries([
                                        { payment_method_name: paymentMethods[0]?.name || 'Cash', amount: grandTotal },
                                    ]);
                                    setShowPaymentModal(true);
                                }}
                                disabled={cartItems.length === 0 || hasOutOfStockCartItems}
                                className="w-full py-3.5 rounded-xl bg-primary text-on-primary font-black text-sm shadow-md hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
                            >
                                <span className="material-symbols-outlined text-[20px]">payments</span>
                                <span>Bayar & Selesaikan POS</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. SPLIT PAYMENT / MULTI-PAYMENT MODAL */}
            {showPaymentModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
                    <div className="bg-surface w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-outline-variant p-6 space-y-5">
                        <div className="flex items-center justify-between border-b border-outline-variant pb-3">
                            <div>
                                <h3 className="font-black text-lg text-on-surface">Konfirmasi Pembayaran Kasir</h3>
                                <p className="text-xs text-on-surface-variant">
                                    Tagihan Grand Total:{' '}
                                    <span className="font-black text-primary">{formatRupiah(grandTotal)}</span>
                                </p>
                            </div>
                            <button
                                onClick={() => setShowPaymentModal(false)}
                                className="p-1 rounded-full hover:bg-tertiary/40 cursor-pointer"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {/* Quick Cash Buttons */}
                        <div className="space-y-1.5">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                                Cepat Nominal Cash (Uang Pas / Lembaran):
                            </p>
                            <div className="grid grid-cols-4 gap-2">
                                <button
                                    type="button"
                                    onClick={() => setQuickCashAmount(grandTotal)}
                                    className="px-2.5 py-2 rounded-xl bg-surface-variant border border-outline-variant font-bold text-xs hover:border-primary hover:text-primary transition-all cursor-pointer"
                                >
                                    Uang Pas
                                </button>
                                {[50000, 100000, 200000, 500000].map((amt) => (
                                    <button
                                        key={amt}
                                        type="button"
                                        onClick={() => setQuickCashAmount(amt)}
                                        className="px-2.5 py-2 rounded-xl bg-surface-variant border border-outline-variant font-bold text-xs hover:border-primary hover:text-primary transition-all cursor-pointer"
                                    >
                                        {amt / 1000}k
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Payment Entries */}
                        <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                            {paymentEntries.map((entry, idx) => (
                                <div
                                    key={idx}
                                    className="p-3.5 rounded-2xl bg-surface-variant/50 border border-outline-variant space-y-2.5"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] font-black uppercase tracking-wider text-on-surface-variant">
                                            Pembayaran #{idx + 1}
                                        </span>
                                        {paymentEntries.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removePaymentEntry(idx)}
                                                className="px-2 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-600 dark:text-rose-400 hover:text-white transition-all flex items-center gap-1 text-[10px] font-bold cursor-pointer"
                                                title="Hapus pembayaran ini"
                                            >
                                                <span className="material-symbols-outlined text-[14px]">delete</span>
                                                <span>Hapus</span>
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase text-on-surface-variant mb-1">
                                                Metode Bayar
                                            </label>
                                            <select
                                                value={entry.payment_method_name}
                                                onChange={(e) => {
                                                    const updated = [...paymentEntries];
                                                    updated[idx].payment_method_name = e.target.value;
                                                    setPaymentEntries(updated);
                                                }}
                                                className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant text-xs font-bold"
                                            >
                                                {paymentMethods.map((pm) => (
                                                    <option key={pm.id} value={pm.name}>
                                                        {pm.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-bold uppercase text-on-surface-variant mb-1">
                                                Nominal Bayar (Rp)
                                            </label>
                                            <input
                                                type="number"
                                                value={entry.amount || ''}
                                                onChange={(e) => {
                                                    const updated = [...paymentEntries];
                                                    updated[idx].amount = Number(e.target.value);
                                                    setPaymentEntries(updated);
                                                }}
                                                placeholder="Nominal..."
                                                className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant text-xs font-bold"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Split payment action */}
                        <button
                            type="button"
                            onClick={addPaymentEntry}
                            className="w-full py-2.5 rounded-xl border border-dashed border-primary text-primary text-xs font-bold hover:bg-primary/5 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                        >
                            <span className="material-symbols-outlined text-[16px]">add_circle</span>
                            <span>Split Pembayaran (Tambah Metode Bayar Lain)</span>
                        </button>

                        {/* Financial Summary Box */}
                        <div className="p-4 rounded-2xl bg-surface-variant space-y-1.5 text-xs">
                            <div className="flex justify-between text-on-surface-variant">
                                <span>Subtotal</span>
                                <span className="font-semibold text-on-surface">{formatRupiah(subtotalBeforeDiscount)}</span>
                            </div>
                            {globalDiscount > 0 && (
                                <div className="flex justify-between text-rose-600 dark:text-rose-400">
                                    <span>Diskon Voucher</span>
                                    <span className="font-semibold">-{formatRupiah(globalDiscount)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-on-surface-variant">
                                <span>PPN ({Math.round(taxRate * 100)}%)</span>
                                <span className="font-semibold text-on-surface">{formatRupiah(taxAmount)}</span>
                            </div>
                            <div className="flex justify-between pt-1 border-t border-outline-variant/60 font-bold text-on-surface">
                                <span>Grand Total Tagihan:</span>
                                <span className="text-primary">{formatRupiah(grandTotal)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Total Diterima:</span>
                                <span className="font-bold">{formatRupiah(totalPaidAmount)}</span>
                            </div>
                            {remainingToPay > 0 && (
                                <div className="flex justify-between text-rose-500 font-bold">
                                    <span>Kekurangan Bayar:</span>
                                    <span>{formatRupiah(remainingToPay)}</span>
                                </div>
                            )}
                            <div className="flex justify-between pt-1.5 border-t border-outline-variant font-black text-sm">
                                <span>KEMBALIAN:</span>
                                <span className="text-emerald-600 dark:text-emerald-400">
                                    {formatRupiah(changeAmount)}
                                </span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setShowPaymentModal(false)}
                                className="px-4 py-2.5 rounded-xl border border-outline-variant text-sm font-semibold hover:bg-tertiary/40 cursor-pointer"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setConfirmPopup({
                                        show: true,
                                        title: 'Konfirmasi Penyelesaian POS',
                                        message: `Apakah Anda yakin ingin memproses transaksi sebesar ${formatRupiah(grandTotal)}  dan mencetak struk resmi?`,
                                        confirmText: 'Ya, Selesaikan Pembayaran',
                                        variant: 'primary',
                                        onConfirm: () => {
                                            setConfirmPopup((prev) => ({ ...prev, show: false }));
                                            handleProcessCheckout();
                                        },
                                    });
                                }}
                                disabled={totalPaidAmount < grandTotal}
                                className="px-6 py-2.5 rounded-xl bg-primary text-on-primary text-sm font-bold shadow-md shadow-primary/20 hover:bg-primary/90 disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                            >
                                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                                <span>Selesaikan Transaksi & Cetak Struk</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 5. VOID TRANSACTION MODAL */}
            {showVoidModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
                    <div className="bg-surface w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-outline-variant p-6 space-y-4">
                        <div className="flex items-center justify-between border-b border-outline-variant pb-3">
                            <h3 className="font-black text-lg text-on-surface">Batalkan (Void) Transaksi POS</h3>
                            <button
                                onClick={() => setShowVoidModal(false)}
                                className="p-1 rounded-full hover:bg-tertiary/40 cursor-pointer"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <form onSubmit={handleSubmitVoid} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                                    Pilih Transaksi Selesai <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    value={voidSaleTarget?.id || ''}
                                    onChange={(e) => {
                                        const found = recentSales.find((x) => x.id === Number(e.target.value));
                                        setVoidSaleTarget(found || null);
                                    }}
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-variant border border-outline-variant text-sm font-bold"
                                    required
                                >
                                    <option value="">-- Pilih Transaksi POS --</option>
                                    {recentSales.map((sale) => (
                                        <option key={sale.id} value={sale.id}>
                                            {sale.invoice_number} • {formatRupiah(Number(sale.grand_total))} ({sale.customer?.full_name || 'Walk-In'})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                                    Alasan Void (Mandatori Audit) <span className="text-rose-500">*</span>
                                </label>
                                <textarea
                                    value={voidReason}
                                    onChange={(e) => setVoidReason(e.target.value)}
                                    rows={3}
                                    placeholder="Alasan pembatalan (misal: salah input metode bayar / retur pelanggan)..."
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-variant border border-outline-variant text-sm focus:outline-none focus:border-primary"
                                    required
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowVoidModal(false)}
                                    className="px-4 py-2 rounded-xl border border-outline-variant text-sm font-semibold hover:bg-tertiary/40 cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 rounded-xl bg-rose-600 text-white text-sm font-bold hover:bg-rose-700 transition-all cursor-pointer"
                                >
                                    Proses Void & Kembalikan Stok
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* 6. CUSTOM PREMIUM CONFIRM POPUP MODAL */}
            {confirmPopup.show && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fadeIn">
                    <div className="bg-surface w-full max-w-sm rounded-3xl shadow-2xl border border-outline-variant p-6 text-center space-y-5">
                        <div
                            className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center border ${confirmPopup.variant === 'danger'
                                ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                                : confirmPopup.variant === 'primary'
                                    ? 'bg-primary/10 text-primary border-primary/20'
                                    : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                }`}
                        >
                            <span className="material-symbols-outlined text-[32px]">
                                {confirmPopup.variant === 'danger'
                                    ? 'delete_forever'
                                    : confirmPopup.variant === 'primary'
                                        ? 'verified'
                                        : 'warning'}
                            </span>
                        </div>

                        <div className="space-y-1.5">
                            <h3 className="font-black text-base text-on-surface">{confirmPopup.title}</h3>
                            <p className="text-xs text-on-surface-variant leading-relaxed">
                                {confirmPopup.message}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-2.5 pt-2">
                            <button
                                type="button"
                                onClick={() => setConfirmPopup((prev) => ({ ...prev, show: false }))}
                                className="w-full py-2.5 rounded-xl border border-outline-variant text-xs font-bold text-on-surface hover:bg-tertiary/40 transition-colors cursor-pointer"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={confirmPopup.onConfirm}
                                className={`w-full py-2.5 rounded-xl text-white text-xs font-bold shadow-md transition-all cursor-pointer ${confirmPopup.variant === 'danger'
                                    ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/20'
                                    : confirmPopup.variant === 'primary'
                                        ? 'bg-primary hover:bg-primary/90 shadow-primary/20'
                                        : 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/20'
                                    }`}
                            >
                                {confirmPopup.confirmText}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 7. RECEIPT PRINT THERMAL MODAL */}
            <ReceiptModal
                show={Boolean(completedSale)}
                onClose={() => setCompletedSale(null)}
                sale={completedSale}
            />
        </AdminLayout>
    );
}
