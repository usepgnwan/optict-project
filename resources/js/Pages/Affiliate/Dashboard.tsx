import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { usePage } from '@inertiajs/react';
import PageHeader from '@/Components/Admin/PageHeader';

export default function AffiliateDashboard({ affiliate }: { affiliate: any }) {
    const { auth } = usePage<any>().props;
    const user = auth.user;

    const copyToClipboard = (text: string, type: string) => {
        navigator.clipboard.writeText(text);
        alert(`${type} berhasil disalin!`);
    };

    return (
        <AdminLayout title="Dashboard Affiliate">
            <PageHeader 
                title={`Selamat Datang, ${user.name}`} 
                subtitle="Berikut adalah pantauan performa referral dan saldo kemitraan Anda bulan ini."
                icon="waving_hand"
            />

            {/* Metrics Section */}
            <div className="flex flex-col lg:flex-row gap-5 mb-8">
                <div className="flex-1 bg-surface border border-outline-variant p-6 rounded-2xl shadow-sm">
                    <small className="text-xs text-on-surface-variant uppercase font-bold tracking-wider">Komisi Siap Cair</small>
                    <div className="text-3xl font-black text-emerald-600 my-2">Rp {Number(affiliate?.balance || 0).toLocaleString('id-ID')}</div>
                    <div className="text-xs text-on-surface-variant font-medium">Akan ditransfer pada tanggal 28.</div>
                </div>
                <div className="flex-1 bg-surface border border-outline-variant p-6 rounded-2xl shadow-sm">
                    <small className="text-xs text-on-surface-variant uppercase font-bold tracking-wider">Komisi Tertahan (Hold)</small>
                    <div className="text-3xl font-black text-amber-500 my-2">Rp 0</div>
                    <div className="text-xs text-on-surface-variant font-medium">Dalam masa penyesuaian/garansi 7 hari.</div>
                </div>
                <div className="flex-1 bg-surface border border-outline-variant p-6 rounded-2xl shadow-sm">
                    <small className="text-xs text-on-surface-variant uppercase font-bold tracking-wider">Total Klik Link</small>
                    <div className="text-3xl font-black text-primary my-2">0 Klik</div>
                    <div className="text-xs text-emerald-600 font-bold">Data klik belum tersedia</div>
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
            <div className="bg-surface border border-outline-variant rounded-2xl p-6 md:p-8 mb-8 shadow-sm">
                <h2 className="text-xl text-primary mb-2 font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined">campaign</span>
                    Bahan Promosi Siap Pakai (Marketing Kit)
                </h2>
                <p className="text-sm text-on-surface-variant mb-6">Materi grafis dan tulisan yang dioptimalkan untuk kebutuhan sebar informasi harian.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border border-outline-variant rounded-xl p-5 bg-surface-variant/20 flex flex-col gap-3">
                        <h4 className="text-sm text-primary font-bold">Brosur Digital Terapi GenQi</h4>
                        <p className="text-xs text-on-surface-variant flex-1 leading-relaxed">Format gambar vertikal beresolusi tinggi, cocok untuk Story WA dan Instagram.</p>
                        <a href="#" className="w-full border-2 border-primary text-primary bg-transparent py-2.5 rounded-lg font-bold text-xs cursor-pointer text-center no-underline hover:bg-primary hover:text-on-primary transition-colors block mt-2">Unduh Gambar</a>
                    </div>
                    <div className="border border-outline-variant rounded-xl p-5 bg-surface-variant/20 flex flex-col gap-3">
                        <h4 className="text-sm text-primary font-bold">Copywriting Edukasi Hidrogen</h4>
                        <p className="text-xs text-on-surface-variant flex-1 leading-relaxed">Kumpulan draf teks edukasi kesehatan radikal bebas tinggal salin tempel ke grup.</p>
                        <a href="#" className="w-full border-2 border-primary text-primary bg-transparent py-2.5 rounded-lg font-bold text-xs cursor-pointer text-center no-underline hover:bg-primary hover:text-on-primary transition-colors block mt-2">Salin Teks</a>
                    </div>
                    <div className="border border-outline-variant rounded-xl p-5 bg-surface-variant/20 flex flex-col gap-3">
                        <h4 className="text-sm text-primary font-bold">Video Banner Home Service</h4>
                        <p className="text-xs text-on-surface-variant flex-1 leading-relaxed">Video dokumentasi durasi 15 detik untuk reels/TikTok pelayanan rumah.</p>
                        <a href="#" className="w-full border-2 border-primary text-primary bg-transparent py-2.5 rounded-lg font-bold text-xs cursor-pointer text-center no-underline hover:bg-primary hover:text-on-primary transition-colors block mt-2">Unduh Video</a>
                    </div>
                </div>
            </div>
            
            {/* Recent Referrals Table */}
            <div className="bg-surface border border-outline-variant rounded-2xl p-6 md:p-8 shadow-sm overflow-x-auto">
                <h2 className="text-xl text-primary mb-6 font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined">history</span>
                    Riwayat Aktivitas Transaksi Terbaru
                </h2>
                <table className="w-full text-left min-w-[600px]">
                    <thead>
                        <tr className="border-b-2 border-outline-variant">
                            <th className="py-3 px-4 text-xs font-bold text-on-surface uppercase tracking-wider">Tanggal</th>
                            <th className="py-3 px-4 text-xs font-bold text-on-surface uppercase tracking-wider">Layanan / Produk</th>
                            <th className="py-3 px-4 text-xs font-bold text-on-surface uppercase tracking-wider">Nilai Transaksi</th>
                            <th className="py-3 px-4 text-xs font-bold text-on-surface uppercase tracking-wider">Komisi Anda</th>
                            <th className="py-3 px-4 text-xs font-bold text-on-surface uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colSpan={5} className="py-8 text-center text-on-surface-variant text-sm font-medium">Belum ada riwayat transaksi dari referal Anda.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

        </AdminLayout>
    );
}
