import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import PageHeader from '@/Components/Admin/PageHeader';
import DataTable from '@/Components/Admin/DataTable';
import StatusBadge from '@/Components/Admin/StatusBadge';
import SearchFilter from '@/Components/Admin/SearchFilter';

interface OpnamesIndexProps {
    opnames: {
        data: any[];
        links: any[];
    };
    filters: {
        status?: string;
    };
    statuses: Record<string, string>;
}

export default function OpnamesIndex({ opnames, filters, statuses }: OpnamesIndexProps) {
    const [selectedStatus, setSelectedStatus] = useState(filters.status || '');

    const handleStatusChange = (status: string) => {
        setSelectedStatus(status);
        router.get(
            route('stock-opnames.index'),
            { status },
            { preserveState: true, replace: true }
        );
    };

    const columns = [
        {
            header: 'No. Opname',
            key: 'opname_number',
            render: (item: any) => (
                <Link
                    href={route('stock-opnames.show', item.id)}
                    className="font-bold text-primary hover:underline"
                >
                    {item.opname_number}
                </Link>
            ),
        },
        {
            header: 'Lokasi',
            key: 'location',
            render: (item: any) => (
                <span className="font-semibold text-on-surface">
                    {item.location_type === 'central' ? 'Gudang Pusat' : item.branch?.name}
                </span>
            ),
        },
        {
            header: 'Tanggal Dibuat',
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
            header: 'Pembuat',
            key: 'creator',
            render: (item: any) => (
                <span className="text-xs font-bold text-on-surface">{item.creator?.name}</span>
            ),
        },
        {
            header: 'Status',
            key: 'status',
            render: (item: any) => <StatusBadge status={item.status} label={statuses[item.status]} />,
        },
        {
            header: 'Aksi',
            key: 'action',
            render: (item: any) => (
                <Link
                    href={route('stock-opnames.show', item.id)}
                    className="px-3 py-1.5 rounded-xl bg-surface-variant text-primary text-xs font-bold hover:bg-primary/10 transition-colors"
                >
                    Buka Sesi
                </Link>
            ),
        },
    ];

    return (
        <AdminLayout>
            <Head title="Stock Opname - Optik Calm" />

            <PageHeader
                title="Daftar Stock Opname (Penghitungan Fisik)"
                subtitle="Penghitungan stok berkala dan pencocokan otomatis dengan sistem"
                icon="fact_check"
                action={
                    <Link
                        href={route('stock-opnames.create')}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-sm shadow-md shadow-primary/20 hover:bg-primary/90 transition-all"
                    >
                        <span className="material-symbols-outlined text-[20px]">add</span>
                        <span>Buat Sesi Opname</span>
                    </Link>
                }
            />

            <SearchFilter
                search=""
                onSearchChange={() => {}}
                placeholder="Filter sesi opname..."
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
                data={opnames.data}
                links={opnames.links}
                emptyMessage="Belum ada sesi stock opname."
            />
        </AdminLayout>
    );
}
