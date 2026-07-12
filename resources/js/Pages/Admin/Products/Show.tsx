import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import PageHeader from '@/Components/Admin/PageHeader';
import DataTable from '@/Components/Admin/DataTable';
import StatusBadge from '@/Components/Admin/StatusBadge';
import StatsCard from '@/Components/Admin/StatsCard';
import { Product, BranchInventory } from '@/types';

interface ProductShowProps {
    product: Product;
}

export default function ProductShow({ product }: ProductShowProps) {
    const centralStock = product.central_inventory?.quantity || 0;
    const branchStockTotal = product.branch_inventories?.reduce((sum, inv) => sum + inv.current_stock, 0) || 0;
    const totalAllLocations = centralStock + branchStockTotal;

    const columns = [
        {
            header: 'Lokasi / Cabang',
            key: 'branch',
            render: (inv: BranchInventory) => (
                <span className="font-bold text-on-surface">
                    {inv.branch?.name || 'Cabang Tidak Diketahui'}
                </span>
            ),
        },
        {
            header: 'Kota',
            key: 'city',
            render: (inv: BranchInventory) => (
                <span className="text-on-surface-variant font-medium">{inv.branch?.city || '—'}</span>
            ),
        },
        {
            header: 'Stok Saat Ini',
            key: 'current_stock',
            render: (inv: BranchInventory) => (
                <span className={`font-extrabold ${
                    inv.current_stock === 0 ? 'text-rose-500' :
                    inv.current_stock <= inv.minimum_stock ? 'text-amber-500' : 'text-on-surface'
                }`}>
                    {inv.current_stock} Unit
                </span>
            ),
        },
        {
            header: 'Stok Minimum',
            key: 'minimum_stock',
            render: (inv: BranchInventory) => (
                <span className="text-on-surface-variant">{inv.minimum_stock} Unit</span>
            ),
        },
        {
            header: 'Status Stok',
            key: 'status',
            render: (inv: BranchInventory) => {
                if (inv.current_stock === 0) {
                    return <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-500">Kosong</span>;
                }
                if (inv.current_stock <= inv.minimum_stock) {
                    return <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-500">Menipis</span>;
                }
                return <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500">Aman</span>;
            },
        },
        {
            header: 'Aksi',
            key: 'action',
            render: (inv: BranchInventory) => (
                <Link
                    href={route('branch-inventory.index', { branch_id: inv.branch_id, search: product.sku })}
                    title={`Kelola Stok ${inv.branch?.name}`}
                    className="inline-flex items-center justify-center p-2 rounded-xl bg-surface-variant/70 text-on-surface-variant hover:bg-primary/10 hover:text-primary transition-all shadow-2xs cursor-pointer"
                >
                    <span className="material-symbols-outlined text-[19px]">settings</span>
                </Link>
            ),
        },
    ];

    return (
        <AdminLayout>
            <Head title={`Detail Produk - ${product.name}`} />

            <div className="mb-4">
                <Link
                    href={route('products.index')}
                    className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                >
                    <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                    Kembali ke Katalog Produk
                </Link>
            </div>

            <PageHeader
                title={product.name}
                subtitle={`SKU: ${product.sku} • Barcode: ${product.barcode} • Brand: ${product.brand}`}
                icon="eyeglasses"
                action={<StatusBadge status={product.is_active} />}
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <StatsCard
                    title="Total Stok Seluruh Lokasi"
                    value={`${totalAllLocations} Unit`}
                    icon="inventory_2"
                    color="primary"
                />
                <StatsCard
                    title="Stok Gudang Pusat"
                    value={`${centralStock} Unit`}
                    icon="warehouse"
                    color="sky"
                />
                <StatsCard
                    title="Stok Tersebar di Cabang"
                    value={`${branchStockTotal} Unit`}
                    icon="storefront"
                    color="emerald"
                />
            </div>

            <div className="bg-surface rounded-2xl border border-outline-variant/60 p-6 mb-8 shadow-2xs flex flex-col sm:flex-row items-start gap-6">
                {(product as any).image_url && (
                    <img
                        src={(product as any).image_url}
                        alt={product.name}
                        className="w-32 h-32 rounded-2xl object-cover border border-outline-variant shadow-md shrink-0"
                    />
                )}
                <div className="flex-1">
                    <h3 className="text-base font-bold text-on-surface mb-3">Informasi Finansial & Spesifikasi</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                        <div>
                            <p className="text-xs text-on-surface-variant font-medium">Harga Jual</p>
                            <p className="font-extrabold text-primary text-base mt-0.5">
                                Rp {Number(product.selling_price).toLocaleString('id-ID')}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-on-surface-variant font-medium">Harga Modal</p>
                            <p className="font-bold text-on-surface text-base mt-0.5">
                                Rp {Number(product.cost_price).toLocaleString('id-ID')}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-on-surface-variant font-medium">Kategori</p>
                            <p className="font-bold uppercase text-on-surface mt-0.5">{product.category}</p>
                        </div>
                        <div>
                            <p className="text-xs text-on-surface-variant font-medium">Spesifikasi Tambahan</p>
                            <p className="font-semibold text-on-surface mt-0.5">
                                {product.frame_type || product.lens_type || 'Umum'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mb-4">
                <h3 className="text-base font-bold text-on-surface tracking-tight">
                    Sebaran Stok di Tiap Cabang
                </h3>
            </div>

            <DataTable
                columns={columns}
                data={product.branch_inventories || []}
                emptyMessage="Belum ada penyebaran stok di cabang."
            />
        </AdminLayout>
    );
}
