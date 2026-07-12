import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import PageHeader from '@/Components/Admin/PageHeader';
import DataTable from '@/Components/Admin/DataTable';
import SearchFilter from '@/Components/Admin/SearchFilter';

interface MovementReportProps {
    movements: {
        data: any[];
        links: any[];
    };
    filters: {
        movement_type?: string;
    };
    types: Record<string, string>;
}

export default function MovementReport({ movements, filters, types }: MovementReportProps) {
    const [selectedType, setSelectedType] = useState(filters.movement_type || '');

    const handleTypeChange = (type: string) => {
        setSelectedType(type);
        router.get(
            route('reports.movements'),
            { movement_type: type },
            { preserveState: true, replace: true }
        );
    };

    const columns = [
        {
            header: 'Tanggal & Waktu',
            key: 'created_at',
            render: (item: any) => (
                <div>
                    <p className="font-bold text-on-surface text-xs">
                        {new Date(item.created_at).toLocaleDateString('id-ID')}
                    </p>
                    <p className="text-[11px] text-on-surface-variant">
                        {new Date(item.created_at).toLocaleTimeString('id-ID')}
                    </p>
                </div>
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
            header: 'Lokasi Mutasi',
            key: 'location',
            render: (item: any) => (
                <span className="text-xs font-semibold text-on-surface">
                    {item.location_type === 'central' ? 'Gudang Pusat' : item.branch?.name}
                </span>
            ),
        },
        {
            header: 'Tipe Transaksi',
            key: 'movement_type',
            render: (item: any) => (
                <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary">
                    {types[item.movement_type] || item.movement_type}
                </span>
            ),
        },
        {
            header: 'Sebelum → Perubahan → Sesudah',
            key: 'change',
            render: (item: any) => (
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-on-surface-variant font-medium">{item.before_quantity}</span>
                    <span className={`font-bold ${item.quantity_change > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        ({item.quantity_change > 0 ? `+${item.quantity_change}` : item.quantity_change})
                    </span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    <span className="font-extrabold text-on-surface">{item.after_quantity}</span>
                </div>
            ),
        },
        {
            header: 'Petugas',
            key: 'user',
            render: (item: any) => (
                <span className="text-xs font-bold text-on-surface">{item.user?.name || 'Sistem'}</span>
            ),
        },
    ];

    return (
        <AdminLayout>
            <Head title="Laporan Mutasi Stok - Optik Calm" />

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
                title="Laporan Jejak Mutasi (Stock Movement Ledger)"
                subtitle="Catatan audit ACID yang merekam semua penambahan dan pengurangan stok secara permanen"
                icon="swap_horiz"
            />

            <SearchFilter
                search=""
                onSearchChange={() => {}}
                placeholder="Filter tipe mutasi..."
            >
                <select
                    value={selectedType}
                    onChange={(e) => handleTypeChange(e.target.value)}
                    className="px-3.5 py-2 rounded-xl bg-surface-variant/50 border border-outline-variant/60 text-sm text-on-surface focus:outline-none focus:border-primary"
                >
                    <option value="">Semua Tipe Mutasi</option>
                    {Object.entries(types).map(([k, v]) => (
                        <option key={k} value={k}>{v}</option>
                    ))}
                </select>
            </SearchFilter>

            <DataTable
                columns={columns}
                data={movements.data}
                links={movements.links}
                emptyMessage="Belum ada transaksi mutasi stok yang tercatat."
            />
        </AdminLayout>
    );
}
