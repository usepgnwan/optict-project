import React from 'react';
import {
    ShinyText,
    BlurText,
    TiltedCard,
    Magnet,
    CountUp,
    FloatingOrbsBackground,
} from '@/Components/ReactBits';

export default function HeroSection() {
    return (
        <section className="max-w-[1200px] mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 items-center gap-16 relative overflow-hidden">
            <FloatingOrbsBackground />

            <div className="space-y-8 relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-tertiary text-on-tertiary rounded-full font-medium text-sm border border-primary/10 shadow-sm">
                    <span className="material-symbols-outlined text-[18px] fill-icon text-primary animate-pulse">
                        verified
                    </span>
                    <ShinyText
                        text="Professional Serenity"
                        className="font-semibold tracking-wide uppercase text-[11px]"
                        speed={3}
                    />
                </div>

                <h1 className="text-5xl font-bold text-primary tracking-tight leading-tight">
                    <BlurText
                        text="Layanan Kesehatan Mata Terpercaya untuk Kenyamanan Anda"
                        animateBy="words"
                        delay={80}
                    />
                </h1>

                <p className="text-on-surface-variant text-lg leading-relaxed max-w-lg">
                    Dapatkan pemeriksaan mata komprehensif dengan teknologi terkini dan pilihan bingkai berkualitas untuk penglihatan yang lebih jernih.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Magnet padding={40}>
                        <button className="w-full sm:w-auto bg-primary text-on-primary px-10 py-4 rounded-xl font-bold shadow-xl shadow-primary/20 hover:shadow-2xl hover:-translate-y-0.5 transition-all active:scale-95 cursor-pointer">
                            Reservasi Sekarang
                        </button>
                    </Magnet>
                    <Magnet padding={40}>
                        <button className="w-full sm:w-auto border-2 border-primary/10 text-primary px-10 py-4 rounded-xl font-bold hover:bg-primary/5 transition-all active:scale-95 cursor-pointer">
                            Lihat Katalog
                        </button>
                    </Magnet>
                </div>

                <div className="flex flex-wrap gap-10 pt-8 border-t border-outline-variant">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-tertiary flex items-center justify-center text-primary shadow-inner">
                            <span className="material-symbols-outlined">medical_services</span>
                        </div>
                        <div>
                            <div className="font-bold text-xl text-primary flex items-center">
                                <CountUp end={100} suffix="+" duration={2} />
                            </div>
                            <div className="text-xs text-on-surface-variant">Tim Profesional</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary shadow-inner">
                            <span className="material-symbols-outlined">sentiment_satisfied</span>
                        </div>
                        <div>
                            <div className="font-bold text-xl text-primary flex items-center">
                                <CountUp end={100} suffix="+" duration={2.5} />
                            </div>
                            <div className="text-xs text-on-surface-variant">Customer Puas</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative z-10">
                <div className="absolute -top-6 -right-6 z-30 glass-panel p-5 rounded-2xl border border-outline-variant card-shadow max-w-[220px]">
                    <div className="flex items-center gap-0.5 mb-2">
                        {[...Array(5)].map((_, i) => (
                            <span
                                key={i}
                                className="material-symbols-outlined text-secondary text-[18px] fill-icon"
                            >
                                star
                            </span>
                        ))}
                    </div>
                    <p className="text-primary font-medium italic text-sm leading-tight">
                        "Pelayanan sangat ramah dan profesional!"
                    </p>
                </div>

                <TiltedCard maxRotate={8} scaleOnHover={1.02} className="rounded-[40px]">
                    <img
                        alt="Professional Optician"
                        className="w-full h-[580px] object-cover rounded-[40px] shadow-2xl relative z-10 border-8 border-white"
                        src="https://lh3.googleusercontent.com/aida/AP1WRLtXY8MncdPk1qoyNOOTOz7m5mAgMgc9gTh_McBJdWFLK6eKk-vgsQNw4RoWE1kY7o0eQnDiwhI8bxEHeZEoD6W49Pv-ixVLrbuCiIT5kHhn5N3TgK5i2QSI6miQRngXZZ4kvw8x29d4A6Yh43GLWMuNVv66CIlS8GWIe0-POSA6ms-CV34z0HtQqn93Sa5UtfYjk-XKG_gpNo_ZP7fsG8oSRGjXIXSyvafxVQ7M_VqjlWZzHAIOrb6jcj4"
                    />
                </TiltedCard>
            </div>
        </section>
    );
}
