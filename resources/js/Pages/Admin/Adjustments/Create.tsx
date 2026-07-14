import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import PageHeader from '@/Components/Admin/PageHeader';
import SelectSearch from '@/Components/Admin/SelectSearch';
import { Branch, Product } from '@/types';

interface AdjustmentsCreateProps {
    branches: Branch[];
    products: Product[];
    reasons: Record<string, string>;
}

export default function AdjustmentsCreate({ branches, products, reasons }: AdjustmentsCreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        location_type: 'branch' as 'central' | 'branch',
        branch_id: branches[0]?.id || '',
        product_id: products[0]?.id || '',
        reason: 'damaged',
        adjustment_qty: -1,
        notes: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('stock-adjustments.store'));
    };

    return (
        <AdminLayout>
            <Head title="Catat Penyesuaian Stok - Harmoni by Phoeinx Sehat" />

            <div className="mb-4">
                <Link
                    href={route('stock-adjustments.index')}
                    className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                >
                    <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                    Kembali ke Riwayat Penyesuaian
                </Link>
            </div>

            <PageHeader
                title="Catat Penyesuaian Stok Manual"
                subtitle="Gunakan nilai negatif (contoh: -2) untuk pengurangan stok rusak/hilang, atau nilai positif (+5) untuk penambahan"
                icon="tune"
            />

            <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
                <div className="p-6 rounded-2xl bg-surface border border-outline-variant/60 shadow-2xs space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                                Lokasi <span className="text-rose-500">*</span>
                            </label>
                            <SelectSearch
                                value={data.location_type}
                                onChange={(val) => setData('location_type', val as any)}
                                placeholder="Pilih Lokasi"
                            >
                                <option value="branch">Cabang Optik</option>
                                <option value="central">Gudang Pusat</option>
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
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                            Produk yang Disesuaikan <span className="text-rose-500">*</span>
                        </label>
                        <SelectSearch
                            value={data.product_id}
                            onChange={(val) => setData('product_id', Number(val))}
                            placeholder="Cari Produk SKU / Nama..."
                        >
                            {products.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.sku} — {p.name}
                                </option>
                            ))}
                        </SelectSearch>
                        {errors.product_id && <p className="text-xs text-rose-500 mt-1">{errors.product_id}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                                Alasan Penyesuaian <span className="text-rose-500">*</span>
                            </label>
                            <SelectSearch
                                value={data.reason}
                                onChange={(val) => setData('reason', val)}
                                placeholder="Pilih Alasan..."
                            >
                                {Object.entries(reasons).map(([k, v]) => (
                                    <option key={k} value={k}>{v}</option>
                                ))}
                            </SelectSearch>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                                Jumlah Perubahan (+/-) <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="number"
                                value={data.adjustment_qty}
                                onChange={(e) => setData('adjustment_qty', e.target.value === '' ? '' as any : Number(e.target.value))}
                                onFocus={(e) => e.target.select()}
                                placeholder="-1 atau +3"
                                className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-outline-variant text-sm font-bold"
                                required
                            />
                            {errors.adjustment_qty && <p className="text-xs text-rose-500 mt-1">{errors.adjustment_qty}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                            Keterangan / Alasan Lengkap
                        </label>
                        <textarea
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            rows={3}
                            placeholder="Penjelasan detail mengapa stok disesuaikan..."
                            className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-outline-variant text-sm"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3">
                    <Link
                        href={route('stock-adjustments.index')}
                        className="px-5 py-2.5 rounded-xl border border-outline-variant text-sm font-semibold hover:bg-tertiary/40"
                    >
                        Batal
                    </Link>
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-sm shadow-md shadow-primary/20 hover:bg-primary/90 disabled:opacity-50 cursor-pointer"
                    >
                        {processing ? 'Menyimpan...' : 'Simpan Penyesuaian'}
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}
