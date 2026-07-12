import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import PageHeader from '@/Components/Admin/PageHeader';
import SelectSearch from '@/Components/Admin/SelectSearch';
import { Branch } from '@/types';

interface OpnamesCreateProps {
    branches: Branch[];
}

export default function OpnamesCreate({ branches }: OpnamesCreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        location_type: 'branch' as 'central' | 'branch',
        branch_id: branches[0]?.id || '',
        notes: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('stock-opnames.store'));
    };

    return (
        <AdminLayout>
            <Head title="Buat Sesi Opname - Optik Calm" />

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
                title="Mulai Sesi Stock Opname Baru"
                subtitle="Sistem akan otomatis merekam stok saat ini sebagai snapshot untuk dicocokkan dengan hitungan fisik"
                icon="fact_check"
            />

            <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
                <div className="p-6 rounded-2xl bg-surface border border-outline-variant/60 shadow-2xs space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                            Lokasi Opname <span className="text-rose-500">*</span>
                        </label>
                        <SelectSearch
                            value={data.location_type}
                            onChange={(val) => setData('location_type', val as any)}
                            placeholder="Pilih Lokasi"
                        >
                            <option value="branch">Cabang Optik</option>
                            <option value="central">Gudang Pusat (Central Warehouse)</option>
                        </SelectSearch>
                    </div>

                    {data.location_type === 'branch' && (
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                                Pilih Cabang <span className="text-rose-500">*</span>
                            </label>
                            <SelectSearch
                                value={data.branch_id}
                                onChange={(val) => setData('branch_id', Number(val))}
                                placeholder="Pilih Cabang..."
                            >
                                {branches.map((b) => (
                                    <option key={b.id} value={b.id}>{b.name}</option>
                                ))}
                            </SelectSearch>
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                            Catatan Sesi Opname
                        </label>
                        <textarea
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            rows={3}
                            placeholder="Contoh: Opname rutin akhir bulan Juli..."
                            className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-outline-variant text-sm"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3">
                    <Link
                        href={route('stock-opnames.index')}
                        className="px-5 py-2.5 rounded-xl border border-outline-variant text-sm font-semibold hover:bg-tertiary/40"
                    >
                        Batal
                    </Link>
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-sm shadow-md shadow-primary/20 hover:bg-primary/90 disabled:opacity-50 cursor-pointer"
                    >
                        {processing ? 'Membuat...' : 'Buat Snapshot & Mulai Sesi'}
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}
