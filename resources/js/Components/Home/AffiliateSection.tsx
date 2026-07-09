import React from 'react';
import { ScrollCard } from '@/Components/ReactBits';

const benefits = [
    {
        icon: 'percent',
        title: 'Komisi Tinggi Hingga 15%',
        description: 'Dapatkan komisi uang tunai otomatis untuk setiap transaksi kacamata maupun reservasi pemeriksaan mata melalui tautan referral Anda.',
    },
    {
        icon: 'monitoring',
        title: 'Dashboard Transparan',
        description: 'Pantau klik, prospek, pencairan dana, dan riwayat komisi secara real-time langsung melalui akun khusus Mitra Affiliate Optik Calm.',
    },
    {
        icon: 'auto_awesome',
        title: 'Materi Promosi Lengkap',
        description: 'Kami menyediakan foto produk profesional, video katalog siap pakai, dan kode voucher diskon eksklusif untuk audiens Anda.',
    },
];

export default function AffiliateSection() {
    return (
        <section id="affiliate" className="py-20 bg-tertiary/10 border-y border-outline-variant scroll-mt-24">
            <div className="max-w-[1200px] mx-auto px-6">
                <div className="bg-surface rounded-[36px] border border-outline-variant p-8 md:p-14 card-shadow relative overflow-hidden">
                    {/* Background visual glow */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

                    <div className="max-w-3xl mx-auto text-center mb-14 relative z-10">
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 text-secondary font-bold text-xs uppercase tracking-widest mb-4">
                            <span className="material-symbols-outlined text-[16px]">handshake</span>
                            Program Mitra Optik Calm
                        </span>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-primary tracking-tight leading-tight mb-4">
                            Gabung Menjadi Mitra Affiliate &amp; Dapatkan Komisi Pasif
                        </h2>
                        <p className="text-on-surface-variant text-base md:text-lg">
                            Bagikan solusi penglihatan profesional kepada komunitas Anda dan nikmati komisi menguntungkan tanpa modal atau biaya pendaftaran.
                        </p>
                    </div>

                    {/* Benefits Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 mb-12">
                        {benefits.map((benefit, idx) => (
                            <ScrollCard
                                key={benefit.title}
                                index={idx}
                                direction="up"
                                enableSpotlight={true}
                                className="bg-surface-variant p-7 rounded-3xl border border-outline-variant flex flex-col justify-between"
                            >
                                <div>
                                    <div className="w-12 h-12 rounded-2xl bg-primary text-on-primary flex items-center justify-center mb-5 shadow-md">
                                        <span className="material-symbols-outlined text-[24px]">{benefit.icon}</span>
                                    </div>
                                    <h3 className="font-bold text-primary text-lg mb-2">{benefit.title}</h3>
                                    <p className="text-on-surface-variant text-sm leading-relaxed">{benefit.description}</p>
                                </div>
                            </ScrollCard>
                        ))}
                    </div>

                    {/* Action Banner */}
                    <div className="bg-primary text-on-primary rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10 shadow-xl">
                        <div>
                            <h4 className="text-xl md:text-2xl font-bold mb-1">Siap Memulai Penghasilan Tambahan?</h4>
                            <p className="text-sm text-on-primary/80">Pendaftaran cepat dalam 2 menit, persetujuan otomatis.</p>
                        </div>
                        <a
                            href="https://wa.me/6281234567890?text=Halo%20Optik%20Calm,%20saya%20tertarik%20mendaftar%20Program%20Mitra%20Affiliate"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-8 py-4 bg-secondary text-white font-bold rounded-2xl shadow-lg hover:bg-secondary/90 transition-all hover:scale-105 shrink-0"
                        >
                            Daftar Jadi Affiliate Sekarang
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
