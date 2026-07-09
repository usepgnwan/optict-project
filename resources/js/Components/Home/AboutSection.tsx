const checklistItems = [
    'Pemeriksaan Refraksi Digital Akurat',
    'Koleksi Frame Eksklusif & Original',
    'Konsultasi Personal dengan Ahli',
];

export default function AboutSection() {
    return (
        <section className="py-20 max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <div className="order-2 md:order-1 relative">
                <div
                    className="aspect-square bg-cover bg-center rounded-[48px] shadow-2xl overflow-hidden border-8 border-white"
                    style={{
                        backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuB4-xrR9vvuj88dJfTL6vdxNrX02_Qfm9JfFeXS09Z2leXZrFAPIWsGyhz9O8-7EwmEjZI73lt6JB4r-59dfSW_131KdOjd8ww-52QvPxIVgcUcPStWPT8UB7tPmwhokwsBbO4p2S6e_YX-EBdwN28-KTu6sIj7VqahhgkkTKf-V9A18KOF6x2yXkllBomLemKmiign3DRQJLeAQmBsLvVv5LjFUhZozxTZLhRlzAvyMRrMM3WwHwObqbRveSqgEgYnH1lZNkUI4os')`,
                    }}
                />
                <div className="absolute -bottom-10 -right-10 bg-primary text-on-primary p-8 rounded-[32px] shadow-2xl hidden lg:block border-4 border-white">
                    <div className="flex items-center gap-5">
                        <div className="text-5xl font-bold">15+</div>
                        <div className="text-sm font-medium leading-tight opacity-90">
                            Tahun<br />Pengalaman<br />Teruji
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-8 order-1 md:order-2">
                <h2 className="font-bold text-5xl text-primary leading-tight tracking-tight">
                    Komitmen Kami pada Kesehatan Mata Anda
                </h2>
                <p className="text-on-surface-variant text-lg leading-relaxed">
                    Di Optik Calm, kami percaya bahwa penglihatan yang baik adalah kunci kualitas hidup. Dengan tim ahli optometri berpengalaman dan peralatan diagnostik mutakhir, kami memastikan setiap pemeriksaan dilakukan dengan presisi medis.
                </p>
                <ul className="space-y-5">
                    {checklistItems.map((item) => (
                        <li key={item} className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                                <span className="material-symbols-outlined text-[20px] font-bold">check</span>
                            </div>
                            <span className="font-medium text-primary">{item}</span>
                        </li>
                    ))}
                </ul>
                <button className="bg-primary text-on-primary px-10 py-4 rounded-xl font-bold shadow-lg hover:bg-primary/90 transition-all hover:shadow-xl">
                    Pelajari Selengkapnya
                </button>
            </div>
        </section>
    );
}
