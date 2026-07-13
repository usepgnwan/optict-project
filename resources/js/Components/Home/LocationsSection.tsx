import React from 'react';
import { Link } from '@inertiajs/react';

export interface BranchItem {
    id: number | string;
    name: string;
    city: string;
    address?: string;
    phone?: string;
    email?: string;
    is_active?: boolean;
}

const fallbackCities: BranchItem[] = [
    { id: 1, city: 'Jakarta Pusat', name: 'Optik Calm Jakarta Pusat', address: 'Jl. MH Thamrin No. 15, Menteng, Jakarta Pusat 10350', phone: '021-3901234', email: 'jakarta@optikcalm.com' },
    { id: 2, city: 'Bandung', name: 'Optik Calm Bandung', address: 'Jl. Braga No. 88, Sumur Bandung, Bandung 40111', phone: '022-4231234', email: 'bandung@optikcalm.com' },
    { id: 3, city: 'Surabaya', name: 'Optik Calm Surabaya', address: 'Jl. Tunjungan No. 42, Genteng, Surabaya 60275', phone: '031-5321234', email: 'surabaya@optikcalm.com' },
    { id: 4, city: 'Medan', name: 'Optik Calm Medan', address: 'Jl. Diponegoro No. 25, Medan Petisah 20152', phone: '061-4561234', email: 'medan@optikcalm.com' },
];

const studioTypes = [
    'Flagship Store',
    'Concept Store',
    'Optical Studio',
    'Clinical Care',
    'Studio & Gallery',
];

export default function LocationsSection({ branches = [] }: { branches?: BranchItem[] }) {
    const activeBranches = branches && branches.length > 0 ? branches : fallbackCities;

    // Ensure we repeat enough times for a continuous marquee strip without gaps
    let displayItems = [...activeBranches];
    while (displayItems.length < 12) {
        displayItems = [...displayItems, ...activeBranches];
    }
    const loopItems = [...displayItems, ...displayItems];

    return (
        <section className="py-16 bg-tertiary/30 border-y border-outline-variant overflow-hidden">
            <div className="max-w-[1200px] mx-auto px-6 mb-8 text-center">
                <p className="text-secondary font-bold text-xs uppercase tracking-[0.25em] mb-2">
                    Jaringan Seluruh Indonesia
                </p>
                <h2 className="font-semibold text-2xl md:text-3xl text-primary tracking-tight mb-3">
                    Lokasi Cabang &amp; Studio Kami
                </h2>
                <p className="text-on-surface-variant text-sm md:text-base max-w-2xl mx-auto">
                    Kunjungi cabang dan studio resmi kami yang tersebar di berbagai kota untuk pemeriksaan mata presisi dan koleksi kacamata terlengkap.
                </p>
            </div>

            {/* Infinite Marquee Strip */}
            <div className="relative w-full overflow-hidden py-3 mb-12">
                {/* Gradient fade edge left & right */}
                <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#F4F8F7] to-transparent z-10" />
                <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#F4F8F7] to-transparent z-10" />

                <div className="animate-marquee flex items-center gap-5">
                    {loopItems.map((item, index) => {
                        const typeBadge = studioTypes[index % studioTypes.length];
                        return (
                            <div
                                key={`${item.id}-${index}`}
                                className="flex items-center gap-3 bg-white px-6 py-3.5 rounded-full border border-outline-variant shadow-sm hover:border-primary/40 hover:shadow-md transition-all cursor-default shrink-0"
                            >
                                <div className="w-8 h-8 rounded-full bg-tertiary text-primary flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-[18px]">location_on</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-primary text-sm">{item.city || 'Indonesia'}</span>
                                    <span className="text-outline-variant">|</span>
                                    <span className="text-on-surface-variant text-sm font-medium">{item.name}</span>
                                </div>
                                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-secondary/10 text-secondary ml-1">
                                    {typeBadge}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Interactive Cards Grid from Data Cabang */}
            <div className="max-w-[1200px] mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {activeBranches.map((branch, index) => {
                        const typeBadge = studioTypes[index % studioTypes.length];
                        const mapQuery = encodeURIComponent(branch.address || `${branch.name} ${branch.city}`);
                        return (
                            <div
                                key={branch.id || index}
                                className="bg-white rounded-3xl p-6 border border-outline-variant shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 flex flex-col justify-between group"
                            >
                                <div>
                                    <div className="flex items-center justify-between gap-2 mb-3">
                                        <span className="px-3 py-1 rounded-full bg-tertiary text-primary text-xs font-bold tracking-wide">
                                            {branch.city}
                                        </span>
                                        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                            Aktif
                                        </div>
                                    </div>

                                    <h3 className="font-bold text-lg text-primary group-hover:text-secondary transition-colors line-clamp-2 mb-2">
                                        {branch.name}
                                    </h3>

                                    <p className="text-xs text-secondary font-semibold uppercase tracking-wider mb-4">
                                        {typeBadge}
                                    </p>

                                    {branch.address && (
                                        <div className="flex items-start gap-2.5 text-sm text-on-surface-variant mb-3">
                                            <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">
                                                location_on
                                            </span>
                                            <span className="line-clamp-3 leading-relaxed text-xs">
                                                {branch.address}
                                            </span>
                                        </div>
                                    )}

                                    {branch.phone && (
                                        <div className="flex items-center gap-2.5 text-sm text-on-surface-variant mb-2">
                                            <span className="material-symbols-outlined text-primary text-[18px] shrink-0">
                                                phone
                                            </span>
                                            <a
                                                href={`tel:${branch.phone}`}
                                                className="text-xs font-semibold hover:text-primary transition-colors"
                                            >
                                                {branch.phone}
                                            </a>
                                        </div>
                                    )}

                                    {branch.email && (
                                        <div className="flex items-center gap-2.5 text-sm text-on-surface-variant mb-4">
                                            <span className="material-symbols-outlined text-primary text-[18px] shrink-0">
                                                mail
                                            </span>
                                            <span className="text-xs truncate">{branch.email}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="pt-4 border-t border-outline-variant/60 flex items-center gap-2 mt-4">
                                    <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 py-2.5 px-3 rounded-xl bg-surface-variant/50 hover:bg-primary hover:text-on-primary text-primary text-xs font-bold flex items-center justify-center gap-1.5 transition-all text-center"
                                    >
                                        <span className="material-symbols-outlined text-[16px]">map</span>
                                        Lihat Peta
                                    </a>
                                    <Link
                                        href="/booking"
                                        className="py-2.5 px-3 rounded-xl bg-tertiary hover:bg-secondary hover:text-on-secondary text-primary text-xs font-bold transition-all shrink-0 flex items-center justify-center"
                                        title="Buat Reservasi di Cabang ini"
                                    >
                                        <span className="material-symbols-outlined text-[16px]">event</span>
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
