import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import PageHeader from '@/Components/Admin/PageHeader';
import DataTable from '@/Components/Admin/DataTable';
import StatusBadge from '@/Components/Admin/StatusBadge';
import StatsCard from '@/Components/Admin/StatsCard';
import { Branch, BranchInventory } from '@/types';

interface BranchShowProps {
    branch: Branch & {
        inventory: (BranchInventory & {
            product?: {
                sku: string;
                name: string;
                category: string;
                formatted_selling_price?: string;
            };
        })[];
    };
}

export default function BranchShow({ branch }: BranchShowProps) {
    const totalStock = branch.inventory?.reduce((sum, inv) => sum + inv.current_stock, 0) || 0;
    const lowStockCount = branch.inventory?.filter(inv => inv.current_stock <= inv.minimum_stock && inv.current_stock > 0).length || 0;
    const outOfStockCount = branch.inventory?.filter(inv => inv.current_stock === 0).length || 0;

    const columns = [
        {
            header: 'SKU & Produk',
            key: 'product',
            render: (inv: any) => (
                <div>
                    <p className="font-bold text-on-surface">{inv.product?.name || '—'}</p>
                    <p className="text-xs text-on-surface-variant mt-0.5">{inv.product?.sku}</p>
                </div>
            ),
        },
        {
            header: 'Kategori',
            key: 'category',
            render: (inv: any) => (
                <span className="uppercase text-xs font-semibold tracking-wider text-primary">
                    {inv.product?.category}
                </span>
            ),
        },
        {
            header: 'Stok Saat Ini',
            key: 'current_stock',
            render: (inv: any) => (
                <span className={`font-extrabold ${
                    inv.current_stock === 0 ? 'text-rose-500' :
                    inv.current_stock <= inv.minimum_stock ? 'text-amber-500' : 'text-on-surface'
                }`}>
                    {inv.current_stock} Unit
                </span>
            ),
        },
        {
            header: 'Stok Minimum',
            key: 'minimum_stock',
            render: (inv: any) => (
                <span className="text-on-surface-variant font-medium">{inv.minimum_stock} Unit</span>
            ),
        },
        {
            header: 'Harga Jual',
            key: 'price',
            render: (inv: any) => (
                <span className="font-semibold text-on-surface">{inv.product?.formatted_selling_price || '—'}</span>
            ),
        },
    ];

    return (
        <AdminLayout>
            <Head title={`Detail Cabang - ${branch.name}`} />

            <div className="mb-4">
                <Link
                    href={route('branches.index')}
                    className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                >
                    <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                    Kembali ke Daftar Cabang
                </Link>
            </div>

            <PageHeader
                title={branch.name}
                subtitle={`${branch.city} — ${branch.address}`}
                icon="store"
                action={
                    <StatusBadge status={branch.is_active} />
                }
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <StatsCard
                    title="Total Stok Cabang"
                    value={`${totalStock} Unit`}
                    icon="inventory_2"
                    color="primary"
                />
                <StatsCard
                    title="Stok Menipis"
                    value={`${lowStockCount} Item`}
                    icon="warning"
                    color="amber"
                />
                <StatsCard
                    title="Stok Habis (Kosong)"
                    value={`${outOfStockCount} Item`}
                    icon="remove_shopping_cart"
                    color="rose"
                />
            </div>

            <div className="mb-4">
                <h3 className="text-base font-bold text-on-surface tracking-tight">
                    Inventori Produk di {branch.name}
                </h3>
            </div>

            <DataTable
                columns={columns}
                data={branch.inventory || []}
                emptyMessage="Belum ada inventori untuk cabang ini."
            />
        </AdminLayout>
    );
}
