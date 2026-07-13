import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { CountUp, ScrollCard } from '@/Components/ReactBits';

export default function Dashboard() {
    const [selectedPeriod] = useState('01 Jul 2026 - 31 Jul 2026');

    // Monthly chart data
    const chartData = [
        { month: 'Mei 26', value: 110, label: 'Rp 110.0Jt' },
        { month: 'Jun 26', value: 235, label: 'Rp 235.9Jt' },
        { month: 'Jul 26', value: 53.3, label: 'Rp 53.3Jt' },
    ];

    // Status distribution
    const statusDistribution = [
        { name: 'Pending', count: 1, pct: '0%', color: 'bg-amber-400', hex: '#FBBF24' },
        { name: 'Proses Fitting / Kirim', count: 89, pct: '4%', color: 'bg-blue-500', hex: '#3B82F6' },
        { name: 'Selesai / Invoice', count: 2033, pct: '96%', color: 'bg-emerald-500', hex: '#10B981' },
    ];

    return (
        <AdminLayout title="Dashboard | Harmoni by Phoenix Sehat">
            <Head title="Dashboard | Harmoni by Phoenix Sehat" />

            {/* Top Page Title & Filter Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <p className="text-[11px] font-bold tracking-widest text-secondary uppercase mb-1">
                        ADMIN PANEL
                    </p>
                    <h1 className="text-3xl font-extrabold text-primary tracking-tight">
                        Dashboard
                    </h1>
                </div>

                <div className="flex items-center gap-3">
                    <button className="inline-flex items-center gap-2.5 px-4 py-2.5 bg-surface border border-outline-variant rounded-xl shadow-xs text-sm font-semibold text-primary hover:border-primary/40 transition-all cursor-pointer">
                        <span className="material-symbols-outlined text-[18px] text-secondary">
                            calendar_month
                        </span>
                        <span>{selectedPeriod}</span>
                        <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
                            calendar_today
                        </span>
                    </button>
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
                            Rp 399.2Jt
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
                            KOMISI DOKTER / TIM
                        </p>
                    </div>
                    <div>
                        <h3 className="text-2xl font-extrabold text-primary tracking-tight mb-1">
                            Rp 318.7Jt
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
                            Rp 80.5Jt
                        </h3>
                        <p className="text-xs text-on-surface-variant">
                            pendapatan - komisi tim
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
                            Rp 53.3Jt
                        </h3>
                        <p className="text-xs text-on-surface-variant">
                            Juli 2026
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
                            <CountUp end={1933} duration={2} />
                        </h3>
                        <p className="text-xs text-on-surface-variant">
                            91% dari 2.123 reservasi
                        </p>
                    </div>
                </ScrollCard>
            </div>

            {/* Charts Grid: Left 70% Revenue Chart, Right 30% Status Distribution Donut */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Left: Monthly Revenue Chart */}
                <div className="lg:col-span-2 bg-surface rounded-3xl border border-outline-variant p-6 lg:p-8 card-shadow flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                                GRAFIK PENDAPATAN
                            </p>
                            <h3 className="text-xl font-bold text-primary">
                                Pendapatan Per Bulan
                            </h3>
                        </div>
                        <span className="px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 font-bold text-xs uppercase tracking-wider border border-emerald-500/20">
                            STATUS SELESAI
                        </span>
                    </div>

                    {/* SVG Chart representation */}
                    <div className="flex-1 min-h-[280px] flex flex-col justify-end pt-4">
                        {/* Y-Axis Gridlines */}
                        <div className="relative h-60 flex flex-col justify-between border-b border-outline-variant pb-2">
                            <div className="absolute top-0 w-full border-t border-dashed border-outline-variant/60 flex items-center">
                                <span className="text-[11px] text-on-surface-variant -mt-5">Rp 280.0Jt</span>
                            </div>
                            <div className="absolute top-1/3 w-full border-t border-dashed border-outline-variant/60 flex items-center">
                                <span className="text-[11px] text-on-surface-variant -mt-5">Rp 210.0Jt</span>
                            </div>
                            <div className="absolute top-2/3 w-full border-t border-dashed border-outline-variant/60 flex items-center">
                                <span className="text-[11px] text-on-surface-variant -mt-5">Rp 140.0Jt</span>
                            </div>

                            {/* Bar Columns */}
                            <div className="h-full flex items-end justify-around relative z-10 px-8">
                                {chartData.map((item, index) => {
                                    const heightPct = Math.min((item.value / 280) * 100, 100);
                                    return (
                                        <div key={item.month} className="flex flex-col items-center group w-16">
                                            {/* Tooltip on hover */}
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity mb-2 px-2.5 py-1 bg-primary text-on-primary text-xs font-bold rounded-lg shadow-md whitespace-nowrap">
                                                {item.label}
                                            </div>
                                            {/* Bar */}
                                            <div
                                                className={`w-12 rounded-t-xl transition-all duration-700 ${
                                                    index === 1
                                                        ? 'bg-gradient-to-t from-primary/80 to-primary shadow-lg shadow-primary/20'
                                                        : 'bg-gradient-to-t from-secondary/50 to-secondary/80'
                                                } group-hover:scale-105`}
                                                style={{ height: `${heightPct}%` }}
                                            />
                                            <span className="text-xs font-semibold text-on-surface-variant mt-3">
                                                {item.month}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Distribution Status Donut Chart */}
                <div className="bg-surface rounded-3xl border border-outline-variant p-6 lg:p-8 card-shadow flex flex-col justify-between">
                    <div>
                        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                            DISTRIBUSI
                        </p>
                        <h3 className="text-xl font-bold text-primary mb-6">
                            Transaksi per Status
                        </h3>
                    </div>

                    {/* SVG Donut Chart */}
                    <div className="flex justify-center items-center relative my-4">
                        <svg className="w-52 h-52 transform -rotate-90" viewBox="0 0 120 120">
                            {/* Background circle */}
                            <circle
                                cx="60"
                                cy="60"
                                r="45"
                                fill="transparent"
                                stroke="currentColor"
                                className="text-outline-variant"
                                strokeWidth="18"
                            />
                            {/* Segment 1: Selesai (96%) */}
                            <circle
                                cx="60"
                                cy="60"
                                r="45"
                                fill="transparent"
                                stroke="#10B981"
                                strokeWidth="18"
                                strokeDasharray="282.7"
                                strokeDashoffset="28"
                                strokeLinecap="round"
                            />
                            {/* Segment 2: Proses (4%) */}
                            <circle
                                cx="60"
                                cy="60"
                                r="45"
                                fill="transparent"
                                stroke="#3B82F6"
                                strokeWidth="18"
                                strokeDasharray="282.7"
                                strokeDashoffset="265"
                                strokeLinecap="round"
                            />
                            {/* Segment 3: Pending (0.5%) */}
                            <circle
                                cx="60"
                                cy="60"
                                r="45"
                                fill="transparent"
                                stroke="#FBBF24"
                                strokeWidth="18"
                                strokeDasharray="282.7"
                                strokeDashoffset="278"
                                strokeLinecap="round"
                            />
                        </svg>

                        {/* Center donut text */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                                TOTAL
                            </span>
                            <span className="text-2xl font-extrabold text-primary">
                                2.123
                            </span>
                        </div>
                    </div>

                    {/* Legend Table */}
                    <div className="space-y-3 pt-4 border-t border-outline-variant">
                        {statusDistribution.map((item) => (
                            <div key={item.name} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2.5">
                                    <span className={`w-3 h-3 rounded-full ${item.color}`} />
                                    <span className="font-medium text-on-surface">{item.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-primary">{item.count}</span>
                                    <span className="text-xs text-on-surface-variant font-medium">({item.pct})</span>
                                </div>
                            </div>
                        ))}
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
                                <th className="py-3.5 px-4">ID Reservasi</th>
                                <th className="py-3.5 px-4">Pasien / Pelanggan</th>
                                <th className="py-3.5 px-4">Layanan</th>
                                <th className="py-3.5 px-4">Tanggal</th>
                                <th className="py-3.5 px-4">Total</th>
                                <th className="py-3.5 px-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/60 text-sm">
                            <tr className="hover:bg-tertiary/20 transition-colors">
                                <td className="py-4 px-4 font-bold text-primary">#OP-9382</td>
                                <td className="py-4 px-4 font-semibold text-on-surface">Bapak Hendra Kusuma</td>
                                <td className="py-4 px-4 text-on-surface-variant">Pemeriksaan Refraksi &amp; Frame Titanium</td>
                                <td className="py-4 px-4 text-on-surface-variant">09 Jul 2026</td>
                                <td className="py-4 px-4 font-bold text-primary">Rp 1.450.000</td>
                                <td className="py-4 px-4">
                                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 font-bold text-xs border border-emerald-500/20">
                                        Selesai
                                    </span>
                                </td>
                            </tr>
                            <tr className="hover:bg-tertiary/20 transition-colors">
                                <td className="py-4 px-4 font-bold text-primary">#OP-9381</td>
                                <td className="py-4 px-4 font-semibold text-on-surface">Ibu Clara Wijaya</td>
                                <td className="py-4 px-4 text-on-surface-variant">Home Service Exclusive (Lensa Progresif)</td>
                                <td className="py-4 px-4 text-on-surface-variant">09 Jul 2026</td>
                                <td className="py-4 px-4 font-bold text-primary">Rp 2.150.000</td>
                                <td className="py-4 px-4">
                                    <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 font-bold text-xs border border-blue-500/20">
                                        Proses Fitting
                                    </span>
                                </td>
                            </tr>
                            <tr className="hover:bg-tertiary/20 transition-colors">
                                <td className="py-4 px-4 font-bold text-primary">#OP-9380</td>
                                <td className="py-4 px-4 font-semibold text-on-surface">Dina Permata</td>
                                <td className="py-4 px-4 text-on-surface-variant">Konsultasi Lensa Spesialis Bluechromic</td>
                                <td className="py-4 px-4 text-on-surface-variant">08 Jul 2026</td>
                                <td className="py-4 px-4 font-bold text-primary">Rp 980.000</td>
                                <td className="py-4 px-4">
                                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 font-bold text-xs border border-emerald-500/20">
                                        Selesai
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
