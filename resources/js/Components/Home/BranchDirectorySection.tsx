const areas = [
    'Tuban',
    'Bojonegoro',
    'Lamongan',
    'Rembang',
    'Blora',
    'Purwodadi',
    'Sragen',
    'Jogjakarta',
    'Purworejo',
    'Gunungkidul',
    'Wonogiri',
    'Demak',
    'Pati',
    'Surabaya',
    'Semarang',
    'Solo',
];

export default function BranchDirectorySection() {
    return (
        <section className="py-16 max-w-[1200px] mx-auto px-6">
            <div className="bg-tertiary/25 p-8 md:p-12 rounded-[32px] border border-outline-variant/80">
                <h3 className="font-semibold text-2xl md:text-3xl text-primary tracking-tight mb-3">
                    Jangkauan Layanan &amp; Cabang Kami
                </h3>

                <p className="text-on-surface-variant text-base md:text-lg leading-relaxed max-w-4xl mb-8">
                    Didukung oleh 200+ Tim Profesional di berbagai kota. Saat ini kami melayani area{' '}
                    <span className="text-primary font-semibold">
                        Tuban, Bojonegoro, Lamongan, Rembang, Blora, Purwodadi, Sragen, Jogjakarta, Purworejo,
                        Gunungkidul, Wonogiri, Demak, Pati
                    </span>{' '}
                    dan sekitarnya.
                </p>

                <div className="flex flex-wrap gap-3">
                    {areas.map((area) => (
                        <div
                            key={area}
                            className="px-6 py-3 rounded-full bg-white border border-outline-variant text-primary font-bold text-sm shadow-sm hover:border-primary/50 hover:shadow-md transition-all cursor-default"
                        >
                            {area}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
