import React, { useState } from 'react';
import { Head, router, useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import PageHeader from '@/Components/Admin/PageHeader';
import DataTable from '@/Components/Admin/DataTable';
import StatusBadge from '@/Components/Admin/StatusBadge';
import FormModal from '@/Components/Admin/FormModal';
import SearchFilter from '@/Components/Admin/SearchFilter';

interface ServiceCategory {
    id: number;
    code: string;
    name: string;
}

interface Service {
    id: number;
    service_code: string;
    name: string;
    service_category_id: number | null;
    description: string | null;
    duration_minutes: number;
    price: number;
    is_active: boolean;
    category?: ServiceCategory;
    commission_type?: 'percentage' | 'fixed' | null;
    commission_amount?: number | string | null;
}

interface ServicesPageProps {
    services: {
        data: Service[];
        links: any[];
    };
    categories: ServiceCategory[];
    filters: {
        search?: string;
        category_id?: string;
    };
}

export default function ServicesIndex({ services, categories, filters }: ServicesPageProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [showModal, setShowModal] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        service_code: '',
        name: '',
        service_category_id: '' as string | number,
        description: '',
        duration_minutes: 30,
        price: 0,
        commission_type: '' as 'percentage' | 'fixed' | '',
        commission_amount: '' as number | string,
        is_active: true,
    });

    const handleSearch = (val: string) => {
        setSearch(val);
        router.get(
            route('services.index'),
            { search: val },
            { preserveState: true, replace: true }
        );
    };

    const openCreateModal = () => {
        setEditingService(null);
        reset();
        setShowModal(true);
    };

    const openEditModal = (service: Service) => {
        setEditingService(service);
        setData({
            service_code: service.service_code,
            name: service.name,
            service_category_id: service.service_category_id || '',
            description: service.description || '',
            duration_minutes: service.duration_minutes,
            price: service.price,
            commission_type: service.commission_type || '',
            commission_amount: service.commission_amount || '',
            is_active: service.is_active,
        });
        setShowModal(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingService) {
            put(route('services.update', editingService.id), {
                onSuccess: () => setShowModal(false),
            });
        } else {
            post(route('services.store'), {
                onSuccess: () => setShowModal(false),
            });
        }
    };

    const handleDelete = (service: Service) => {
        if (confirm(`Apakah Anda yakin ingin menghapus layanan "${service.name}"?`)) {
            router.delete(route('services.destroy', service.id));
        }
    };

    const formatRupiah = (val: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(val);
    };

    const columns = [
        {
            header: 'Kode Layanan',
            key: 'service_code',
            render: (service: Service) => (
                <span className="font-mono font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-md text-xs">
                    {service.service_code}
                </span>
            ),
        },
        {
            header: 'Nama Layanan',
            key: 'name',
            render: (service: Service) => (
                <div>
                    <p className="font-bold text-on-surface">{service.name}</p>
                    <p className="text-xs text-on-surface-variant mt-0.5 line-clamp-1">{service.description || '—'}</p>
                </div>
            ),
        },
        {
            header: 'Kategori',
            key: 'category',
            render: (service: Service) => (
                <span className="text-xs font-semibold text-on-surface-variant bg-surface-variant px-2.5 py-1 rounded-lg">
                    {service.category?.name || 'Umum'}
                </span>
            ),
        },
        {
            header: 'Durasi',
            key: 'duration_minutes',
            render: (service: Service) => (
                <span className="text-sm font-medium text-on-surface">
                    {service.duration_minutes} Menit
                </span>
            ),
        },
        {
            header: 'Harga Layanan',
            key: 'price',
            render: (service: Service) => (
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {formatRupiah(Number(service.price))}
                </span>
            ),
        },
        {
            header: 'Komisi Affiliate',
            key: 'commission',
            render: (service: Service) => {
                if (!service.commission_type || !service.commission_amount) {
                    return <span className="text-on-surface-variant text-xs italic">—</span>;
                }
                return (
                    <span className="font-bold text-amber-600 bg-amber-500/10 px-2 py-1 rounded-md text-xs whitespace-nowrap">
                        {service.commission_type === 'percentage' 
                            ? `${service.commission_amount}%` 
                            : formatRupiah(Number(service.commission_amount))}
                    </span>
                );
            },
        },
        {
            header: 'Status',
            key: 'is_active',
            render: (service: Service) => <StatusBadge status={service.is_active} />,
        },
        {
            header: 'Aksi',
            key: 'id',
            render: (service: Service) => (
                <div className="flex items-center gap-1.5">
                    <button
                        onClick={() => openEditModal(service)}
                        title="Edit Layanan"
                        className="p-1.5 rounded-lg text-on-surface-variant hover:bg-tertiary/60 hover:text-primary transition-colors cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button
                        onClick={() => handleDelete(service)}
                        title="Hapus Layanan"
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
            <Head title="Master Layanan - Harmoni by Phoeinx Sehat" />

            <PageHeader
                title="Master Layanan Optik"
                subtitle="Daftar layanan pemeriksaan mata, pemasangan lensa, fitting, dan servis frame"
                icon="medical_services"
                action={
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('service-categories.index')}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-outline-variant text-on-surface font-semibold text-sm hover:bg-tertiary/40 transition-all"
                        >
                            <span className="material-symbols-outlined text-[18px]">category</span>
                            <span>Kategori Layanan</span>
                        </Link>
                        <button
                            onClick={openCreateModal}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-sm shadow-md shadow-primary/20 hover:bg-primary/90 transition-all cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-[20px]">add</span>
                            <span>Tambah Layanan</span>
                        </button>
                    </div>
                }
            />

            <SearchFilter
                search={search}
                onSearchChange={handleSearch}
                placeholder="Cari kode layanan, nama, atau deskripsi..."
            />

            <DataTable
                columns={columns}
                data={services.data}
                links={services.links}
                emptyMessage="Belum ada data layanan optik."
            />

            <FormModal
                show={showModal}
                onClose={() => setShowModal(false)}
                title={editingService ? 'Edit Layanan Optik' : 'Tambah Layanan Baru'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                                Kode Layanan <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.service_code}
                                onChange={(e) => setData('service_code', e.target.value.toUpperCase())}
                                placeholder="Contoh: SRV005"
                                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-variant/50 border border-outline-variant text-sm focus:outline-none focus:border-primary font-mono uppercase"
                                required
                            />
                            {errors.service_code && <p className="text-xs text-rose-500 mt-1">{errors.service_code}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                                Kategori
                            </label>
                            <select
                                value={data.service_category_id}
                                onChange={(e) => setData('service_category_id', e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-variant/50 border border-outline-variant text-sm focus:outline-none focus:border-primary"
                            >
                                <option value="">-- Pilih Kategori --</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                            Nama Layanan <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Contoh: Eye Examination Lengkap"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-surface-variant/50 border border-outline-variant text-sm focus:outline-none focus:border-primary"
                            required
                        />
                        {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                                Durasi (Menit) <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="number"
                                value={data.duration_minutes}
                                onChange={(e) => setData('duration_minutes', Number(e.target.value))}
                                min={5}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-variant/50 border border-outline-variant text-sm focus:outline-none focus:border-primary"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                                Harga (Rp) <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="number"
                                value={data.price}
                                onChange={(e) => setData('price', Number(e.target.value))}
                                min={0}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-variant/50 border border-outline-variant text-sm focus:outline-none focus:border-primary font-bold"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                                Tipe Komisi Affiliate
                            </label>
                            <select
                                value={data.commission_type}
                                onChange={(e) => setData('commission_type', e.target.value as any)}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-variant/50 border border-outline-variant text-sm focus:outline-none focus:border-primary"
                            >
                                <option value="">Tanpa Komisi</option>
                                <option value="percentage">Persentase (%)</option>
                                <option value="fixed">Nominal Tetap (Rp)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                                Besaran Komisi
                            </label>
                            <input
                                type="number"
                                value={data.commission_amount}
                                onChange={(e) => setData('commission_amount', e.target.value ? Number(e.target.value) : '')}
                                min={0}
                                disabled={!data.commission_type}
                                placeholder={data.commission_type === 'percentage' ? 'Cth: 10' : data.commission_type === 'fixed' ? 'Cth: 20000' : '-'}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-variant/50 border border-outline-variant text-sm focus:outline-none focus:border-primary font-bold disabled:opacity-50"
                            />
                            {errors.commission_amount && <p className="text-xs text-rose-500 mt-1">{errors.commission_amount}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                            Deskripsi Layanan (Opsional)
                        </label>
                        <textarea
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            rows={2}
                            placeholder="Penjelasan ringkas prosedur layanan..."
                            className="w-full px-3.5 py-2.5 rounded-xl bg-surface-variant/50 border border-outline-variant text-sm focus:outline-none focus:border-primary"
                        />
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                        <input
                            type="checkbox"
                            id="is_active_srv"
                            checked={data.is_active}
                            onChange={(e) => setData('is_active', e.target.checked)}
                            className="w-4 h-4 rounded text-primary border-outline-variant"
                        />
                        <label htmlFor="is_active_srv" className="text-sm font-semibold text-on-surface cursor-pointer">
                            Layanan Aktif Tersedia
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
                            {processing ? 'Menyimpan...' : editingService ? 'Simpan Perubahan' : 'Tambah Layanan'}
                        </button>
                    </div>
                </form>
            </FormModal>
        </AdminLayout>
    );
}
