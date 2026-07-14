import React from 'react';

export default function BranchDirectorySection({ branches = [] }: { branches?: any[] }) {
    // Extract unique cities from data cabang (from http://127.0.0.1:8000/branches)
    const dbCities = branches && branches.length > 0
        ? Array.from(new Set(branches.map((b: any) => b.city).filter(Boolean)))
        : [];

    return (
        <section className="py-16 max-w-[1200px] mx-auto px-6">
            <div className="bg-tertiary/25 p-8 md:p-12 rounded-[32px] border border-outline-variant/80">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <h3 className="font-semibold text-2xl md:text-3xl text-primary tracking-tight">
                        Jangkauan Layanan &amp; Cabang Kami
                    </h3>
                    {branches && branches.length > 0 && (
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-wider">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            {branches.length} Cabang Resmi Aktif
                        </span>
                    )}
                </div>

                <p className="text-on-surface-variant text-base md:text-lg leading-relaxed max-w-4xl mb-8">
                    Didukung oleh Tim Profesional Harmoni by Phoeinx Sehat di berbagai kota.{' '}
                    {dbCities.length > 0 ? (
                        <span>
                            Cabang resmi kami hadir di{' '}
                            <span className="text-primary font-bold">
                                {dbCities.join(', ')}
                            </span>{' '}
                            dan siap melayani kebutuhan kesehatan mata Anda dengan pelayanan terbaik.
                        </span>
                    ) : (
                        <span>
                            Saat ini cabang resmi kami siap melayani kebutuhan kesehatan mata Anda.
                        </span>
                    )}
                </p>

                <div className="flex flex-wrap gap-3">
                    {branches && branches.length > 0 ? (
                        branches.map((branch: any) => (
                            <div
                                key={branch.id}
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-on-primary border border-primary font-bold text-sm shadow-md hover:bg-primary/90 transition-all cursor-default"
                            >
                                <span className="material-symbols-outlined text-[18px]">storefront</span>
                                <span>{branch.city}</span>
                                <span className="text-white/80 font-normal text-xs">
                                    • {branch.name}
                                </span>
                            </div>
                        ))
                    ) : (
                        <div className="text-sm text-on-surface-variant">
                            Belum ada data cabang terdaftar.
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
