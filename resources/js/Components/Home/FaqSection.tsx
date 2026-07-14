import { useState } from 'react';

interface Faq {
    id: number;
    question: string;
    answer: string;
    is_active: boolean;
    sort_order: number;
}

interface FaqSectionProps {
    faqs?: Faq[];
}

export default function FaqSection({ faqs = [] }: FaqSectionProps) {
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
                {faqs.length === 0 ? (
                    <div className="text-center py-12 text-on-surface-variant">
                        <span className="material-symbols-outlined text-4xl mb-3 block opacity-40">quiz</span>
                        <p className="text-sm">Belum ada FAQ yang tersedia.</p>
                    </div>
                ) : (
                    faqs.map((faq, idx) => (
                        <div key={faq.id} className="border border-outline-variant rounded-2xl overflow-hidden card-shadow">
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
                    ))
                )}
            </div>
        </section>
    );
}
