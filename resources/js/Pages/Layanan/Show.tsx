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

interface LayananShowProps {
    service: Service;
    otherServices: Service[];
}

export default function LayananShow({ service, otherServices }: LayananShowProps) {
    return (
        <HomeLayout title={`${service.title} | Layanan Spesialis Harmoni by Phoeinx Sehat`}>
            {/* Page Header */}
            <div className="bg-tertiary/20 border-b border-outline-variant py-10">
                <div className="max-w-[1200px] mx-auto px-6">
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 text-sm font-medium text-on-surface-variant flex-wrap mb-4">
                        <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
                            <span className="material-symbols-outlined text-[18px]">home</span>
                            Home
                        </Link>
                        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                        <Link href="/layanan" className="hover:text-primary transition-colors">
                            Layanan
                        </Link>
                        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                        <span className="text-primary font-bold">{service.title}</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-widest text-secondary block mb-1">
                                Layanan Spesialis
                            </span>
                            <h1 className="font-semibold text-3xl md:text-4xl text-primary tracking-tight">
                                {service.title}
                            </h1>
                        </div>
                        <Link
                            href="/layanan"
                            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-outline-variant bg-surface hover:bg-tertiary/40 font-bold text-xs text-primary transition-all shadow-2xs self-start"
                        >
                            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                            Semua Layanan
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Content - Blog Style Layout */}
            <div className="max-w-[800px] mx-auto px-6 py-12">
                <article className="bg-surface rounded-3xl border border-outline-variant shadow-lg overflow-hidden">
                    {/* Hero Image */}
                    {service.thumbnail ? (
                        <div className="w-full h-[400px] sm:h-[500px] relative">
                            <img
                                src={`/storage/${service.thumbnail}`}
                                alt={service.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ) : (
                        <div className="w-full h-[300px] bg-surface-variant flex flex-col items-center justify-center text-on-surface-variant/40 gap-3">
                            <span className="material-symbols-outlined text-7xl">image</span>
                            <span className="text-sm font-semibold uppercase tracking-wider">Foto Belum Tersedia</span>
                        </div>
                    )}

                    {/* Article Body */}
                    <div className="p-8 sm:p-12">
                        <div className="mb-8 pb-8 border-b border-outline-variant/60">
                            <h2 className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight leading-tight">
                                {service.title}
                            </h2>
                        </div>

                        {service.description ? (
                            <div
                                className="prose prose-lg prose-slate max-w-none text-on-surface-variant leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: service.description }}
                            />
                        ) : (
                            <p className="text-on-surface-variant italic">
                                Konten belum tersedia.
                            </p>
                        )}
                    </div>
                </article>

                {/* Other Services */}
                {otherServices.length > 0 && (
                    <div className="mt-16 border-t border-outline-variant/60 pt-12">
                        <h3 className="text-2xl font-extrabold text-primary mb-8 flex items-center gap-3">
                            <span className="material-symbols-outlined text-secondary">article</span>
                            Layanan Lainnya
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {otherServices.slice(0, 4).map((other) => (
                                <Link
                                    key={other.id}
                                    href={`/layanan/${other.slug}`}
                                    className="group bg-surface rounded-2xl border border-outline-variant p-5 hover:border-primary/30 hover:shadow-md transition-all flex gap-4 items-center"
                                >
                                    {other.thumbnail ? (
                                        <img
                                            src={`/storage/${other.thumbnail}`}
                                            alt={other.title}
                                            className="w-20 h-20 object-cover rounded-xl shrink-0 border border-outline-variant"
                                        />
                                    ) : (
                                        <div className="w-20 h-20 rounded-xl bg-surface-variant flex items-center justify-center shrink-0 border border-outline-variant">
                                            <span className="material-symbols-outlined text-on-surface-variant/50 text-2xl">
                                                image
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-primary group-hover:text-secondary transition-colors line-clamp-2">
                                            {other.title}
                                        </h4>
                                        <span className="text-xs text-secondary font-semibold flex items-center gap-1 mt-1.5">
                                            Baca selengkapnya
                                            <span className="material-symbols-outlined text-[14px] group-hover:translate-x-1 transition-transform">
                                                arrow_forward
                                            </span>
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <CtaSection />
        </HomeLayout>
    );
}
