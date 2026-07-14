import React from 'react';
import { ScrollCard } from '@/Components/ReactBits';

const staticServices = [
    {
        id: 0,
        title: 'Pemeriksaan Refraksi Digital',
        description: 'Pemeriksaan mata akurat menggunakan teknologi digital terkini untuk hasil presisi maksimal.',
        thumbnail: null,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB7aS6Is0ZsFKhWh6HEHLKkVzChFSORG4pZrc6fmD1i02iFYFZK5TInEDPKNBkfuJT-0xcFrVRnl0gagE4wwyGL0TohIkJDKUbs5vZCvo1May1bZJsLpXWgwHi6E1oHP0Z0TSJvi0PJcyqDiupJayodI1RksDZnjbu_xzJqmqZ74fIAKuFblDL5dyOexcPnduS1u8mWjWdmRVGQqe93Rjy64rfNLQmq56gkpXy5tLJQ0jryN7lzAUBNC1lJX2RN9fMeK6zJdoipDhc',
    },
    {
        id: 1,
        title: 'Konsultasi Lensa Spesialis',
        description: 'Saran ahli untuk pemilihan lensa yang paling sesuai dengan kebutuhan gaya hidup aktif Anda.',
        thumbnail: null,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDaVb56SXm-MEkklwUSjnUhQ-0kJI5SgR1g7DI0vNAQxN95Ui3E75x0ExuNer-wXaqqD4Q5vr5k77jKeC2STONjC-6cOVg7dUK4wN4wCWn7tip4PjCFzxFLuf5i9Kka4_OXqGYKx_rLuReUU8KCMWt88JM0IwRwsab4qzuIGn52iUcK1zp_NLGyCSEM3yalob0us4R7ximDzVBTbGnrkSYOKyfABR3hmFrkT2eL560NzXeiCsg12WNviBDm-GAZqKKeuGVFBOxjG8o',
    },
    {
        id: 2,
        title: 'Home Service Exclusive',
        description: 'Layanan pemeriksaan mata profesional yang hadir langsung di kenyamanan rumah pribadi Anda.',
        thumbnail: null,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5Gsk3GrUogfi4-YeyzaBviod-VC-jHOtCvW8iah5l4xg7ftsyXr-vpXCCb3pcJCavBiRU-xK_CoA1U680NFXu22BA0CZ0gJL-mlkfVoEKIOmOdW9nbF6qmHusvWEClnHVOQxAbNrhEL9YudazE4ZfZlMZy9qgyuBZRV1BUxYJiZqdIQQWIQfxXa5rNsgOqeF7CiXD-hIzzEiuV-EoAyl40xtokV2zGFaSNDdlxccLXp9NlCQv3iF2dilr5qI0ne94LMTj-eJP-cs',
    },
    {
        id: 3,
        title: 'Frame Fitting & Adjustment',
        description: 'Penyetelan bingkai kacamata secara presisi agar pas dan nyaman digunakan sepanjang hari.',
        thumbnail: null,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCyz21PEXekSrPARpN9wWXWFD4UxoXvyZvwVCVmL3Rm6RIa9nBMvE3ZqeubpqMay-xusrZ27qr6WS5hNCMomIEVoNFb71lTZkpJeTwsAejSHeK7TjmYxfA-L7TJ7DcN0fQLLx92sYY2JVY56EGhCFZx-hO2-ahX9YGqDVjqURoVqto7o42i-KEhBMYE88PhAWUD7x-02iUH4HNZaK46n8WTecqRfwBFq_cEf3NbcNhBZNNccDjCQfP8CfZy9V2l6EKasRMx9Jo1n1M',
    },
];

interface Service {
    id: number;
    title: string;
    slug?: string;
    description: string | null;
    thumbnail: string | null;
}

interface ServicesSectionProps {
    services?: Service[];
}

export default function ServicesSection({ services = [] }: ServicesSectionProps) {
    const displayServices = services.slice(0, 4);

    const getImageSrc = (service: any) =>
        service.thumbnail ? `/storage/${service.thumbnail}` : service.image || '';

    const getDescription = (service: any) => {
        if (!service.description) return '';
        // Strip HTML tags for display
        return service.description.replace(/<[^>]*>/g, '');
    };

    return (
        <section id="services" className="bg-surface py-20 scroll-mt-24">
            <div className="max-w-[1200px] mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="font-semibold text-[32px] leading-[40px] tracking-tight text-primary mb-3">
                        Layanan Spesialis Kami
                    </h2>
                    <p className="text-on-surface-variant max-w-xl mx-auto">
                        Solusi kesehatan mata menyeluruh dengan standar medis profesional dan sentuhan personal.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {displayServices.map((service, idx) => (
                        <ScrollCard
                            key={service.id}
                            index={idx}
                            direction="up"
                            enableSpotlight={true}
                            className="group bg-surface rounded-2xl border border-outline-variant card-shadow overflow-hidden flex flex-col"
                        >
                            <div className="relative h-56 overflow-hidden">
                                <img
                                    alt={service.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    src={getImageSrc(service)}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
                                <span className="absolute top-4 left-4 bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
                                    Featured
                                </span>
                            </div>
                            <div className="p-8 flex-1 flex flex-col relative z-20">
                                <h3 className="font-bold text-primary text-xl mb-3">{service.title}</h3>
                                <p className="text-on-surface-variant text-sm leading-relaxed mb-6 line-clamp-3">
                                    {getDescription(service)}
                                </p>
                                <a
                                    href={(service as any).slug ? `/layanan/${(service as any).slug}` : '/layanan'}
                                    className="mt-auto text-secondary font-bold text-sm flex items-center gap-2 group-hover:translate-x-1 transition-transform cursor-pointer"
                                >
                                    Detail Layanan <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                </a>
                            </div>
                        </ScrollCard>
                    ))}
                </div>
            </div>
        </section>
    );
}

