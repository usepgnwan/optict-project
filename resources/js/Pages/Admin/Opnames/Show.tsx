import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import PageHeader from '@/Components/Admin/PageHeader';
import DataTable from '@/Components/Admin/DataTable';
import StatusBadge from '@/Components/Admin/StatusBadge';

interface OpnamesShowProps {
    opname: any;
}

export default function OpnamesShow({ opname }: OpnamesShowProps) {
    const [counts, setCounts] = useState<Record<number, number>>(() => {
        const init: Record<number, number> = {};
        opname.items?.forEach((item: any) => {
            init[item.id] = item.physical_qty ?? item.system_qty;
        });
        return init;
    });

    const handleStart = () => {
        if (confirm('Mulai penghitungan fisik? Status akan berubah ke Counting.')) {
            router.post(route('stock-opnames.start', opname.id));
        }
    };

    const handleSaveCounts = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(route('stock-opnames.counts', opname.id), { counts });
    };

    const handleApprove = () => {
        if (confirm('Setujui Stock Opname ini dan terapkan penyesuaian otomatis untuk selisih stok?')) {
            router.post(route('stock-opnames.approve', opname.id));
        }
    };

    const columns = [
        {
            header: 'Produk & SKU',
            key: 'product',
            render: (item: any) => (
                <div>
                    <p className="font-bold text-on-surface">{item.product?.name}</p>
                    <p className="text-xs text-on-surface-variant mt-0.5">SKU: {item.product?.sku}</p>
                </div>
            ),
        },
        {
            header: 'Stok Sistem',
            key: 'system_qty',
            render: (item: any) => (
                <span className="font-bold text-on-surface">{item.system_qty} Unit</span>
            ),
        },
        {
            header: 'Stok Fisik (Hasil Hitung)',
            key: 'physical_qty',
            render: (item: any) => (
                opname.status === 'counting' || opname.status === 'draft' ? (
                    <input
                        type="number"
                        min="0"
                        value={counts[item.id] ?? item.system_qty}
                        onChange={(e) => setCounts({ ...counts, [item.id]: e.target.value === '' ? '' as any : Number(e.target.value) })}
                        onFocus={(e) => e.target.select()}
                        className="w-24 px-3 py-1.5 rounded-xl bg-surface border border-outline-variant text-sm font-bold text-center focus:border-primary"
                    />
                ) : (
                    <span className="font-extrabold text-primary">{item.physical_qty} Unit</span>
                )
            ),
        },
        {
            header: 'Selisih (Discrepancy)',
            key: 'difference',
            render: (item: any) => {
                const phys = counts[item.id] ?? item.system_qty;
                const diff = phys - item.system_qty;
                return (
                    <span className={`font-extrabold ${diff < 0 ? 'text-rose-500' : diff > 0 ? 'text-emerald-500' : 'text-on-surface-variant'}`}>
                        {diff > 0 ? `+${diff}` : diff} Unit
                    </span>
                );
            },
        },
    ];

    return (
        <AdminLayout>
            <Head title={`Stock Opname - ${opname.opname_number}`} />

            <div className="mb-4">
                <Link
                    href={route('stock-opnames.index')}
                    className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                >
                    <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                    Kembali ke Daftar Opname
                </Link>
            </div>

            <PageHeader
                title={`Sesi Opname: ${opname.opname_number}`}
                subtitle={`Lokasi: ${opname.location_type === 'central' ? 'Gudang Pusat' : opname.branch?.name}`}
                icon="fact_check"
                action={<StatusBadge status={opname.status} />}
            />

            {/* Workflow Banner */}
            <div className="p-4 mb-6 rounded-2xl bg-surface border border-outline-variant/60 shadow-2xs flex items-center justify-between flex-wrap gap-4">
                <div className="text-xs text-on-surface-variant">
                    Alur Opname: <span className="font-bold text-on-surface">Draft → Counting → Approved (Penyesuaian Otomatis)</span>
                </div>

                <div className="flex items-center gap-2.5">
                    {opname.status === 'draft' && (
                        <button
                            onClick={handleStart}
                            className="px-4 py-2 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-sm hover:bg-primary/90 cursor-pointer"
                        >
                            Mulai Penghitungan Fisik (Counting)
                        </button>
                    )}

                    {(opname.status === 'draft' || opname.status === 'counting') && (
                        <button
                            onClick={handleSaveCounts}
                            className="px-4 py-2 rounded-xl bg-sky-600 text-white font-bold text-xs shadow-sm hover:bg-sky-700 cursor-pointer"
                        >
                            Simpan Hasil Hitung
                        </button>
                    )}

                    {opname.status === 'counting' && (
                        <button
                            onClick={handleApprove}
                            className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-sm hover:bg-emerald-700 cursor-pointer"
                        >
                            Setujui & Terapkan Penyesuaian Otomatis (Approve)
                        </button>
                    )}
                </div>
            </div>

            <form onSubmit={handleSaveCounts}>
                <DataTable
                    columns={columns}
                    data={opname.items || []}
                    emptyMessage="Tidak ada item dalam sesi opname ini."
                />
            </form>
        </AdminLayout>
    );
}
