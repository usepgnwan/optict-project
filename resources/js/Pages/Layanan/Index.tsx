import React from 'react';
import { Link } from '@inertiajs/react';
import HomeLayout from '@/Layouts/HomeLayout';
import CtaSection from '@/Components/Home/CtaSection';

interface Service {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    thumbnail: string | null;
}

interface LayananIndexProps {
    services: Service[];
}

export default function LayananIndex({ services }: LayananIndexProps) {
    const getDescription = (desc: string | null) => {
        if (!desc) return '';
        return desc.replace(/<[^>]*>/g, '').substring(0, 120) + '...';
    };

    return (
        <HomeLayout title="Layanan Spesialis Kami | Optik Calm">
            {/* Page Header */}
            <div className="bg-tertiary/20 border-b border-outline-variant py-14">
                <div className="max-w-[1200px] mx-auto px-6">
                    <div className="flex items-center gap-2 text-sm font-medium text-on-surface-variant flex-wrap mb-4">
                        <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
                            <span className="material-symbols-outlined text-[18px]">home</span>
                            Home
                        </Link>
                        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                        <span className="text-primary font-bold">Layanan</span>
                    </div>
                    <h1 className="font-extrabold text-4xl md:text-5xl text-primary tracking-tight mb-3">
                        Artikel & Informasi
                    </h1>
                    <p className="text-on-surface-variant text-lg max-w-2xl">
                        Kumpulan artikel, tips kesehatan mata, dan informasi layanan terbaru dari Optik Calm.
                    </p>
                </div>
            </div>

            {/* Services Grid */}
            <div className="max-w-[1200px] mx-auto px-6 py-16">
                {services.length === 0 ? (
                    <div className="text-center py-24">
                        <span className="material-symbols-outlined text-6xl text-on-surface-variant/40 mb-4 block">medical_services</span>
                        <h2 className="text-2xl font-bold text-primary mb-2">Belum Ada Layanan</h2>
                        <p className="text-on-surface-variant">Layanan akan segera tersedia.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service) => (
                            <Link
                                key={service.id}
                                href={`/layanan/${service.slug}`}
                                className="group bg-surface rounded-3xl border border-outline-variant card-shadow overflow-hidden flex flex-col hover:border-primary/30 hover:shadow-xl transition-all duration-300"
                            >
                                {/* Thumbnail */}
                                <div className="relative h-64 overflow-hidden bg-surface-variant">
                                    {service.thumbnail ? (
                                        <img
                                            src={`/storage/${service.thumbnail}`}
                                            alt={service.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <span className="material-symbols-outlined text-6xl text-on-surface-variant/30">
                                                image
                                            </span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
                                    <span className="absolute top-5 left-5 bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
                                        Artikel
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="p-8 flex-1 flex flex-col">
                                    <h2 className="font-bold text-primary text-2xl mb-4 group-hover:text-secondary transition-colors leading-tight">
                                        {service.title}
                                    </h2>
                                    {service.description && (
                                        <p className="text-on-surface-variant text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                                            {getDescription(service.description)}
                                        </p>
                                    )}
                                    <span className="mt-auto text-secondary font-bold text-sm flex items-center gap-2 group-hover:translate-x-1 transition-transform uppercase tracking-wider">
                                        Baca Artikel
                                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            <CtaSection />
        </HomeLayout>
    );
}
