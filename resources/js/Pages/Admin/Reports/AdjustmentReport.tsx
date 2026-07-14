import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import PageHeader from '@/Components/Admin/PageHeader';
import DataTable from '@/Components/Admin/DataTable';

interface AdjustmentReportProps {
    adjustments: {
        data: any[];
        links: any[];
    };
}

export default function AdjustmentReport({ adjustments }: AdjustmentReportProps) {
    const columns = [
        {
            header: 'No. Adjustment',
            key: 'adjustment_number',
            render: (item: any) => (
                <span className="font-bold text-on-surface">{item.adjustment_number}</span>
            ),
        },
        {
            header: 'Produk / SKU',
            key: 'product',
            render: (item: any) => (
                <div>
                    <p className="font-bold text-on-surface">{item.product?.name}</p>
                    <p className="text-xs text-on-surface-variant">SKU: {item.product?.sku}</p>
                </div>
            ),
        },
        {
            header: 'Lokasi',
            key: 'loc',
            render: (item: any) => (
                <span className="text-xs font-semibold text-on-surface">
                    {item.location_type === 'central' ? 'Gudang Pusat' : item.branch?.name}
                </span>
            ),
        },
        {
            header: 'Alasan',
            key: 'reason',
            render: (item: any) => (
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-500/10 text-amber-600">
                    {item.reason}
                </span>
            ),
        },
        {
            header: 'Koreksi (+/-)',
            key: 'qty',
            render: (item: any) => (
                <span className={`font-extrabold ${item.adjustment_qty > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {item.adjustment_qty > 0 ? `+${item.adjustment_qty}` : item.adjustment_qty} Unit
                </span>
            ),
        },
        {
            header: 'Petugas',
            key: 'user',
            render: (item: any) => (
                <span className="text-xs font-bold text-on-surface">{item.user?.name}</span>
            ),
        },
    ];

    return (
        <AdminLayout>
            <Head title="Laporan Penyesuaian - Harmoni by Phoeinx Sehat" />

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
                title="Laporan Penyesuaian Stok"
                subtitle="Rekapitulasi seluruh penyesuaian stok karena cacat, hilang, rusak, dan selisih opname"
                icon="tune"
            />

            <DataTable
                columns={columns}
                data={adjustments.data}
                links={adjustments.links}
                emptyMessage="Belum ada catatan penyesuaian stok."
            />
        </AdminLayout>
    );
}
