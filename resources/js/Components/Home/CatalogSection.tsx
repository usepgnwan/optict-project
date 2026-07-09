import React, { useState, useMemo } from 'react';
import { Link } from '@inertiajs/react';
import { ScrollCard } from '@/Components/ReactBits';

interface Product {
    id: number;
    category: string;
    name: string;
    price: string;
    priceValue: number;
    badge: { text: string; color: string } | null;
    image: string;
}

const products: Product[] = [
    {
        id: 1,
        category: 'Titanium Series',
        name: 'Aura Gold Classic',
        price: 'Rp 1.450.000',
        priceValue: 1450000,
        badge: { text: 'New Arrival', color: 'bg-secondary text-on-secondary' },
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCeWPF_of7nlKq-1AibDLuWcUstIxVEs7BG3rsc5Ojb8rJ0Y1CetJUtW5xvKg8CvFPaHnmIdhXM4SLWttp6lg5tQINjiSsN5Vc0B5xpIRwiiThiRz-zC-GFj5mLkM_rKXFbTc_VPmxNm-J5iqiGPubB3H5nxWvqj1WRZNvFtCmpYQmJdwr-wIrkHjy9sKtrBxJXtkzztnjf21d-1TK74gCdQDdSm9cmBHLEcaU2jp3qH3uyPiUeLfRl-DI2y_IDnfBFcDrQiHU2Diw',
    },
    {
        id: 2,
        category: 'Urban Lifestyle',
        name: 'Midnight Matte',
        price: 'Rp 980.000',
        priceValue: 980000,
        badge: { text: 'Popular', color: 'bg-primary text-on-primary' },
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8t0ZJeToebmAUNhBH3vVQZiDPkzHjlIhIaNCyBTjnGxx-FkhEuiozaWI5g14RqByGTBAdSjLlgQ3Ry-6P7kiRhqb9NqWzJlCGFjbc94qUomrVwN4WNYu_Q34DFKyi_Y4qNP0C_FWk21Eo9C020IDn1NKYFr_lsiX6r9gEjOei1CTzLcp9MHSLCTZmxYO2AsgZCmmXHUu4N6YLAx5fV2XZ1HUG7AZpptO0ioKhm_vUA0XL3089BVp_RDiKdZq7neQhLZO85D_sMoM',
    },
    {
        id: 3,
        category: 'Modern Collection',
        name: 'Sage Transparent',
        price: 'Rp 1.120.000',
        priceValue: 1120000,
        badge: null,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAL9yzDERVRDF5e8sYvl2u4WwItCsNRf3xj8KS0EBPZKj8AqhCz8rJkzlLg3BWyTbAsqh6BwKmdbGJQ-bWll27_enmNPWiqFQ7uJxdvrpsHS2cYQwybbZ2VKZQ_I8bq-MDcmjEvQeCnqZn05MlJMQqqZio3ULrySe1HZprlqRRGavGjsQopjWjJ9mu0nD4VmriCRX70O4YffPo_njj85JhDUgoB9AHl1MM713-g03fkyQBuB96QGz5nxC9PuHvzq0gf_jMfSosCS0s',
    },
    {
        id: 4,
        category: 'Heritage Series',
        name: 'Tortoise Round',
        price: 'Rp 1.250.000',
        priceValue: 1250000,
        badge: null,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEk8WGvLews9RY9DsTrofkrkV3uV39GXO6hbZ5EzZQOkzYe7Xbc1L1Vz8oAolPM8Uqva6NdfiokLZx51x_VCeTgRdb_mlzXxsn5XSt89EyIJPHOmEzBjzqcfeAoXjKgNZpwZAL8HrcmIlgnNiUBXmeoi-eSYk7eDbRbHFqXVWZ8hqR4HJU0SnYIYz1c8eAtCOhHeoZEZeK7KuAbVf0Eph9elkEAyTzkDIo3wA3E1IXgJ8aJgLiq26g4NPcfObgJ7eCzDgClpk-uMs',
    },
    {
        id: 5,
        category: 'Minimalist Frame',
        name: 'Crystal Clear Acetate',
        price: 'Rp 750.000',
        priceValue: 750000,
        badge: { text: 'Best Value', color: 'bg-emerald-600 text-white' },
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAL9yzDERVRDF5e8sYvl2u4WwItCsNRf3xj8KS0EBPZKj8AqhCz8rJkzlLg3BWyTbAsqh6BwKmdbGJQ-bWll27_enmNPWiqFQ7uJxdvrpsHS2cYQwybbZ2VKZQ_I8bq-MDcmjEvQeCnqZn05MlJMQqqZio3ULrySe1HZprlqRRGavGjsQopjWjJ9mu0nD4VmriCRX70O4YffPo_njj85JhDUgoB9AHl1MM713-g03fkyQBuB96QGz5nxC9PuHvzq0gf_jMfSosCS0s',
    },
    {
        id: 6,
        category: 'Luxury Titanium',
        name: 'Obsidian Black Titanium',
        price: 'Rp 1.850.000',
        priceValue: 1850000,
        badge: { text: 'Premium', color: 'bg-amber-600 text-white' },
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCeWPF_of7nlKq-1AibDLuWcUstIxVEs7BG3rsc5Ojb8rJ0Y1CetJUtW5xvKg8CvFPaHnmIdhXM4SLWttp6lg5tQINjiSsN5Vc0B5xpIRwiiThiRz-zC-GFj5mLkM_rKXFbTc_VPmxNm-J5iqiGPubB3H5nxWvqj1WRZNvFtCmpYQmJdwr-wIrkHjy9sKtrBxJXtkzztnjf21d-1TK74gCdQDdSm9cmBHLEcaU2jp3qH3uyPiUeLfRl-DI2y_IDnfBFcDrQiHU2Diw',
    },
    {
        id: 7,
        category: 'Classic Aviator',
        name: 'Aviator Pilot Gold',
        price: 'Rp 1.150.000',
        priceValue: 1150000,
        badge: null,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEk8WGvLews9RY9DsTrofkrkV3uV39GXO6hbZ5EzZQOkzYe7Xbc1L1Vz8oAolPM8Uqva6NdfiokLZx51x_VCeTgRdb_mlzXxsn5XSt89EyIJPHOmEzBjzqcfeAoXjKgNZpwZAL8HrcmIlgnNiUBXmeoi-eSYk7eDbRbHFqXVWZ8hqR4HJU0SnYIYz1c8eAtCOhHeoZEZeK7KuAbVf0Eph9elkEAyTzkDIo3wA3E1IXgJ8aJgLiq26g4NPcfObgJ7eCzDgClpk-uMs',
    },
    {
        id: 8,
        category: 'Retro Chic',
        name: 'Vintage Havana Horn',
        price: 'Rp 890.000',
        priceValue: 890000,
        badge: null,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8t0ZJeToebmAUNhBH3vVQZiDPkzHjlIhIaNCyBTjnGxx-FkhEuiozaWI5g14RqByGTBAdSjLlgQ3Ry-6P7kiRhqb9NqWzJlCGFjbc94qUomrVwN4WNYu_Q34DFKyi_Y4qNP0C_FWk21Eo9C020IDn1NKYFr_lsiX6r9gEjOei1CTzLcp9MHSLCTZmxYO2AsgZCmmXHUu4N6YLAx5fV2XZ1HUG7AZpptO0ioKhm_vUA0XL3089BVp_RDiKdZq7neQhLZO85D_sMoM',
    },
    {
        id: 9,
        category: 'Executive Line',
        name: 'Carbon Fiber Lite',
        price: 'Rp 2.100.000',
        priceValue: 2100000,
        badge: { text: 'Limited', color: 'bg-indigo-600 text-white' },
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCeWPF_of7nlKq-1AibDLuWcUstIxVEs7BG3rsc5Ojb8rJ0Y1CetJUtW5xvKg8CvFPaHnmIdhXM4SLWttp6lg5tQINjiSsN5Vc0B5xpIRwiiThiRz-zC-GFj5mLkM_rKXFbTc_VPmxNm-J5iqiGPubB3H5nxWvqj1WRZNvFtCmpYQmJdwr-wIrkHjy9sKtrBxJXtkzztnjf21d-1TK74gCdQDdSm9cmBHLEcaU2jp3qH3uyPiUeLfRl-DI2y_IDnfBFcDrQiHU2Diw',
    },
    {
        id: 10,
        category: 'Everyday Comfort',
        name: 'Flex Memory Tech',
        price: 'Rp 650.000',
        priceValue: 650000,
        badge: null,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAL9yzDERVRDF5e8sYvl2u4WwItCsNRf3xj8KS0EBPZKj8AqhCz8rJkzlLg3BWyTbAsqh6BwKmdbGJQ-bWll27_enmNPWiqFQ7uJxdvrpsHS2cYQwybbZ2VKZQ_I8bq-MDcmjEvQeCnqZn05MlJMQqqZio3ULrySe1HZprlqRRGavGjsQopjWjJ9mu0nD4VmriCRX70O4YffPo_njj85JhDUgoB9AHl1MM713-g03fkyQBuB96QGz5nxC9PuHvzq0gf_jMfSosCS0s',
    },
    {
        id: 11,
        category: 'Blue Light Armor',
        name: 'Digital Shield Pro',
        price: 'Rp 920.000',
        priceValue: 920000,
        badge: { text: 'Anti-Blue Light', color: 'bg-sky-600 text-white' },
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8t0ZJeToebmAUNhBH3vVQZiDPkzHjlIhIaNCyBTjnGxx-FkhEuiozaWI5g14RqByGTBAdSjLlgQ3Ry-6P7kiRhqb9NqWzJlCGFjbc94qUomrVwN4WNYu_Q34DFKyi_Y4qNP0C_FWk21Eo9C020IDn1NKYFr_lsiX6r9gEjOei1CTzLcp9MHSLCTZmxYO2AsgZCmmXHUu4N6YLAx5fV2XZ1HUG7AZpptO0ioKhm_vUA0XL3089BVp_RDiKdZq7neQhLZO85D_sMoM',
    },
    {
        id: 12,
        category: 'Designer Series',
        name: 'Rose Gold Geometric',
        price: 'Rp 1.550.000',
        priceValue: 1550000,
        badge: null,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEk8WGvLews9RY9DsTrofkrkV3uV39GXO6hbZ5EzZQOkzYe7Xbc1L1Vz8oAolPM8Uqva6NdfiokLZx51x_VCeTgRdb_mlzXxsn5XSt89EyIJPHOmEzBjzqcfeAoXjKgNZpwZAL8HrcmIlgnNiUBXmeoi-eSYk7eDbRbHFqXVWZ8hqR4HJU0SnYIYz1c8eAtCOhHeoZEZeK7KuAbVf0Eph9elkEAyTzkDIo3wA3E1IXgJ8aJgLiq26g4NPcfObgJ7eCzDgClpk-uMs',
    },
];

const ITEMS_PER_PAGE = 6;

interface CatalogSectionProps {
    isHomePreview?: boolean;
}

export default function CatalogSection({ isHomePreview = false }: CatalogSectionProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [priceFilter, setPriceFilter] = useState('all');
    const [sortBy, setSortBy] = useState('default');
    const [currentPage, setCurrentPage] = useState(1);

    // Filter & Sort Logic (used only on standalone full catalog page)
    const filteredProducts = useMemo(() => {
        let list = products.filter((p) => {
            const matchesSearch =
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.category.toLowerCase().includes(searchQuery.toLowerCase());

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
    }, [searchQuery, priceFilter, sortBy]);

    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;
    const paginatedProducts = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredProducts, currentPage]);

    // When on Home preview mode, show top 6 products directly (3 columns grid)
    const displayProducts = isHomePreview ? products.slice(0, 6) : paginatedProducts;

    return (
        <section id="catalog" className="py-20 max-w-[1200px] mx-auto px-6 scroll-mt-24">
            {/* Header only shown on Home Preview */}
            {isHomePreview && (
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest mb-3">
                            Koleksi Unggulan
                        </span>
                        <h2 className="font-semibold text-[32px] leading-[40px] tracking-tight text-primary mb-2">
                            Katalog Kacamata &amp; Frame
                        </h2>
                        <p className="text-on-surface-variant max-w-2xl">
                            Temukan bingkai favorit Anda yang menggabungkan presisi ergonomis, material ringan berkualitas tinggi, dan keanggunan gaya modern.
                        </p>
                    </div>

                    <Link
                        href="/katalog-kacamataa"
                        className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-full font-bold text-sm tracking-wide shadow-lg hover:bg-primary/90 transition-all shrink-0 active:scale-95"
                    >
                        Lihat Lainnya <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
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
                                placeholder="Cari model atau kategori frame..."
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
                            {/* Price Filter */}
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

                            {/* Sort Filter */}
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

            {/* Products Grid (3 columns per row) */}
            {displayProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {displayProducts.map((product, idx) => (
                        <ScrollCard
                            key={product.id}
                            index={idx}
                            direction="up"
                            enableSpotlight={false}
                            className="group bg-surface rounded-3xl border border-outline-variant overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
                        >
                            <div className="h-64 bg-tertiary/40 flex items-center justify-center p-8 relative overflow-hidden">
                                <img
                                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                                    src={product.image}
                                    alt={product.name}
                                />
                                {product.badge && (
                                    <span className={`absolute top-4 left-4 ${product.badge.color} text-[10px] uppercase tracking-[0.15em] px-3.5 py-1.5 rounded-full font-bold shadow-md`}>
                                        {product.badge.text}
                                    </span>
                                )}
                            </div>
                            <div className="p-7 flex-1 flex flex-col justify-between">
                                <div className="mb-6">
                                    <p className="text-secondary font-bold text-[11px] uppercase tracking-widest mb-1">
                                        {product.category}
                                    </p>
                                    <h4 className="font-semibold text-xl text-primary">{product.name}</h4>
                                </div>
                                <div className="flex justify-between items-center pt-4 border-t border-outline-variant/60">
                                    <span className="text-primary font-bold text-xl">{product.price}</span>
                                    <a
                                        href="#booking"
                                        className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-xs uppercase tracking-wider hover:bg-primary/90 transition-all shadow-md active:scale-95"
                                    >
                                        Pesan Frame
                                    </a>
                                </div>
                            </div>
                        </ScrollCard>
                    ))}
                </div>
            ) : (
                /* Empty State */
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

            {/* Pagination Controls (Only on full catalog page) */}
            {!isHomePreview && totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-14">
                    {/* Previous Button */}
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        aria-label="Halaman Sebelumnya"
                        className="w-11 h-11 rounded-2xl border border-outline-variant bg-surface flex items-center justify-center text-primary disabled:opacity-40 disabled:cursor-not-allowed hover:bg-tertiary/50 transition-all cursor-pointer"
                    >
                        <span className="material-symbols-outlined">chevron_left</span>
                    </button>

                    {/* Page Number Buttons */}
                    {[...Array(totalPages)].map((_, i) => {
                        const pageNum = i + 1;
                        return (
                            <button
                                key={pageNum}
                                onClick={() => setCurrentPage(pageNum)}
                                aria-label={`Halaman ${pageNum}`}
                                className={`w-11 h-11 rounded-2xl font-bold text-sm transition-all cursor-pointer ${
                                    currentPage === pageNum
                                        ? 'bg-primary text-on-primary shadow-lg shadow-primary/25'
                                        : 'bg-surface border border-outline-variant text-primary hover:bg-tertiary/50'
                                }`}
                            >
                                {pageNum}
                            </button>
                        );
                    })}

                    {/* Next Button */}
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
                        href="/katalog-kacamataa"
                        className="inline-flex items-center gap-3 bg-surface border-2 border-primary text-primary hover:bg-primary hover:text-on-primary px-8 py-4 rounded-2xl font-bold text-base transition-all shadow-md active:scale-95"
                    >
                        <span>Lihat 12+ Katalog Kacamata Lainnya</span>
                        <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                    </Link>
                </div>
            )}
        </section>
    );
}
