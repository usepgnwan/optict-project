import React, { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import PageHeader from '@/Components/Admin/PageHeader';
import DataTable from '@/Components/Admin/DataTable';
import StatusBadge from '@/Components/Admin/StatusBadge';
import FormModal from '@/Components/Admin/FormModal';
import SearchFilter from '@/Components/Admin/SearchFilter';
import SelectSearch from '@/Components/Admin/SelectSearch';
import RupiahInput from '@/Components/Admin/RupiahInput';
import { Product } from '@/types';

interface ProductsPageProps {
    products: {
        data: Product[];
        links: any[];
    };
    filters: {
        search?: string;
        category?: string;
    };
    categories: Record<string, string>;
}

export default function ProductsIndex({ products, filters, categories }: ProductsPageProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || '');
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        sku: '',
        barcode: '',
        name: '',
        brand: '',
        category: 'frame',
        frame_type: 'full_frame',
        frame_color: '',
        lens_type: 'single_vision',
        selling_price: 0,
        cost_price: 0,
        description: '',
        image: null as File | null,
        is_active: true,
    });

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleSearch = (val: string) => {
        setSearch(val);
        router.get(
            route('products.index'),
            { search: val, category: selectedCategory },
            { preserveState: true, replace: true }
        );
    };

    const handleCategoryChange = (cat: string) => {
        setSelectedCategory(cat);
        router.get(
            route('products.index'),
            { search, category: cat },
            { preserveState: true, replace: true }
        );
    };

    const openCreateModal = () => {
        setEditingProduct(null);
        setPreviewUrl(null);
        reset();
        setShowModal(true);
    };

    const openEditModal = (product: Product) => {
        setEditingProduct(product);
        setPreviewUrl((product as any).image_url || null);
        setData({
            sku: product.sku,
            barcode: product.barcode,
            name: product.name,
            brand: product.brand,
            category: product.category,
            frame_type: product.frame_type || 'full_frame',
            frame_color: product.frame_color || '',
            lens_type: product.lens_type || 'single_vision',
            selling_price: product.selling_price,
            cost_price: product.cost_price,
            description: product.description || '',
            image: null,
            is_active: product.is_active,
        });
        setShowModal(true);
    };

    const compressImageClientSide = (file: File, maxWidth = 1200, quality = 0.82): Promise<File> => {
        return new Promise((resolve) => {
            if (!file.type.startsWith('image/')) {
                resolve(file);
                return;
            }

            const img = new Image();
            const objectUrl = URL.createObjectURL(file);

            img.onload = () => {
                URL.revokeObjectURL(objectUrl);

                let width = img.width;
                let height = img.height;

                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    resolve(file);
                    return;
                }

                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            resolve(file);
                            return;
                        }
                        const filename = file.name.replace(/\.[^/.]+$/, '.webp');
                        const newFile = new File([blob], filename, {
                            type: 'image/webp',
                            lastModified: Date.now(),
                        });
                        resolve(newFile);
                    },
                    'image/webp',
                    quality
                );
            };

            img.onerror = () => {
                URL.revokeObjectURL(objectUrl);
                resolve(file);
            };

            img.src = objectUrl;
        });
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (!file) {
            setData('image', null);
            return;
        }

        // Compress photo client-side so file size drops to ~150KB and never hits PHP 2M limit
        const compressedFile = await compressImageClientSide(file);
        setData('image', compressedFile);
        setPreviewUrl(URL.createObjectURL(compressedFile));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingProduct) {
            router.post(
                route('products.update', editingProduct.id),
                {
                    _method: 'PUT',
                    ...data,
                },
                {
                    forceFormData: true,
                    onSuccess: () => setShowModal(false),
                }
            );
        } else {
            post(route('products.store'), {
                forceFormData: true,
                onSuccess: () => setShowModal(false),
            });
        }
    };

    const handleDelete = (product: Product) => {
        if (confirm(`Apakah Anda yakin ingin menghapus produk "${product.name}"?`)) {
            router.delete(route('products.destroy', product.id));
        }
    };

    const columns = [
        {
            header: 'Produk & SKU',
            key: 'name',
            render: (item: Product) => (
                <div className="flex items-center gap-3">
                    {(item as any).image_url ? (
                        <img
                            src={(item as any).image_url}
                            alt={item.name}
                            className="w-11 h-11 rounded-xl object-cover border border-outline-variant/80 shrink-0 shadow-2xs"
                        />
                    ) : (
                        <div className="w-11 h-11 rounded-xl bg-surface-variant/70 border border-outline-variant/80 flex items-center justify-center shrink-0 text-on-surface-variant">
                            <span className="material-symbols-outlined text-[22px]">eyeglasses</span>
                        </div>
                    )}
                    <div>
                        <Link
                            href={route('products.show', item.id)}
                            className="font-bold text-primary hover:underline block"
                        >
                            {item.name}
                        </Link>
                        <p className="text-xs text-on-surface-variant mt-0.5">
                            SKU: <span className="font-semibold">{item.sku}</span> • Barcode: {item.barcode}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            header: 'Brand & Kategori',
            key: 'brand',
            render: (item: Product) => (
                <div>
                    <p className="font-semibold text-on-surface">{item.brand}</p>
                    <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-primary/10 text-primary">
                        {item.category}
                    </span>
                </div>
            ),
        },
        {
            header: 'Spesifikasi',
            key: 'spec',
            render: (item: Product) => (
                <div className="text-xs text-on-surface-variant">
                    {item.category === 'frame' && (
                        <span>{item.frame_type} • Warna: {item.frame_color || '—'}</span>
                    )}
                    {item.category === 'lens' && (
                        <span>Tipe Lensa: {item.lens_type}</span>
                    )}
                    {(item.category === 'accessory' || item.category === 'package') && (
                        <span className="italic">Umum</span>
                    )}
                </div>
            ),
        },
        {
            header: 'Harga Jual / Modal',
            key: 'price',
            render: (item: Product) => (
                <div>
                    <p className="font-bold text-on-surface">
                        Rp {Number(item.selling_price).toLocaleString('id-ID')}
                    </p>
                    <p className="text-xs text-on-surface-variant">
                        Modal: Rp {Number(item.cost_price).toLocaleString('id-ID')}
                    </p>
                </div>
            ),
        },
        {
            header: 'Stok Pusat',
            key: 'stock',
            render: (item: Product) => (
                <span className="font-extrabold text-sm text-primary">
                    {item.central_inventory?.quantity || 0} Unit
                </span>
            ),
        },
        {
            header: 'Status',
            key: 'is_active',
            render: (item: Product) => <StatusBadge status={item.is_active} />,
        },
        {
            header: 'Aksi',
            key: 'id',
            render: (item: Product) => (
                <div className="flex items-center gap-1.5">
                    <Link
                        href={route('products.show', item.id)}
                        title="Pengaturan & Detail Produk"
                        className="p-1.5 rounded-lg text-on-surface-variant hover:bg-primary/10 hover:text-primary transition-colors inline-flex items-center justify-center cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-[18px]">settings</span>
                    </Link>
                    <button
                        onClick={() => openEditModal(item)}
                        title="Edit Produk"
                        className="p-1.5 rounded-lg text-on-surface-variant hover:bg-tertiary/60 hover:text-primary transition-colors cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button
                        onClick={() => handleDelete(item)}
                        title="Hapus Produk"
                        className="p-1.5 rounded-lg text-on-surface-variant hover:bg-rose-500/10 hover:text-rose-500 transition-colors cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                </div>
            ),
        },
    ];

    return (
        <AdminLayout>
            <Head title="Katalog Produk - Harmoni by Phoeinx Sehat" />

            <PageHeader
                title="Katalog Produk Kacamata & Lensa"
                subtitle="Daftar inventory barang, frame, lensa, dan paket penjualan optik"
                icon="eyeglasses"
                action={
                    <button
                        onClick={openCreateModal}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-sm shadow-md shadow-primary/20 hover:bg-primary/90 transition-all cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-[20px]">add</span>
                        <span>Tambah Produk</span>
                    </button>
                }
            />

            <SearchFilter
                search={search}
                onSearchChange={handleSearch}
                placeholder="Cari nama produk, SKU, barcode, atau brand..."
            >
                <div className="w-52">
                    <SelectSearch
                        value={selectedCategory}
                        onChange={(val) => handleCategoryChange(val)}
                        placeholder="Semua Kategori"
                    >
                        <option value="">Semua Kategori</option>
                        {Object.entries(categories).map(([k, v]) => (
                            <option key={k} value={k}>
                                {v}
                            </option>
                        ))}
                    </SelectSearch>
                </div>
            </SearchFilter>

            <DataTable
                columns={columns}
                data={products.data}
                links={products.links}
                emptyMessage="Belum ada produk kacamata/lensa."
            />

            <FormModal
                show={showModal}
                onClose={() => setShowModal(false)}
                title={editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}
                maxWidth="xl"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                                SKU Produk <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.sku}
                                onChange={(e) => setData('sku', e.target.value)}
                                placeholder="Contoh: FRM-001"
                                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-variant/50 border border-outline-variant text-sm focus:outline-none focus:border-primary"
                                required
                            />
                            {errors.sku && <p className="text-xs text-rose-500 mt-1">{errors.sku}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                                Barcode / EAN <span className="text-on-surface-variant/70 font-normal lowercase">(opsional)</span>
                            </label>
                            <input
                                type="text"
                                value={data.barcode}
                                onChange={(e) => setData('barcode', e.target.value)}
                                placeholder="Kosongkan jika tidak ada / auto"
                                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-variant/50 border border-outline-variant text-sm focus:outline-none focus:border-primary"
                            />
                            {errors.barcode && <p className="text-xs text-rose-500 mt-1">{errors.barcode}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                                Nama Produk <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Contoh: Ray-Ban Aviator Classic"
                                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-variant/50 border border-outline-variant text-sm focus:outline-none focus:border-primary"
                                required
                            />
                            {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                                Brand / Merek <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.brand}
                                onChange={(e) => setData('brand', e.target.value)}
                                placeholder="Contoh: Ray-Ban, Essilor"
                                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-variant/50 border border-outline-variant text-sm focus:outline-none focus:border-primary"
                                required
                            />
                            {errors.brand && <p className="text-xs text-rose-500 mt-1">{errors.brand}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                                Kategori <span className="text-rose-500">*</span>
                            </label>
                            <SelectSearch
                                value={data.category}
                                onChange={(val) => setData('category', val as any)}
                                placeholder="Pilih Kategori"
                            >
                                {Object.entries(categories).map(([k, v]) => (
                                    <option key={k} value={k}>{v}</option>
                                ))}
                            </SelectSearch>
                        </div>

                        {data.category === 'frame' && (
                            <>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                                        Tipe Frame
                                    </label>
                                    <SelectSearch
                                        value={data.frame_type}
                                        onChange={(val) => setData('frame_type', val as any)}
                                        placeholder="Pilih Tipe Frame"
                                    >
                                        <option value="full_frame">Full Frame</option>
                                        <option value="half_frame">Half Frame</option>
                                        <option value="rimless">Rimless</option>
                                    </SelectSearch>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                                        Warna Frame
                                    </label>
                                    <input
                                        type="text"
                                        value={data.frame_color}
                                        onChange={(e) => setData('frame_color', e.target.value)}
                                        placeholder="Contoh: Gold, Matte Black"
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-surface-variant/50 border border-outline-variant text-sm focus:outline-none focus:border-primary"
                                    />
                                </div>
                            </>
                        )}

                        {data.category === 'lens' && (
                            <div className="sm:col-span-2">
                                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                                    Tipe Lensa
                                </label>
                                <SelectSearch
                                    value={data.lens_type}
                                    onChange={(val) => setData('lens_type', val as any)}
                                    placeholder="Pilih Tipe Lensa"
                                >
                                    <option value="single_vision">Single Vision</option>
                                    <option value="bifocal">Bifocal</option>
                                    <option value="progressive">Progressive</option>
                                    <option value="photochromic">Photochromic</option>
                                </SelectSearch>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                                Harga Jual (IDR) <span className="text-rose-500">*</span>
                            </label>
                            <RupiahInput
                                value={data.selling_price}
                                onChange={(val) => setData('selling_price', val)}
                                placeholder="0"
                                required
                            />
                            {errors.selling_price && <p className="text-xs text-rose-500 mt-1">{errors.selling_price}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                                Harga Modal (IDR) <span className="text-rose-500">*</span>
                            </label>
                            <RupiahInput
                                value={data.cost_price}
                                onChange={(val) => setData('cost_price', val)}
                                placeholder="0"
                                required
                            />
                            {errors.cost_price && <p className="text-xs text-rose-500 mt-1">{errors.cost_price}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                            Foto Produk (Opsional, Max 3 MB — Otomatis dikompresi ke WebP)
                        </label>
                        <div className="flex items-center gap-4">
                            {previewUrl && (
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="w-16 h-16 rounded-xl object-cover border border-outline-variant shadow-sm shrink-0"
                                />
                            )}
                            <div className="flex-1">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="w-full text-xs text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                                />
                                <p className="text-[11px] text-on-surface-variant mt-1">
                                    Format: JPG, PNG, atau WEBP. Maksimal ukuran file 3 MB.
                                </p>
                                {errors.image && <p className="text-xs text-rose-500 mt-1">{errors.image}</p>}
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                            Deskripsi Produk
                        </label>
                        <textarea
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            rows={3}
                            placeholder="Deskripsi spesifikasi produk..."
                            className="w-full px-3.5 py-2.5 rounded-xl bg-surface-variant/50 border border-outline-variant text-sm focus:outline-none focus:border-primary"
                        />
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                        <input
                            type="checkbox"
                            id="product_is_active"
                            checked={data.is_active}
                            onChange={(e) => setData('is_active', e.target.checked)}
                            className="w-4 h-4 rounded text-primary border-outline-variant"
                        />
                        <label htmlFor="product_is_active" className="text-sm font-semibold text-on-surface cursor-pointer">
                            Produk Aktif Dijual
                        </label>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant/60">
                        <button
                            type="button"
                            onClick={() => setShowModal(false)}
                            className="px-4 py-2 rounded-xl border border-outline-variant text-sm font-semibold hover:bg-tertiary/40 transition-colors cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-5 py-2 rounded-xl bg-primary text-on-primary text-sm font-bold shadow-md shadow-primary/20 hover:bg-primary/90 disabled:opacity-50 transition-all cursor-pointer"
                        >
                            {processing ? 'Menyimpan...' : editingProduct ? 'Simpan Perubahan' : 'Tambah Produk'}
                        </button>
                    </div>
                </form>
            </FormModal>
        </AdminLayout>
    );
}
