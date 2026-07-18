import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import PageHeader from '@/Components/Admin/PageHeader';
import ReceiptModal from './ReceiptModal';
import SaleDetailModal from './SaleDetailModal';

interface KPIProps {
    period_reservations: number;
    period_revenue: number;
    completed_reservations: number;
    cancelled_reservations: number;
}

interface TopItem {
    item_name: string;
    total_qty: number;
    total_revenue: number;
}

interface SalesByBranch {
    branch_name: string;
    revenue: number;
    transactions: number;
}

interface DashboardProps {
    kpis: KPIProps;
    topServices: TopItem[];
    topProducts: TopItem[];
    salesByBranch: SalesByBranch[];
    recentReservations: any[];
    recentSales?: any[];
    topAffiliates?: any[];
    branches: any[];
    currentBranch: string | number;
    startDate: string;
    endDate: string;
}

export default function POSDashboard({
    kpis,
    topServices,
    topProducts,
    salesByBranch,
    recentReservations,
    recentSales = [],
    topAffiliates = [],
    branches,
    currentBranch,
    startDate,
    endDate,
}: DashboardProps) {
    const [selectedSaleToPrint, setSelectedSaleToPrint] = useState<any>(null);
    const [selectedSaleToView, setSelectedSaleToView] = useState<any>(null);

    const [filterStart, setFilterStart] = useState(startDate);
    const [filterEnd, setFilterEnd] = useState(endDate);

    const formatRupiah = (val: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(val);
    };

    const handleFilter = (branchId: string, start: string, end: string) => {
        router.get(route('pos.dashboard'), { 
            branch_id: branchId,
            start_date: start,
            end_date: end
        }, { preserveState: true });
    };

    return (
        <AdminLayout>
            <Head title="POS & Reservation Analytics - Harmoni by Phoeinx Sehat" />

            <div className="mb-6">
                <PageHeader
                    title="POS & Reservation Analytics Dashboard"
                    subtitle="Laporan eksekutif real-time reservasi harian dan pendapatan kasir POS per cabang"
                    icon="leaderboard"
                />
            </div>

            {/* Controls in a Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
                {/* Branch Switcher */}
                <div className="bg-surface rounded-2xl border border-outline-variant p-4 shadow-xs flex items-center gap-3 transition-colors hover:border-primary/30">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[20px]">storefront</span>
                    </div>
                    <div className="flex flex-col w-full">
                        <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Cabang Optik</label>
                        <select
                            value={String(currentBranch)}
                            onChange={(e) => handleFilter(e.target.value, filterStart, filterEnd)}
                            className="bg-transparent text-sm font-black text-on-surface focus:outline-none cursor-pointer w-full -ml-1 mt-0.5"
                        >
                            <option value="all">Semua Cabang Optik</option>
                            {branches.map((b) => (
                                <option key={b.id} value={b.id}>
                                    {b.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Date Filters */}
                <div className="bg-surface rounded-2xl border border-outline-variant p-4 shadow-xs flex items-center gap-3 transition-colors hover:border-primary/30">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[20px]">calendar_today</span>
                    </div>
                    <div className="flex flex-col w-full">
                        <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Rentang Waktu</label>
                        <div className="flex items-center gap-2 mt-0.5">
                            <input
                                type="date"
                                value={filterStart}
                                onChange={(e) => {
                                    setFilterStart(e.target.value);
                                    handleFilter(String(currentBranch), e.target.value, filterEnd);
                                }}
                                className="bg-transparent text-xs font-black text-on-surface focus:outline-none cursor-pointer w-full"
                            />
                            <span className="text-on-surface-variant text-xs font-bold">-</span>
                            <input
                                type="date"
                                value={filterEnd}
                                onChange={(e) => {
                                    setFilterEnd(e.target.value);
                                    handleFilter(String(currentBranch), filterStart, e.target.value);
                                }}
                                className="bg-transparent text-xs font-black text-on-surface focus:outline-none cursor-pointer w-full"
                            />
                        </div>
                    </div>
                </div>

                {/* Print Dashboard Button */}
                <div className="bg-surface rounded-2xl border border-outline-variant p-4 shadow-xs flex items-center justify-between transition-colors hover:border-primary/30">
                    <div className="flex flex-col">
                        <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Aksi Cetak</label>
                        <span className="text-sm font-black text-on-surface mt-0.5">Laporan Dashboard</span>
                    </div>
                    <button
                        onClick={() => window.print()}
                        className="w-10 h-10 rounded-xl bg-primary text-on-primary font-bold flex items-center justify-center shadow-xs hover:bg-primary/90 cursor-pointer shrink-0"
                        title="Cetak Laporan Dashboard"
                    >
                        <span className="material-symbols-outlined text-[20px]">print</span>
                    </button>
                </div>
            </div>

            {/* 4 KPI CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                <div className="bg-surface rounded-2xl border border-outline-variant p-5 shadow-xs flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                            Total Reservasi
                        </p>
                        <h3 className="text-2xl font-black text-on-surface mt-1">{kpis.period_reservations}</h3>
                        <p className="text-xs text-primary font-semibold mt-1">Jadwal pemeriksaan & fitting</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                        <span className="material-symbols-outlined text-[26px]">event</span>
                    </div>
                </div>

                <div className="bg-surface rounded-2xl border border-outline-variant p-5 shadow-xs flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                            Total Pendapatan POS
                        </p>
                        <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                            {formatRupiah(kpis.period_revenue)}
                        </h3>
                        <p className="text-xs text-emerald-600/80 font-semibold mt-1">Penjualan produk & layanan</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[26px]">payments</span>
                    </div>
                </div>

                <div className="bg-surface rounded-2xl border border-outline-variant p-5 shadow-xs flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                            Reservasi Selesai (Completed)
                        </p>
                        <h3 className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
                            {kpis.completed_reservations}
                        </h3>
                        <p className="text-xs text-indigo-600/80 font-semibold mt-1">Telah dibayar di kasir</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[26px]">task_alt</span>
                    </div>
                </div>

                <div className="bg-surface rounded-2xl border border-outline-variant p-5 shadow-xs flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                            Reservasi Batal / No-Show
                        </p>
                        <h3 className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">
                            {kpis.cancelled_reservations}
                        </h3>
                        <p className="text-xs text-rose-600/80 font-semibold mt-1">Pasien tidak hadir / batal</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[26px]">event_busy</span>
                    </div>
                </div>
            </div>

            {/* TOP CHARTS & TABLES: TOP SERVICES & TOP PRODUCTS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Top Services */}
                <div className="bg-surface rounded-2xl border border-outline-variant p-5 shadow-xs">
                    <h3 className="font-black text-base text-on-surface flex items-center gap-2 mb-4">
                        <span className="material-symbols-outlined text-primary">medical_services</span>
                        <span>5 Layanan Terlaris (Top Services)</span>
                    </h3>
                    <div className="space-y-3">
                        {topServices.length === 0 ? (
                            <p className="text-xs text-on-surface-variant py-6 text-center">Belum ada transaksi layanan.</p>
                        ) : (
                            topServices.map((srv, idx) => (
                                <div
                                    key={idx}
                                    className="p-3 rounded-xl bg-surface-variant/40 border border-outline-variant flex items-center justify-between"
                                >
                                    <div>
                                        <p className="font-bold text-sm text-on-surface">{srv.item_name}</p>
                                        <p className="text-xs text-on-surface-variant">
                                            Total Dipesan: <span className="font-bold">{srv.total_qty}x</span>
                                        </p>
                                    </div>
                                    <span className="font-black text-sm text-emerald-600 dark:text-emerald-400">
                                        {formatRupiah(Number(srv.total_revenue))}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Top Products */}
                <div className="bg-surface rounded-2xl border border-outline-variant p-5 shadow-xs">
                    <h3 className="font-black text-base text-on-surface flex items-center gap-2 mb-4">
                        <span className="material-symbols-outlined text-primary">eyeglasses</span>
                        <span>5 Produk Frame/Lensa Terlaris</span>
                    </h3>
                    <div className="space-y-3">
                        {topProducts.length === 0 ? (
                            <p className="text-xs text-on-surface-variant py-6 text-center">Belum ada transaksi produk.</p>
                        ) : (
                            topProducts.map((prod, idx) => (
                                <div
                                    key={idx}
                                    className="p-3 rounded-xl bg-surface-variant/40 border border-outline-variant flex items-center justify-between"
                                >
                                    <div>
                                        <p className="font-bold text-sm text-on-surface">{prod.item_name}</p>
                                        <p className="text-xs text-on-surface-variant">
                                            Terjual: <span className="font-bold">{prod.total_qty} Unit</span>
                                        </p>
                                    </div>
                                    <span className="font-black text-sm text-emerald-600 dark:text-emerald-400">
                                        {formatRupiah(Number(prod.total_revenue))}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* SALES BY BRANCH & TOP AFFILIATES */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* SALES BY BRANCH TABLE */}
                <div className="bg-surface rounded-2xl border border-outline-variant p-5 shadow-xs">
                    <h3 className="font-black text-base text-on-surface flex items-center gap-2 mb-4">
                        <span className="material-symbols-outlined text-primary">storefront</span>
                        <span>Pendapatan POS per Cabang Optik</span>
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-sm">
                            <thead>
                                <tr className="border-b border-outline-variant bg-surface-variant/40 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                                    <th className="p-3">Nama Cabang</th>
                                    <th className="p-3">Total Transaksi POS</th>
                                    <th className="p-3 text-right">Pendapatan Bersih</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant/60">
                                {salesByBranch.map((b, idx) => (
                                    <tr key={idx}>
                                        <td className="p-3 font-bold text-on-surface">{b.branch_name}</td>
                                        <td className="p-3 font-medium">{b.transactions} Transaksi</td>
                                        <td className="p-3 text-right font-black text-emerald-600 dark:text-emerald-400">
                                            {formatRupiah(Number(b.revenue))}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* TOP AFFILIATES TABLE */}
                <div className="bg-surface rounded-2xl border border-outline-variant p-5 shadow-xs">
                    <h3 className="font-black text-base text-on-surface flex items-center gap-2 mb-4">
                        <span className="material-symbols-outlined text-primary">group</span>
                        <span>Top Affiliator (Berdasarkan Omzet)</span>
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-sm">
                            <thead>
                                <tr className="border-b border-outline-variant bg-surface-variant/40 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                                    <th className="p-3">Nama Affiliator</th>
                                    <th className="p-3">Total Transaksi</th>
                                    <th className="p-3 text-right">Est. Komisi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant/60">
                                {topAffiliates.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="p-6 text-center text-on-surface-variant text-xs">
                                            Belum ada data affiliator.
                                        </td>
                                    </tr>
                                ) : (
                                    topAffiliates.map((aff, idx) => (
                                        <tr key={idx}>
                                            <td className="p-3">
                                                <p className="font-bold text-on-surface">{aff.user?.full_name || 'Tanpa Nama'}</p>
                                                <p className="text-[10px] text-on-surface-variant font-mono">{aff.referral_code}</p>
                                            </td>
                                            <td className="p-3 font-medium text-xs">
                                                {aff.sales_count} Trx ({formatRupiah(Number(aff.total_revenue))})
                                            </td>
                                            <td className="p-3 text-right font-black text-emerald-600 dark:text-emerald-400">
                                                {formatRupiah(Number(aff.estimated_commission))}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* RECENT POS SALES WITH PRINT ACTION */}
            <div className="bg-surface rounded-2xl border border-outline-variant p-5 shadow-xs mt-8">
                <h3 className="font-black text-base text-on-surface flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-primary">receipt_long</span>
                    <span>Daftar Transaksi POS Terbaru</span>
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                        <thead>
                            <tr className="border-b border-outline-variant bg-surface-variant/40 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                                <th className="p-3">No. Invoice</th>
                                <th className="p-3">Waktu</th>
                                <th className="p-3">Pelanggan</th>
                                <th className="p-3">Cabang</th>
                                <th className="p-3">Affiliator</th>
                                <th className="p-3 text-right">Total Tagihan</th>
                                <th className="p-3 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/60">
                            {(!recentSales || recentSales.length === 0) ? (
                                <tr>
                                    <td colSpan={6} className="p-6 text-center text-on-surface-variant">
                                        Belum ada riwayat transaksi terbaru.
                                    </td>
                                </tr>
                            ) : (
                                recentSales.map((sale, idx) => (
                                    <tr key={idx} className="hover:bg-surface-variant/20 transition-colors">
                                        <td className="p-3 font-bold text-primary">{sale.invoice_number}</td>
                                        <td className="p-3 text-on-surface-variant">
                                            {new Date(sale.created_at).toLocaleString('id-ID', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </td>
                                        <td className="p-3 font-semibold text-on-surface">
                                            {sale.walkin_name || sale.customer?.full_name || 'Walk-in'}
                                        </td>
                                        <td className="p-3 text-on-surface-variant">{sale.branch?.name || '-'}</td>
                                        <td className="p-3 text-on-surface-variant">
                                            {sale.affiliate ? (
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-primary">{sale.affiliate.user?.full_name}</span>
                                                    <span className="text-[10px]">{sale.affiliate.referral_code}</span>
                                                </div>
                                            ) : (
                                                '-'
                                            )}
                                        </td>
                                        <td className="p-3 text-right font-black text-emerald-600 dark:text-emerald-400">
                                            {formatRupiah(Number(sale.grand_total))}
                                        </td>
                                        <td className="p-3 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedSaleToView(sale)}
                                                    className="px-3 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-600 text-indigo-600 hover:text-white font-bold transition-all inline-flex items-center gap-1 cursor-pointer"
                                                    title="Lihat Detail & Komisi"
                                                >
                                                    <span className="material-symbols-outlined text-[15px]">visibility</span>
                                                    <span>View</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedSaleToPrint(sale)}
                                                    className="px-3 py-1.5 rounded-xl bg-primary/10 hover:bg-primary text-primary hover:text-on-primary font-bold transition-all inline-flex items-center gap-1 cursor-pointer"
                                                    title="Cetak Struk Transaksi"
                                                >
                                                    <span className="material-symbols-outlined text-[15px]">print</span>
                                                    <span>Cetak</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Receipt Modal for Printing Specific Transaction */}
            <ReceiptModal
                show={Boolean(selectedSaleToPrint)}
                onClose={() => setSelectedSaleToPrint(null)}
                sale={selectedSaleToPrint}
            />

            {/* Sale Detail Modal for Viewing Affiliate & Commission */}
            <SaleDetailModal
                show={Boolean(selectedSaleToView)}
                onClose={() => setSelectedSaleToView(null)}
                sale={selectedSaleToView}
            />
        </AdminLayout>
    );
}
