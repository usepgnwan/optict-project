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
            <div className="max-w-[1200px] mx-auto px-6">
                <div className="text-center mb-16">
                    <h3 className="font-semibold text-[32px] leading-[40px] tracking-tight text-primary mb-3">
                        Langkah Mudah Konsultasi
                    </h3>
                    <p className="text-on-surface-variant max-w-xl mx-auto">
                        Proses sederhana dan profesional untuk penglihatan yang lebih baik tanpa repot.
                    </p>
                </div>
                <div className="relative flex flex-col md:flex-row justify-between items-center md:items-start gap-12 md:gap-4 pt-4">
                    <div className="hidden md:block absolute top-14 left-0 w-full h-[2px] bg-primary/10 z-0" />
                    {steps.map((step, idx) => (
                        <ScrollCard
                            key={step.title}
                            index={idx}
                            direction="up"
                            enableSpotlight={false}
                            className="relative z-10 flex flex-col items-center text-center flex-1 group w-full pt-4 px-2"
                        >
                            <div className={`relative mx-auto w-28 h-28 rounded-[2rem] ${step.active ? 'bg-primary text-on-primary shadow-2xl' : 'bg-white text-primary shadow-xl'} flex items-center justify-center mb-8 transition-all group-hover:scale-105 border-4 border-white`}>
                                <span className="material-symbols-outlined text-4xl">{step.icon}</span>
                                <div className={`absolute -top-3 -right-3 w-10 h-10 ${step.active ? 'bg-secondary text-white' : 'bg-outline text-on-surface-variant'} rounded-full flex items-center justify-center font-bold shadow-lg border-2 border-white z-20`}>
                                    {idx + 1}
                                </div>
                            </div>
                            <h4 className="font-bold text-primary text-lg mb-2">{step.title}</h4>
                            <p className="text-on-surface-variant text-sm px-4">{step.description}</p>
                        </ScrollCard>
                    ))}
                </div>
            </div>
        </section>
    );
}
