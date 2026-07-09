import React from 'react';
import { CountUp } from '@/Components/ReactBits';

export default function StatsSection() {
    return (
        <section className="py-16 px-6">
            <div className="max-w-[1200px] mx-auto bg-primary text-on-primary rounded-[40px] p-16 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl animate-float" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full -ml-32 -mb-32 blur-3xl animate-float" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center relative z-10">
                    <div className="space-y-4">
                        <div className="text-5xl font-bold">
                            <CountUp end={100} suffix="%" duration={2} />
                        </div>
                        <div className="text-lg font-medium opacity-80 uppercase tracking-widest">
                            Puas &amp; Nyaman
                        </div>
                    </div>
                    <div className="space-y-4 border-y md:border-y-0 md:border-x border-white/10 py-12 md:py-0">
                        <div className="text-5xl font-bold">
                            <CountUp end={500} suffix="+" duration={2.5} />
                        </div>
                        <div className="text-lg font-medium opacity-80 uppercase tracking-widest">
                            Koleksi Frame
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="text-5xl font-bold">
                            <CountUp end={7} suffix=" Hari" duration={1.8} />
                        </div>
                        <div className="text-lg font-medium opacity-80 uppercase tracking-widest">
                            Siap Melayani
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
