import { PropsWithChildren } from 'react';
import { Head } from '@inertiajs/react';
import Navbar from '@/Components/Home/Navbar';
import Footer from '@/Components/Home/Footer';
import WhatsAppButton from '@/Components/Home/WhatsAppButton';

interface HomeLayoutProps extends PropsWithChildren {
    title?: string;
}

export default function HomeLayout({ title, children }: HomeLayoutProps) {
    return (
        <>
            <Head title={title} />
            <Navbar />
            <main>{children}</main>
            <Footer />
            <WhatsAppButton />
        </>
    );
}
