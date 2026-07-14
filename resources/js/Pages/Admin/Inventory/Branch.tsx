import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import PageHeader from '@/Components/Admin/PageHeader';
import DataTable from '@/Components/Admin/DataTable';
import SearchFilter from '@/Components/Admin/SearchFilter';
import StatsCard from '@/Components/Admin/StatsCard';
import { BranchInventory, Branch } from '@/types';

interface BranchInventoryPageProps {
    inventories: {
        data: BranchInventory[];
        links: any[];
    };
    branches: Branch[];
    selectedBranchId: number;
    filters: {
        search?: string;
        branch_id?: number;
    };
}

export default function BranchInventoryPage({ inventories, branches, selectedBranchId, filters }: BranchInventoryPageProps) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (val: string) => {
        setSearch(val);
        router.get(
            route('branch-inventory.index'),
            { search: val, branch_id: selectedBranchId },
            { preserveState: true, replace: true }
        );
    };

    const handleBranchChange = (branchId: number) => {
        router.get(
            route('branch-inventory.index'),
            { search, branch_id: branchId },
            { preserveState: true, replace: true }
        );
    };

    const currentBranch = branches.find(b => b.id === selectedBranchId);
    const totalQuantity = inventories.data.reduce((acc, item) => acc + item.current_stock, 0);

    const columns = [
        {
            header: 'Produk & SKU',
            key: 'product',
            render: (item: BranchInventory) => (
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
            render: (item: BranchInventory) => (
                <span className="inline-block px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary">
                    {item.product?.category}
                </span>
            ),
        },
        {
            header: 'Stok Terkini',
            key: 'current_stock',
            render: (item: BranchInventory) => (
                <span className={`font-extrabold text-base ${item.current_stock === 0 ? 'text-rose-500' :
                        item.current_stock <= item.minimum_stock ? 'text-amber-500' : 'text-on-surface'
                    }`}>
                    {item.current_stock} Unit
                </span>
            ),
        },
        {
            header: 'Stok Minimum',
            key: 'minimum_stock',
            render: (item: BranchInventory) => (
                <span className="text-sm font-medium text-on-surface-variant">{item.minimum_stock} Unit</span>
            ),
        },
        {
            header: 'Status',
            key: 'status',
            render: (item: BranchInventory) => {
                if (item.current_stock === 0) {
                    return <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-500">Kosong</span>;
                }
                if (item.current_stock <= item.minimum_stock) {
                    return <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-500">Menipis</span>;
                }
                return <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500">Aman</span>;
            },
        },
    ];

    return (
        <AdminLayout>
            <Head title="Stok Cabang - Harmoni by Phoeinx Sehat" />

            <PageHeader
                title="Stok Inventori Cabang"
                subtitle="Pantau ketersediaan stok fisik di tiap cabang optik"
                icon="inventory_2"
                action={
                    <select
                        value={selectedBranchId}
                        onChange={(e) => handleBranchChange(Number(e.target.value))}
                        className="px-4 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-sm shadow-md shadow-primary/20 cursor-pointer focus:outline-none"
                    >
                        {branches.map((b) => (
                            <option key={b.id} value={b.id} className="bg-surface text-on-surface">
                                Cabang: {b.name}
                            </option>
                        ))}
                    </select>
                }
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <StatsCard
                    title={`Total Item di ${currentBranch?.name || 'Cabang'}`}
                    value={`${inventories.data.length} Produk`}
                    icon="storefront"
                    color="primary"
                />
                <StatsCard
                    title="Akumulasi Unit Stok (Halaman Ini)"
                    value={`${totalQuantity} Unit`}
                    icon="inventory_2"
                    color="emerald"
                />
            </div>

            <SearchFilter
                search={search}
                onSearchChange={handleSearch}
                placeholder="Cari nama produk, SKU, atau barcode di cabang ini..."
            />

            <DataTable
                columns={columns}
                data={inventories.data}
                links={inventories.links}
                emptyMessage="Belum ada inventori untuk cabang yang dipilih."
            />
        </AdminLayout>
    );
}
