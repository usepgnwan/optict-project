import React from 'react';
import HomeLayout from '@/Layouts/HomeLayout';
import BookingFormSection from '@/Components/Home/BookingFormSection';
import FaqSection from '@/Components/Home/FaqSection';
import { Link } from '@inertiajs/react';

export default function Booking({
    branches = [],
    complaintTypes = [],
}: {
    branches?: any[];
    complaintTypes?: any[];
}) {
    return (
        <HomeLayout title="Reservasi Pemeriksaan Mata & Konsultasi | Harmoni by Phoenix Sehat">
            {/* HERO HEADER FOR BOOKING PAGE */}
            <div className="pt-32 pb-12 bg-gradient-to-b from-primary/5 via-surface to-surface relative overflow-hidden">
                {/* Decorative background glows */}
                <div className="absolute top-10 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-20 right-10 w-80 h-80 bg-tertiary/20 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-[1200px] mx-auto px-6 relative z-10">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-4">
                        <Link href="/" className="hover:text-primary transition-colors">
                            Beranda
                        </Link>
                        <span>/</span>
                        <span className="text-primary">Reservasi Pemeriksaan</span>
                    </div>

                    <div className="max-w-3xl">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest mb-4">
                            Layanan Pemeriksaan Komprehensif
                        </span>
                        <h1 className="text-3xl sm:text-5xl font-extrabold text-on-surface tracking-tight leading-tight mb-4">
                            Jadwalkan Pemeriksaan Mata Bersama{' '}
                            <span className="text-primary">Optometris Ahli</span>
                        </h1>
                        <p className="text-on-surface-variant text-base sm:text-lg leading-relaxed">
                            Rasakan standar pemeriksaan optikal 7-tahap dengan instrumen diagnostik digital berakurasi tinggi dan konsultasi optikal terpercaya.
                        </p>
                    </div>

                    {/* Key Guarantee Badges */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
                        <div className="bg-surface p-4 rounded-2xl border border-outline-variant/60 shadow-sm flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-[20px]">verified</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-xs text-on-surface">Pemeriksaan Lengkap</h4>
                                <p className="text-[11px] text-on-surface-variant">Analisis tajam penglihatan</p>
                            </div>
                        </div>

                        <div className="bg-surface p-4 rounded-2xl border border-outline-variant/60 shadow-sm flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-[20px]">biotech</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-xs text-on-surface">Digital 7-Tahap</h4>
                                <p className="text-[11px] text-on-surface-variant">Alat diagnostik akurat</p>
                            </div>
                        </div>

                        <div className="bg-surface p-4 rounded-2xl border border-outline-variant/60 shadow-sm flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-[20px]">medical_services</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-xs text-on-surface">Optometris Resmi</h4>
                                <p className="text-[11px] text-on-surface-variant">Bersertifikasi & berlisensi</p>
                            </div>
                        </div>

                        <div className="bg-surface p-4 rounded-2xl border border-outline-variant/60 shadow-sm flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-[20px]">home_health</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-xs text-on-surface">Home Service</h4>
                                <p className="text-[11px] text-on-surface-variant">Kunjungan ke rumah/kantor</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MAIN BOOKING FORM */}
            <div className="pb-16">
                <BookingFormSection branches={branches} complaintTypes={complaintTypes} isStandalone={true} />
            </div>

            {/* FAQ SECTION TO HELP USERS */}
            <FaqSection />
        </HomeLayout>
    );
}
