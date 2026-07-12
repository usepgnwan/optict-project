import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import PageHeader from '@/Components/Admin/PageHeader';
import DataTable from '@/Components/Admin/DataTable';
import SearchFilter from '@/Components/Admin/SearchFilter';

interface AdjustmentsIndexProps {
    adjustments: {
        data: any[];
        links: any[];
    };
    filters: {
        reason?: string;
    };
    reasons: Record<string, string>;
}

export default function AdjustmentsIndex({ adjustments, filters, reasons }: AdjustmentsIndexProps) {
    const [selectedReason, setSelectedReason] = useState(filters.reason || '');

    const handleReasonChange = (val: string) => {
        setSelectedReason(val);
        router.get(
            route('stock-adjustments.index'),
            { reason: val },
            { preserveState: true, replace: true }
        );
    };

    const columns = [
        {
            header: 'No. Penyesuaian',
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
                    <p className="text-xs text-on-surface-variant mt-0.5">SKU: {item.product?.sku}</p>
                </div>
            ),
        },
        {
            header: 'Lokasi',
            key: 'location',
            render: (item: any) => (
                <span className="text-sm font-semibold text-on-surface">
                    {item.location_type === 'central' ? 'Gudang Pusat' : item.branch?.name}
                </span>
            ),
        },
        {
            header: 'Alasan',
            key: 'reason',
            render: (item: any) => (
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    {reasons[item.reason] || item.reason}
                </span>
            ),
        },
        {
            header: 'Stok Sebelum → Sesudah',
            key: 'stock_change',
            render: (item: any) => (
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-on-surface-variant font-medium">{item.before_stock}</span>
                    <span className={`font-bold ${item.adjustment_qty > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        ({item.adjustment_qty > 0 ? `+${item.adjustment_qty}` : item.adjustment_qty})
                    </span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    <span className="font-extrabold text-on-surface">{item.after_stock}</span>
                </div>
            ),
        },
        {
            header: 'Dicatat Oleh & Waktu',
            key: 'user',
            render: (item: any) => (
                <div>
                    <p className="text-xs font-bold text-on-surface">{item.user?.name}</p>
                    <p className="text-[11px] text-on-surface-variant">
                        {new Date(item.created_at).toLocaleDateString('id-ID')}
                    </p>
                </div>
            ),
        },
    ];

    return (
        <AdminLayout>
            <Head title="Penyesuaian Stok - Optik Calm" />

            <PageHeader
                title="Riwayat Penyesuaian Stok (Adjustments)"
                subtitle="Koreksi stok karena kehilangan, kerusakan, atau selisih fisik"
                icon="tune"
                action={
                    <Link
                        href={route('stock-adjustments.create')}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-sm shadow-md shadow-primary/20 hover:bg-primary/90 transition-all"
                    >
                        <span className="material-symbols-outlined text-[20px]">add</span>
                        <span>Catat Penyesuaian</span>
                    </Link>
                }
            />

            <SearchFilter
                search=""
                onSearchChange={() => {}}
                placeholder="Filter penyesuaian stok..."
            >
                <select
                    value={selectedReason}
                    onChange={(e) => handleReasonChange(e.target.value)}
                    className="px-3.5 py-2 rounded-xl bg-surface-variant/50 border border-outline-variant/60 text-sm text-on-surface focus:outline-none focus:border-primary"
                >
                    <option value="">Semua Alasan</option>
                    {Object.entries(reasons).map(([k, v]) => (
                        <option key={k} value={k}>{v}</option>
                    ))}
                </select>
            </SearchFilter>

            <DataTable
                columns={columns}
                data={adjustments.data}
                links={adjustments.links}
                emptyMessage="Belum ada catatan penyesuaian stok."
            />
        </AdminLayout>
    );
}
