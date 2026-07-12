import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import PageHeader from '@/Components/Admin/PageHeader';
import DataTable from '@/Components/Admin/DataTable';
import StatusBadge from '@/Components/Admin/StatusBadge';
import FormModal from '@/Components/Admin/FormModal';
import SearchFilter from '@/Components/Admin/SearchFilter';
import SelectSearch from '@/Components/Admin/SelectSearch';
import { User, Role, Branch } from '@/types';

interface UsersPageProps {
    users: {
        data: User[];
        links: any[];
    };
    roles: Role[];
    branches: Branch[];
    filters: {
        search?: string;
        role_id?: string;
    };
}

export default function UsersIndex({ users, roles, branches, filters }: UsersPageProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedRole, setSelectedRole] = useState(filters.role_id || '');
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role_id: roles[0]?.id || '',
        branch_id: '' as string | number,
        is_active: true,
    });

    const handleSearch = (val: string) => {
        setSearch(val);
        router.get(
            route('users.index'),
            { search: val, role_id: selectedRole },
            { preserveState: true, replace: true }
        );
    };

    const handleRoleChange = (val: string) => {
        setSelectedRole(val);
        router.get(
            route('users.index'),
            { search, role_id: val },
            { preserveState: true, replace: true }
        );
    };

    const openCreateModal = () => {
        setEditingUser(null);
        reset();
        setShowModal(true);
    };

    const openEditModal = (user: User) => {
        setEditingUser(user);
        setData({
            name: user.name,
            email: user.email,
            password: '',
            password_confirmation: '',
            role_id: user.role_id || roles[0]?.id || '',
            branch_id: user.branch_id || '',
            is_active: user.is_active ?? true,
        });
        setShowModal(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingUser) {
            put(route('users.update', editingUser.id), {
                onSuccess: () => setShowModal(false),
            });
        } else {
            post(route('users.store'), {
                onSuccess: () => setShowModal(false),
            });
        }
    };

    const handleDelete = (user: User) => {
        if (confirm(`Hapus akun pengguna "${user.name}"?`)) {
            router.delete(route('users.destroy', user.id));
        }
    };

    const columns = [
        {
            header: 'Nama & Email',
            key: 'name',
            render: (user: User) => (
                <div>
                    <p className="font-bold text-on-surface">{user.name}</p>
                    <p className="text-xs text-on-surface-variant mt-0.5">{user.email}</p>
                </div>
            ),
        },
        {
            header: 'Hak Akses (Role)',
            key: 'role',
            render: (user: User) => (
                <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary">
                    {user.role?.display_name || 'Tanpa Role'}
                </span>
            ),
        },
        {
            header: 'Penempatan Cabang',
            key: 'branch',
            render: (user: User) => (
                <span className="text-sm font-medium text-on-surface">
                    {user.branch?.name || 'Semua Lokasi / Pusat'}
                </span>
            ),
        },
        {
            header: 'Status',
            key: 'is_active',
            render: (user: User) => <StatusBadge status={user.is_active ?? true} />,
        },
        {
            header: 'Aksi',
            key: 'id',
            render: (user: User) => (
                <div className="flex items-center gap-1.5">
                    <button
                        onClick={() => openEditModal(user)}
                        title="Edit User"
                        className="p-1.5 rounded-lg text-on-surface-variant hover:bg-tertiary/60 hover:text-primary transition-colors cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button
                        onClick={() => handleDelete(user)}
                        title="Hapus User"
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
            <Head title="Manajemen User & Role - Optik Calm" />

            <PageHeader
                title="Manajemen Pengguna & Role (RBAC)"
                subtitle="Kelola akun staf, otorisasi hak akses, dan penugasan cabang"
                icon="manage_accounts"
                action={
                    <button
                        onClick={openCreateModal}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-sm shadow-md shadow-primary/20 hover:bg-primary/90 transition-all cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-[20px]">add</span>
                        <span>Tambah User Baru</span>
                    </button>
                }
            />

            <SearchFilter
                search={search}
                onSearchChange={handleSearch}
                placeholder="Cari nama pengguna atau alamat email..."
            >
                <div className="w-48">
                    <SelectSearch
                        value={selectedRole}
                        onChange={(val) => handleRoleChange(val)}
                        placeholder="Semua Role"
                    >
                        <option value="">Semua Role</option>
                        {roles.map((r) => (
                            <option key={r.id} value={r.id}>{r.display_name}</option>
                        ))}
                    </SelectSearch>
                </div>
            </SearchFilter>

            <DataTable
                columns={columns}
                data={users.data}
                links={users.links}
                emptyMessage="Belum ada data pengguna."
            />

            <FormModal
                show={showModal}
                onClose={() => setShowModal(false)}
                title={editingUser ? 'Edit Akun Pengguna' : 'Tambah Pengguna Baru'}
                maxWidth="lg"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                                Nama Lengkap <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Contoh: Budi Santoso"
                                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-variant/50 border border-outline-variant text-sm"
                                required
                            />
                            {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                                Email <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="budi@optikcalm.com"
                                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-variant/50 border border-outline-variant text-sm"
                                required
                            />
                            {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                                Role Hak Akses <span className="text-rose-500">*</span>
                            </label>
                            <SelectSearch
                                value={data.role_id}
                                onChange={(val) => setData('role_id', val)}
                                placeholder="Pilih Role..."
                            >
                                {roles.map((r) => (
                                    <option key={r.id} value={r.id}>{r.display_name}</option>
                                ))}
                            </SelectSearch>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                                Cabang Penempatan
                            </label>
                            <SelectSearch
                                value={data.branch_id}
                                onChange={(val) => setData('branch_id', val)}
                                placeholder="Semua Lokasi / Kantor Pusat"
                            >
                                <option value="">Semua Lokasi / Kantor Pusat</option>
                                {branches.map((b) => (
                                    <option key={b.id} value={b.id}>{b.name}</option>
                                ))}
                            </SelectSearch>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-outline-variant/40">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                                {editingUser ? 'Kata Sandi Baru (Opsional)' : 'Kata Sandi *'}
                            </label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder={editingUser ? 'Kosongkan jika tidak ubah' : 'Min 8 karakter'}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-variant/50 border border-outline-variant text-sm"
                                required={!editingUser}
                            />
                            {errors.password && <p className="text-xs text-rose-500 mt-1">{errors.password}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                                Konfirmasi Kata Sandi
                            </label>
                            <input
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                placeholder="Ulangi kata sandi"
                                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-variant/50 border border-outline-variant text-sm"
                                required={!editingUser && !!data.password}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                        <input
                            type="checkbox"
                            id="user_is_active"
                            checked={data.is_active}
                            onChange={(e) => setData('is_active', e.target.checked)}
                            className="w-4 h-4 rounded text-primary border-outline-variant"
                        />
                        <label htmlFor="user_is_active" className="text-sm font-semibold text-on-surface cursor-pointer">
                            Akun Aktif (Dapat Login)
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
                            {processing ? 'Menyimpan...' : editingUser ? 'Simpan Perubahan' : 'Tambah User'}
                        </button>
                    </div>
                </form>
            </FormModal>
        </AdminLayout>
    );
}
