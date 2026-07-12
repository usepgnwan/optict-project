import HomeLayout from '@/Layouts/HomeLayout';
import HeroSection from '@/Components/Home/HeroSection';
import ComplaintsSection from '@/Components/Home/ComplaintsSection';
import LocationsSection from '@/Components/Home/LocationsSection';
import AboutSection from '@/Components/Home/AboutSection';
import ProcessSection from '@/Components/Home/ProcessSection';
import ServicesSection from '@/Components/Home/ServicesSection';
import CatalogSection from '@/Components/Home/CatalogSection';
import AffiliateSection from '@/Components/Home/AffiliateSection';
import CtaSection from '@/Components/Home/CtaSection';
import StatsSection from '@/Components/Home/StatsSection';
import TestimonialsSection from '@/Components/Home/TestimonialsSection';
import BranchDirectorySection from '@/Components/Home/BranchDirectorySection';
import BookingFormSection from '@/Components/Home/BookingFormSection';
import FaqSection from '@/Components/Home/FaqSection';

export default function Home({ dbProducts = [], branches = [] }: { dbProducts?: any[]; branches?: any[] }) {
    return (
        <HomeLayout title="Home | Layanan Kesehatan Mata Terpercaya">
            <HeroSection />
            <AboutSection />
            <ComplaintsSection />
            <ProcessSection />
            <LocationsSection />
            <ServicesSection />
            <CatalogSection isHomePreview={true} dbProducts={dbProducts} branches={branches} />
            <AffiliateSection />
            <CtaSection />
            <StatsSection />
            <TestimonialsSection />
            <BranchDirectorySection />
            <BookingFormSection />
            <FaqSection />
        </HomeLayout>
    );
}
