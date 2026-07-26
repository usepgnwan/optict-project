import { Link } from '@inertiajs/react';
import HomeLayout from '@/Layouts/HomeLayout';
import { motion } from 'framer-motion';

export default function NotFound() {
    return (
        <HomeLayout title="404 - Halaman Tidak Ditemukan">
            <div className="min-h-[80vh] flex items-center justify-center bg-surface relative overflow-hidden dotted-bg">
                {/* Decorative background elements */}
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-tertiary/20 rounded-full blur-3xl pointer-events-none"></div>

                <div className="max-w-2xl w-full px-6 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-[120px] md:text-[180px] font-black text-transparent bg-clip-text bg-gradient-to-br from-primary to-tertiary leading-none tracking-tighter drop-shadow-sm mb-4">
                            404
                        </h1>
                        <h2 className="text-2xl md:text-4xl font-bold text-on-surface mb-6">
                            Oops! Sepertinya Anda Salah Jalan
                        </h2>
                        <p className="text-on-surface-variant text-base md:text-lg mb-10 max-w-lg mx-auto">
                            Halaman yang Anda cari mungkin telah dipindahkan, dihapus, atau memang tidak pernah ada. Mari kembali ke jalan yang benar.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link 
                                href="/" 
                                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-primary text-on-primary font-bold shadow-lg shadow-primary/30 hover:scale-105 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined">home</span>
                                Kembali ke Beranda
                            </Link>
                            <Link 
                                href="/katalog-kacamata" 
                                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-surface border border-outline-variant text-on-surface font-bold hover:bg-surface-variant transition-colors flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined">search</span>
                                Cari Kacamata
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </HomeLayout>
    );
}
