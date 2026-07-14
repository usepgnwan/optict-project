import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import PageHeader from '@/Components/Admin/PageHeader';
import DataTable from '@/Components/Admin/DataTable';
import FormModal from '@/Components/Admin/FormModal';
import SearchFilter from '@/Components/Admin/SearchFilter';

interface Customer {
    id: number;
    customer_code: string;
    full_name: string;
    phone_number: string;
    email: string | null;
    address: string | null;
    date_of_birth: string | null;
    gender: string | null;
    notes: string | null;
    reservations_count?: number;
    sales_count?: number;
}

interface CustomersPageProps {
    customers: {
        data: Customer[];
        links: any[];
    };
    filters: {
        search?: string;
    };
}

export default function CustomersIndex({ customers, filters }: CustomersPageProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [showModal, setShowModal] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        customer_code: '',
        full_name: '',
        phone_number: '',
        email: '',
        address: '',
        date_of_birth: '',
        gender: 'Male',
        notes: '',
    });

    const handleSearch = (val: string) => {
        setSearch(val);
        router.get(
            route('customers.index'),
            { search: val },
            { preserveState: true, replace: true }
        );
    };

    const openCreateModal = () => {
        setEditingCustomer(null);
        reset();
        setData('customer_code', 'CUST-' + Math.floor(1000 + Math.random() * 9000));
        setShowModal(true);
    };

    const openEditModal = (customer: Customer) => {
        setEditingCustomer(customer);
        setData({
            customer_code: customer.customer_code,
            full_name: customer.full_name,
            phone_number: customer.phone_number,
            email: customer.email || '',
            address: customer.address || '',
            date_of_birth: customer.date_of_birth || '',
            gender: customer.gender || 'Male',
            notes: customer.notes || '',
        });
        setShowModal(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingCustomer) {
            put(route('customers.update', editingCustomer.id), {
                onSuccess: () => setShowModal(false),
            });
        } else {
            post(route('customers.store'), {
                onSuccess: () => setShowModal(false),
            });
        }
    };

    const handleDelete = (customer: Customer) => {
        if (confirm(`Apakah Anda yakin ingin menghapus data pelanggan "${customer.full_name}"?`)) {
            router.delete(route('customers.destroy', customer.id));
        }
    };

    const columns = [
        {
            header: 'Kode & Nama',
            key: 'full_name',
            render: (c: Customer) => (
                <div>
                    <span className="font-mono text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-primary/10 text-primary">
                        {c.customer_code}
                    </span>
                    <p className="font-bold text-on-surface mt-1">{c.full_name}</p>
                </div>
            ),
        },
        {
            header: 'No. WhatsApp / Kontak',
            key: 'phone_number',
            render: (c: Customer) => (
                <div>
                    <p className="font-semibold text-primary">{c.phone_number}</p>
                    <p className="text-xs text-on-surface-variant mt-0.5">{c.email || '—'}</p>
                </div>
            ),
        },
        {
            header: 'Alamat',
            key: 'address',
            render: (c: Customer) => (
                <span className="text-xs text-on-surface line-clamp-2 max-w-xs">{c.address || '—'}</span>
            ),
        },
        {
            header: 'Riwayat Reservasi & POS',
            key: 'stats',
            render: (c: Customer) => (
                <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold">
                        <span className="material-symbols-outlined text-[14px]">event</span>
                        {c.reservations_count || 0} Reservasi
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                        <span className="material-symbols-outlined text-[14px]">receipt</span>
                        {c.sales_count || 0} Transaksi
                    </span>
                </div>
            ),
        },
        {
            header: 'Aksi',
            key: 'id',
            render: (c: Customer) => (
                <div className="flex items-center gap-1.5">
                    <button
                        onClick={() => openEditModal(c)}
                        title="Edit Data Pelanggan"
                        className="p-1.5 rounded-lg text-on-surface-variant hover:bg-tertiary/60 hover:text-primary transition-colors cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button
                        onClick={() => handleDelete(c)}
                        title="Hapus Pelanggan"
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
            <Head title="Data Pelanggan - Harmoni by Phoeinx Sehat" />

            <PageHeader
                title="Manajemen Pelanggan Optik"
                subtitle="Daftar pasien & pelanggan beserta rekam jejak reservasi dan riwayat pembelian"
                icon="groups"
                action={
                    <button
                        onClick={openCreateModal}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-sm shadow-md shadow-primary/20 hover:bg-primary/90 transition-all cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-[20px]">person_add</span>
                        <span>Tambah Pelanggan</span>
                    </button>
                }
            />

            <SearchFilter
                search={search}
                onSearchChange={handleSearch}
                placeholder="Cari nama pelanggan, nomor telepon, atau kode..."
            />

            <DataTable
                columns={columns}
                data={customers.data}
                links={customers.links}
                emptyMessage="Belum ada data pelanggan."
            />

            <FormModal
                show={showModal}
                onClose={() => setShowModal(false)}
                title={editingCustomer ? 'Edit Data Pelanggan' : 'Tambah Pelanggan Baru'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                                Kode Pelanggan <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.customer_code}
                                onChange={(e) => setData('customer_code', e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-variant/50 border border-outline-variant text-sm font-mono"
                                required
                            />
                            {errors.customer_code && <p className="text-xs text-rose-500 mt-1">{errors.customer_code}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                                No. Telepon / WA <span className="text-rose-500">* (Unik)</span>
                            </label>
                            <input
                                type="text"
                                value={data.phone_number}
                                onChange={(e) => setData('phone_number', e.target.value)}
                                placeholder="08123456789"
                                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-variant/50 border border-outline-variant text-sm"
                                required
                            />
                            {errors.phone_number && <p className="text-xs text-rose-500 mt-1">{errors.phone_number}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                            Nama Lengkap <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.full_name}
                            onChange={(e) => setData('full_name', e.target.value)}
                            placeholder="Nama Lengkap Pelanggan"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-surface-variant/50 border border-outline-variant text-sm"
                            required
                        />
                        {errors.full_name && <p className="text-xs text-rose-500 mt-1">{errors.full_name}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                                Email (Opsional)
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-variant/50 border border-outline-variant text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                                Jenis Kelamin
                            </label>
                            <select
                                value={data.gender}
                                onChange={(e) => setData('gender', e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-variant/50 border border-outline-variant text-sm"
                            >
                                <option value="Male">Laki-laki</option>
                                <option value="Female">Perempuan</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                            Alamat Lengkap
                        </label>
                        <textarea
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                            rows={2}
                            placeholder="Alamat domisili..."
                            className="w-full px-3.5 py-2.5 rounded-xl bg-surface-variant/50 border border-outline-variant text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                            Catatan Khusus Optik (Ukuran / Riwayat Mata)
                        </label>
                        <textarea
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            rows={2}
                            placeholder="Catatan lensa, minus/plus, preferensi frame..."
                            className="w-full px-3.5 py-2.5 rounded-xl bg-surface-variant/50 border border-outline-variant text-sm"
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
                            {processing ? 'Menyimpan...' : editingCustomer ? 'Simpan Perubahan' : 'Tambah Pelanggan'}
                        </button>
                    </div>
                </form>
            </FormModal>
        </AdminLayout>
    );
}
