import React, { useState } from 'react';
import { Head, router, useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import PageHeader from '@/Components/Admin/PageHeader';
import FormModal from '@/Components/Admin/FormModal';

interface Branch {
    id: number;
    name: string;
    city: string;
}

interface Customer {
    id: number;
    customer_code: string;
    full_name: string;
    phone_number: string;
}

interface Service {
    id: number;
    service_code: string;
    name: string;
    price: number;
    duration_minutes: number;
}

interface ReservationItem {
    id: number;
    service_id: number;
    qty: number;
    price: number;
    service?: Service;
}

interface Reservation {
    id: number;
    reservation_number: string;
    reservation_type: string;
    branch_id: number;
    customer_id?: number | null;
    customer_name?: string | null;
    customer_phone?: string | null;
    display_name?: string;
    display_phone?: string;
    reservation_date: string;
    reservation_time: string;
    status: 'Waiting' | 'Confirmed' | 'Checked In' | 'In Progress' | 'Completed' | 'Cancelled' | 'No Show';
    notes: string | null;
    customer?: Customer;
    branch?: Branch;
    items?: ReservationItem[];
}

interface ReservationsPageProps {
    reservations: Reservation[];
    branches: Branch[];
    customers: Customer[];
    services: Service[];
    staffMembers: any[];
    currentBranchId: number;
    filters: {
        status?: string;
        date?: string;
        branch_id?: string;
    };
}

export default function ReservationsIndex({
    reservations,
    branches,
    customers,
    services,
    currentBranchId,
    filters,
}: ReservationsPageProps) {
    const [viewMode, setViewMode] = useState<'table' | 'calendar'>('calendar');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedResForStatus, setSelectedResForStatus] = useState<Reservation | null>(null);

    const [selectedServices, setSelectedServices] = useState<{ service_id: number; qty: number; price: number }[]>([]);

    const { data, setData, post, processing, errors, reset } = useForm({
        reservation_type: 'Online',
        branch_id: currentBranchId,
        customer_type: 'member' as 'member' | 'non_member',
        customer_id: '',
        customer_name: '',
        customer_phone: '',
        reservation_date: new Date().toISOString().split('T')[0],
        reservation_time: '10:00',
        notes: '',
        items: [] as any[],
    });

    const handleBranchChange = (newBranchId: number) => {
        router.get(
            route('reservations.index'),
            { ...filters, branch_id: newBranchId },
            { preserveState: true }
        );
    };

    const handleStatusFilter = (statusVal: string) => {
        router.get(
            route('reservations.index'),
            { ...filters, branch_id: currentBranchId, status: statusVal },
            { preserveState: true }
        );
    };

    const toggleServiceSelection = (srv: Service) => {
        const exists = selectedServices.find((item) => item.service_id === srv.id);
        if (exists) {
            setSelectedServices(selectedServices.filter((item) => item.service_id !== srv.id));
        } else {
            setSelectedServices([
                ...selectedServices,
                { service_id: srv.id, qty: 1, price: Number(srv.price) },
            ]);
        }
    };

    const handleSubmitCreate = (e: React.FormEvent) => {
        e.preventDefault();
        if (data.customer_type === 'member' && !data.customer_id) {
            alert('Pilih pelanggan member dari daftar.');
            return;
        }
        if (data.customer_type === 'non_member' && !data.customer_name) {
            alert('Masukkan nama pelanggan non-member.');
            return;
        }
        if (selectedServices.length === 0) {
            alert('Pilih minimal 1 layanan optik.');
            return;
        }

        router.post(route('reservations.store'), {
            ...data,
            customer_id: data.customer_type === 'member' ? data.customer_id : null,
            branch_id: currentBranchId,
            items: selectedServices,
        }, {
            onSuccess: () => {
                setShowCreateModal(false);
                setSelectedServices([]);
                reset();
            },
        });
    };

    const handleUpdateStatus = (res: Reservation, newStatus: string) => {
        router.post(route('reservations.status', res.id), {
            status: newStatus,
        }, {
            preserveScroll: true,
            onSuccess: () => setSelectedResForStatus(null),
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Waiting':
                return 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30';
            case 'Confirmed':
                return 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30';
            case 'Checked In':
                return 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30';
            case 'In Progress':
                return 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30';
            case 'Completed':
                return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
            default:
                return 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30';
        }
    };

    const formatRupiah = (val: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(val);
    };

    const currentBranchName = branches.find((b) => b.id === currentBranchId)?.name || 'Semua Cabang';

    return (
        <AdminLayout>
            <Head title="Manajemen Reservasi Cabang - Optik Calm" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-black text-on-surface flex items-center gap-2.5">
                        <span className="material-symbols-outlined text-primary text-[28px]">event</span>
                        <span>Reservasi Cabang Optik</span>
                    </h1>
                    <p className="text-sm text-on-surface-variant mt-1">
                        Cabang Aktif: <span className="font-bold text-primary">{currentBranchName}</span> — Jadwal pemeriksaan & konsultasi pasien
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Branch Switcher */}
                    <div className="flex items-center gap-2 bg-surface-variant px-3 py-1.5 rounded-xl border border-outline-variant">
                        <span className="material-symbols-outlined text-[18px] text-primary">storefront</span>
                        <select
                            value={currentBranchId}
                            onChange={(e) => handleBranchChange(Number(e.target.value))}
                            className="bg-transparent text-sm font-bold text-on-surface focus:outline-none cursor-pointer"
                        >
                            {branches.map((b) => (
                                <option key={b.id} value={b.id}>
                                    {b.name} ({b.city})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* View Switcher */}
                    <div className="flex rounded-xl bg-surface-variant p-1 border border-outline-variant">
                        <button
                            onClick={() => setViewMode('calendar')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                                viewMode === 'calendar'
                                    ? 'bg-primary text-on-primary shadow-sm'
                                    : 'text-on-surface-variant hover:text-on-surface'
                            }`}
                        >
                            <span className="material-symbols-outlined text-[16px]">calendar_month</span>
                            Kalender
                        </button>
                        <button
                            onClick={() => setViewMode('table')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                                viewMode === 'table'
                                    ? 'bg-primary text-on-primary shadow-sm'
                                    : 'text-on-surface-variant hover:text-on-surface'
                            }`}
                        >
                            <span className="material-symbols-outlined text-[16px]">table_rows</span>
                            Tabel
                        </button>
                    </div>

                    {/* Create Reservation button */}
                    <button
                        onClick={() => {
                            setData('branch_id', currentBranchId);
                            setShowCreateModal(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-sm shadow-md shadow-primary/20 hover:bg-primary/90 transition-all cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-[20px]">add</span>
                        <span>Buat Reservasi</span>
                    </button>
                </div>
            </div>

            {/* Status Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
                {['all', 'Waiting', 'Confirmed', 'Checked In', 'In Progress', 'Completed', 'Cancelled'].map((st) => (
                    <button
                        key={st}
                        onClick={() => handleStatusFilter(st)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                            (filters.status || 'all') === st
                                ? 'bg-primary text-on-primary border-primary'
                                : 'bg-surface-variant/60 text-on-surface-variant border-outline-variant hover:border-primary/40'
                        }`}
                    >
                        {st === 'all' ? 'Semua Status' : st}
                    </button>
                ))}
            </div>

            {/* CALENDAR OR TABLE VIEW */}
            {viewMode === 'calendar' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {reservations.length === 0 ? (
                        <div className="col-span-full py-16 text-center bg-surface-variant/30 rounded-2xl border border-outline-variant/60">
                            <span className="material-symbols-outlined text-[48px] text-on-surface-variant/40 block mb-2">
                                event_busy
                            </span>
                            <p className="font-bold text-on-surface">Belum Ada Reservasi di Cabang Ini</p>
                            <p className="text-xs text-on-surface-variant mt-1">
                                Klik tombol "Buat Reservasi" di atas untuk menambahkan jadwal pelanggan baru.
                            </p>
                        </div>
                    ) : (
                        reservations.map((res) => (
                            <div
                                key={res.id}
                                className="bg-surface rounded-2xl border border-outline-variant p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                            >
                                <div>
                                    {/* Card Header */}
                                    <div className="flex items-center justify-between gap-2 mb-3">
                                        <span className="font-mono text-xs font-bold text-primary">
                                            {res.reservation_number}
                                        </span>
                                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${getStatusColor(res.status)}`}>
                                            {res.status}
                                        </span>
                                    </div>

                                    {/* Customer & Time */}
                                    <div className="mb-4">
                                        <h3 className="text-lg font-black text-on-surface">
                                            {res.display_name || res.customer?.full_name || res.customer_name || 'Tamu Walk In'}
                                        </h3>
                                        <div className="flex items-center gap-4 mt-1 text-xs text-on-surface-variant">
                                            <span className="flex items-center gap-1 font-semibold text-primary">
                                                <span className="material-symbols-outlined text-[16px]">schedule</span>
                                                {res.reservation_date} • {res.reservation_time}
                                            </span>
                                            <span>|</span>
                                            <span className="flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[16px]">label</span>
                                                {res.reservation_type}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Services List */}
                                    <div className="space-y-1.5 bg-surface-variant/40 p-3 rounded-xl mb-4">
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                                            Layanan Dipesan:
                                        </p>
                                        {res.items?.map((item) => (
                                            <div key={item.id} className="flex items-center justify-between text-xs">
                                                <span className="font-medium text-on-surface">
                                                    ✓ {item.service?.name}
                                                </span>
                                                <span className="font-bold text-on-surface-variant">
                                                    {formatRupiah(Number(item.price))}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Actions Footer */}
                                <div className="flex items-center justify-between gap-2 pt-3 border-t border-outline-variant/60">
                                    <button
                                        onClick={() => setSelectedResForStatus(res)}
                                        className="text-xs font-bold text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                                    >
                                        Ubah Status ▾
                                    </button>

                                    {res.status !== 'Completed' && res.status !== 'Cancelled' ? (
                                        <Link
                                            href={`/pos?branch_id=${res.branch_id}&reservation_id=${res.id}`}
                                            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 shadow-sm transition-all"
                                        >
                                            <span className="material-symbols-outlined text-[16px]">point_of_sale</span>
                                            <span>Buka Kasir POS</span>
                                        </Link>
                                    ) : (
                                        <span className="text-xs font-semibold text-on-surface-variant">
                                            {res.status === 'Completed' ? '✓ Selesai Dibayar' : 'Dibatalkan'}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            ) : (
                /* TABLE VIEW */
                <div className="bg-surface rounded-2xl border border-outline-variant overflow-hidden shadow-xs">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-outline-variant bg-surface-variant/50 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                                <th className="p-4">No. Reservasi</th>
                                <th className="p-4">Pelanggan</th>
                                <th className="p-4">Jadwal</th>
                                <th className="p-4">Layanan</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Aksi POS</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/60 text-sm">
                            {reservations.map((res) => (
                                <tr key={res.id} className="hover:bg-tertiary/20 transition-colors">
                                    <td className="p-4 font-mono font-bold text-primary">{res.reservation_number}</td>
                                    <td className="p-4">
                                        <p className="font-bold text-on-surface">{res.display_name || res.customer?.full_name || res.customer_name || 'Tamu Walk In'}</p>
                                        <p className="text-xs text-on-surface-variant">{res.display_phone || res.customer?.phone_number || res.customer_phone || '-'}</p>
                                    </td>
                                    <td className="p-4 font-medium">
                                        {res.reservation_date} pukul <span className="font-bold">{res.reservation_time}</span>
                                    </td>
                                    <td className="p-4">
                                        {res.items?.map((item) => (
                                            <span
                                                key={item.id}
                                                className="inline-block bg-surface-variant text-xs font-medium px-2 py-0.5 rounded mr-1 mb-1"
                                            >
                                                {item.service?.name}
                                            </span>
                                        ))}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${getStatusColor(res.status)}`}>
                                            {res.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <Link
                                            href={`/pos?branch_id=${res.branch_id}&reservation_id=${res.id}`}
                                            className="px-3 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-bold inline-flex items-center gap-1 hover:bg-primary/90"
                                        >
                                            <span className="material-symbols-outlined text-[16px]">point_of_sale</span>
                                            Buka di Kasir
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* STATUS TRANSITION MODAL */}
            {selectedResForStatus && (
                <FormModal
                    show={Boolean(selectedResForStatus)}
                    onClose={() => setSelectedResForStatus(null)}
                    title={`Ubah Status Reservasi (${selectedResForStatus.reservation_number})`}
                >
                    <div className="space-y-3">
                        <p className="text-xs text-on-surface-variant mb-2">
                            Pilih status baru untuk reservasi atas nama{' '}
                            <span className="font-bold text-on-surface">
                                {selectedResForStatus.display_name || selectedResForStatus.customer?.full_name || selectedResForStatus.customer_name || 'Tamu Walk In'}
                            </span>
                            :
                        </p>
                        {['Waiting', 'Confirmed', 'Checked In', 'In Progress', 'Completed', 'Cancelled', 'No Show'].map(
                            (st) => (
                                <button
                                    key={st}
                                    type="button"
                                    onClick={() => handleUpdateStatus(selectedResForStatus, st)}
                                    className={`w-full text-left px-4 py-3 rounded-xl border font-bold text-sm flex items-center justify-between transition-all cursor-pointer ${
                                        selectedResForStatus.status === st
                                            ? 'bg-primary text-on-primary border-primary'
                                            : 'bg-surface hover:bg-tertiary/40 border-outline-variant text-on-surface'
                                    }`}
                                >
                                    <span>{st}</span>
                                    {selectedResForStatus.status === st && <span>✓ Aktif</span>}
                                </button>
                            )
                        )}
                    </div>
                </FormModal>
            )}

            {/* CREATE RESERVATION MODAL */}
            <FormModal
                show={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                title="Buat Reservasi Baru"
            >
                <form onSubmit={handleSubmitCreate} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                                Tipe Reservasi
                            </label>
                            <select
                                value={data.reservation_type}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setData((prev) => ({
                                        ...prev,
                                        reservation_type: val,
                                        customer_type: val === 'Walk In' ? 'non_member' : prev.customer_type,
                                    }));
                                }}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-variant/50 border border-outline-variant text-sm font-bold"
                            >
                                <option value="Online">Online</option>
                                <option value="Walk In">Walk In (Offline)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                                Kategori Pelanggan
                            </label>
                            <div className="flex rounded-xl bg-surface-variant p-1 border border-outline-variant">
                                <button
                                    type="button"
                                    onClick={() => setData('customer_type', 'member')}
                                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                        data.customer_type === 'member'
                                            ? 'bg-primary text-on-primary shadow-sm'
                                            : 'text-on-surface-variant hover:text-on-surface'
                                    }`}
                                >
                                    Member Terdaftar
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setData('customer_type', 'non_member')}
                                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                        data.customer_type === 'non_member'
                                            ? 'bg-primary text-on-primary shadow-sm'
                                            : 'text-on-surface-variant hover:text-on-surface'
                                    }`}
                                >
                                    Non-Member / Tamu
                                </button>
                            </div>
                        </div>
                    </div>

                    {data.customer_type === 'member' ? (
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                                Pilih Pelanggan Member <span className="text-rose-500">*</span>
                            </label>
                            <select
                                value={data.customer_id}
                                onChange={(e) => setData('customer_id', e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-variant/50 border border-outline-variant text-sm font-semibold"
                                required={data.customer_type === 'member'}
                            >
                                <option value="">-- Pilih Pelanggan --</option>
                                {customers.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.full_name} ({c.phone_number})
                                    </option>
                                ))}
                            </select>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-surface-variant/30 p-3.5 rounded-2xl border border-outline-variant">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                                    Nama Lengkap Tamu <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.customer_name}
                                    onChange={(e) => setData('customer_name', e.target.value)}
                                    placeholder="Contoh: Budi Santoso"
                                    className="w-full px-3.5 py-2 rounded-xl bg-surface border border-outline-variant text-sm font-semibold"
                                    required={data.customer_type === 'non_member'}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                                    No. WhatsApp / HP
                                </label>
                                <input
                                    type="text"
                                    value={data.customer_phone}
                                    onChange={(e) => setData('customer_phone', e.target.value)}
                                    placeholder="Contoh: 08123456789"
                                    className="w-full px-3.5 py-2 rounded-xl bg-surface border border-outline-variant text-sm font-semibold"
                                />
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                                Tanggal <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="date"
                                value={data.reservation_date}
                                onChange={(e) => setData('reservation_date', e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-variant/50 border border-outline-variant text-sm"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                                Jam Kunjungan <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="time"
                                value={data.reservation_time}
                                onChange={(e) => setData('reservation_time', e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-variant/50 border border-outline-variant text-sm"
                                required
                            />
                        </div>
                    </div>

                    {/* Choose Services */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                            Pilih Layanan Optik <span className="text-rose-500">*</span>
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-44 overflow-y-auto pr-1">
                            {services.map((srv) => {
                                const isSelected = selectedServices.some((s) => s.service_id === srv.id);
                                return (
                                    <div
                                        key={srv.id}
                                        onClick={() => toggleServiceSelection(srv)}
                                        className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                                            isSelected
                                                ? 'bg-primary/10 border-primary text-primary font-bold'
                                                : 'bg-surface border-outline-variant hover:border-primary/40'
                                        }`}
                                    >
                                        <div>
                                            <p>{srv.name}</p>
                                            <p className="text-[10px] text-on-surface-variant mt-0.5">
                                                {srv.duration_minutes} Menit
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold">{formatRupiah(Number(srv.price))}</p>
                                            {isSelected && <span>✓</span>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                            Catatan Reservasi
                        </label>
                        <textarea
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            rows={2}
                            placeholder="Catatan keluhan mata / permintaan khusus..."
                            className="w-full px-3.5 py-2.5 rounded-xl bg-surface-variant/50 border border-outline-variant text-sm"
                        />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant/60">
                        <button
                            type="button"
                            onClick={() => setShowCreateModal(false)}
                            className="px-4 py-2 rounded-xl border border-outline-variant text-sm font-semibold hover:bg-tertiary/40 transition-colors cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-5 py-2 rounded-xl bg-primary text-on-primary text-sm font-bold shadow-md shadow-primary/20 hover:bg-primary/90 transition-all cursor-pointer"
                        >
                            Simpan Reservasi
                        </button>
                    </div>
                </form>
            </FormModal>
        </AdminLayout>
    );
}
