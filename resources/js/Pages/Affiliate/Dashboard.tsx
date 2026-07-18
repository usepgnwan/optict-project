import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { usePage, router, Head } from '@inertiajs/react';
import PageHeader from '@/Components/Admin/PageHeader';

export default function AffiliateDashboard({
    affiliate,
    sales,
    startDate,
    endDate,
    affiliateStats,
    marketingKits = [],
}: {
    affiliate: any;
    sales: any;
    startDate: string;
    endDate: string;
    affiliateStats: any;
    marketingKits?: any[];
}) {
    const { auth } = usePage<any>().props;
    const user = auth.user;

    const copyToClipboard = (text: string, type: string) => {
        navigator.clipboard.writeText(text);
        alert(`${type} berhasil disalin!`);
    };

    const formatRupiah = (val: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val || 0);

    const handleFilter = (start: string, end: string) => {
        router.get(route('dashboard'), { start_date: start, end_date: end }, { preserveState: true });
    };

    const statusColor: Record<string, string> = {
        'Menunggu Pembayaran': 'bg-amber-400/10 text-amber-600 border border-amber-400/30',
        'Lunas': 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/30',
        'Tanpa Komisi': 'bg-gray-400/10 text-gray-500 border border-gray-400/30',
    };

    return (
        <AdminLayout title="Dashboard Affiliate">
            <Head title="Dashboard Affiliate" />
            <PageHeader
                title={`Selamat Datang, ${user.name}`}
                subtitle="Berikut adalah pantauan performa referral dan saldo kemitraan Anda bulan ini."
                icon="waving_hand"
            />

            {/* Metrics Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                <div className="bg-surface border border-outline-variant p-6 rounded-2xl shadow-sm">
                    <small className="text-xs text-on-surface-variant uppercase font-bold tracking-wider">Komisi Siap Cair</small>
                    <div className="text-3xl font-black text-emerald-600 my-2">Rp {Number(affiliate?.balance || 0).toLocaleString('id-ID')}</div>
                    <div className="text-xs text-on-surface-variant font-medium">Akan ditransfer pada tanggal 28.</div>
                </div>
                <div className="bg-surface border border-outline-variant p-6 rounded-2xl shadow-sm">
                    <small className="text-xs text-on-surface-variant uppercase font-bold tracking-wider">Komisi Tertahan (Hold)</small>
                    <div className="text-3xl font-black text-amber-500 my-2">Rp 0</div>
                    <div className="text-xs text-on-surface-variant font-medium">Dalam masa penyesuaian/garansi 7 hari.</div>
                </div>
                <div className="bg-surface border border-outline-variant p-6 rounded-2xl shadow-sm">
                    <small className="text-xs text-on-surface-variant uppercase font-bold tracking-wider">Total Klik Link</small>
                    <div className="text-3xl font-black text-primary my-2">{affiliateStats?.totalClicks || 0} Klik</div>
                    <div className="text-xs text-on-surface-variant font-medium">Pengunjung unik lewat link Anda.</div>
                </div>
                <div className="bg-surface border border-outline-variant p-6 rounded-2xl shadow-sm">
                    <small className="text-xs text-on-surface-variant uppercase font-bold tracking-wider">Reservasi Online</small>
                    <div className="text-3xl font-black text-secondary my-2">{affiliateStats?.totalReservations || 0} Booking</div>
                    <div className="text-xs text-on-surface-variant font-medium">Reservasi online terdaftar.</div>
                </div>
            </div>

            {/* Link Generator Panel */}
            <div className="bg-surface border border-outline-variant rounded-2xl p-6 md:p-8 mb-8 shadow-sm">
                <h2 className="text-xl text-primary mb-2 font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined">link</span>
                    Alat Promosi Personal Anda
                </h2>
                <p className="text-sm text-on-surface-variant mb-6">Gunakan tautan atau kode kupon di bawah untuk menyebarkan informasi edukasi kesehatan.</p>

                <div className="mb-6">
                    <label className="text-xs font-bold text-on-surface uppercase tracking-wider block mb-2">Tautan Afiliasi Utama (Home Service & Terapi)</label>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <input
                            type="text"
                            readOnly
                            value={`http://127.0.0.1:8000/booking?track=${affiliate?.referral_code || 'PHNX-001'}`}
                            className="flex-1 px-4 py-3 border border-outline-variant rounded-xl text-sm bg-surface-variant/30 text-on-surface font-mono outline-none"
                        />
                        <button onClick={() => copyToClipboard(`http://127.0.0.1:8000/booking?track=${affiliate?.referral_code || 'PHNX-001'}`, 'Link')} className="bg-primary text-on-primary px-6 py-3 rounded-xl font-bold text-sm cursor-pointer hover:bg-primary/90 transition-colors shrink-0 shadow-md">
                            Salin Link
                        </button>
                    </div>
                </div>

                <div>
                    <label className="text-xs font-bold text-on-surface uppercase tracking-wider block mb-2">Kode Kupon Eksklusif Anda (Potongan Pasien)</label>
                    <div className="flex flex-col sm:flex-row gap-3 md:max-w-md">
                        <input
                            type="text"
                            readOnly
                            value={affiliate?.referral_code || 'PHNX-001'}
                            className="flex-1 px-4 py-3 border border-outline-variant rounded-xl text-sm bg-primary/5 outline-none text-center font-black tracking-widest text-primary"
                        />
                        <button onClick={() => copyToClipboard(affiliate?.referral_code || 'PHNX-001', 'Kupon')} className="bg-secondary text-on-secondary px-6 py-3 rounded-xl font-bold text-sm cursor-pointer hover:bg-secondary/90 transition-colors shrink-0 shadow-md">
                            Salin Kupon
                        </button>
                    </div>
                </div>
            </div>

            {/* Marketing Kit Area */}
            <div id="marketing-kit" className="bg-surface border border-outline-variant rounded-2xl p-6 md:p-8 mb-8 shadow-sm scroll-mt-24">
                <h2 className="text-xl text-primary mb-2 font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined">campaign</span>
                    Bahan Promosi Siap Pakai (Marketing Kit)
                </h2>
                <p className="text-sm text-on-surface-variant mb-6">Materi grafis dan tulisan yang dioptimalkan untuk kebutuhan sebar informasi harian.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {marketingKits.length > 0 ? (
                        marketingKits.map((kit: any) => (
                            <div key={kit.id} className="border border-outline-variant rounded-xl overflow-hidden bg-surface flex flex-col hover:shadow-md transition-shadow">
                                {kit.image_path ? (
                                    <div className="aspect-video bg-surface-variant w-full overflow-hidden">
                                        <img src={`/storage/${kit.image_path}`} alt={kit.title} className="w-full h-full object-cover" />
                                    </div>
                                ) : (
                                    <div className="aspect-video bg-surface-variant flex items-center justify-center">
                                        <span className="material-symbols-outlined text-[40px] text-on-surface-variant/30">image</span>
                                    </div>
                                )}
                                
                                <div className="p-5 flex-1 flex flex-col">
                                    <h4 className="text-sm text-primary font-bold mb-2">{kit.title}</h4>
                                    {kit.description && (
                                        <p className="text-xs text-on-surface-variant mb-4 whitespace-pre-line flex-1">
                                            {kit.description}
                                        </p>
                                    )}
                                    
                                    <div className="flex flex-col gap-2 mt-auto">
                                        {kit.image_path && (
                                            <a 
                                                href={`/storage/${kit.image_path}`} 
                                                download 
                                                target="_blank"
                                                rel="noreferrer"
                                                className="w-full border-2 border-primary text-primary bg-transparent py-2 rounded-lg font-bold text-xs text-center hover:bg-primary hover:text-on-primary transition-colors flex items-center justify-center gap-2"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">download</span> Unduh Gambar
                                            </a>
                                        )}
                                        {kit.description && (
                                            <button 
                                                onClick={() => {
                                                    navigator.clipboard.writeText(kit.description);
                                                    alert('Teks berhasil disalin!');
                                                }}
                                                className="w-full border-2 border-primary text-primary bg-transparent py-2 rounded-lg font-bold text-xs text-center hover:bg-primary hover:text-on-primary transition-colors flex items-center justify-center gap-2"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">content_copy</span> Salin Teks
                                            </button>
                                        )}
                                        {kit.video_url && (
                                            <a 
                                                href={kit.video_url} 
                                                target="_blank" 
                                                rel="noreferrer"
                                                className="w-full bg-red-600 text-white py-2 rounded-lg font-bold text-xs text-center hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">play_circle</span> Tonton Video
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-12 text-center bg-surface-variant/20 rounded-xl border border-outline-variant/50">
                            <span className="material-symbols-outlined text-[40px] text-on-surface-variant/40 mb-3">inventory_2</span>
                            <p className="text-sm font-semibold text-on-surface-variant">Belum ada materi promosi.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Riwayat Transaksi with Filter + Pagination */}
            <div id="riwayat-komisi" className="bg-surface border border-outline-variant rounded-2xl p-6 md:p-8 shadow-sm scroll-mt-24">
                {/* Header + Filter */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <h2 className="text-xl text-primary font-bold flex items-center gap-2">
                        <span className="material-symbols-outlined">history</span>
                        Riwayat Aktivitas Transaksi
                    </h2>

                    {/* Date Filter */}
                    <div className="flex items-center gap-2 bg-surface-variant/40 border border-outline-variant px-3 py-2 rounded-xl">
                        <span className="material-symbols-outlined text-[16px] text-primary">calendar_today</span>
                        <input
                            type="date"
                            defaultValue={startDate}
                            onBlur={(e) => handleFilter(e.target.value, endDate)}
                            className="bg-transparent text-xs font-bold text-on-surface focus:outline-none cursor-pointer"
                        />
                        <span className="text-on-surface-variant text-xs">—</span>
                        <input
                            type="date"
                            defaultValue={endDate}
                            onBlur={(e) => handleFilter(startDate, e.target.value)}
                            className="bg-transparent text-xs font-bold text-on-surface focus:outline-none cursor-pointer"
                        />
                    </div>
                </div>

                {/* Summary */}
                <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-surface-variant/30 rounded-xl border border-outline-variant/50">
                    <div className="text-center">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">Total Transaksi</p>
                        <p className="text-xl font-black text-primary">{affiliateStats?.totalTransaksi || 0}</p>
                    </div>
                    <div className="text-center border-x border-outline-variant">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">Nilai Referral</p>
                        <p className="text-xl font-black text-primary">{formatRupiah(affiliateStats?.totalRevenue || 0)}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">Total Komisi</p>
                        <p className="text-xl font-black text-emerald-600">{formatRupiah(affiliateStats?.totalEarned || 0)}</p>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[700px]">
                        <thead>
                            <tr className="border-b-2 border-outline-variant">
                                <th className="py-3 px-4 text-xs font-bold text-on-surface uppercase tracking-wider">Tanggal</th>
                                <th className="py-3 px-4 text-xs font-bold text-on-surface uppercase tracking-wider">Layanan / Produk</th>
                                <th className="py-3 px-4 text-xs font-bold text-on-surface uppercase tracking-wider">Pasien</th>
                                <th className="py-3 px-4 text-xs font-bold text-on-surface uppercase tracking-wider text-right">Nilai Transaksi</th>
                                <th className="py-3 px-4 text-xs font-bold text-on-surface uppercase tracking-wider text-right">Komisi Anda</th>
                                <th className="py-3 px-4 text-xs font-bold text-on-surface uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sales?.data?.length > 0 ? (
                                sales.data.map((row: any) => (
                                    <tr key={row.id} className="border-b border-outline-variant/30 hover:bg-surface-variant/30 transition-colors">
                                        <td className="py-4 px-4 text-sm text-on-surface-variant whitespace-nowrap">{row.date}</td>
                                        <td className="py-4 px-4 text-sm text-on-surface max-w-[220px] truncate" title={row.items_summary}>{row.items_summary || '-'}</td>
                                        <td className="py-4 px-4 text-sm font-semibold text-on-surface">{row.customer}</td>
                                        <td className="py-4 px-4 text-sm font-bold text-primary text-right whitespace-nowrap">{formatRupiah(row.grand_total)}</td>
                                        <td className="py-4 px-4 text-sm font-black text-emerald-600 text-right whitespace-nowrap">{formatRupiah(row.commission)}</td>
                                        <td className="py-4 px-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${statusColor[row.status] || 'bg-gray-100 text-gray-500'}`}>
                                                {row.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-on-surface-variant text-sm font-medium">
                                        <span className="material-symbols-outlined text-[40px] block mb-2 opacity-30">receipt_long</span>
                                        Belum ada riwayat transaksi dari referal Anda pada periode ini.
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
                            Menampilkan {sales.from}–{sales.to} dari {sales.total} transaksi
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

            {/* Click and Reservation History Logs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                {/* Click History */}
                <div className="bg-surface border border-outline-variant rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined">ads_click</span>
                        Riwayat Kunjungan Link ({affiliateStats?.clickHistory?.length || 0} Terbaru)
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="border-b border-outline-variant text-on-surface-variant uppercase tracking-wider font-bold">
                                    <th className="py-2.5 px-3">Tanggal</th>
                                    <th className="py-2.5 px-3">Halaman</th>
                                    <th className="py-2.5 px-3">IP / Perangkat</th>
                                </tr>
                            </thead>
                            <tbody>
                                {affiliateStats?.clickHistory?.length > 0 ? (
                                    affiliateStats.clickHistory.map((click: any) => (
                                        <tr key={click.id} className="border-b border-outline-variant/30 hover:bg-surface-variant/20 transition-colors">
                                            <td className="py-3 px-3 text-on-surface-variant whitespace-nowrap">{click.date}</td>
                                            <td className="py-3 px-3 font-semibold text-primary">{click.landing_page}</td>
                                            <td className="py-3 px-3 text-on-surface-variant">
                                                <span className="font-mono bg-surface-variant/40 px-1.5 py-0.5 rounded mr-1.5">{click.ip_address}</span>
                                                <span className="text-[10px] bg-secondary/10 text-secondary px-1.5 py-0.5 rounded font-bold">{click.user_agent}</span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="py-8 text-center text-on-surface-variant">Belum ada kunjungan lewat referral Anda.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Reservation History */}
                <div className="bg-surface border border-outline-variant rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined">book_online</span>
                        Reservasi Online ({affiliateStats?.reservationHistory?.length || 0} Terbaru)
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="border-b border-outline-variant text-on-surface-variant uppercase tracking-wider font-bold">
                                    <th className="py-2.5 px-3">No. Reservasi</th>
                                    <th className="py-2.5 px-3">Pasien</th>
                                    <th className="py-2.5 px-3">Jadwal & Cabang</th>
                                    <th className="py-2.5 px-3 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {affiliateStats?.reservationHistory?.length > 0 ? (
                                    affiliateStats.reservationHistory.map((res: any) => (
                                        <tr key={res.id} className="border-b border-outline-variant/30 hover:bg-surface-variant/20 transition-colors">
                                            <td className="py-3 px-3 font-bold text-primary whitespace-nowrap">{res.reservation_number}</td>
                                            <td className="py-3 px-3 font-semibold text-on-surface">{res.customer_name}</td>
                                            <td className="py-3 px-3 text-on-surface-variant">
                                                <div>{res.date} • {res.time}</div>
                                                <div className="text-[10px] text-primary">{res.branch}</div>
                                            </td>
                                            <td className="py-3 px-3 text-center">
                                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                                    res.status === 'Menunggu' 
                                                        ? 'bg-amber-100 text-amber-700' 
                                                        : res.status === 'Diterima' 
                                                        ? 'bg-emerald-100 text-emerald-700' 
                                                        : 'bg-red-100 text-red-700'
                                                }`}>
                                                    {res.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="py-8 text-center text-on-surface-variant">Belum ada reservasi dari link Anda.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
