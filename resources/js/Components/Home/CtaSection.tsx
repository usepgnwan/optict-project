import React from 'react';
import { Link } from '@inertiajs/react';

export default function CtaSection() {
    return (
        <section className="py-20 px-6 bg-tertiary/20">
            <div className="max-w-[1200px] mx-auto bg-surface rounded-[48px] shadow-2xl overflow-hidden flex flex-col md:flex-row items-stretch border border-outline-variant">
                <div className="flex-1 p-10 md:p-20 flex flex-col justify-center items-start space-y-8">
                    <span className="text-secondary tracking-[0.3em] uppercase text-xs font-bold">Reservasi Mudah</span>
                    <h2 className="font-bold text-4xl sm:text-5xl text-on-surface leading-[1.1] tracking-tight">
                        Jadwalkan kunjungan & pemeriksaan mata sekarang!
                    </h2>
                    <p className="text-on-surface-variant text-base sm:text-lg">
                        Nikmati kenyamanan pemeriksaan mata profesional di cabang terdekat atau layanan Home Service tanpa harus keluar rumah.
                    </p>
                    <Link
                        href="/booking"
                        className="bg-primary text-on-primary px-10 py-5 rounded-2xl font-bold flex items-center gap-4 hover:shadow-2xl hover:-translate-y-1 transition-all shadow-xl shadow-primary/20 active:scale-95"
                    >
                        <span className="material-symbols-outlined text-[24px]">calendar_month</span>
                        <span>BUAT JADWAL SEKARANG</span>
                    </Link>
                </div>
                <div className="flex-1 relative min-h-[350px] md:min-h-full">
                    <div className="absolute inset-0 z-10 bg-gradient-to-r from-surface via-transparent to-transparent" />
                    <img
                        alt="Pemeriksaan Mata & Tes Kacamata Harmoni"
                        className="w-full h-full object-cover"
                        src="https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=1200&q=80"
                    />
                </div>
            </div>
        </section>
    );
}
