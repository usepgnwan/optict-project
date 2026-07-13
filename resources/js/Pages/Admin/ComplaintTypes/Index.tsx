import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import PageHeader from '@/Components/Admin/PageHeader';
import DataTable from '@/Components/Admin/DataTable';
import StatusBadge from '@/Components/Admin/StatusBadge';
import FormModal from '@/Components/Admin/FormModal';
import SearchFilter from '@/Components/Admin/SearchFilter';

interface ComplaintType {
    id: number;
    name: string;
    description: string | null;
    is_active: boolean;
    sort_order: number;
}

interface ComplaintTypesPageProps {
    complaintTypes: {
        data: ComplaintType[];
        links: any[];
    };
    filters: {
        search?: string;
    };
}

export default function ComplaintTypesIndex({ complaintTypes, filters }: ComplaintTypesPageProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState<ComplaintType | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        description: '',
        sort_order: 1,
        is_active: true,
    });

    const handleSearch = (val: string) => {
        setSearch(val);
        router.get(
            route('complaint-types.index'),
            { search: val },
            { preserveState: true, replace: true }
        );
    };

    const openCreateModal = () => {
        setEditingItem(null);
        reset();
        setShowModal(true);
    };

    const openEditModal = (item: ComplaintType) => {
        setEditingItem(item);
        setData({
            name: item.name,
            description: item.description || '',
            sort_order: item.sort_order,
            is_active: item.is_active,
        });
        setShowModal(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingItem) {
            put(route('complaint-types.update', editingItem.id), {
                onSuccess: () => setShowModal(false),
            });
        } else {
            post(route('complaint-types.store'), {
                onSuccess: () => setShowModal(false),
            });
        }
    };

    const handleDelete = (item: ComplaintType) => {
        if (confirm(`Apakah Anda yakin ingin menghapus tipe keluhan "${item.name}"?`)) {
            router.delete(route('complaint-types.destroy', item.id));
        }
    };

    const columns = [
        {
            header: 'No. Urut',
            key: 'sort_order',
            render: (item: ComplaintType) => (
                <span className="font-mono font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-md text-xs">
                    #{item.sort_order}
                </span>
            ),
        },
        {
            header: 'Nama Tipe Keluhan / Kebutuhan',
            key: 'name',
            render: (item: ComplaintType) => (
                <div>
                    <p className="font-bold text-on-surface">{item.name}</p>
                    {item.description && (
                        <p className="text-xs text-on-surface-variant mt-0.5 line-clamp-1">
                            {item.description}
                        </p>
                    )}
                </div>
            ),
        },
        {
            header: 'Deskripsi',
            key: 'description',
            render: (item: ComplaintType) => (
                <span className="text-sm text-on-surface-variant">
                    {item.description || '—'}
                </span>
            ),
        },
        {
            header: 'Status',
            key: 'is_active',
            render: (item: ComplaintType) => <StatusBadge status={item.is_active} />,
        },
        {
            header: 'Aksi',
            key: 'id',
            render: (item: ComplaintType) => (
                <div className="flex items-center gap-1.5">
                    <button
                        onClick={() => openEditModal(item)}
                        title="Edit Tipe Keluhan"
                        className="p-1.5 rounded-lg text-on-surface-variant hover:bg-tertiary/60 hover:text-primary transition-colors cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button
                        onClick={() => handleDelete(item)}
                        title="Hapus Tipe Keluhan"
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
            <Head title="Master Tipe Keluhan - Optik Calm" />

            <PageHeader
                title="Master Tipe Keluhan / Kebutuhan"
                subtitle="Daftar opsi keluhan atau jenis konsultasi untuk pilihan formulir booking online"
                icon="clinical_notes"
                action={
                    <button
                        onClick={openCreateModal}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-sm shadow-md shadow-primary/20 hover:bg-primary/90 transition-all cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-[20px]">add</span>
                        <span>Tambah Tipe Keluhan</span>
                    </button>
                }
            />

            <SearchFilter
                search={search}
                onSearchChange={handleSearch}
                placeholder="Cari nama tipe keluhan atau deskripsi..."
            />

            <DataTable
                columns={columns}
                data={complaintTypes.data}
                links={complaintTypes.links}
                emptyMessage="Belum ada data tipe keluhan."
            />

            <FormModal
                show={showModal}
                onClose={() => setShowModal(false)}
                title={editingItem ? 'Edit Tipe Keluhan' : 'Tambah Tipe Keluhan Baru'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                        <div className="sm:col-span-3">
                            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                                Nama Tipe Keluhan <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Contoh: Pandangan Buram Jarak Jauh"
                                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-variant/50 border border-outline-variant text-sm focus:outline-none focus:border-primary"
                                required
                            />
                            {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                                Urutan
                            </label>
                            <input
                                type="number"
                                value={data.sort_order}
                                onChange={(e) => setData('sort_order', Number(e.target.value))}
                                min={0}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-variant/50 border border-outline-variant text-sm focus:outline-none focus:border-primary text-center font-bold"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                            Deskripsi (Opsional)
                        </label>
                        <textarea
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            rows={3}
                            placeholder="Penjelasan singkat mengenai keluhan atau kebutuhan ini..."
                            className="w-full px-3.5 py-2.5 rounded-xl bg-surface-variant/50 border border-outline-variant text-sm focus:outline-none focus:border-primary"
                        />
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                        <input
                            type="checkbox"
                            id="is_active_ct"
                            checked={data.is_active}
                            onChange={(e) => setData('is_active', e.target.checked)}
                            className="w-4 h-4 rounded text-primary border-outline-variant"
                        />
                        <label htmlFor="is_active_ct" className="text-sm font-semibold text-on-surface cursor-pointer">
                            Tampilkan di Formulir Booking Online
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
                            {processing ? 'Menyimpan...' : editingItem ? 'Simpan Perubahan' : 'Tambah Tipe Keluhan'}
                        </button>
                    </div>
                </form>
            </FormModal>
        </AdminLayout>
    );
}
