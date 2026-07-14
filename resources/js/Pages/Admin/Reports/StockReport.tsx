import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import PageHeader from '@/Components/Admin/PageHeader';
import DataTable from '@/Components/Admin/DataTable';

interface StockReportProps {
    central: any[];
    branch: any[];
    branches: any[];
}

export default function StockReport({ central, branch }: StockReportProps) {
    const centralCols = [
        {
            header: 'Produk & SKU',
            key: 'product',
            render: (item: any) => (
                <div>
                    <p className="font-bold text-on-surface">{item.product?.name}</p>
                    <p className="text-xs text-on-surface-variant">SKU: {item.product?.sku}</p>
                </div>
            ),
        },
        {
            header: 'Kategori',
            key: 'category',
            render: (item: any) => (
                <span className="uppercase text-xs font-bold text-primary">{item.product?.category}</span>
            ),
        },
        {
            header: 'Stok Gudang Pusat',
            key: 'quantity',
            render: (item: any) => (
                <span className="font-extrabold text-base text-emerald-600 dark:text-emerald-400">
                    {item.quantity} Unit
                </span>
            ),
        },
    ];

    const branchCols = [
        {
            header: 'Cabang Optik',
            key: 'branch',
            render: (item: any) => (
                <span className="font-bold text-on-surface">{item.branch?.name}</span>
            ),
        },
        {
            header: 'Produk & SKU',
            key: 'product',
            render: (item: any) => (
                <div>
                    <p className="font-bold text-on-surface">{item.product?.name}</p>
                    <p className="text-xs text-on-surface-variant">SKU: {item.product?.sku}</p>
                </div>
            ),
        },
        {
            header: 'Stok Cabang',
            key: 'current_stock',
            render: (item: any) => (
                <span className="font-extrabold text-base text-primary">
                    {item.current_stock} Unit
                </span>
            ),
        },
    ];

    return (
        <AdminLayout>
            <Head title="Laporan Stok - Harmoni by Phoeinx Sehat" />

            <div className="mb-4">
                <Link
                    href={route('reports.index')}
                    className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                >
                    <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                    Kembali ke Pusat Laporan
                </Link>
            </div>

            <PageHeader
                title="Laporan Posisi Stok Lengkap"
                subtitle="Rekapitulasi saldo stok di Gudang Pusat dan seluruh Cabang"
                icon="inventory"
            />

            <div className="space-y-8">
                <div>
                    <h3 className="text-base font-bold text-on-surface mb-3">
                        1. Stok Gudang Pusat (Central Warehouse)
                    </h3>
                    <DataTable
                        columns={centralCols}
                        data={central}
                        emptyMessage="Stok di Gudang Pusat kosong."
                    />
                </div>

                <div>
                    <h3 className="text-base font-bold text-on-surface mb-3">
                        2. Sebaran Stok di Seluruh Cabang Optik
                    </h3>
                    <DataTable
                        columns={branchCols}
                        data={branch}
                        emptyMessage="Belum ada penyebaran stok cabang."
                    />
                </div>
            </div>
        </AdminLayout>
    );
}
