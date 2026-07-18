import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';

export default function AffiliateHistoryIndex({
    sales,
    affiliates = [],
    startDate,
    endDate,
    selectedAffiliate,
    search,
    summary,
    topAffiliates = [],
    isAffiliator = false,
}: {
    sales: any;
    affiliates: any[];
    startDate: string;
    endDate: string;
    selectedAffiliate: string | number;
    search: string;
    summary: any;
    topAffiliates: any[];
    isAffiliator?: boolean;
}) {
    const [selectedSale, setSelectedSale] = useState<any>(null);

    const formatRupiah = (val: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val || 0);

    const handleFilter = (params: Record<string, string>) => {
        router.get(route('riwayat.affiliate'), {
            start_date: startDate,
            end_date: endDate,
            affiliate_id: String(selectedAffiliate),
            search,
            ...params,
        }, { preserveState: true });
    };

    const handleStatusChange = (saleId: number, newStatus: string) => {
        router.post(route('riwayat.affiliate.status', saleId), {
            commission_status: newStatus
        }, { preserveScroll: true, preserveState: true });
    };

    const statusStyle: Record<string, string> = {
        'Menunggu Pembayaran': 'bg-amber-400/10 text-amber-600 border-amber-400/30',
        'Pending':             'bg-amber-400/10 text-amber-600 border-amber-400/30',
        'Lunas':               'bg-emerald-500/10 text-emerald-600 border-emerald-500/30',
        'Ditahan':             'bg-red-500/10 text-red-600 border-red-500/30',
        'Tanpa Komisi':        'bg-gray-400/10 text-gray-500 border-gray-400/30',
    };

    return (
        <AdminLayout title="Riwayat Komisi Affiliate">
            <Head title="Riwayat Komisi Affiliate" />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <p className="text-[11px] font-bold tracking-widest text-secondary uppercase mb-1">AFFILIATE</p>
                    <h1 className="text-3xl font-extrabold text-primary tracking-tight">Riwayat Komisi</h1>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
                <div className="bg-surface rounded-2xl border border-outline-variant p-5 card-shadow">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-3">
                        <span className="material-symbols-outlined text-[20px]">payments</span>
                    </div>
                    <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Total Komisi</p>
                    <h3 className="text-2xl font-extrabold text-emerald-600">{formatRupiah(summary?.totalCommission)}</h3>
                    <p className="text-xs text-on-surface-variant mt-1">Periode yang dipilih</p>
                </div>
                <div className="bg-surface rounded-2xl border border-outline-variant p-5 card-shadow">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                        <span className="material-symbols-outlined text-[20px]">receipt_long</span>
                    </div>
                    <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Nilai Transaksi Referral</p>
                    <h3 className="text-2xl font-extrabold text-primary">{formatRupiah(summary?.totalRevenue)}</h3>
                    <p className="text-xs text-on-surface-variant mt-1">Semua transaksi via kode referral</p>
                </div>
                <div className="bg-surface rounded-2xl border border-outline-variant p-5 card-shadow">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-3">
                        <span className="material-symbols-outlined text-[20px]">group</span>
                    </div>
                    <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Total Transaksi</p>
                    <h3 className="text-2xl font-extrabold text-primary">{summary?.totalCount || 0}</h3>
                    <p className="text-xs text-on-surface-variant mt-1">Transaksi selesai via referral</p>
                </div>
            </div>

            {/* Top Affiliators (Hanya untuk Admin) */}
            {!isAffiliator && topAffiliates.length > 0 && (
                <div className="bg-surface rounded-3xl border border-outline-variant p-6 lg:p-8 card-shadow mb-8">
                    <h3 className="text-lg font-bold text-primary mb-5 flex items-center gap-2">
                        <span className="material-symbols-outlined">emoji_events</span>
                        Top Affiliator Periode Ini
                    </h3>
                    <div className="space-y-4">
                        {topAffiliates.map((aff: any, idx: number) => {
                            const maxComm = topAffiliates[0]?.commission || 1;
                            const pct = (aff.commission / maxComm) * 100;
                            return (
                                <div key={idx} className="flex items-center gap-4">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shrink-0 ${idx === 0 ? 'bg-amber-400 text-white' : idx === 1 ? 'bg-gray-400 text-white' : idx === 2 ? 'bg-amber-700 text-white' : 'bg-surface-variant text-on-surface-variant'}`}>
                                        {idx + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <div>
                                                <span className="font-bold text-sm text-on-surface">{aff.name}</span>
                                                <span className="ml-2 text-[10px] font-mono text-on-surface-variant bg-surface-variant/60 px-1.5 py-0.5 rounded">{aff.referral_code}</span>
                                            </div>
                                            <div className="text-right shrink-0 ml-4">
                                                <span className="font-black text-sm text-emerald-600">{formatRupiah(aff.commission)}</span>
                                                <span className="text-[10px] text-on-surface-variant ml-2">({aff.total_sales} transaksi)</span>
                                            </div>
                                        </div>
                                        <div className="w-full bg-surface-variant/50 rounded-full h-2 border border-outline-variant/30">
                                            <div className="h-full bg-gradient-to-r from-emerald-500/70 to-emerald-500 rounded-full transition-all duration-1000" style={{ width: `${pct}%` }} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Table with Filters */}
            <div className="bg-surface rounded-3xl border border-outline-variant p-6 lg:p-8 card-shadow">
                {/* Filter Bar */}
                <div className="flex flex-wrap items-center gap-3 mb-6">
                    {/* Search */}
                    <div className="flex items-center gap-2 bg-surface-variant/40 border border-outline-variant px-3 py-2 rounded-xl flex-1 min-w-[200px]">
                        <span className="material-symbols-outlined text-[16px] text-on-surface-variant">search</span>
                        <input
                            type="text"
                            placeholder="Cari invoice, kode referral, pasien..."
                            defaultValue={search}
                            onKeyDown={(e) => e.key === 'Enter' && handleFilter({ search: (e.target as HTMLInputElement).value })}
                            onBlur={(e) => handleFilter({ search: e.target.value })}
                            className="bg-transparent text-sm text-on-surface focus:outline-none w-full placeholder:text-on-surface-variant/50"
                        />
                    </div>

                    {/* Date Range */}
                    <div className="flex items-center gap-2 bg-surface border border-outline-variant px-3 py-2 rounded-xl shadow-xs hover:border-primary/40 transition-colors">
                        <span className="material-symbols-outlined text-[18px] text-primary">calendar_today</span>
                        <input
                            type="date"
                            defaultValue={startDate}
                            onBlur={(e) => handleFilter({ start_date: e.target.value })}
                            className="bg-transparent text-sm font-bold text-on-surface focus:outline-none cursor-pointer"
                        />
                        <span className="text-on-surface-variant">—</span>
                        <input
                            type="date"
                            defaultValue={endDate}
                            onBlur={(e) => handleFilter({ end_date: e.target.value })}
                            className="bg-transparent text-sm font-bold text-on-surface focus:outline-none cursor-pointer"
                        />
                    </div>

                    {/* Affiliate Filter (Hanya untuk Admin) */}
                    {!isAffiliator && (
                        <div className="flex items-center gap-2 bg-surface border border-outline-variant px-3 py-2 rounded-xl shadow-xs hover:border-primary/40 transition-colors">
                            <span className="material-symbols-outlined text-[18px] text-primary">person</span>
                            <select
                                value={String(selectedAffiliate)}
                                onChange={(e) => handleFilter({ affiliate_id: e.target.value })}
                                className="bg-transparent text-sm font-bold text-on-surface focus:outline-none cursor-pointer"
                            >
                                <option value="all">Semua Affiliator</option>
                                {affiliates.map((a: any) => (
                                    <option key={a.id} value={a.id}>{a.user?.name ?? a.referral_code} ({a.referral_code})</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[800px]">
                        <thead>
                            <tr className="border-b-2 border-outline-variant">
                                <th className="py-3 px-4 text-xs font-bold text-on-surface uppercase tracking-wider">Tanggal</th>
                                <th className="py-3 px-4 text-xs font-bold text-on-surface uppercase tracking-wider">Invoice</th>
                                <th className="py-3 px-4 text-xs font-bold text-on-surface uppercase tracking-wider">Affiliator</th>
                                <th className="py-3 px-4 text-xs font-bold text-on-surface uppercase tracking-wider">Pasien</th>
                                <th className="py-3 px-4 text-xs font-bold text-on-surface uppercase tracking-wider">Cabang</th>
                                <th className="py-3 px-4 text-xs font-bold text-on-surface uppercase tracking-wider">Item</th>
                                <th className="py-3 px-4 text-xs font-bold text-on-surface uppercase tracking-wider text-right">Nilai Transaksi</th>
                                <th className="py-3 px-4 text-xs font-bold text-on-surface uppercase tracking-wider text-right">Komisi</th>
                                <th className="py-3 px-4 text-xs font-bold text-on-surface uppercase tracking-wider">Status</th>
                                {!isAffiliator && <th className="py-3 px-4 text-xs font-bold text-on-surface uppercase tracking-wider text-center">Aksi</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {sales?.data?.length > 0 ? (
                                sales.data.map((row: any) => (
                                    <tr key={row.id} className="border-b border-outline-variant/30 hover:bg-surface-variant/30 transition-colors">
                                        <td className="py-3.5 px-4 text-sm text-on-surface-variant whitespace-nowrap">{row.date}</td>
                                        <td className="py-3.5 px-4 text-sm font-mono font-bold text-primary whitespace-nowrap">{row.invoice}</td>
                                        <td className="py-3.5 px-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-sm text-on-surface">{row.affiliate_name}</span>
                                                <span className="text-[10px] font-mono text-on-surface-variant bg-surface-variant/60 px-1.5 py-0.5 rounded w-fit">{row.referral_code}</span>
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-4 text-sm font-semibold text-on-surface">{row.customer}</td>
                                        <td className="py-3.5 px-4 text-sm text-on-surface-variant">{row.branch}</td>
                                        <td className="py-3.5 px-4 text-xs text-on-surface-variant max-w-[180px] truncate" title={row.items_summary}>{row.items_summary || '-'}</td>
                                        <td className="py-3.5 px-4 text-sm font-bold text-on-surface text-right whitespace-nowrap">{formatRupiah(row.grand_total)}</td>
                                        <td className="py-3.5 px-4 text-sm font-black text-emerald-600 text-right whitespace-nowrap">{formatRupiah(row.commission)}</td>
                                        <td className="py-3.5 px-4">
                                            {!isAffiliator && row.status !== 'Tanpa Komisi' ? (
                                                <select
                                                    value={row.raw_status || 'pending'}
                                                    onChange={(e) => handleStatusChange(row.id, e.target.value)}
                                                    className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border cursor-pointer outline-none appearance-none pr-6 bg-no-repeat bg-right ${statusStyle[row.status]}`}
                                                    style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23666%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundSize: '8px auto', backgroundPosition: 'calc(100% - 6px) center' }}
                                                >
                                                    <option value="pending" className="bg-surface text-on-surface">PENDING</option>
                                                    <option value="paid" className="bg-surface text-on-surface">LUNAS</option>
                                                    <option value="held" className="bg-surface text-on-surface">DITAHAN</option>
                                                </select>
                                            ) : (
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${statusStyle[row.status] || 'bg-gray-100 text-gray-500 border-gray-300'}`}>
                                                    {row.status}
                                                </span>
                                            )}
                                        </td>
                                        {!isAffiliator && (
                                            <td className="py-3.5 px-4 text-center">
                                                <button
                                                    onClick={() => setSelectedSale(row)}
                                                    title="Lihat Info Pembayaran"
                                                    className="w-8 h-8 flex items-center justify-center rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-on-primary transition-colors mx-auto"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">visibility</span>
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={9} className="py-16 text-center text-on-surface-variant">
                                        <span className="material-symbols-outlined text-[48px] block mb-3 opacity-20">receipt_long</span>
                                        <p className="text-sm font-semibold">Tidak ada transaksi referral ditemukan</p>
                                        <p className="text-xs mt-1 opacity-60">Coba ubah filter tanggal atau pilih affiliator yang lain</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {(sales?.last_page || 1) > 1 && (
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-outline-variant">
                        <span className="text-xs text-on-surface-variant">
                            Menampilkan <strong>{sales.from}</strong>–<strong>{sales.to}</strong> dari <strong>{sales.total}</strong> transaksi
                        </span>
                        <div className="flex items-center gap-1.5">
                            {sales.links?.map((link: any, idx: number) => (
                                <button
                                    key={idx}
                                    disabled={!link.url}
                                    onClick={() => link.url && router.get(link.url)}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                        link.active
                                            ? 'bg-primary text-on-primary shadow-sm'
                                            : link.url
                                            ? 'bg-surface-variant text-on-surface hover:bg-primary/10'
                                            : 'bg-surface-variant/30 text-on-surface-variant/40 cursor-not-allowed'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Modal Informasi Affiliator */}
            {selectedSale && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedSale(null)}></div>
                    <div className="relative w-full max-w-md bg-surface rounded-3xl shadow-2xl overflow-hidden border border-outline-variant animate-in fade-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="bg-primary/5 px-6 py-5 border-b border-outline-variant flex items-center justify-between">
                            <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                                <span className="material-symbols-outlined">account_balance</span>
                                Informasi Pembayaran
                            </h3>
                            <button
                                onClick={() => setSelectedSale(null)}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-surface text-on-surface-variant hover:bg-red-500/10 hover:text-red-500 transition-colors shadow-sm"
                            >
                                <span className="material-symbols-outlined text-[20px]">close</span>
                            </button>
                        </div>
                        
                        {/* Modal Body */}
                        <div className="p-6">
                            <div className="mb-6 pb-6 border-b border-outline-variant/50">
                                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Data Affiliator</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-lg">
                                        {selectedSale.affiliate_name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-bold text-on-surface">{selectedSale.affiliate_name}</p>
                                        <p className="text-xs font-mono text-on-surface-variant bg-surface-variant/50 px-1.5 py-0.5 rounded w-fit mt-1">{selectedSale.referral_code}</p>
                                    </div>
                                </div>
                            </div>

                            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">Informasi Rekening Bank</p>
                            
                            {selectedSale.affiliate_bank ? (
                                <div className="space-y-4">
                                    <div className="bg-surface-variant/30 rounded-xl p-4 border border-outline-variant/50">
                                        <p className="text-[11px] text-on-surface-variant uppercase mb-1">Nama Bank</p>
                                        <p className="font-bold text-primary text-base">{selectedSale.affiliate_bank.bank_name || '-'}</p>
                                    </div>
                                    <div className="bg-surface-variant/30 rounded-xl p-4 border border-outline-variant/50">
                                        <p className="text-[11px] text-on-surface-variant uppercase mb-1">Nomor Rekening</p>
                                        <div className="flex items-center justify-between">
                                            <p className="font-mono font-bold text-on-surface text-lg">{selectedSale.affiliate_bank.account_number || '-'}</p>
                                            <button 
                                                onClick={() => {
                                                    navigator.clipboard.writeText(selectedSale.affiliate_bank.account_number || '');
                                                    alert('Nomor rekening disalin!');
                                                }}
                                                className="text-primary hover:text-primary/70 text-xs font-bold flex items-center gap-1 bg-primary/10 px-2 py-1 rounded"
                                            >
                                                <span className="material-symbols-outlined text-[14px]">content_copy</span> Salin
                                            </button>
                                        </div>
                                    </div>
                                    <div className="bg-surface-variant/30 rounded-xl p-4 border border-outline-variant/50">
                                        <p className="text-[11px] text-on-surface-variant uppercase mb-1">Nama Pemilik Rekening</p>
                                        <p className="font-bold text-on-surface text-base">{selectedSale.affiliate_bank.account_name || '-'}</p>
                                    </div>
                                    <div className="bg-surface-variant/30 rounded-xl p-4 border border-outline-variant/50">
                                        <p className="text-[11px] text-on-surface-variant uppercase mb-1">Nomor WhatsApp / HP</p>
                                        <p className="font-bold text-on-surface text-base">{selectedSale.affiliate_bank.phone || '-'}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-6 bg-surface-variant/20 rounded-xl border border-outline-variant/50">
                                    <span className="material-symbols-outlined text-[40px] text-on-surface-variant/40 mb-2">account_balance_wallet</span>
                                    <p className="text-sm font-semibold text-on-surface-variant">Data rekening belum diisi</p>
                                    <p className="text-xs text-on-surface-variant mt-1 opacity-70">Affiliator ini belum melengkapi profil pembayaran.</p>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 border-t border-outline-variant bg-surface-variant/30 flex justify-end">
                            <button
                                onClick={() => setSelectedSale(null)}
                                className="px-5 py-2.5 rounded-xl font-bold text-sm bg-primary text-on-primary hover:bg-primary/90 transition-colors shadow-md"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
