import React, { useState } from 'react';
import { Head, router, useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import PageHeader from '@/Components/Admin/PageHeader';
import DataTable from '@/Components/Admin/DataTable';
import FormModal from '@/Components/Admin/FormModal';
import SearchFilter from '@/Components/Admin/SearchFilter';

interface ServiceCategory {
    id: number;
    code: string;
    name: string;
    description: string | null;
    services_count?: number;
}

interface ServiceCategoriesPageProps {
    categories: {
        data: ServiceCategory[];
        links: any[];
    };
    filters: {
        search?: string;
    };
}

export default function ServiceCategoriesIndex({ categories, filters }: ServiceCategoriesPageProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState<ServiceCategory | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        code: '',
        name: '',
        description: '',
    });

    const handleSearch = (val: string) => {
        setSearch(val);
        router.get(
            route('service-categories.index'),
            { search: val },
            { preserveState: true, replace: true }
        );
    };

    const openCreateModal = () => {
        setEditingItem(null);
        reset();
        setShowModal(true);
    };

    const openEditModal = (item: ServiceCategory) => {
        setEditingItem(item);
        setData({
            code: item.code,
            name: item.name,
            description: item.description || '',
        });
        setShowModal(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingItem) {
            put(route('service-categories.update', editingItem.id), {
                onSuccess: () => setShowModal(false),
            });
        } else {
            post(route('service-categories.store'), {
                onSuccess: () => setShowModal(false),
            });
        }
    };

    const handleDelete = (item: ServiceCategory) => {
        if ((item.services_count || 0) > 0) {
            alert(`Kategori "${item.name}" tidak dapat dihapus karena masih terhubung dengan ${item.services_count} layanan.`);
            return;
        }
        if (confirm(`Apakah Anda yakin ingin menghapus kategori layanan "${item.name}"?`)) {
            router.delete(route('service-categories.destroy', item.id));
        }
    };

    const columns = [
        {
            header: 'Kode Kategori',
            key: 'code',
            render: (item: ServiceCategory) => (
                <span className="font-mono font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-md text-xs uppercase">
                    {item.code}
                </span>
            ),
        },
        {
            header: 'Nama Kategori Layanan',
            key: 'name',
            render: (item: ServiceCategory) => (
                <div>
                    <p className="font-bold text-on-surface">{item.name}</p>
                </div>
            ),
        },
        {
            header: 'Deskripsi',
            key: 'description',
            render: (item: ServiceCategory) => (
                <span className="text-sm text-on-surface-variant line-clamp-1">
                    {item.description || '—'}
                </span>
            ),
        },
        {
            header: 'Jumlah Layanan',
            key: 'services_count',
            render: (item: ServiceCategory) => (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-bold">
                    <span className="material-symbols-outlined text-[16px]">medical_services</span>
                    {item.services_count ?? 0} Layanan
                </span>
            ),
        },
        {
            header: 'Aksi',
            key: 'id',
            render: (item: ServiceCategory) => (
                <div className="flex items-center gap-1.5">
                    <button
                        onClick={() => openEditModal(item)}
                        title="Edit Kategori"
                        className="p-1.5 rounded-lg text-on-surface-variant hover:bg-tertiary/60 hover:text-primary transition-colors cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button
                        onClick={() => handleDelete(item)}
                        title="Hapus Kategori"
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
            <Head title="Master Kategori Layanan - Harmoni by Phoeinx Sehat" />

            <PageHeader
                title="Master Kategori Layanan"
                subtitle="Kelola kelompok dan klasifikasi layanan optikal (Pemeriksaan Mata, Servis Lensa, Fitting, dll.)"
                icon="category"
                action={
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('services.index')}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-outline-variant text-on-surface font-semibold text-sm hover:bg-tertiary/40 transition-all"
                        >
                            <span className="material-symbols-outlined text-[18px]">medical_services</span>
                            <span>Daftar Layanan</span>
                        </Link>
                        <button
                            onClick={openCreateModal}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-sm shadow-md shadow-primary/20 hover:bg-primary/90 transition-all cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-[20px]">add</span>
                            <span>Tambah Kategori</span>
                        </button>
                    </div>
                }
            />

            <SearchFilter
                search={search}
                onSearchChange={handleSearch}
                placeholder="Cari kode kategori, nama, atau deskripsi..."
            />

            <DataTable
                columns={columns}
                data={categories.data}
                links={categories.links}
                emptyMessage="Belum ada data kategori layanan optik."
            />

            <FormModal
                show={showModal}
                onClose={() => setShowModal(false)}
                title={editingItem ? 'Edit Kategori Layanan' : 'Tambah Kategori Layanan Baru'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                                Kode Kategori <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.code}
                                onChange={(e) => setData('code', e.target.value.toUpperCase())}
                                placeholder="Contoh: EXAM"
                                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-variant/50 border border-outline-variant text-sm focus:outline-none focus:border-primary font-mono uppercase"
                                required
                            />
                            {errors.code && <p className="text-xs text-rose-500 mt-1">{errors.code}</p>}
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                                Nama Kategori <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Contoh: Pemeriksaan Mata & Refraksi"
                                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-variant/50 border border-outline-variant text-sm focus:outline-none focus:border-primary"
                                required
                            />
                            {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                            Deskripsi Kategori (Opsional)
                        </label>
                        <textarea
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            rows={3}
                            placeholder="Penjelasan ringkas klasifikasi layanan ini..."
                            className="w-full px-3.5 py-2.5 rounded-xl bg-surface-variant/50 border border-outline-variant text-sm focus:outline-none focus:border-primary"
                        />
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
                            {processing ? 'Menyimpan...' : editingItem ? 'Simpan Perubahan' : 'Tambah Kategori'}
                        </button>
                    </div>
                </form>
            </FormModal>
        </AdminLayout>
    );
}
