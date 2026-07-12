import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import PageHeader from '@/Components/Admin/PageHeader';
import DataTable from '@/Components/Admin/DataTable';
import StatusBadge from '@/Components/Admin/StatusBadge';

interface TransfersShowProps {
    transfer: any;
}

export default function TransfersShow({ transfer }: TransfersShowProps) {
    const handleApprove = () => {
        if (confirm('Setujui transfer stok ini? Status akan beralih ke Approved.')) {
            router.post(route('stock-transfers.approve', transfer.id));
        }
    };

    const handleShip = () => {
        if (confirm('Tandai transfer ini sedang dalam pengiriman (Shipped) dan potong stok asal?')) {
            router.post(route('stock-transfers.ship', transfer.id));
        }
    };

    const handleReceive = () => {
        if (confirm('Konfirmasi penerimaan barang dan tambahkan ke stok tujuan (Received)?')) {
            router.post(route('stock-transfers.receive', transfer.id));
        }
    };

    const handleCancel = () => {
        if (confirm('Apakah Anda yakin ingin membatalkan transfer ini?')) {
            router.post(route('stock-transfers.cancel', transfer.id));
        }
    };

    const columns = [
        {
            header: 'SKU & Produk',
            key: 'product',
            render: (item: any) => (
                <div>
                    <p className="font-bold text-on-surface">{item.product?.name}</p>
                    <p className="text-xs text-on-surface-variant mt-0.5">SKU: {item.product?.sku}</p>
                </div>
            ),
        },
        {
            header: 'Brand / Kategori',
            key: 'brand',
            render: (item: any) => (
                <span className="text-xs font-semibold text-on-surface">
                    {item.product?.brand} • <span className="uppercase text-primary">{item.product?.category}</span>
                </span>
            ),
        },
        {
            header: 'Jumlah Transfer',
            key: 'quantity',
            render: (item: any) => (
                <span className="font-extrabold text-base text-primary">
                    {item.quantity} Unit
                </span>
            ),
        },
    ];

    return (
        <AdminLayout>
            <Head title={`Detail Transfer - ${transfer.transfer_number}`} />

            <div className="mb-4">
                <Link
                    href={route('stock-transfers.index')}
                    className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                >
                    <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                    Kembali ke Daftar Transfer
                </Link>
            </div>

            <PageHeader
                title={`Transfer: ${transfer.transfer_number}`}
                subtitle={`Dibuat pada ${new Date(transfer.created_at).toLocaleString('id-ID')}`}
                icon="local_shipping"
                action={<StatusBadge status={transfer.status} />}
            />

            {/* Workflow Action Buttons */}
            <div className="p-4 mb-6 rounded-2xl bg-surface border border-outline-variant/60 shadow-2xs flex items-center justify-between flex-wrap gap-4">
                <div className="text-xs text-on-surface-variant">
                    Alur Transfer: <span className="font-bold text-on-surface">Draft → Approved → Shipped → Received</span>
                </div>

                <div className="flex items-center gap-2.5">
                    {transfer.status === 'draft' && (
                        <>
                            <button
                                onClick={handleApprove}
                                className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-sm hover:bg-emerald-700 cursor-pointer"
                            >
                                Setujui Transfer (Approve)
                            </button>
                            <button
                                onClick={handleCancel}
                                className="px-4 py-2 rounded-xl bg-rose-500/10 text-rose-500 font-bold text-xs hover:bg-rose-500/20 cursor-pointer"
                            >
                                Batalkan
                            </button>
                        </>
                    )}

                    {transfer.status === 'approved' && (
                        <button
                            onClick={handleShip}
                            className="px-4 py-2 rounded-xl bg-sky-600 text-white font-bold text-xs shadow-sm hover:bg-sky-700 cursor-pointer"
                        >
                            Tandai Dikirim (Ship & Potong Stok Asal)
                        </button>
                    )}

                    {transfer.status === 'shipped' && (
                        <button
                            onClick={handleReceive}
                            className="px-4 py-2 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-sm hover:bg-primary/90 cursor-pointer"
                        >
                            Konfirmasi Terima Barang (Receive & Tambah Stok)
                        </button>
                    )}
                </div>
            </div>

            {/* Locations Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="p-5 rounded-2xl bg-surface border border-outline-variant/60">
                    <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                        Lokasi Pengirim (Asal)
                    </p>
                    <p className="text-lg font-bold text-on-surface mt-1">
                        {transfer.source_type === 'central' ? 'Gudang Pusat' : transfer.source_branch?.name}
                    </p>
                </div>

                <div className="p-5 rounded-2xl bg-surface border border-outline-variant/60">
                    <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                        Lokasi Penerima (Tujuan)
                    </p>
                    <p className="text-lg font-bold text-on-surface mt-1">
                        {transfer.destination_type === 'central' ? 'Gudang Pusat' : transfer.destination_branch?.name}
                    </p>
                </div>
            </div>

            {transfer.notes && (
                <div className="p-4 mb-6 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-300">
                    <span className="font-bold">Catatan: </span> {transfer.notes}
                </div>
            )}

            {/* Approval & Workflow History Timeline */}
            <div className="p-6 mb-8 rounded-2xl bg-surface border border-outline-variant/60 shadow-2xs">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">history</span>
                            Riwayat Persetujuan & Alur Kerja (Approval History)
                        </h3>
                        <p className="text-xs text-on-surface-variant mt-0.5">
                            Jejak audit persetujuan transfer stok dari pembuatan draft hingga penerimaan barang
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Step 1: Draft Created */}
                    <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 relative">
                        <div className="flex items-center justify-between mb-2">
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                                <span className="material-symbols-outlined text-[18px]">edit_document</span>
                            </span>
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 uppercase">
                                Selesai
                            </span>
                        </div>
                        <h4 className="text-sm font-bold text-on-surface">1. Pengajuan Draft</h4>
                        <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                            Dibuat oleh <span className="font-semibold text-on-surface">{transfer.creator?.name || 'Admin'}</span>
                        </p>
                        <p className="text-[11px] text-on-surface-variant/80 mt-2 flex items-center gap-1 font-medium">
                            <span className="material-symbols-outlined text-[14px]">schedule</span>
                            {new Date(transfer.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                        </p>
                    </div>

                    {/* Step 2: Approval Status */}
                    <div className={`p-4 rounded-xl border relative ${
                        transfer.status === 'draft'
                            ? 'bg-amber-500/5 border-amber-500/20'
                            : transfer.status === 'cancelled'
                            ? 'bg-rose-500/5 border-rose-500/20'
                            : 'bg-emerald-500/5 border-emerald-500/20'
                    }`}>
                        <div className="flex items-center justify-between mb-2">
                            <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-xs ${
                                transfer.status === 'draft'
                                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                    : transfer.status === 'cancelled'
                                    ? 'bg-rose-500/10 text-rose-600'
                                    : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            }`}>
                                <span className="material-symbols-outlined text-[18px]">
                                    {transfer.status === 'cancelled' ? 'cancel' : 'verified_user'}
                                </span>
                            </span>
                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded uppercase ${
                                transfer.status === 'draft'
                                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                    : transfer.status === 'cancelled'
                                    ? 'bg-rose-500/10 text-rose-600'
                                    : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            }`}>
                                {transfer.status === 'draft' ? 'Pending' : transfer.status === 'cancelled' ? 'Dibatalkan' : 'Approved'}
                            </span>
                        </div>
                        <h4 className="text-sm font-bold text-on-surface">2. Persetujuan (Approval)</h4>
                        <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                            {['approved', 'shipped', 'received'].includes(transfer.status)
                                ? <>Disetujui oleh <span className="font-semibold text-on-surface">{transfer.approver?.name || 'Manager / Admin'}</span></>
                                : transfer.status === 'cancelled'
                                ? 'Transfer ini telah dibatalkan'
                                : 'Menunggu tinjauan & persetujuan Manager'}
                        </p>
                        <p className="text-[11px] text-on-surface-variant/80 mt-2 flex items-center gap-1 font-medium">
                            <span className="material-symbols-outlined text-[14px]">schedule</span>
                            {['approved', 'shipped', 'received', 'cancelled'].includes(transfer.status)
                                ? new Date(transfer.updated_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
                                : 'Belum disetujui'}
                        </p>
                    </div>

                    {/* Step 3: Shipping Status */}
                    <div className={`p-4 rounded-xl border relative ${
                        transfer.shipped_at
                            ? 'bg-emerald-500/5 border-emerald-500/20'
                            : 'bg-surface-variant/30 border-outline-variant/50'
                    }`}>
                        <div className="flex items-center justify-between mb-2">
                            <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-xs ${
                                transfer.shipped_at
                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                    : 'bg-surface-variant text-on-surface-variant'
                            }`}>
                                <span className="material-symbols-outlined text-[18px]">local_shipping</span>
                            </span>
                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded uppercase ${
                                transfer.shipped_at
                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                    : 'bg-surface-variant text-on-surface-variant'
                            }`}>
                                {transfer.shipped_at ? 'Dikirim' : 'Menunggu'}
                            </span>
                        </div>
                        <h4 className="text-sm font-bold text-on-surface">3. Pengiriman Barang</h4>
                        <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                            {transfer.shipped_at
                                ? 'Stok asal telah dikurangi & dikirim'
                                : 'Menunggu pengiriman dari lokasi asal'}
                        </p>
                        <p className="text-[11px] text-on-surface-variant/80 mt-2 flex items-center gap-1 font-medium">
                            <span className="material-symbols-outlined text-[14px]">schedule</span>
                            {transfer.shipped_at
                                ? new Date(transfer.shipped_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
                                : '-'}
                        </p>
                    </div>

                    {/* Step 4: Received Status */}
                    <div className={`p-4 rounded-xl border relative ${
                        transfer.received_at
                            ? 'bg-emerald-500/5 border-emerald-500/20'
                            : 'bg-surface-variant/30 border-outline-variant/50'
                    }`}>
                        <div className="flex items-center justify-between mb-2">
                            <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-xs ${
                                transfer.received_at
                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                    : 'bg-surface-variant text-on-surface-variant'
                            }`}>
                                <span className="material-symbols-outlined text-[18px]">task_alt</span>
                            </span>
                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded uppercase ${
                                transfer.received_at
                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                    : 'bg-surface-variant text-on-surface-variant'
                            }`}>
                                {transfer.received_at ? 'Diterima' : 'Menunggu'}
                            </span>
                        </div>
                        <h4 className="text-sm font-bold text-on-surface">4. Barang Diterima</h4>
                        <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                            {transfer.received_at
                                ? 'Diterima di lokasi tujuan & stok masuk'
                                : 'Menunggu konfirmasi penerimaan barang'}
                        </p>
                        <p className="text-[11px] text-on-surface-variant/80 mt-2 flex items-center gap-1 font-medium">
                            <span className="material-symbols-outlined text-[14px]">schedule</span>
                            {transfer.received_at
                                ? new Date(transfer.received_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
                                : '-'}
                        </p>
                    </div>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={transfer.items || []}
                emptyMessage="Daftar item tidak ditemukan."
            />
        </AdminLayout>
    );
}
