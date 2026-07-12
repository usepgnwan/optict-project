import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import PageHeader from '@/Components/Admin/PageHeader';
import SelectSearch from '@/Components/Admin/SelectSearch';
import { Branch, Product } from '@/types';

interface TransfersCreateProps {
    branches: Branch[];
    products: Product[];
}

export default function TransfersCreate({ branches, products }: TransfersCreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        source_type: 'central' as 'central' | 'branch',
        source_branch_id: '' as string | number,
        destination_type: 'branch' as 'central' | 'branch',
        destination_branch_id: branches[0]?.id || '',
        notes: '',
        items: [{ product_id: products[0]?.id || '', quantity: 1 }],
    });

    const addItem = () => {
        setData('items', [...data.items, { product_id: products[0]?.id || '', quantity: 1 }]);
    };

    const removeItem = (index: number) => {
        setData('items', data.items.filter((_, i) => i !== index));
    };

    const updateItem = (index: number, field: string, value: any) => {
        const newItems = [...data.items];
        (newItems[index] as any)[field] = value;
        setData('items', newItems);
    };

    const getAvailableStock = (productId: number | string) => {
        if (!productId) return null;
        const product = products.find((p) => p.id === Number(productId));
        if (!product) return null;

        if (data.source_type === 'central') {
            return (product as any).central_inventory?.quantity ?? 0;
        } else if (data.source_type === 'branch' && data.source_branch_id) {
            const inv = (product as any).branch_inventories?.find(
                (i: any) => i.branch_id === Number(data.source_branch_id)
            );
            return inv?.current_stock ?? 0;
        }
        return 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('stock-transfers.store'));
    };

    return (
        <AdminLayout>
            <Head title="Buat Transfer Stok - Optik Calm" />

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
                title="Buat Transfer Stok Baru"
                subtitle="Pilih lokasi asal, lokasi tujuan, serta daftar produk yang akan dikirim"
                icon="local_shipping"
            />

            <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
                <div className="p-6 rounded-2xl bg-surface border border-outline-variant/60 shadow-2xs space-y-4">
                    <h3 className="text-base font-bold text-on-surface">1. Lokasi Pengiriman</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Lokasi Asal */}
                        <div className="space-y-3 p-4 rounded-xl bg-surface-variant/30 border border-outline-variant/40">
                            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                                Lokasi Asal Stok
                            </label>
                            <SelectSearch
                                value={data.source_type}
                                onChange={(val) => setData('source_type', val as any)}
                                placeholder="Pilih Lokasi Asal"
                            >
                                <option value="central">Gudang Pusat (Central Warehouse)</option>
                                <option value="branch">Cabang Optik</option>
                            </SelectSearch>

                            {data.source_type === 'branch' && (
                                <SelectSearch
                                    value={data.source_branch_id}
                                    onChange={(val) => setData('source_branch_id', Number(val))}
                                    placeholder="Pilih Cabang Asal..."
                                >
                                    <option value="">Pilih Cabang Asal</option>
                                    {branches.map((b) => (
                                        <option key={b.id} value={b.id}>{b.name}</option>
                                    ))}
                                </SelectSearch>
                            )}
                        </div>

                        {/* Lokasi Tujuan */}
                        <div className="space-y-3 p-4 rounded-xl bg-surface-variant/30 border border-outline-variant/40">
                            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                                Lokasi Tujuan Penerima
                            </label>
                            <SelectSearch
                                value={data.destination_type}
                                onChange={(val) => setData('destination_type', val as any)}
                                placeholder="Pilih Lokasi Tujuan"
                            >
                                <option value="branch">Cabang Optik</option>
                                <option value="central">Gudang Pusat (Central Warehouse)</option>
                            </SelectSearch>

                            {data.destination_type === 'branch' && (
                                <SelectSearch
                                    value={data.destination_branch_id}
                                    onChange={(val) => setData('destination_branch_id', Number(val))}
                                    placeholder="Pilih Cabang Tujuan..."
                                >
                                    <option value="">Pilih Cabang Tujuan</option>
                                    {branches.map((b) => (
                                        <option key={b.id} value={b.id}>{b.name}</option>
                                    ))}
                                </SelectSearch>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                            Catatan Pengiriman (Opsional)
                        </label>
                        <textarea
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            rows={2}
                            placeholder="Keterangan atau instruksi tambahan..."
                            className="w-full px-3.5 py-2.5 rounded-xl bg-surface-variant/50 border border-outline-variant text-sm"
                        />
                    </div>
                </div>

                <div className="p-6 rounded-2xl bg-surface border border-outline-variant/60 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-base font-bold text-on-surface">2. Daftar Produk yang Ditransfer</h3>
                        <button
                            type="button"
                            onClick={addItem}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 text-primary font-bold text-xs hover:bg-primary/20 transition-colors cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-[16px]">add</span>
                            Tambah Item
                        </button>
                    </div>

                    <div className="space-y-3">
                        {data.items.map((item, index) => {
                            const availStock = getAvailableStock(item.product_id);
                            const isShortfall = availStock !== null && Number(item.quantity) > availStock;
                            const shortfallQty = availStock !== null ? Number(item.quantity) - availStock : 0;

                            return (
                                <div key={index} className="p-4 rounded-xl bg-surface-variant/30 border border-outline-variant/40 space-y-3">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-bold text-on-surface-variant w-6 text-center">
                                            #{index + 1}
                                        </span>
                                        <div className="flex-1">
                                            <SelectSearch
                                                value={item.product_id}
                                                onChange={(val) => updateItem(index, 'product_id', Number(val))}
                                                placeholder="Pilih Produk (Cari SKU/Nama)..."
                                            >
                                                <option value="">Pilih Produk</option>
                                                {products.map((p) => {
                                                    const stockOpt = getAvailableStock(p.id);
                                                    return (
                                                        <option key={p.id} value={p.id}>
                                                            {p.sku} — {p.name} ({p.brand}) [Stok Asal: {stockOpt ?? 0} Unit]
                                                        </option>
                                                    );
                                                })}
                                            </SelectSearch>
                                        </div>

                                        <input
                                            type="number"
                                            min="1"
                                            value={item.quantity}
                                            onChange={(e) => updateItem(index, 'quantity', e.target.value === '' ? '' : Number(e.target.value))}
                                            onFocus={(e) => e.target.select()}
                                            placeholder="Qty"
                                            className="w-24 px-3 py-2 rounded-xl bg-surface border border-outline-variant text-sm text-center font-bold"
                                            required
                                        />

                                        {data.items.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeItem(index)}
                                                className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">delete</span>
                                            </button>
                                        )}
                                    </div>

                                    {availStock !== null && (
                                        <div className="flex items-center justify-between text-xs pt-1 border-t border-outline-variant/40">
                                            <span className="text-on-surface-variant font-medium">
                                                Stok Tersedia di Lokasi Asal: <strong className={availStock <= 0 ? 'text-rose-500' : 'text-emerald-600 dark:text-emerald-400'}>{availStock} Unit</strong>
                                            </span>

                                            {isShortfall && (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400 font-bold">
                                                    <span className="material-symbols-outlined text-[15px]">warning</span>
                                                    <span>Stok Kurang {shortfallQty} Unit!</span>
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {errors.items && <p className="text-xs text-rose-500">{errors.items}</p>}
                </div>

                <div className="flex items-center justify-end gap-3">
                    <Link
                        href={route('stock-transfers.index')}
                        className="px-5 py-2.5 rounded-xl border border-outline-variant text-sm font-semibold hover:bg-tertiary/40"
                    >
                        Batal
                    </Link>
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-sm shadow-md shadow-primary/20 hover:bg-primary/90 disabled:opacity-50 cursor-pointer"
                    >
                        {processing ? 'Menyimpan...' : 'Buat Transfer (Draft)'}
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}
