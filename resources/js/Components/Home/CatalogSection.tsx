import React, { useState, useMemo } from 'react';
import { Link } from '@inertiajs/react';
import { ScrollCard } from '@/Components/ReactBits';

interface BranchAvailability {
    branchId: number;
    branchName: string;
    city: string;
    address: string;
    stock: number;
}

const toSlug = (text: string) =>
    text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

interface ProductItem {
    id: number | string;
    slug?: string;
    category: string;
    name: string;
    sku?: string;
    brand?: string;
    frameType?: string;
    frameColor?: string;
    lensType?: string;
    price: string;
    priceValue: number;
    badge: { text: string; color: string } | null;
    image: string | null;
    description: string;
    centralStock: number;
    branchAvailability: BranchAvailability[];
}

const defaultProducts: ProductItem[] = [
    {
        id: 101,
        category: 'Titanium Series',
        name: 'Aura Gold Classic',
        sku: 'FRM-AURA-01',
        brand: 'Harmoni by Phoeinx Sehat Titanium',
        price: 'Rp 1.450.000',
        priceValue: 1450000,
        badge: { text: 'New Arrival', color: 'bg-secondary text-on-secondary' },
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCeWPF_of7nlKq-1AibDLuWcUstIxVEs7BG3rsc5Ojb8rJ0Y1CetJUtW5xvKg8CvFPaHnmIdhXM4SLWttp6lg5tQINjiSsN5Vc0B5xpIRwiiThiRz-zC-GFj5mLkM_rKXFbTc_VPmxNm-J5iqiGPubB3H5nxWvqj1WRZNvFtCmpYQmJdwr-wIrkHjy9sKtrBxJXtkzztnjf21d-1TK74gCdQDdSm9cmBHLEcaU2jp3qH3uyPiUeLfRl-DI2y_IDnfBFcDrQiHU2Diw',
        description: 'Bingkai berbahan titanium murni yang sangat ringan, anti-karat, serta hipoalergenik untuk kenyamanan maksimal sepanjang hari.',
        centralStock: 24,
        branchAvailability: [
            { branchId: 1, branchName: 'Harmoni by Phoeinx Sehat Jakarta Pusat', city: 'Jakarta', address: 'Jl. MH Thamrin No. 15, Menteng', stock: 8 },
            { branchId: 2, branchName: 'Harmoni by Phoeinx Sehat Surabaya', city: 'Surabaya', address: 'Jl. Tunjungan No. 45, Genteng', stock: 5 },
        ],
    },
    {
        id: 102,
        category: 'Urban Lifestyle',
        name: 'Midnight Matte',
        sku: 'FRM-MID-02',
        brand: 'Harmoni by Phoeinx Sehat Urban',
        price: 'Rp 980.000',
        priceValue: 980000,
        badge: { text: 'Popular', color: 'bg-primary text-on-primary' },
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8t0ZJeToebmAUNhBH3vVQZiDPkzHjlIhIaNCyBTjnGxx-FkhEuiozaWI5g14RqByGTBAdSjLlgQ3Ry-6P7kiRhqb9NqWzJlCGFjbc94qUomrVwN4WNYu_Q34DFKyi_Y4qNP0C_FWk21Eo9C020IDn1NKYFr_lsiX6r9gEjOei1CTzLcp9MHSLCTZmxYO2AsgZCmmXHUu4N6YLAx5fV2XZ1HUG7AZpptO0ioKhm_vUA0XL3089BVp_RDiKdZq7neQhLZO85D_sMoM',
        description: 'Desain asetat matte modern yang kokoh dengan sentuhan finishing halus, cocok untuk aktivitas urban sehari-hari.',
        centralStock: 18,
        branchAvailability: [
            { branchId: 1, branchName: 'Harmoni by Phoeinx Sehat Jakarta Pusat', city: 'Jakarta', address: 'Jl. MH Thamrin No. 15, Menteng', stock: 12 },
            { branchId: 2, branchName: 'Harmoni by Phoeinx Sehat Surabaya', city: 'Surabaya', address: 'Jl. Tunjungan No. 45, Genteng', stock: 0 },
        ],
    },
    {
        id: 103,
        category: 'Modern Collection',
        name: 'Sage Transparent',
        sku: 'FRM-SAGE-03',
        brand: 'Harmoni by Phoeinx Sehat Studio',
        price: 'Rp 1.120.000',
        priceValue: 1120000,
        badge: null,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAL9yzDERVRDF5e8sYvl2u4WwItCsNRf3xj8KS0EBPZKj8AqhCz8rJkzlLg3BWyTbAsqh6BwKmdbGJQ-bWll27_enmNPWiqFQ7uJxdvrpsHS2cYQwybbZ2VKZQ_I8bq-MDcmjEvQeCnqZn05MlJMQqqZio3ULrySe1HZprlqRRGavGjsQopjWjJ9mu0nD4VmriCRX70O4YffPo_njj85JhDUgoB9AHl1MM713-g03fkyQBuB96QGz5nxC9PuHvzq0gf_jMfSosCS0s',
        description: 'Bingkai transparan bernuansa sage crystal yang elegan, memberikan tampilan wajah cerah dan estetik ala Korea.',
        centralStock: 30,
        branchAvailability: [
            { branchId: 1, branchName: 'Harmoni by Phoeinx Sehat Jakarta Pusat', city: 'Jakarta', address: 'Jl. MH Thamrin No. 15, Menteng', stock: 6 },
            { branchId: 2, branchName: 'Harmoni by Phoeinx Sehat Surabaya', city: 'Surabaya', address: 'Jl. Tunjungan No. 45, Genteng', stock: 4 },
        ],
    },
    {
        id: 104,
        category: 'Heritage Series',
        name: 'Tortoise Round',
        sku: 'FRM-TORT-04',
        brand: 'Harmoni by Phoeinx Sehat Heritage',
        price: 'Rp 1.250.000',
        priceValue: 1250000,
        badge: null,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEk8WGvLews9RY9DsTrofkrkV3uV39GXO6hbZ5EzZQOkzYe7Xbc1L1Vz8oAolPM8Uqva6NdfiokLZx51x_VCeTgRdb_mlzXxsn5XSt89EyIJPHOmEzBjzqcfeAoXjKgNZpwZAL8HrcmIlgnNiUBXmeoi-eSYk7eDbRbHFqXVWZ8hqR4HJU0SnYIYz1c8eAtCOhHeoZEZeK7KuAbVf0Eph9elkEAyTzkDIo3wA3E1IXgJ8aJgLiq26g4NPcfObgJ7eCzDgClpk-uMs',
        description: 'Siluet klasik bulat dengan corak tortoise klasik yang tak lekang oleh waktu, dilengkapi engsel fleksibel premium.',
        centralStock: 15,
        branchAvailability: [
            { branchId: 1, branchName: 'Harmoni by Phoeinx Sehat Jakarta Pusat', city: 'Jakarta', address: 'Jl. MH Thamrin No. 15, Menteng', stock: 3 },
            { branchId: 2, branchName: 'Harmoni by Phoeinx Sehat Surabaya', city: 'Surabaya', address: 'Jl. Tunjungan No. 45, Genteng', stock: 7 },
        ],
    },
    {
        id: 105,
        category: 'Minimalist Frame',
        name: 'Crystal Clear Acetate',
        sku: 'FRM-CRYS-05',
        brand: 'Harmoni by Phoeinx Sehat Pure',
        price: 'Rp 750.000',
        priceValue: 750000,
        badge: { text: 'Best Value', color: 'bg-emerald-600 text-white' },
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAL9yzDERVRDF5e8sYvl2u4WwItCsNRf3xj8KS0EBPZKj8AqhCz8rJkzlLg3BWyTbAsqh6BwKmdbGJQ-bWll27_enmNPWiqFQ7uJxdvrpsHS2cYQwybbZ2VKZQ_I8bq-MDcmjEvQeCnqZn05MlJMQqqZio3ULrySe1HZprlqRRGavGjsQopjWjJ9mu0nD4VmriCRX70O4YffPo_njj85JhDUgoB9AHl1MM713-g03fkyQBuB96QGz5nxC9PuHvzq0gf_jMfSosCS0s',
        description: 'Bingkai asetat jernih transparan yang super ringan, bergaya kontemporer cocok untuk lensa minus maupun progresif.',
        centralStock: 40,
        branchAvailability: [
            { branchId: 1, branchName: 'Harmoni by Phoeinx Sehat Jakarta Pusat', city: 'Jakarta', address: 'Jl. MH Thamrin No. 15, Menteng', stock: 15 },
            { branchId: 2, branchName: 'Harmoni by Phoeinx Sehat Surabaya', city: 'Surabaya', address: 'Jl. Tunjungan No. 45, Genteng', stock: 10 },
        ],
    },
    {
        id: 106,
        category: 'Luxury Titanium',
        name: 'Obsidian Black Titanium',
        sku: 'FRM-OBS-06',
        brand: 'Harmoni by Phoeinx Sehat Titanium',
        price: 'Rp 1.850.000',
        priceValue: 1850000,
        badge: { text: 'Premium', color: 'bg-amber-600 text-white' },
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCeWPF_of7nlKq-1AibDLuWcUstIxVEs7BG3rsc5Ojb8rJ0Y1CetJUtW5xvKg8CvFPaHnmIdhXM4SLWttp6lg5tQINjiSsN5Vc0B5xpIRwiiThiRz-zC-GFj5mLkM_rKXFbTc_VPmxNm-J5iqiGPubB3H5nxWvqj1WRZNvFtCmpYQmJdwr-wIrkHjy9sKtrBxJXtkzztnjf21d-1TK74gCdQDdSm9cmBHLEcaU2jp3qH3uyPiUeLfRl-DI2y_IDnfBFcDrQiHU2Diw',
        description: 'Pilihan eksekutif kelas atas dengan lapisan titanium hitam obsidian, tangkai ultra-slim dan nosepad silikon lembut.',
        centralStock: 10,
        branchAvailability: [
            { branchId: 1, branchName: 'Harmoni by Phoeinx Sehat Jakarta Pusat', city: 'Jakarta', address: 'Jl. MH Thamrin No. 15, Menteng', stock: 4 },
            { branchId: 2, branchName: 'Harmoni by Phoeinx Sehat Surabaya', city: 'Surabaya', address: 'Jl. Tunjungan No. 45, Genteng', stock: 3 },
        ],
    },
];

const ITEMS_PER_PAGE = 6;

interface CatalogSectionProps {
    isHomePreview?: boolean;
    dbProducts?: any[];
    branches?: any[];
}

export default function CatalogSection({ isHomePreview = false, dbProducts = [], branches = [] }: CatalogSectionProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [priceFilter, setPriceFilter] = useState('all');
    const [sortBy, setSortBy] = useState('default');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);

    // Merge database products with showcase products
    const allProducts = useMemo<ProductItem[]>(() => {
        const formattedDb: ProductItem[] = (dbProducts || []).map((p: any, idx: number) => {
            const defaultBranches = (branches || []).map((b: any) => {
                const inv = (p.branch_inventories || []).find((bi: any) => bi.branch_id === b.id);
                return {
                    branchId: b.id,
                    branchName: b.name,
                    city: b.city || 'Jakarta',
                    address: b.address || '',
                    stock: inv ? inv.current_stock : 0,
                };
            });

            const formatFrameType = (type: string) => {
                if (type === 'full_frame') return 'Full Frame';
                if (type === 'half_frame') return 'Half Frame';
                if (type === 'rimless') return 'Rimless';
                return type || 'Full Frame';
            };

            const formatLensType = (type: string) => {
                if (type === 'single_vision') return 'Single Vision';
                if (type === 'bifocal') return 'Bifocal';
                if (type === 'progressive') return 'Progressive';
                return type || 'Single Vision';
            };

            const resolvedImage = p.image_path
                ? `/storage/${p.image_path}`
                : (p.image_url || null);

            return {
                id: p.id,
                slug: toSlug(p.name),
                category: p.category ? p.category.toUpperCase() : 'FRAME',
                name: p.name,
                sku: p.sku || `SKU-${p.id}`,
                brand: p.brand || 'Harmoni by Phoeinx Sehat',
                frameType: formatFrameType(p.frame_type),
                frameColor: p.frame_color || 'Standard',
                lensType: formatLensType(p.lens_type),
                price: `Rp ${Number(p.selling_price || 0).toLocaleString('id-ID')}`,
                priceValue: Number(p.selling_price || 0),
                badge: { text: p.category?.toUpperCase() || 'FRAME', color: 'bg-primary text-on-primary' },
                image: resolvedImage,
                description: p.description || 'Bingkai kacamata presisi tinggi standar optikal Harmoni by Phoeinx Sehat.',
                centralStock: p.central_inventory?.quantity ?? 0,
                branchAvailability: defaultBranches.length > 0 ? defaultBranches : defaultProducts[0].branchAvailability,
            };
        });

        // Show exact Admin products if any exist in database, otherwise fall back to curated defaults
        if (formattedDb.length > 0) {
            return formattedDb;
        }

        return defaultProducts.map(p => ({ ...p, slug: p.slug || toSlug(p.name) }));
    }, [dbProducts, branches]);

    // Filter & Sort Logic
    const filteredProducts = useMemo(() => {
        let list = allProducts.filter((p) => {
            const matchesSearch =
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase()));

            let matchesPrice = true;
            if (priceFilter === 'under_1m') {
                matchesPrice = p.priceValue < 1000000;
            } else if (priceFilter === '1m_to_1_5m') {
                matchesPrice = p.priceValue >= 1000000 && p.priceValue <= 1500000;
            } else if (priceFilter === 'above_1_5m') {
                matchesPrice = p.priceValue > 1500000;
            }

            return matchesSearch && matchesPrice;
        });

        if (sortBy === 'price_asc') {
            list = [...list].sort((a, b) => a.priceValue - b.priceValue);
        } else if (sortBy === 'price_desc') {
            list = [...list].sort((a, b) => b.priceValue - a.priceValue);
        }

        return list;
    }, [allProducts, searchQuery, priceFilter, sortBy]);

    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;
    const paginatedProducts = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredProducts, currentPage]);

    const displayProducts = isHomePreview ? allProducts.slice(0, 6) : paginatedProducts;

    return (
        <section id="catalog" className="py-20 max-w-[1200px] mx-auto px-6 scroll-mt-24">
            {/* Header only shown on Home Preview */}
            {isHomePreview && (
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest mb-3">
                            Koleksi Unggulan &amp; Katalog
                        </span>
                        <h2 className="font-semibold text-[32px] leading-[40px] tracking-tight text-primary mb-2">
                            Katalog Kacamata &amp; Frame
                        </h2>
                        <p className="text-on-surface-variant max-w-2xl">
                            Temukan bingkai favorit Anda dan cek langsung ketersediaan stok real-time di Gudang Pusat maupun di seluruh cabang Harmoni by Phoeinx Sehat.
                        </p>
                    </div>

                    <Link
                        href="/katalog-kacamata"
                        className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-full font-bold text-sm tracking-wide shadow-lg hover:bg-primary/90 transition-all shrink-0 active:scale-95"
                    >
                        Lihat Semua Katalog <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </Link>
                </div>
            )}

            {/* Only show Search & Filter bar when NOT in Home preview */}
            {!isHomePreview && (
                <>
                    <div className="bg-surface p-6 rounded-3xl border border-outline-variant shadow-md mb-10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                        {/* Search Bar */}
                        <div className="relative flex-1">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
                                search
                            </span>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1);
                                }}
                                placeholder="Cari nama kacamata, SKU, atau kategori..."
                                className="w-full h-12 pl-12 pr-4 rounded-2xl bg-surface-variant border border-outline-variant text-primary placeholder:text-on-surface-variant/70 focus:outline-none focus:border-primary transition-all text-sm"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => {
                                        setSearchQuery('');
                                        setCurrentPage(1);
                                    }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-outline-variant/60 flex items-center justify-center text-on-surface-variant hover:text-primary cursor-pointer"
                                >
                                    <span className="material-symbols-outlined text-[16px]">close</span>
                                </button>
                            )}
                        </div>

                        {/* Price Range Filter & Sort */}
                        <div className="flex flex-col sm:flex-row items-center gap-3">
                            <div className="w-full sm:w-auto flex items-center gap-2 bg-surface-variant px-4 py-1.5 rounded-2xl border border-outline-variant">
                                <span className="material-symbols-outlined text-primary text-[20px]">filter_alt</span>
                                <select
                                    value={priceFilter}
                                    onChange={(e) => {
                                        setPriceFilter(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    aria-label="Filter berdasarkan rentang harga"
                                    className="bg-transparent h-9 text-sm text-primary font-medium focus:outline-none cursor-pointer pr-4"
                                >
                                    <option value="all">Semua Harga</option>
                                    <option value="under_1m">Di bawah Rp 1.000.000</option>
                                    <option value="1m_to_1_5m">Rp 1.000.000 - Rp 1.500.000</option>
                                    <option value="above_1_5m">Di atas Rp 1.500.000</option>
                                </select>
                            </div>

                            <div className="w-full sm:w-auto flex items-center gap-2 bg-surface-variant px-4 py-1.5 rounded-2xl border border-outline-variant">
                                <span className="material-symbols-outlined text-primary text-[20px]">sort</span>
                                <select
                                    value={sortBy}
                                    onChange={(e) => {
                                        setSortBy(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    aria-label="Urutkan harga frame"
                                    className="bg-transparent h-9 text-sm text-primary font-medium focus:outline-none cursor-pointer pr-4"
                                >
                                    <option value="default">Rekomendasi</option>
                                    <option value="price_asc">Harga Terendah</option>
                                    <option value="price_desc">Harga Tertinggi</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Results Count Summary */}
                    <div className="flex justify-between items-center mb-6 px-1">
                        <p className="text-sm font-medium text-on-surface-variant">
                            Menampilkan <span className="font-bold text-primary">{filteredProducts.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}</span> - <span className="font-bold text-primary">{Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)}</span> dari <span className="font-bold text-primary">{filteredProducts.length}</span> produk
                        </p>
                        {(searchQuery || priceFilter !== 'all' || sortBy !== 'default') && (
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setPriceFilter('all');
                                    setSortBy('default');
                                    setCurrentPage(1);
                                }}
                                className="text-xs font-bold text-secondary hover:underline cursor-pointer flex items-center gap-1"
                            >
                                <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                                Reset Filter
                            </button>
                        )}
                    </div>
                </>
            )}

            {/* Products Grid */}
            {displayProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {displayProducts.map((product, idx) => (
                        <ScrollCard
                            key={`${product.id}-${idx}`}
                            index={idx}
                            direction="up"
                            enableSpotlight={false}
                            className="group bg-surface rounded-3xl border border-outline-variant overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
                        >
                            <Link
                                href={`/katalog-kacamata/${product.slug}`}
                                className="h-64 bg-tertiary/40 flex items-center justify-center p-8 relative overflow-hidden block group-hover:bg-tertiary/60 transition-colors"
                            >
                                {product.image ? (
                                    <img
                                        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                                        src={product.image}
                                        alt={product.name}
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-on-surface-variant/50 gap-2 h-full">
                                        <div className="w-16 h-16 rounded-2xl bg-surface-variant/80 border border-outline-variant flex items-center justify-center shadow-inner">
                                            <span className="material-symbols-outlined text-3xl text-on-surface-variant/60">image_not_supported</span>
                                        </div>
                                        <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/70">Foto Belum Tersedia</span>
                                    </div>
                                )}
                                {product.badge && (
                                    <span className={`absolute top-4 left-4 ${product.badge.color} text-[10px] uppercase tracking-[0.15em] px-3.5 py-1.5 rounded-full font-bold shadow-md`}>
                                        {product.badge.text}
                                    </span>
                                )}
                            </Link>
                            <div className="p-7 flex-1 flex flex-col justify-between">
                                <div className="mb-4">
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="text-secondary font-bold text-[11px] uppercase tracking-widest">
                                            {product.category}
                                        </p>
                                        {product.sku && (
                                            <span className="text-[11px] font-mono text-on-surface-variant">
                                                {product.sku}
                                            </span>
                                        )}
                                    </div>
                                    <Link
                                        href={`/katalog-kacamata/${product.slug}`}
                                        className="font-semibold text-xl text-primary block hover:underline"
                                    >
                                        {product.name}
                                    </Link>
                                    {product.brand && (
                                        <p className="text-xs text-on-surface-variant mt-0.5">Brand: {product.brand}</p>
                                    )}
                                </div>

                                {/* Quick Stock Availability Preview */}
                                <div className="mb-4 py-2 px-3 rounded-xl bg-surface-variant/50 border border-outline-variant/60 flex items-center justify-between text-xs">
                                    <span className="text-on-surface-variant font-medium flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[16px] text-emerald-600">storefront</span>
                                        Ketersediaan:
                                    </span>
                                    <span className="font-bold text-primary">
                                        Pusat ({product.centralStock}) • {product.branchAvailability.filter(b => b.stock > 0).length} Cabang Ready
                                    </span>
                                </div>

                                <div className="flex justify-between items-center pt-4 border-t border-outline-variant/60">
                                    <span className="text-primary font-bold text-xl">{product.price}</span>
                                    <Link
                                        href={`/katalog-kacamata/${product.slug}`}
                                        className="px-4 py-2 rounded-xl bg-primary text-on-primary font-bold text-xs uppercase tracking-wider hover:bg-primary/90 transition-all shadow-md active:scale-95 flex items-center gap-1"
                                    >
                                        <span>Cek Stok &amp; Detail</span>
                                        <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                                    </Link>
                                </div>
                            </div>
                        </ScrollCard>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-surface rounded-3xl border border-outline-variant">
                    <span className="material-symbols-outlined text-5xl text-on-surface-variant/50 mb-3 block">
                        search_off
                    </span>
                    <h4 className="font-bold text-xl text-primary mb-1">Kacamata tidak ditemukan</h4>
                    <p className="text-on-surface-variant text-sm max-w-sm mx-auto mb-6">
                        Coba gunakan kata kunci lain atau ubah filter rentang harga yang Anda pilih.
                    </p>
                    <button
                        onClick={() => {
                            setSearchQuery('');
                            setPriceFilter('all');
                            setCurrentPage(1);
                        }}
                        className="px-6 py-2.5 rounded-full bg-primary text-on-primary font-bold text-sm shadow-md cursor-pointer"
                    >
                        Tampilkan Semua Produk
                    </button>
                </div>
            )}

            {/* Pagination Controls */}
            {!isHomePreview && totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-14">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        aria-label="Halaman Sebelumnya"
                        className="w-11 h-11 rounded-2xl border border-outline-variant bg-surface flex items-center justify-center text-primary disabled:opacity-40 disabled:cursor-not-allowed hover:bg-tertiary/50 transition-all cursor-pointer"
                    >
                        <span className="material-symbols-outlined">chevron_left</span>
                    </button>

                    {[...Array(totalPages)].map((_, i) => {
                        const pageNum = i + 1;
                        return (
                            <button
                                key={pageNum}
                                onClick={() => setCurrentPage(pageNum)}
                                aria-label={`Halaman ${pageNum}`}
                                className={`w-11 h-11 rounded-2xl font-bold text-sm transition-all cursor-pointer ${currentPage === pageNum
                                        ? 'bg-primary text-on-primary shadow-lg shadow-primary/25'
                                        : 'bg-surface border border-outline-variant text-primary hover:bg-tertiary/50'
                                    }`}
                            >
                                {pageNum}
                            </button>
                        );
                    })}

                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        aria-label="Halaman Selanjutnya"
                        className="w-11 h-11 rounded-2xl border border-outline-variant bg-surface flex items-center justify-center text-primary disabled:opacity-40 disabled:cursor-not-allowed hover:bg-tertiary/50 transition-all cursor-pointer"
                    >
                        <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                </div>
            )}

            {/* Bottom CTA Button on Home preview */}
            {isHomePreview && (
                <div className="text-center mt-12">
                    <Link
                        href="/katalog-kacamata"
                        className="inline-flex items-center gap-3 bg-surface border-2 border-primary text-primary hover:bg-primary hover:text-on-primary px-8 py-4 rounded-2xl font-bold text-base transition-all shadow-md active:scale-95"
                    >
                        <span>Lihat Semua Katalog Kacamata &amp; Cek Stok</span>
                        <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                    </Link>
                </div>
            )}
            {/* PRODUCT DETAIL NOW IN DEDICATED PAGE /katalog-kacamata/{slug} */}
        </section>
    );
}
