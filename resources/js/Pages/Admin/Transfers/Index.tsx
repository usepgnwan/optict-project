import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import PageHeader from '@/Components/Admin/PageHeader';
import DataTable from '@/Components/Admin/DataTable';
import StatusBadge from '@/Components/Admin/StatusBadge';
import SearchFilter from '@/Components/Admin/SearchFilter';

interface TransferIndexProps {
    transfers: {
        data: any[];
        links: any[];
    };
    filters: {
        status?: string;
    };
    statuses: Record<string, string>;
}

export default function TransfersIndex({ transfers, filters, statuses }: TransferIndexProps) {
    const [selectedStatus, setSelectedStatus] = useState(filters.status || '');

    const handleStatusChange = (status: string) => {
        setSelectedStatus(status);
        router.get(
            route('stock-transfers.index'),
            { status },
            { preserveState: true, replace: true }
        );
    };

    const columns = [
        {
            header: 'No. Transfer',
            key: 'transfer_number',
            render: (item: any) => (
                <Link
                    href={route('stock-transfers.show', item.id)}
                    className="font-bold text-primary hover:underline"
                >
                    {item.transfer_number}
                </Link>
            ),
        },
        {
            header: 'Asal → Tujuan',
            key: 'route',
            render: (item: any) => (
                <div className="flex items-center gap-2 text-sm">
                    <span className="font-semibold text-on-surface">
                        {item.source_type === 'central' ? 'Gudang Pusat' : item.source_branch?.name}
                    </span>
                    <span className="material-symbols-outlined text-[16px] text-primary">arrow_forward</span>
                    <span className="font-semibold text-on-surface">
                        {item.destination_type === 'central' ? 'Gudang Pusat' : item.destination_branch?.name}
                    </span>
                </div>
            ),
        },
        {
            header: 'Dibuat Oleh',
            key: 'creator',
            render: (item: any) => (
                <span className="text-xs text-on-surface-variant font-medium">
                    {item.creator?.name || '—'}
                </span>
            ),
        },
        {
            header: 'Tanggal',
            key: 'date',
            render: (item: any) => (
                <span className="text-xs text-on-surface-variant">
                    {new Date(item.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                    })}
                </span>
            ),
        },
        {
            header: 'Status',
            key: 'status',
            render: (item: any) => <StatusBadge status={item.status} label={statuses[item.status]} />,
        },
        {
            header: 'Detail',
            key: 'action',
            render: (item: any) => (
                <Link
                    href={route('stock-transfers.show', item.id)}
                    className="px-3 py-1.5 rounded-xl bg-surface-variant text-primary text-xs font-bold hover:bg-primary/10 transition-colors"
                >
                    Lihat
                </Link>
            ),
        },
    ];

    return (
        <AdminLayout>
            <Head title="Daftar Transfer Stok - Harmoni by Phoeinx Sehat" />

            <PageHeader
                title="Daftar Transfer Stok"
                subtitle="Pengiriman & perpindahan stok antar Gudang Pusat dan Cabang Optik"
                icon="local_shipping"
                action={
                    <Link
                        href={route('stock-transfers.create')}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-sm shadow-md shadow-primary/20 hover:bg-primary/90 transition-all"
                    >
                        <span className="material-symbols-outlined text-[20px]">add</span>
                        <span>Buat Transfer Baru</span>
                    </Link>
                }
            />

            <SearchFilter
                search=""
                onSearchChange={() => { }}
                placeholder="Filter berdasarkan status transfer..."
            >
                <select
                    value={selectedStatus}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="px-3.5 py-2 rounded-xl bg-surface-variant/50 border border-outline-variant/60 text-sm text-on-surface focus:outline-none focus:border-primary"
                >
                    <option value="">Semua Status</option>
                    {Object.entries(statuses).map(([k, v]) => (
                        <option key={k} value={k}>{v}</option>
                    ))}
                </select>
            </SearchFilter>

            <DataTable
                columns={columns}
                data={transfers.data}
                links={transfers.links}
                emptyMessage="Belum ada riwayat transfer stok."
            />
        </AdminLayout>
    );
}
