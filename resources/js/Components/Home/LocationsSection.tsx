const cities = [
    { city: 'Jakarta Selatan', branch: 'Senopati Flagship', type: 'Flagship Store' },
    { city: 'Bandung', branch: 'Dago Heritage', type: 'Concept Store' },
    { city: 'Jakarta Pusat', branch: 'Menteng Studio', type: 'Premium Clinic' },
    { city: 'Surabaya', branch: 'Dharmahusada', type: 'Clinical Care' },
    { city: 'Tangerang', branch: 'PIK 2 Gallery', type: 'Lifestyle Store' },
    { city: 'Bali', branch: 'Canggu Resort', type: 'Resort Edition' },
    { city: 'Yogyakarta', branch: 'Gejayan Studio', type: 'Optical Center' },
    { city: 'Medan', branch: 'Polonia Clinic', type: 'Eye Care Studio' },
    { city: 'Semarang', branch: 'Simpang Lima', type: 'Studio & Gallery' },
    { city: 'Makassar', branch: 'Panakkukang', type: 'Optical Center' },
];

export default function LocationsSection() {
    // Duplicate array so marquee loops infinitely without gaps
    const loopItems = [...cities, ...cities];

    return (
        <section className="py-14 bg-tertiary/30 border-y border-outline-variant overflow-hidden">
            <div className="max-w-[1200px] mx-auto px-6 mb-8 text-center">
                <p className="text-secondary font-bold text-xs uppercase tracking-[0.25em] mb-2">
                    Jaringan Seluruh Indonesia
                </p>
                <h2 className="font-semibold text-2xl md:text-3xl text-primary tracking-tight">
                    Lokasi Cabang &amp; Studio Kami
                </h2>
            </div>

            {/* Infinite Marquee Strip */}
            <div className="relative w-full overflow-hidden py-2">
                {/* Gradient fade edge left & right */}
                <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#F4F8F7] to-transparent z-10" />
                <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#F4F8F7] to-transparent z-10" />

                <div className="animate-marquee flex items-center gap-5">
                    {loopItems.map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-3 bg-white px-6 py-3.5 rounded-full border border-outline-variant shadow-sm hover:border-primary/40 hover:shadow-md transition-all cursor-default shrink-0"
                        >
                            <div className="w-8 h-8 rounded-full bg-tertiary text-primary flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-[18px]">location_on</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-primary text-sm">{item.city}</span>
                                <span className="text-outline-variant">|</span>
                                <span className="text-on-surface-variant text-sm font-medium">{item.branch}</span>
                            </div>
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-secondary/10 text-secondary ml-1">
                                {item.type}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
