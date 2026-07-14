import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import PageHeader from '@/Components/Admin/PageHeader';
import DataTable from '@/Components/Admin/DataTable';
import StatusBadge from '@/Components/Admin/StatusBadge';

interface TransferReportProps {
    transfers: {
        data: any[];
        links: any[];
    };
}

export default function TransferReport({ transfers }: TransferReportProps) {
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
            header: 'Pengirim (Asal)',
            key: 'source',
            render: (item: any) => (
                <span className="font-semibold text-on-surface">
                    {item.source_type === 'central' ? 'Gudang Pusat' : item.source_branch?.name}
                </span>
            ),
        },
        {
            header: 'Penerima (Tujuan)',
            key: 'dest',
            render: (item: any) => (
                <span className="font-semibold text-on-surface">
                    {item.destination_type === 'central' ? 'Gudang Pusat' : item.destination_branch?.name}
                </span>
            ),
        },
        {
            header: 'Petugas',
            key: 'creator',
            render: (item: any) => (
                <span className="text-xs font-bold text-on-surface">{item.creator?.name}</span>
            ),
        },
        {
            header: 'Tanggal Dibuat',
            key: 'created_at',
            render: (item: any) => (
                <span className="text-xs text-on-surface-variant">
                    {new Date(item.created_at).toLocaleDateString('id-ID')}
                </span>
            ),
        },
        {
            header: 'Status Akhir',
            key: 'status',
            render: (item: any) => <StatusBadge status={item.status} />,
        },
    ];

    return (
        <AdminLayout>
            <Head title="Laporan Transfer - Harmoni by Phoeinx Sehat" />

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
                title="Laporan Riwayat Transfer Stok"
                subtitle="Rekap seluruh pengiriman antar cabang dan gudang pusat"
                icon="local_shipping"
            />

            <DataTable
                columns={columns}
                data={transfers.data}
                links={transfers.links}
                emptyMessage="Belum ada transaksi transfer."
            />
        </AdminLayout>
    );
}
