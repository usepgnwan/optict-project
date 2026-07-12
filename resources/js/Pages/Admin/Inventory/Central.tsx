import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import PageHeader from '@/Components/Admin/PageHeader';
import DataTable from '@/Components/Admin/DataTable';
import SearchFilter from '@/Components/Admin/SearchFilter';
import StatsCard from '@/Components/Admin/StatsCard';
import { CentralInventory } from '@/types';

interface CentralPageProps {
    inventories: {
        data: CentralInventory[];
        links: any[];
    };
    filters: {
        search?: string;
        category?: string;
    };
    categories: Record<string, string>;
}

export default function CentralInventoryPage({ inventories, filters, categories }: CentralPageProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || '');

    const handleSearch = (val: string) => {
        setSearch(val);
        router.get(
            route('central-inventory.index'),
            { search: val, category: selectedCategory },
            { preserveState: true, replace: true }
        );
    };

    const handleCategoryChange = (cat: string) => {
        setSelectedCategory(cat);
        router.get(
            route('central-inventory.index'),
            { search, category: cat },
            { preserveState: true, replace: true }
        );
    };

    const totalQuantity = inventories.data.reduce((acc, item) => acc + item.quantity, 0);

    const columns = [
        {
            header: 'SKU & Produk',
            key: 'product',
            render: (item: CentralInventory) => (
                <div>
                    <Link
                        href={route('products.show', item.product_id)}
                        className="font-bold text-primary hover:underline block"
                    >
                        {item.product?.name}
                    </Link>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                        SKU: <span className="font-semibold">{item.product?.sku}</span> • Brand: {item.product?.brand}
                    </p>
                </div>
            ),
        },
        {
            header: 'Kategori',
            key: 'category',
            render: (item: CentralInventory) => (
                <span className="inline-block px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary">
                    {item.product?.category}
                </span>
            ),
        },
        {
            header: 'Harga Jual',
            key: 'price',
            render: (item: CentralInventory) => (
                <span className="font-semibold text-on-surface">
                    Rp {Number(item.product?.selling_price || 0).toLocaleString('id-ID')}
                </span>
            ),
        },
        {
            header: 'Stok Gudang Pusat',
            key: 'quantity',
            render: (item: CentralInventory) => (
                <span className={`font-extrabold text-base ${item.quantity === 0 ? 'text-rose-500' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    {item.quantity} Unit
                </span>
            ),
        },
    ];

    return (
        <AdminLayout>
            <Head title="Gudang Pusat - Optik Calm" />

            <PageHeader
                title="Stok Gudang Pusat (Central Warehouse)"
                subtitle="Inventori utama yang bertindak sebagai pusat suplai seluruh cabang optik"
                icon="warehouse"
                action={
                    <Link
                        href={route('stock-transfers.index')}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-sm shadow-md shadow-primary/20 hover:bg-primary/90 transition-all"
                    >
                        <span className="material-symbols-outlined text-[20px]">local_shipping</span>
                        <span>Buat Transfer Stok</span>
                    </Link>
                }
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <StatsCard
                    title="Total Item di Halaman Ini"
                    value={`${inventories.data.length} Produk`}
                    icon="category"
                    color="primary"
                />
                <StatsCard
                    title="Akumulasi Kuantitas Stok (Halaman Ini)"
                    value={`${totalQuantity} Unit`}
                    icon="inventory_2"
                    color="emerald"
                />
            </div>

            <SearchFilter
                search={search}
                onSearchChange={handleSearch}
                placeholder="Cari nama produk, SKU, barcode di Gudang Pusat..."
            >
                <select
                    value={selectedCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="px-3.5 py-2 rounded-xl bg-surface-variant/50 border border-outline-variant/60 text-sm text-on-surface focus:outline-none focus:border-primary"
                >
                    <option value="">Semua Kategori</option>
                    {Object.entries(categories).map(([k, v]) => (
                        <option key={k} value={k}>{v}</option>
                    ))}
                </select>
            </SearchFilter>

            <DataTable
                columns={columns}
                data={inventories.data}
                links={inventories.links}
                emptyMessage="Tidak ada inventori produk di Gudang Pusat."
            />
        </AdminLayout>
    );
}
