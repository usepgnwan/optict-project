export default function CtaSection() {
    return (
        <section className="py-20 px-6 bg-tertiary/20">
            <div className="max-w-[1200px] mx-auto bg-white rounded-[48px] shadow-2xl overflow-hidden flex flex-col md:flex-row items-stretch border border-outline-variant">
                <div className="flex-1 p-10 md:p-20 flex flex-col justify-center items-start space-y-8">
                    <span className="text-secondary tracking-[0.3em] uppercase text-xs font-bold">Contact Us</span>
                    <h2 className="font-bold text-5xl text-primary leading-[1.1] tracking-tight">
                        Jadwalkan kunjungan tim ahli kami sekarang!
                    </h2>
                    <p className="text-on-surface-variant text-lg">
                        Nikmati kenyamanan pemeriksaan mata profesional tanpa harus keluar rumah.
                    </p>
                    <button className="bg-primary text-on-primary px-10 py-5 rounded-2xl font-bold flex items-center gap-4 hover:shadow-2xl hover:-translate-y-1 transition-all shadow-xl shadow-primary/20 active:scale-95">
                        <span className="material-symbols-outlined">calendar_month</span>
                        <span>BOOK NOW</span>
                    </button>
                </div>
                <div className="flex-1 relative min-h-[350px] md:min-h-full">
                    <div className="absolute inset-0 z-10 bg-gradient-to-r from-white via-transparent to-transparent" />
                    <img
                        alt="Mobile Optician Service"
                        className="w-full h-full object-cover"
                        src="https://lh3.googleusercontent.com/aida/AP1WRLtbQPbWVLn4S4ufcdf-AWwClIItAhEJkYcINej1Z3VErqB_FOcoLT7gvEm2bhwrBjORnopYfCo0sTaW58N3iJYCHthW-G4FvgDoXKLRmoneBREoVHZQYfw0uDQN2b47B2oJ8BEN4-p1-OpOvLuAGMd2R5L83XplSLin-jIk1Qf-2CMexc-AqjemQA_vzimUz3RHNJHDeZE5j8tXNN1Os_NWP8MwMn-S8b-BMsgYB0vmR_wriY9hTOqgxSc"
                    />
                </div>
            </div>
        </section>
    );
}
