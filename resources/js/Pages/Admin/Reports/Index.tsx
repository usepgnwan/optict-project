import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import PageHeader from '@/Components/Admin/PageHeader';

export default function ReportsIndex() {
    const reportCards = [
        {
            title: 'Laporan Posisi Stok Lengkap',
            description: 'Lihat seluruh saldo stok produk di Gudang Pusat dan setiap Cabang Optik secara terpusat.',
            href: route('reports.stock'),
            icon: 'inventory',
            color: 'bg-primary/10 text-primary',
        },
        {
            title: 'Laporan Jejak Mutasi (Stock Ledger / Movement)',
            description: 'Audit log mutasi masuk & keluar yang tidak dapat diubah (immutable trail) dari transfer, adjustment, dan opname.',
            href: route('reports.movements'),
            icon: 'swap_horiz',
            color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
        },
        {
            title: 'Laporan Riwayat Transfer Stok',
            description: 'Laporan lengkap seluruh pengiriman barang antar cabang dan gudang pusat beserta status terkininya.',
            href: route('reports.transfers'),
            icon: 'local_shipping',
            color: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
        },
        {
            title: 'Laporan Penyesuaian & Selisih Stok',
            description: 'Rekap penyesuaian stok akibat kehilangan, kerusakan barang, dan selisih stock opname.',
            href: route('reports.adjustments'),
            icon: 'tune',
            color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
        },
    ];

    return (
        <AdminLayout>
            <Head title="Pusat Laporan & Analitik - Harmoni by Phoeinx Sehat" />

            <PageHeader
                title="Pusat Laporan & Analitik Stok"
                subtitle="Dapatkan wawasan menyeluruh mengenai sirkulasi, ketersediaan, dan mutasi inventori optik"
                icon="analytics"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reportCards.map((card, index) => (
                    <Link
                        key={index}
                        href={card.href}
                        className="p-6 rounded-2xl bg-surface border border-outline-variant/60 shadow-2xs hover:shadow-md hover:border-primary/50 transition-all group flex flex-col justify-between"
                    >
                        <div>
                            <div className="flex items-center gap-4 mb-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${card.color}`}>
                                    <span className="material-symbols-outlined text-[26px]">{card.icon}</span>
                                </div>
                                <h3 className="text-lg font-bold text-on-surface group-hover:text-primary transition-colors">
                                    {card.title}
                                </h3>
                            </div>

                            <p className="text-sm text-on-surface-variant leading-relaxed">
                                {card.description}
                            </p>
                        </div>

                        <div className="mt-6 pt-4 border-t border-outline-variant/40 flex items-center justify-between text-xs font-bold text-primary">
                            <span>Buka Laporan</span>
                            <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                                arrow_forward
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </AdminLayout>
    );
}
