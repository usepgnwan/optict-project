import React, { useMemo, useState } from 'react';
import { Link } from '@inertiajs/react';
import HomeLayout from '@/Layouts/HomeLayout';
import CtaSection from '@/Components/Home/CtaSection';

interface CatalogDetailProps {
    slug: string;
    dbProduct?: any;
    dbProducts?: any[];
    branches?: any[];
}

export default function CatalogDetail({ slug, dbProduct, dbProducts = [], branches = [] }: CatalogDetailProps) {
    const toSlug = (text: string) =>
        text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

    const formatFrameType = (type?: string) => {
        if (type === 'full_frame') return 'Full Frame';
        if (type === 'half_frame') return 'Half Frame';
        if (type === 'rimless') return 'Rimless';
        return type || 'Full Frame';
    };

    const formatLensType = (type?: string) => {
        if (type === 'single_vision') return 'Single Vision';
        if (type === 'bifocal') return 'Bifocal';
        if (type === 'progressive') return 'Progressive';
        if (type === 'photochromic') return 'Photochromic';
        return type || 'Single Vision';
    };

    // Find product from dbProduct prop, or search dbProducts array by slug/id, or default fallback
    const product = useMemo(() => {
        const targetDb = dbProduct || (dbProducts || []).find((p: any) =>
            toSlug(p.name || '') === slug ||
            toSlug(p.sku || '') === slug ||
            String(p.id) === slug
        );

        if (targetDb) {
            const defaultBranches = (branches || []).map((b: any) => {
                const inv = (targetDb.branch_inventories || []).find((bi: any) => bi.branch_id === b.id);
                return {
                    branchId: b.id,
                    branchName: b.name,
                    city: b.city || 'Jakarta',
                    address: b.address || '',
                    stock: inv ? inv.current_stock : 0,
                };
            });

            return {
                id: targetDb.id,
                name: targetDb.name,
                category: targetDb.category ? targetDb.category.toUpperCase() : 'FRAME',
                sku: targetDb.sku || `SKU-${targetDb.id}`,
                brand: targetDb.brand || 'Optik Calm',
                frameType: formatFrameType(targetDb.frame_type),
                frameColor: targetDb.frame_color || 'Standard',
                lensType: formatLensType(targetDb.lens_type),
                price: `Rp ${Number(targetDb.selling_price || 0).toLocaleString('id-ID')}`,
                priceValue: Number(targetDb.selling_price || 0),
                image: targetDb.image_path ? `/storage/${targetDb.image_path}` : (targetDb.image_url || null),
                description: targetDb.description || 'Bingkai kacamata presisi tinggi standar optikal Optik Calm.',
                centralStock: targetDb.central_inventory?.quantity ?? 0,
                branchAvailability: defaultBranches.length > 0 ? defaultBranches : [
                    { branchId: 1, branchName: 'Optik Calm Jakarta Pusat', city: 'Jakarta', address: 'Jl. MH Thamrin No. 15, Menteng', stock: 0 },
                    { branchId: 2, branchName: 'Optik Calm Surabaya', city: 'Surabaya', address: 'Jl. Tunjungan No. 45, Genteng', stock: 0 },
                ],
            };
        }

        // Default Fallback list
        const defaultList = [
            {
                id: 101,
                name: 'Aura Gold Classic',
                category: 'Titanium Series',
                sku: 'FRM-AURA-01',
                brand: 'Optik Calm Titanium',
                frameType: 'Full Frame',
                frameColor: 'Gold Matte',
                lensType: 'Single Vision',
                price: 'Rp 1.450.000',
                image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCeWPF_of7nlKq-1AibDLuWcUstIxVEs7BG3rsc5Ojb8rJ0Y1CetJUtW5xvKg8CvFPaHnmIdhXM4SLWttp6lg5tQINjiSsN5Vc0B5xpIRwiiThiRz-zC-GFj5mLkM_rKXFbTc_VPmxNm-J5iqiGPubB3H5nxWvqj1WRZNvFtCmpYQmJdwr-wIrkHjy9sKtrBxJXtkzztnjf21d-1TK74gCdQDdSm9cmBHLEcaU2jp3qH3uyPiUeLfRl-DI2y_IDnfBFcDrQiHU2Diw',
                description: 'Bingkai berbahan titanium murni yang sangat ringan, anti-karat, serta hipoalergenik untuk kenyamanan maksimal sepanjang hari.',
                centralStock: 24,
                branchAvailability: [
                    { branchId: 1, branchName: 'Optik Calm Jakarta Pusat', city: 'Jakarta', address: 'Jl. MH Thamrin No. 15, Menteng', stock: 8 },
                    { branchId: 2, branchName: 'Optik Calm Surabaya', city: 'Surabaya', address: 'Jl. Tunjungan No. 45, Genteng', stock: 5 },
                ],
            },
        ];

        return defaultList.find((p) => toSlug(p.name) === slug) || null;
    }, [dbProduct, dbProducts, slug, branches]);

    if (!product) {
        return (
            <HomeLayout title="Katalog Tidak Ditemukan | Optik Calm">
                <div className="max-w-[1200px] mx-auto px-6 py-24 text-center">
                    <span className="material-symbols-outlined text-6xl text-on-surface-variant/40 mb-4 block">
                        find_in_page
                    </span>
                    <h1 className="text-3xl font-extrabold text-primary mb-2">Kacamata Tidak Ditemukan</h1>
                    <p className="text-on-surface-variant max-w-md mx-auto mb-8">
                        Mohon maaf, produk dengan slug <code className="font-mono bg-surface-variant px-2 py-0.5 rounded text-primary">{slug}</code> tidak tersedia atau telah dinonaktifkan.
                    </p>
                    <Link
                        href="/katalog-kacamata"
                        className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-primary text-on-primary font-bold shadow-lg hover:bg-primary/90 transition-all"
                    >
                        <span className="material-symbols-outlined">arrow_back</span>
                        Kembali ke Katalog Kacamata
                    </Link>
                </div>
                <CtaSection />
            </HomeLayout>
        );
    }

    const [selectedBranchId, setSelectedBranchId] = useState<number | ''>('');

    const totalReadyBranches = product.branchAvailability.filter((b: any) => b.stock > 0).length;

    const selectedBranch = product.branchAvailability.find((b: any) => b.branchId === selectedBranchId);
    const isWaDisabled = !selectedBranch || selectedBranch.stock <= 0;
    const waUrl = selectedBranch
        ? `https://wa.me/6281234567890?text=Halo%20Optik%20Calm%20${encodeURIComponent(selectedBranch.branchName)},%20saya%20tertarik%20reservasi%20kacamata%20${encodeURIComponent(product.name)}`
        : '#';

    return (
        <HomeLayout title={`${product.name} - Katalog & Stok | Optik Calm`}>
            {/* Page Header Banner */}
            <div className="bg-tertiary/20 border-b border-outline-variant py-10">
                <div className="max-w-[1200px] mx-auto px-6">
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 text-sm font-medium text-on-surface-variant flex-wrap mb-3">
                        <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
                            <span className="material-symbols-outlined text-[18px]">home</span>
                            Home
                        </Link>
                        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                        <Link href="/katalog-kacamata" className="hover:text-primary transition-colors">
                            Katalog Kacamata
                        </Link>
                        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                        <span className="text-primary font-bold">{product.name}</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-widest text-secondary block mb-1">
                                {product.category}
                            </span>
                            <h1 className="font-semibold text-3xl md:text-4xl text-primary tracking-tight">
                                {product.name}
                            </h1>
                        </div>
                        <Link
                            href="/katalog-kacamata"
                            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-outline-variant bg-surface hover:bg-tertiary/40 font-bold text-xs text-primary transition-all shadow-2xs self-start"
                        >
                            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                            Kembali ke Katalog
                        </Link>
                    </div>
                </div>
            </div>

            {/* HERO PRODUCT SHOWCASE SECTION */}
            <div className="max-w-[1200px] mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    {/* Left Column: Image Card */}
                    <div className="lg:col-span-6 bg-surface rounded-3xl border border-outline-variant p-8 sm:p-12 shadow-lg relative overflow-hidden flex items-center justify-center min-h-[420px]">
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-tertiary/20 pointer-events-none" />
                        {product.image ? (
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full max-h-80 object-contain drop-shadow-xl transition-transform duration-500 hover:scale-105"
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center text-on-surface-variant/50 gap-3 py-16">
                                <div className="w-24 h-24 rounded-3xl bg-surface-variant/80 border border-outline-variant flex items-center justify-center shadow-inner">
                                    <span className="material-symbols-outlined text-5xl text-on-surface-variant/60">image_not_supported</span>
                                </div>
                                <span className="text-sm font-bold uppercase tracking-widest text-on-surface-variant/80">Foto Produk Belum Tersedia</span>
                                <span className="text-xs text-on-surface-variant/60 text-center max-w-xs">Silakan hubungi admin atau datang ke cabang untuk melihat fisik produk.</span>
                            </div>
                        )}
                        <span className="absolute top-6 left-6 px-4 py-1.5 rounded-full bg-primary text-on-primary font-extrabold text-xs tracking-widest uppercase shadow-md">
                            {product.category}
                        </span>
                    </div>

                    {/* Right Column: Detailed Specs & Info */}
                    <div className="lg:col-span-6 bg-surface rounded-3xl border border-outline-variant p-8 sm:p-10 shadow-lg flex flex-col justify-between space-y-6">
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-bold uppercase tracking-wider text-secondary">
                                    Brand: {product.brand}
                                </span>
                                {product.sku && (
                                    <span className="text-xs font-mono text-on-surface-variant bg-surface-variant/60 px-2.5 py-1 rounded-lg border border-outline-variant">
                                        {product.sku}
                                    </span>
                                )}
                            </div>

                            <h2 className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
                                {product.name}
                            </h2>

                            <p className="text-2xl sm:text-3xl font-black text-primary mt-3">
                                {product.price}
                            </p>

                            <p className="text-on-surface-variant text-sm sm:text-base leading-relaxed mt-4">
                                {product.description}
                            </p>
                        </div>

                        {/* Specifications Grid */}
                        <div className="p-5 rounded-2xl bg-surface-variant/40 border border-outline-variant space-y-3">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[16px] text-primary">fact_check</span>
                                Spesifikasi Optikal &amp; Frame
                            </h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-xs text-on-surface-variant">Tipe Frame</p>
                                    <p className="font-bold text-on-surface">{product.frameType}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-on-surface-variant">Warna Frame</p>
                                    <p className="font-bold text-on-surface">{product.frameColor}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-on-surface-variant">Rekomendasi Lensa</p>
                                    <p className="font-bold text-on-surface">{product.lensType}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-on-surface-variant">Kategori Produk</p>
                                    <p className="font-bold text-on-surface">{product.category}</p>
                                </div>
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="pt-2 space-y-3">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                                    Pilih Cabang untuk Reservasi / Tanya WA
                                </label>
                                <select
                                    value={selectedBranchId}
                                    onChange={(e) => setSelectedBranchId(Number(e.target.value) || '')}
                                    className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                                >
                                    <option value="">-- Pilih Cabang Optik Calm --</option>
                                    {product.branchAvailability.map((branch: any) => (
                                        <option key={branch.branchId} value={branch.branchId}>
                                            {branch.branchName} {branch.stock > 0 ? `(Ready: ${branch.stock})` : '(Stok Habis)'}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                <a
                                    href="#stock-locations"
                                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-surface-variant/50 text-on-surface font-bold text-sm hover:bg-surface-variant transition-all active:scale-98 border border-outline-variant"
                                >
                                    <span className="material-symbols-outlined text-[18px]">storefront</span>
                                    Cek Semua Stok
                                </a>
                                {isWaDisabled ? (
                                    <button
                                        disabled
                                        className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-surface-variant text-on-surface-variant/50 font-bold text-sm cursor-not-allowed border border-outline-variant/50"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">chat</span>
                                        WhatsApp
                                    </button>
                                ) : (
                                    <a
                                        href={waUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-primary text-on-primary font-bold text-sm shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all active:scale-98"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">chat</span>
                                        WhatsApp
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* LIVE STOCK AVAILABILITY SECTION */}
            <div id="stock-locations" className="max-w-[1200px] mx-auto px-6 pb-16 scroll-mt-24">
                <div className="bg-surface rounded-3xl border border-outline-variant p-8 sm:p-10 shadow-lg space-y-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-outline-variant/60">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-primary flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-3xl">location_on</span>
                                Cek Stok Real-Time di Seluruh Lokasi
                            </h2>
                            <p className="text-sm text-on-surface-variant mt-1">
                                Informasi persediaan diperbarui secara live dari sistem database inventori Optik Calm.
                            </p>
                        </div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold text-xs self-start sm:self-center">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span>{totalReadyBranches} Cabang Ready Stok</span>
                        </div>
                    </div>

                    {/* Central Warehouse Card */}
                    <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                                <span className="material-symbols-outlined text-2xl">warehouse</span>
                            </div>
                            <div>
                                <h4 className="font-extrabold text-base text-on-surface">Gudang Pusat (Central Warehouse)</h4>
                                <p className="text-xs text-on-surface-variant">Pusat Distribusi Utama Optik Calm Indonesia</p>
                            </div>
                        </div>
                        <div>
                            {product.centralStock > 0 ? (
                                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 text-sm font-extrabold">
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                                    Tersedia ({product.centralStock} Unit)
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 text-sm font-extrabold">
                                    Stok Habis
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Branches Grid */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                            Ketersediaan di Cabang Resmi Optik Calm
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {product.branchAvailability.map((branch: any) => (
                                <div
                                    key={branch.branchId}
                                    className="p-6 rounded-2xl bg-surface border border-outline-variant hover:border-primary/50 transition-all flex flex-col justify-between gap-5 shadow-sm"
                                >
                                    <div>
                                        <div className="flex items-start justify-between gap-3 mb-2">
                                            <h4 className="font-extrabold text-base text-on-surface">
                                                {branch.branchName}
                                            </h4>
                                            {branch.stock > 0 ? (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 text-xs font-extrabold whitespace-nowrap">
                                                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                                    Ready ({branch.stock})
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 text-xs font-extrabold whitespace-nowrap">
                                                    Bisa Pesan
                                                </span>
                                            )}
                                        </div>
                                        {branch.address && (
                                            <p className="text-xs text-on-surface-variant leading-relaxed">
                                                {branch.address}
                                            </p>
                                        )}
                                    </div>

                                    <div className="pt-4 border-t border-outline-variant/60 flex items-center justify-between">
                                        <span className="text-xs font-semibold text-on-surface-variant">
                                            {branch.city}
                                        </span>
                                        <a
                                            href={`https://wa.me/6281234567890?text=Halo%20Optik%20Calm%20${encodeURIComponent(branch.branchName)},%20saya%20tertarik%20reservasi%20kacamata%20${encodeURIComponent(product.name)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-on-primary font-bold text-xs transition-colors"
                                        >
                                            <span>Reservasi Cabang Ini</span>
                                            <span className="material-symbols-outlined text-[14px]">arrow_outward</span>
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <CtaSection />
        </HomeLayout>
    );
}
