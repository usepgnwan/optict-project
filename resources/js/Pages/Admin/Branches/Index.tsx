import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import PageHeader from '@/Components/Admin/PageHeader';
import DataTable from '@/Components/Admin/DataTable';
import StatusBadge from '@/Components/Admin/StatusBadge';
import FormModal from '@/Components/Admin/FormModal';
import SearchFilter from '@/Components/Admin/SearchFilter';
import { Branch } from '@/types';

interface BranchesPageProps {
    branches: {
        data: Branch[];
        links: any[];
    };
    filters: {
        search?: string;
        is_active?: string;
    };
}

export default function BranchesIndex({ branches, filters }: BranchesPageProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [showModal, setShowModal] = useState(false);
    const [editingBranch, setEditingBranch] = useState<Branch | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        city: '',
        address: '',
        phone: '',
        email: '',
        is_active: true,
    });

    const handleSearch = (val: string) => {
        setSearch(val);
        router.get(
            route('branches.index'),
            { search: val },
            { preserveState: true, replace: true }
        );
    };

    const openCreateModal = () => {
        setEditingBranch(null);
        reset();
        setShowModal(true);
    };

    const openEditModal = (branch: Branch) => {
        setEditingBranch(branch);
        setData({
            name: branch.name,
            city: branch.city,
            address: branch.address,
            phone: branch.phone,
            email: branch.email || '',
            is_active: branch.is_active,
        });
        setShowModal(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingBranch) {
            put(route('branches.update', editingBranch.id), {
                onSuccess: () => setShowModal(false),
            });
        } else {
            post(route('branches.store'), {
                onSuccess: () => setShowModal(false),
            });
        }
    };

    const handleDelete = (branch: Branch) => {
        if (confirm(`Apakah Anda yakin ingin menghapus cabang "${branch.name}"?`)) {
            router.delete(route('branches.destroy', branch.id));
        }
    };

    const columns = [
        {
            header: 'Nama Cabang',
            key: 'name',
            render: (branch: Branch) => (
                <div>
                    <p className="font-bold text-on-surface">{branch.name}</p>
                    <p className="text-xs text-on-surface-variant mt-0.5">{branch.email || '—'}</p>
                </div>
            ),
        },
        {
            header: 'Kota',
            key: 'city',
            render: (branch: Branch) => (
                <span className="font-medium">{branch.city}</span>
            ),
        },
        {
            header: 'Alamat & Telepon',
            key: 'address',
            render: (branch: Branch) => (
                <div>
                    <p className="text-xs text-on-surface line-clamp-1 max-w-xs">{branch.address}</p>
                    <p className="text-xs font-semibold text-primary mt-0.5">{branch.phone}</p>
                </div>
            ),
        },
        {
            header: 'Pengguna',
            key: 'users_count',
            render: (branch: Branch) => (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-variant text-xs font-bold text-on-surface">
                    <span className="material-symbols-outlined text-[16px]">group</span>
                    {branch.users_count || 0} Admin
                </span>
            ),
        },
        {
            header: 'Status',
            key: 'is_active',
            render: (branch: Branch) => <StatusBadge status={branch.is_active} />,
        },
        {
            header: 'Aksi',
            key: 'id',
            render: (branch: Branch) => (
                <div className="flex items-center gap-1.5">
                    <button
                        onClick={() => openEditModal(branch)}
                        title="Edit Cabang"
                        className="p-1.5 rounded-lg text-on-surface-variant hover:bg-tertiary/60 hover:text-primary transition-colors cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button
                        onClick={() => handleDelete(branch)}
                        title="Hapus Cabang"
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
            <Head title="Manajemen Cabang - Harmoni by Phoeinx Sehat" />

            <PageHeader
                title="Daftar Cabang Optik"
                subtitle="Kelola data master cabang dan lokasi toko fisik"
                icon="storefront"
                action={
                    <button
                        onClick={openCreateModal}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-sm shadow-md shadow-primary/20 hover:bg-primary/90 transition-all cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-[20px]">add</span>
                        <span>Tambah Cabang</span>
                    </button>
                }
            />

            <SearchFilter
                search={search}
                onSearchChange={handleSearch}
                placeholder="Cari nama cabang, kota, atau alamat..."
            />

            <DataTable
                columns={columns}
                data={branches.data}
                links={branches.links}
                emptyMessage="Belum ada data cabang optik."
            />

            <FormModal
                show={showModal}
                onClose={() => setShowModal(false)}
                title={editingBranch ? 'Edit Cabang Optik' : 'Tambah Cabang Baru'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                            Nama Cabang <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Contoh: Harmoni by Phoeinx Sehat Jakarta Selatan"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-surface-variant/50 border border-outline-variant text-sm focus:outline-none focus:border-primary"
                            required
                        />
                        {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                                Kota <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.city}
                                onChange={(e) => setData('city', e.target.value)}
                                placeholder="Contoh: Jakarta"
                                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-variant/50 border border-outline-variant text-sm focus:outline-none focus:border-primary"
                                required
                            />
                            {errors.city && <p className="text-xs text-rose-500 mt-1">{errors.city}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                                Telepon <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                placeholder="Contoh: 021-3901234"
                                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-variant/50 border border-outline-variant text-sm focus:outline-none focus:border-primary"
                                required
                            />
                            {errors.phone && <p className="text-xs text-rose-500 mt-1">{errors.phone}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                            Email Cabang (Opsional)
                        </label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="Contoh: jakarta@optikcalm.com"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-surface-variant/50 border border-outline-variant text-sm focus:outline-none focus:border-primary"
                        />
                        {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                            Alamat Lengkap <span className="text-rose-500">*</span>
                        </label>
                        <textarea
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                            rows={3}
                            placeholder="Alamat lengkap lokasi toko fisik..."
                            className="w-full px-3.5 py-2.5 rounded-xl bg-surface-variant/50 border border-outline-variant text-sm focus:outline-none focus:border-primary"
                            required
                        />
                        {errors.address && <p className="text-xs text-rose-500 mt-1">{errors.address}</p>}
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                        <input
                            type="checkbox"
                            id="is_active"
                            checked={data.is_active}
                            onChange={(e) => setData('is_active', e.target.checked)}
                            className="w-4 h-4 rounded text-primary border-outline-variant"
                        />
                        <label htmlFor="is_active" className="text-sm font-semibold text-on-surface cursor-pointer">
                            Cabang Aktif Beroperasi
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
                            {processing ? 'Menyimpan...' : editingBranch ? 'Simpan Perubahan' : 'Tambah Cabang'}
                        </button>
                    </div>
                </form>
            </FormModal>
        </AdminLayout>
    );
}
