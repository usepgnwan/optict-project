import { useState, useEffect, useCallback } from 'react';
import { ScrollCard } from '@/Components/ReactBits';

const testimonials = [
    {
        name: 'Ibu Siti',
        role: 'Verified Customer',
        quote: 'Pelayanan home service sangat membantu, kacamata pas dan stylish! Tidak perlu repot keluar rumah lagi.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdDKNOPWnUI_kwnybJE5_CH_9TqRYk0fPQayV3NwdiCIld4DkPVpqPjTqr8k4gl_N1k6HgdJQLYq9kS_1T-ZHb-OmZssEwEV0Ha7vgTiiZrKeaKfFPIXs7nRLJZ-7RJoNQPLA5k3mzDvzwh7_bL2nzuLmNnC3WsQh-Y8hbcMqLrQCIEzT24zi_TAkV0s-W-ao7np4wSunHuLn7VxiRsTqBffT4po_nnGXD8-0n0qMUYZRCCBM_H545I6eoUtgEolPo0wPoE3t726g',
    },
    {
        name: 'Bapak Budi',
        role: 'Entrepreneur',
        quote: 'Pemeriksaan matanya sangat detail dan profesional. Koleksi framenya juga sangat beragam dan berkualitas tinggi.',
        image: 'https://lh3.googleusercontent.com/aida/AP1WRLvFLbBSiHxJdZ-lAWNPs49TVSHiiWuU1B7Be_K8XYm8JKkQSHPxfyF5OpIvNshDpPLPvkpyMSYFrEJlxxUrLc1mUW_r-oUW3OYevxAzfk3cEUIQU8ciIqyvWYdEsIxZcBa1vkhTIRAi32n6cR7cXJOaQx5ec90AJ-P6tXY8lYvIYSfXk7TT2BBCi71VrhgX10CARzBLv_5GPqhqbhacENAfwPaDxutA7GceSV3bXWEF9GuYBOJjc6EG0g',
    },
];

export default function TestimonialsSection() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const totalSlides = testimonials.length;

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, [totalSlides]);

    const prevSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    }, [totalSlides]);

    const goToSlide = (idx: number) => {
        setCurrentIndex(idx);
    };

    // Auto-play
    useEffect(() => {
        const timer = setInterval(nextSlide, 8000);
        return () => clearInterval(timer);
    }, [nextSlide]);

    return (
        <section className="py-20 bg-surface-variant/30 overflow-hidden">
            <div className="max-w-[1200px] mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest mb-3">
                        Testimoni Nyata
                    </span>
                    <h2 className="font-semibold text-[32px] leading-[40px] tracking-tight text-primary mb-3">
                        Apa Kata Pelanggan Kami
                    </h2>
                    <p className="text-on-surface-variant">Kepercayaan Anda adalah prioritas utama kami.</p>
                </div>

                <ScrollCard direction="up" enableSpotlight={false} className="relative group max-w-5xl mx-auto">
                    {/* Slider Controls */}
                    <button
                        onClick={prevSlide}
                        aria-label="Testimoni Sebelumnya"
                        className="absolute left-3 md:left-8 top-1/2 -translate-y-1/2 z-30 bg-surface p-3.5 md:p-4 rounded-full shadow-2xl border border-outline-variant text-primary hover:bg-primary hover:text-on-primary transition-all active:scale-95 cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-[24px]">chevron_left</span>
                    </button>
                    <button
                        onClick={nextSlide}
                        aria-label="Testimoni Selanjutnya"
                        className="absolute right-3 md:right-8 top-1/2 -translate-y-1/2 z-30 bg-surface p-3.5 md:p-4 rounded-full shadow-2xl border border-outline-variant text-primary hover:bg-primary hover:text-on-primary transition-all active:scale-95 cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-[24px]">chevron_right</span>
                    </button>

                    {/* Absolute Positioning Slider Container */}
                    <div className="relative w-full h-[640px] md:h-[480px] rounded-[40px] bg-surface border border-outline-variant overflow-hidden">
                        {testimonials.map((testimonial, idx) => {
                            const isActive = idx === currentIndex;
                            return (
                                <div
                                    key={testimonial.name}
                                    className={`absolute inset-0 w-full h-full transition-all duration-700 ease-in-out ${isActive
                                        ? 'opacity-100 z-10 translate-x-0'
                                        : 'opacity-0 z-0 pointer-events-none translate-x-4'
                                        }`}
                                >
                                    <div className="flex flex-col md:flex-row h-full w-full">
                                        <div className="w-full md:w-1/2 h-64 md:h-full shrink-0 overflow-hidden">
                                            <img
                                                alt={testimonial.name}
                                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                                src={testimonial.image}
                                            />
                                        </div>
                                        <div className="w-full md:w-1/2 p-8 md:p-14 flex flex-col justify-center">
                                            <div className="flex items-center gap-1 mb-6">
                                                {[...Array(5)].map((_, i) => (
                                                    <span key={i} className="material-symbols-outlined text-secondary text-xl">
                                                        star
                                                    </span>
                                                ))}
                                            </div>
                                            <blockquote className="text-primary font-semibold text-lg md:text-2xl mb-8 leading-relaxed italic">
                                                "{testimonial.quote}"
                                            </blockquote>
                                            <div>
                                                <div className="font-bold text-primary text-xl md:text-2xl mb-1">
                                                    {testimonial.name}
                                                </div>
                                                <div className="text-secondary font-semibold text-xs md:text-sm uppercase tracking-widest">
                                                    {testimonial.role}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Pagination Dots */}
                    <div className="flex justify-center gap-2.5 mt-8">
                        {testimonials.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => goToSlide(idx)}
                                aria-label={`Pindah ke testimoni ${idx + 1}`}
                                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${idx === currentIndex ? 'w-8 bg-primary' : 'w-2.5 bg-outline-variant hover:bg-primary/50'
                                    }`}
                            />
                        ))}
                    </div>
                </ScrollCard>
            </div>
        </section>
    );
}
