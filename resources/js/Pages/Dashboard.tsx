import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { CountUp, ScrollCard } from '@/Components/ReactBits';

interface DashboardProps {
    stats: any;
    financialStats: any;
    lowStockProducts: any[];
    outOfStockProducts: any[];
    recentTransfers: any[];
    recentAdjustments: any[];
    stockByBranch: any[];
    chartData: any[];
    statusDistribution: any[];
    recentTransactions: any[];
    topProducts: any[];
    topServices: any[];
    branches: any[];
    currentBranch: string | number;
    startDate: string;
    endDate: string;
    affiliatorCommissions: any[];
}

export default function Dashboard({
    stats,
    financialStats,
    chartData = [],
    statusDistribution = [],
    recentTransactions = [],
    topProducts = [],
    topServices = [],
    branches = [],
    currentBranch,
    startDate,
    endDate,
    affiliatorCommissions = [],
}: DashboardProps) {
    const [filterStart, setFilterStart] = useState(startDate);
    const [filterEnd, setFilterEnd] = useState(endDate);

    const formatRupiah = (val: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(val || 0);
    };

    const handleFilter = (branchId: string, start: string, end: string) => {
        router.get(route('dashboard'), { 
            branch_id: branchId,
            start_date: start,
            end_date: end
        }, { preserveState: true });
    };

    const maxVal = Math.max(
        ...chartData.flatMap((d: any) => [d.kacamata || 0, d.layanan || 0, d.komisi || 0]),
        1000 // minimum scale
    );
    
    const formatYAxis = (val: number) => {
        if (val >= 1000000000) return 'Rp ' + (val / 1000000000).toFixed(1) + 'M';
        if (val >= 1000000) return 'Rp ' + (val / 1000000).toFixed(1) + 'Jt';
        if (val >= 1000) return 'Rp ' + (val / 1000).toFixed(1) + 'Rb';
        return 'Rp ' + Math.round(val);
    };

    const yAxisLabels = [maxVal, maxVal * 0.66, maxVal * 0.33].map(v => formatYAxis(v));

    return (
        <AdminLayout title="Dashboard | Harmoni by Phoenix Sehat">
            <Head title="Dashboard | Harmoni by Phoenix Sehat" />

            {/* Top Page Title & Filter Row */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <p className="text-[11px] font-bold tracking-widest text-secondary uppercase mb-1">
                        ADMIN PANEL
                    </p>
                    <h1 className="text-3xl font-extrabold text-primary tracking-tight">
                        Dashboard
                    </h1>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 bg-surface border border-outline-variant px-3 py-2 rounded-xl shadow-xs transition-colors hover:border-primary/40">
                        <span className="material-symbols-outlined text-[18px] text-primary">calendar_today</span>
                        <div className="flex items-center gap-1">
                            <input
                                type="date"
                                value={filterStart}
                                onChange={(e) => {
                                    setFilterStart(e.target.value);
                                    handleFilter(String(currentBranch), e.target.value, filterEnd);
                                }}
                                className="bg-transparent text-sm font-bold text-on-surface focus:outline-none cursor-pointer"
                            />
                            <span className="text-on-surface-variant">-</span>
                            <input
                                type="date"
                                value={filterEnd}
                                onChange={(e) => {
                                    setFilterEnd(e.target.value);
                                    handleFilter(String(currentBranch), filterStart, e.target.value);
                                }}
                                className="bg-transparent text-sm font-bold text-on-surface focus:outline-none cursor-pointer"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 bg-surface border border-outline-variant px-3 py-2 rounded-xl shadow-xs transition-colors hover:border-primary/40">
                        <span className="material-symbols-outlined text-[18px] text-primary">storefront</span>
                        <select
                            value={String(currentBranch)}
                            onChange={(e) => handleFilter(e.target.value, filterStart, filterEnd)}
                            className="bg-transparent text-sm font-bold text-on-surface focus:outline-none cursor-pointer"
                        >
                            <option value="all">Semua Cabang</option>
                            {branches.map((b) => (
                                <option key={b.id} value={b.id}>{b.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Summary Cards Row (5 Horizontal Cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
                {/* Card 1: Total Pendapatan */}
                <ScrollCard index={0} enableSpotlight={true} direction="up" className="bg-surface p-5 rounded-2xl border border-outline-variant card-shadow flex flex-col justify-between">
                    <div className="mb-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-3">
                            <span className="material-symbols-outlined text-[20px]">payments</span>
                        </div>
                        <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                            TOTAL PENDAPATAN
                        </p>
                    </div>
                    <div>
                        <h3 className="text-2xl font-extrabold text-primary tracking-tight mb-1">
                            {formatRupiah(financialStats?.totalRevenue)}
                        </h3>
                        <p className="text-xs text-on-surface-variant">
                            semua waktu (success)
                        </p>
                    </div>
                </ScrollCard>

                {/* Card 2: Komisi Dokter / Tim */}
                <ScrollCard index={1} enableSpotlight={true} direction="up" className="bg-surface p-5 rounded-2xl border border-outline-variant card-shadow flex flex-col justify-between">
                    <div className="mb-4">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-3">
                            <span className="material-symbols-outlined text-[20px]">clinical_notes</span>
                        </div>
                        <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                            KOMISI AFFILIATOR
                        </p>
                    </div>
                    <div>
                        <h3 className="text-2xl font-extrabold text-primary tracking-tight mb-1">
                            {formatRupiah(financialStats?.totalCommission)}
                        </h3>
                        <p className="text-xs text-on-surface-variant">
                            dari transaksi selesai
                        </p>
                    </div>
                </ScrollCard>

                {/* Card 3: Pendapatan Bersih (Highlighted Card) */}
                <ScrollCard index={2} enableSpotlight={true} direction="up" className="bg-surface p-5 rounded-2xl border-2 border-primary/40 shadow-lg shadow-primary/5 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 blur-xl" />
                    <div className="mb-4 relative z-10">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-3">
                            <span className="material-symbols-outlined text-[20px]">trending_up</span>
                        </div>
                        <p className="text-[11px] font-bold text-primary uppercase tracking-wider">
                            PENDAPATAN BERSIH
                        </p>
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-2xl font-extrabold text-amber-500 tracking-tight mb-1">
                            {formatRupiah(financialStats?.netRevenue)}
                        </h3>
                        <p className="text-xs text-on-surface-variant">
                            pendapatan - komisi
                        </p>
                    </div>
                </ScrollCard>

                {/* Card 4: Bulan Ini */}
                <ScrollCard index={3} enableSpotlight={true} direction="up" className="bg-surface p-5 rounded-2xl border border-outline-variant card-shadow flex flex-col justify-between">
                    <div className="mb-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-3">
                            <span className="material-symbols-outlined text-[20px]">calendar_month</span>
                        </div>
                        <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                            BULAN INI
                        </p>
                    </div>
                    <div>
                        <h3 className="text-2xl font-extrabold text-primary tracking-tight mb-1">
                            {chartData.length > 0 ? formatRupiah((chartData[chartData.length - 1].kacamata || 0) + (chartData[chartData.length - 1].layanan || 0)) : formatRupiah(0)}
                        </h3>
                        <p className="text-xs text-on-surface-variant">
                            Periode terakhir
                        </p>
                    </div>
                </ScrollCard>

                {/* Card 5: Reservasi Selesai */}
                <ScrollCard index={4} enableSpotlight={true} direction="up" className="bg-surface p-5 rounded-2xl border border-outline-variant card-shadow flex flex-col justify-between">
                    <div className="mb-4">
                        <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-500 flex items-center justify-center mb-3">
                            <span className="material-symbols-outlined text-[20px]">check_circle</span>
                        </div>
                        <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                            RESERVASI SELESAI
                        </p>
                    </div>
                    <div>
                        <h3 className="text-2xl font-extrabold text-primary tracking-tight mb-1">
                            <CountUp end={financialStats?.completedReservations || 0} duration={2} />
                        </h3>
                        <p className="text-xs text-on-surface-variant">
                            dari {financialStats?.totalReservations || 0} total reservasi
                        </p>
                    </div>
                </ScrollCard>
            </div>

            {/* Charts Grid: Left 70% Revenue Chart, Right 30% Status Distribution Donut */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Left: Monthly Revenue Chart */}
                <div className="lg:col-span-2 bg-surface rounded-3xl border border-outline-variant p-6 lg:p-8 card-shadow flex flex-col">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                        <div>
                            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                                GRAFIK TREN
                            </p>
                            <h3 className="text-xl font-bold text-primary">
                                Penjualan & Komisi
                            </h3>
                        </div>
                        {/* Legend */}
                        <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                            <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                                Kacamata
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                                Layanan
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                                Komisi
                            </div>
                        </div>
                    </div>

                    {/* SVG Chart representation */}
                    <div className="flex-1 min-h-[280px] flex flex-col justify-end pt-4">
                        <div className="relative h-60 flex flex-col justify-between border-b border-outline-variant pb-2 w-full">
                            {/* Y-Axis Gridlines */}
                            <div className="absolute top-0 w-full border-t border-dashed border-outline-variant/60 flex items-center">
                                <span className="text-[11px] text-on-surface-variant -mt-5">{yAxisLabels[0]}</span>
                            </div>
                            <div className="absolute top-1/3 w-full border-t border-dashed border-outline-variant/60 flex items-center">
                                <span className="text-[11px] text-on-surface-variant -mt-5">{yAxisLabels[1]}</span>
                            </div>
                            <div className="absolute top-2/3 w-full border-t border-dashed border-outline-variant/60 flex items-center">
                                <span className="text-[11px] text-on-surface-variant -mt-5">{yAxisLabels[2]}</span>
                            </div>

                            {/* Bar Columns */}
                            <div className="h-full flex items-end justify-around relative z-10 px-2 lg:px-8 mt-6">
                                {chartData.map((item: any, index: number) => {
                                    const pctKacamata = Math.max(Math.min(((item.kacamata || 0) / maxVal) * 100, 100), 1); // min 1% to show a sliver
                                    const pctLayanan = Math.max(Math.min(((item.layanan || 0) / maxVal) * 100, 100), 1);
                                    const pctKomisi = Math.max(Math.min(((item.komisi || 0) / maxVal) * 100, 100), 1);
                                    
                                    return (
                                        <div key={index} className="flex flex-col items-center group flex-1 shrink relative h-full justify-end">
                                            {/* Tooltip */}
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity mb-2 px-3 py-2 bg-surface-variant border border-outline-variant text-on-surface text-xs font-bold rounded-xl shadow-md whitespace-nowrap absolute bottom-full left-1/2 -translate-x-1/2 z-20 pointer-events-none">
                                                <div className="mb-1 text-primary">{item.label}</div>
                                                <div className="flex gap-2 text-[10px]">
                                                    <span className="text-indigo-500">Kacamata:</span> {formatRupiah(item.kacamata)}
                                                </div>
                                                <div className="flex gap-2 text-[10px]">
                                                    <span className="text-emerald-500">Layanan:</span> {formatRupiah(item.layanan)}
                                                </div>
                                                <div className="flex gap-2 text-[10px]">
                                                    <span className="text-purple-500">Komisi:</span> {formatRupiah(item.komisi)}
                                                </div>
                                            </div>
                                            
                                            {/* Bars */}
                                            <div className="flex-1 w-full flex items-end justify-center gap-1 mt-8">
                                                {item.kacamata > 0 && <div className="w-3 rounded-t-lg bg-indigo-500 shadow-md shadow-indigo-500/20 group-hover:opacity-80 transition-all" style={{ height: `${pctKacamata}%` }}></div>}
                                                {item.layanan > 0 && <div className="w-3 rounded-t-lg bg-emerald-500 shadow-md shadow-emerald-500/20 group-hover:opacity-80 transition-all" style={{ height: `${pctLayanan}%` }}></div>}
                                                {item.komisi > 0 && <div className="w-3 rounded-t-lg bg-purple-500 shadow-md shadow-purple-500/20 group-hover:opacity-80 transition-all" style={{ height: `${pctKomisi}%` }}></div>}
                                            </div>
                                            
                                            <span className="text-[10px] font-bold text-on-surface-variant mt-3 text-center whitespace-nowrap">
                                                {item.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Status Distribution Donut Chart */}
                <div className="bg-surface rounded-3xl border border-outline-variant p-6 lg:p-8 card-shadow flex flex-col">
                    <div className="mb-8">
                        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                            DISTRIBUSI
                        </p>
                        <h3 className="text-xl font-bold text-primary">
                            Transaksi per Status
                        </h3>
                    </div>

                    <div className="flex-1 flex flex-col justify-center">
                        <div className="relative w-48 h-48 mx-auto mb-8">
                            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                                {(() => {
                                    let currentOffset = 0;
                                    return statusDistribution.map((status: any, idx: number) => {
                                        const dashArray = `${status.pct} ${100 - status.pct}`;
                                        const dashOffset = -currentOffset;
                                        currentOffset += status.pct;

                                        return (
                                            <circle
                                                key={idx}
                                                cx="50"
                                                cy="50"
                                                r="40"
                                                fill="transparent"
                                                stroke={status.hex || '#e2e8f0'}
                                                strokeWidth="15"
                                                strokeDasharray={dashArray}
                                                strokeDashoffset={dashOffset}
                                                className="transition-all duration-1000"
                                            />
                                        );
                                    });
                                })()}
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                                    TOTAL
                                </span>
                                <span className="text-3xl font-black text-primary">
                                    {financialStats?.totalReservations || 0}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {statusDistribution.map((status: any, idx: number) => (
                                <div key={idx} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className={`w-3 h-3 rounded-full ${status.color}`}></span>
                                        <span className="font-semibold text-on-surface">{status.name}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="font-bold text-primary">{status.count}</span>
                                        <span className="text-xs font-semibold text-on-surface-variant w-8 text-right">
                                            ({status.pct})
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Top 5 Items Grid (Bar Charts) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Top 5 Kacamata */}
                <div className="bg-surface rounded-3xl border border-outline-variant p-6 lg:p-8 card-shadow flex flex-col">
                    <h3 className="text-lg font-bold text-primary mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined">analytics</span>
                        Top 5 Kacamata (Produk)
                    </h3>
                    <div className="space-y-5 flex-1">
                        {topProducts.map((item: any, idx: number) => {
                            const maxQty = Math.max(...topProducts.map((p: any) => p.total_qty), 1);
                            const pct = (item.total_qty / maxQty) * 100;
                            return (
                                <div key={idx} className="flex flex-col gap-1.5">
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-sm text-on-surface line-clamp-1">{item.item_name}</span>
                                        <span className="font-black text-sm text-primary">{item.total_qty} <span className="text-[10px] font-bold uppercase text-on-surface-variant">pcs</span></span>
                                    </div>
                                    <div className="w-full bg-surface-variant/50 rounded-full h-3 overflow-hidden relative border border-outline-variant/30">
                                        <div 
                                            className="h-full bg-gradient-to-r from-indigo-500/80 to-indigo-500 rounded-full transition-all duration-1000"
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                    <p className="text-[10px] font-bold text-emerald-600 text-right">{formatRupiah(item.total_revenue)}</p>
                                </div>
                            );
                        })}
                        {topProducts.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-on-surface-variant/60">
                                <span className="material-symbols-outlined text-[40px] mb-2">inventory_2</span>
                                <p className="text-sm font-semibold">Belum ada data penjualan kacamata</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Top 5 Layanan */}
                <div className="bg-surface rounded-3xl border border-outline-variant p-6 lg:p-8 card-shadow flex flex-col">
                    <h3 className="text-lg font-bold text-primary mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined">analytics</span>
                        Top 5 Layanan Spesialis
                    </h3>
                    <div className="space-y-5 flex-1">
                        {topServices.map((item: any, idx: number) => {
                            const maxQty = Math.max(...topServices.map((p: any) => p.total_qty), 1);
                            const pct = (item.total_qty / maxQty) * 100;
                            return (
                                <div key={idx} className="flex flex-col gap-1.5">
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-sm text-on-surface line-clamp-1">{item.item_name}</span>
                                        <span className="font-black text-sm text-primary">{item.total_qty} <span className="text-[10px] font-bold uppercase text-on-surface-variant">kali</span></span>
                                    </div>
                                    <div className="w-full bg-surface-variant/50 rounded-full h-3 overflow-hidden relative border border-outline-variant/30">
                                        <div 
                                            className="h-full bg-gradient-to-r from-emerald-500/80 to-emerald-500 rounded-full transition-all duration-1000"
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                    <p className="text-[10px] font-bold text-emerald-600 text-right">{formatRupiah(item.total_revenue)}</p>
                                </div>
                            );
                        })}
                        {topServices.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-on-surface-variant/60">
                                <span className="material-symbols-outlined text-[40px] mb-2">health_and_safety</span>
                                <p className="text-sm font-semibold">Belum ada data penjualan layanan</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Actions / Recent Activity Preview */}
            <div className="bg-surface rounded-3xl border border-outline-variant p-6 lg:p-8 card-shadow">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-primary">Reservasi &amp; Transaksi Terbaru</h3>
                        <p className="text-sm text-on-surface-variant">Daftar pemeriksaan mata dan pesanan frame terbaru</p>
                    </div>
                    <button className="px-4 py-2 rounded-xl bg-primary/10 text-primary text-sm font-bold hover:bg-primary hover:text-on-primary transition-all cursor-pointer">
                        Lihat Semua
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-outline-variant text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                                <th className="py-3.5 px-4">Invoice / Res.</th>
                                <th className="py-3.5 px-4">Pasien / Pelanggan</th>
                                <th className="py-3.5 px-4">Affiliator</th>
                                <th className="py-3.5 px-4">Tanggal</th>
                                <th className="py-3.5 px-4">Total</th>
                                <th className="py-3.5 px-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/60 text-sm">
                            {recentTransactions.map((trx: any, idx: number) => (
                                <tr key={idx} className="hover:bg-tertiary/20 transition-colors">
                                    <td className="py-4 px-4 font-bold text-primary">{trx.invoice_number}</td>
                                    <td className="py-4 px-4 font-semibold text-on-surface">
                                        {trx.walkin_name || trx.customer?.full_name || 'Walk-in'}
                                    </td>
                                     <td className="py-4 px-4">
                                        {trx.affiliate ? (
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-primary">{trx.affiliate.user?.full_name}</span>
                                                <span className="text-[10px] font-mono text-on-surface-variant">{trx.affiliate.referral_code}</span>
                                            </div>
                                        ) : (
                                            <span className="text-on-surface-variant">-</span>
                                        )}
                                    </td>
                                    <td className="py-4 px-4 text-on-surface-variant">
                                        {new Date(trx.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </td>
                                    <td className="py-4 px-4 font-bold text-primary">{formatRupiah(Number(trx.grand_total))}</td>
                                    <td className="py-4 px-4">
                                        <span className={`px-3 py-1 rounded-full font-bold text-xs border ${
                                            trx.status === 'completed' 
                                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                                            : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                        }`}>
                                            {trx.status === 'completed' ? 'Selesai' : trx.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {recentTransactions.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center text-on-surface-variant">Belum ada transaksi terbaru</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Affiliator Commission List */}
            <div className="bg-surface rounded-3xl border border-outline-variant p-6 lg:p-8 card-shadow mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                        <span className="material-symbols-outlined">group</span>
                        Pendapatan Komisi Affiliator
                    </h3>
                    <span className="text-xs text-on-surface-variant font-semibold">{affiliatorCommissions.length} transaksi referral</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[750px]">
                        <thead>
                            <tr className="border-b-2 border-outline-variant">
                                <th className="py-3 px-4 text-xs font-bold text-on-surface uppercase tracking-wider">Tanggal</th>
                                <th className="py-3 px-4 text-xs font-bold text-on-surface uppercase tracking-wider">Invoice</th>
                                <th className="py-3 px-4 text-xs font-bold text-on-surface uppercase tracking-wider">Affiliator</th>
                                <th className="py-3 px-4 text-xs font-bold text-on-surface uppercase tracking-wider">Pasien</th>
                                <th className="py-3 px-4 text-xs font-bold text-on-surface uppercase tracking-wider">Cabang</th>
                                <th className="py-3 px-4 text-xs font-bold text-on-surface uppercase tracking-wider text-right">Nilai Transaksi</th>
                                <th className="py-3 px-4 text-xs font-bold text-on-surface uppercase tracking-wider text-right">Komisi</th>
                                <th className="py-3 px-4 text-xs font-bold text-on-surface uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {affiliatorCommissions.length > 0 ? (
                                affiliatorCommissions.map((row: any) => (
                                    <tr key={row.id} className="border-b border-outline-variant/30 hover:bg-surface-variant/30 transition-colors">
                                        <td className="py-3.5 px-4 text-sm text-on-surface-variant whitespace-nowrap">{row.date}</td>
                                        <td className="py-3.5 px-4 text-sm font-mono font-bold text-primary whitespace-nowrap">{row.invoice}</td>
                                        <td className="py-3.5 px-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-sm text-on-surface">{row.affiliate_name}</span>
                                                <span className="text-[10px] font-mono text-on-surface-variant bg-surface-variant/50 px-1.5 py-0.5 rounded w-fit">{row.referral_code}</span>
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-4 text-sm font-semibold text-on-surface">{row.customer}</td>
                                        <td className="py-3.5 px-4 text-sm text-on-surface-variant">{row.branch}</td>
                                        <td className="py-3.5 px-4 text-sm font-bold text-on-surface text-right whitespace-nowrap">{formatRupiah(row.grand_total)}</td>
                                        <td className="py-3.5 px-4 text-sm font-black text-emerald-600 text-right whitespace-nowrap">{formatRupiah(row.commission)}</td>
                                        <td className="py-3.5 px-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                                row.status === 'Menunggu'
                                                    ? 'bg-amber-400/10 text-amber-600 border border-amber-400/30'
                                                    : 'bg-gray-400/10 text-gray-500 border border-gray-400/30'
                                            }`}>
                                                {row.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={8} className="py-12 text-center text-on-surface-variant text-sm font-medium">
                                        <span className="material-symbols-outlined text-[40px] block mb-2 text-on-surface-variant/30">group_off</span>
                                        Belum ada transaksi dari referral affiliator pada periode ini.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
