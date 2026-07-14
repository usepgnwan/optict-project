import React from 'react';
import { ScrollCard } from '@/Components/ReactBits';

const steps = [
    { icon: 'chat', title: 'Chat WhatsApp', description: 'Hubungi kami untuk konsultasi awal yang mudah.', active: true },
    { icon: 'calendar_month', title: 'Pilih Jadwal', description: 'Tentukan waktu kunjungan yang paling nyaman.', active: false },
    { icon: 'home_pin', title: 'Tim Datang', description: 'Tim ahli kami tiba di lokasi Anda tepat waktu.', active: false },
    { icon: 'visibility', title: 'Pemeriksaan Mata', description: 'Pemeriksaan profesional dengan alat lengkap.', active: false },
    { icon: 'local_shipping', title: 'Kacamata Dikirim', description: 'Pesanan selesai dan diantar langsung ke tangan Anda.', active: false },
];

export default function ProcessSection() {
    return (
        <section className="py-20 bg-tertiary/20 dotted-bg">
            <div className=" mx-auto px-2">
                <div className="text-center mb-20 relative z-10">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[80px] -z-10 pointer-events-none"></div>

                    <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/60 text-primary font-semibold text-sm mb-6 border border-primary/10 shadow-sm backdrop-blur-md">
                        <span className="material-symbols-outlined text-[18px]">verified</span>
                        Alur Layanan
                    </span>

                    <h3 className="font-extrabold text-4xl md:text-5xl lg:text-[54px] leading-tight tracking-tight mb-6 text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/90 to-secondary drop-shadow-sm">
                        Langkah Mudah Konsultasi
                    </h3>

                    <p className="text-on-surface-variant text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
                        Proses sederhana dan profesional untuk penglihatan yang lebih baik tanpa repot.
                    </p>
                </div>
                <div className="relative grid grid-cols-1 md:grid-cols-2 gap-y-12 md:gap-y-16 gap-x-4 md:gap-x-20 pt-4 max-w-4xl mx-auto">
                    {/* Snake line connecting 3 rows (hidden on mobile) */}
                    <div className="hidden md:block absolute top-0 left-0 w-full h-[90%] z-0 pointer-events-none">
                        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" fill="none" overflow="visible" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M 25 14 L 75 14 C 95 14, 95 50, 75 50 L 25 50 C 5 50, 5 86, 25 86 L 80 86"
                                stroke="currentColor"
                                className="text-primary/30"
                                strokeWidth="2"
                                strokeDasharray="4 4"
                                strokeLinecap="round"
                                vectorEffect="non-scaling-stroke"
                            />
                        </svg>
                    </div>
                    {steps.map((step, idx) => (
                        <div key={step.title} className={idx === 2 ? "col-span-1 md:col-span-2 flex justify-center" : "col-span-1"}>
                            <div className={idx === 2 ? "w-full md:w-[45%]" : "w-full"}>
                                <ScrollCard
                                    index={idx}
                                    direction="up"
                                    enableSpotlight={false}
                                    className="relative z-10 flex flex-col items-center text-center w-full group cursor-pointer"
                                >
                                    <div className="relative mx-auto w-24 h-24 md:w-28 md:h-28 rounded-[2rem] bg-white text-primary flex items-center justify-center mb-6 transition-all duration-500 ease-out group-hover:scale-110 group-hover:-translate-y-3 group-hover:shadow-[0_20px_40px_-15px_rgba(var(--color-primary),0.3)] shadow-xl border-4 border-white group-hover:border-primary/10">
                                        <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                        <span className="material-symbols-outlined text-4xl md:text-5xl transition-all duration-500 group-hover:scale-110 group-hover:text-secondary relative z-10 drop-shadow-sm group-hover:drop-shadow-md">
                                            {step.icon}
                                        </span>
                                    </div>
                                    <h4 className="font-bold text-primary text-lg mb-2 transition-colors duration-300 group-hover:text-secondary">{step.title}</h4>
                                    <p className="text-on-surface-variant text-sm px-4 transition-all duration-300 group-hover:text-primary/80">{step.description}</p>
                                </ScrollCard>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
