import React from 'react';
import { Link } from '@inertiajs/react';
import HomeLayout from '@/Layouts/HomeLayout';
import CatalogSection from '@/Components/Home/CatalogSection';
import CtaSection from '@/Components/Home/CtaSection';

export default function Catalog({ dbProducts = [], branches = [] }: { dbProducts?: any[]; branches?: any[] }) {
    return (
        <HomeLayout title="Katalog Kacamata & Frame | Optik Calm">
            {/* Catalog Page Header Banner */}
            <div className="bg-tertiary/20 border-b border-outline-variant py-14">
                <div className="max-w-[1200px] mx-auto px-6">
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 text-sm font-medium text-on-surface-variant mb-4">
                        <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
                            <span className="material-symbols-outlined text-[18px]">home</span>
                            Home
                        </Link>
                        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                        <span className="text-primary font-bold">Katalog Kacamata</span>
                    </div>

                    <h1 className="font-semibold text-3xl md:text-5xl text-primary tracking-tight mb-4">
                        Katalog Kacamata &amp; Frame
                    </h1>
                    <p className="text-on-surface-variant text-base md:text-lg max-w-2xl">
                        Jelajahi koleksi lengkap bingkai kacamata Optik Calm dengan filter harga, pencarian cepat, serta jaminan kualitas lensa standar optikal tertinggi.
                    </p>
                </div>
            </div>

            {/* Catalog Section Component */}
            <CatalogSection dbProducts={dbProducts} branches={branches} />

            {/* CTA Section */}
            <CtaSection />
        </HomeLayout>
    );
}
