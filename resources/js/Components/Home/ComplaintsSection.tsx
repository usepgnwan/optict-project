import React from 'react';
import { ScrollCard } from '@/Components/ReactBits';

const complaints = [
    { icon: 'visibility_off', title: 'Mata Lelah', description: 'Terlalu lama menatap layar digital setiap hari.', accent: 'tertiary', textColor: 'primary' },
    { icon: 'blur_on', title: 'Pandangan Buram', description: 'Kesulitan melihat objek dalam jarak dekat atau jauh.', accent: 'secondary', textColor: 'secondary' },
    { icon: 'build_circle', title: 'Kacamata Rusak', description: 'Lensa baret atau frame patah yang perlu diperbaiki.', accent: 'tertiary', textColor: 'primary' },
    { icon: 'schedule', title: 'Malas Antre', description: 'Ingin konsultasi tepat waktu tanpa menunggu lama.', accent: 'secondary', textColor: 'secondary' },
];

export default function ComplaintsSection() {
    return (
        <section className="bg-tertiary/40 py-20 dotted-bg">
            <div className="max-w-[1200px] mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="font-semibold text-[32px] leading-[40px] tracking-tight text-primary mb-3">
                        Sering Mengalami Keluhan?
                    </h2>
                    <p className="text-on-surface-variant max-w-xl mx-auto">
                        Kami siap membantu mengatasi masalah penglihatan Anda dengan pendekatan medis yang menenangkan.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {complaints.map((item, idx) => (
                        <ScrollCard
                            key={item.title}
                            index={idx}
                            direction="up"
                            enableSpotlight={true}
                            className="bg-surface p-10 rounded-2xl border border-outline-variant card-shadow flex flex-col items-center text-center"
                        >
                            <div className='w-full justify-center items-center flex'>
                                <div className={`w-20 h-20 ${item.accent === 'tertiary' ? 'bg-tertiary' : 'bg-secondary/10'} rounded-full flex items-center justify-center mb-8`}>
                                    <span className={`material-symbols-outlined text-${item.textColor} text-4xl`}>{item.icon}</span>
                                </div>
                            </div>
                            <h3 className="font-semibold text-2xl text-primary mb-3">{item.title}</h3>
                            <p className="text-on-surface-variant">{item.description}</p>
                        </ScrollCard>
                    ))}
                </div>
            </div>
        </section>
    );
}
