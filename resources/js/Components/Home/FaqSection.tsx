import { useState } from 'react';

const faqs = [
    {
        question: 'Berapa lama proses pembuatan kacamata?',
        answer: 'Proses pembuatan kacamata rata-rata memakan waktu 1-3 hari kerja tergantung pada jenis lensa dan kompleksitas resep Anda. Untuk lensa standar, seringkali dapat selesai dalam hari yang sama.',
    },
    {
        question: 'Apakah ada garansi untuk frame dan lensa?',
        answer: 'Ya, kami memberikan garansi 6-12 bulan untuk kerusakan pabrik pada frame dan garansi kenyamanan resep selama 1 bulan. Syarat dan ketentuan berlaku untuk setiap merek tertentu.',
    },
];

export default function FaqSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggle = (idx: number) => {
        setOpenIndex(openIndex === idx ? null : idx);
    };

    return (
        <section className="py-20 max-w-[1200px] mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className="font-semibold text-[32px] leading-[40px] tracking-tight text-primary mb-3">
                    Pertanyaan Umum
                </h2>
                <p className="text-on-surface-variant">
                    Segala hal yang perlu Anda ketahui tentang layanan premium kami.
                </p>
            </div>
            <div className="max-w-3xl mx-auto space-y-6">
                {faqs.map((faq, idx) => (
                    <div key={idx} className="border border-outline-variant rounded-2xl overflow-hidden card-shadow">
                        <button
                            className="w-full p-8 text-left flex justify-between items-center bg-white hover:bg-tertiary/20 transition-colors group"
                            onClick={() => toggle(idx)}
                        >
                            <span className="font-bold text-primary text-lg group-hover:text-primary transition-colors">
                                {faq.question}
                            </span>
                            <span className="material-symbols-outlined text-secondary transition-all">
                                {openIndex === idx ? 'remove' : 'add'}
                            </span>
                        </button>
                        {openIndex === idx && (
                            <div className="p-8 bg-tertiary/10 text-on-surface-variant leading-relaxed border-t border-outline-variant">
                                {faq.answer}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}
