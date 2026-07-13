export default function Footer() {
    return (
        <footer className="bg-primary text-on-primary w-full py-20 px-6 mt-20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-secondary" />
            <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between gap-20 relative z-10">
                <div className="max-w-sm space-y-8">
                    <div className="bg-white px-5 py-3 rounded-2xl inline-block shadow-lg w-fit">
                        <img src="/logo.png" alt="Harmoni by Phoenix Sehat Logo" className="h-11 w-auto object-contain" />
                    </div>
                    <p className="text-white/85 leading-relaxed text-sm">
                        Harmoni by Phoenix Sehat adalah pusat perawatan mata holistik dan penyedia kacamata profesional yang berdedikasi untuk meningkatkan kualitas penglihatan pelanggan dengan pendekatan medis yang menenangkan.
                    </p>
                    <div className="flex gap-4">
                        <a className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center hover:bg-secondary transition-all" href="#">
                            <span className="material-symbols-outlined text-[24px]">public</span>
                        </a>
                        <a className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center hover:bg-secondary transition-all" href="#">
                            <span className="material-symbols-outlined text-[24px]">smartphone</span>
                        </a>
                        <a className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center hover:bg-secondary transition-all" href="#">
                            <span className="material-symbols-outlined text-[24px]">photo_camera</span>
                        </a>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-20">
                    <div className="space-y-6">
                        <h5 className="font-bold text-secondary uppercase tracking-[0.2em] text-sm">Layanan</h5>
                        <ul className="space-y-4">
                            <li><a className="text-white/80 hover:text-white transition-colors text-sm font-medium" href="/katalog-kacamata">Katalog Kacamata & Frame</a></li>
                            <li><a className="text-white/80 hover:text-white transition-colors text-sm font-medium" href="/booking">Reservasi & Booking Online</a></li>
                            <li><a className="text-white/80 hover:text-white transition-colors text-sm font-medium" href="/#services">Layanan Home Service</a></li>
                            <li><a className="text-white/80 hover:text-white transition-colors text-sm font-medium" href="/#affiliate">Program Afiliasi</a></li>
                        </ul>
                    </div>
                    <div className="space-y-6">
                        <h5 className="font-bold text-secondary uppercase tracking-[0.2em] text-sm">Harmoni Sehat</h5>
                        <ul className="space-y-4">
                            <li><a className="text-white/80 hover:text-white transition-colors text-sm font-medium" href="#">Tentang Harmoni</a></li>
                            <li><a className="text-white/80 hover:text-white transition-colors text-sm font-medium" href="#">Lokasi Cabang</a></li>
                            <li><a className="text-white/80 hover:text-white transition-colors text-sm font-medium" href="#">Kebijakan Privasi</a></li>
                            <li><a className="text-white/80 hover:text-white transition-colors text-sm font-medium" href="#">Syarat & Ketentuan</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="max-w-[1200px] mx-auto mt-20 pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
                <p className="text-white/60 text-sm">
                    © {new Date().getFullYear()} Harmoni by Phoenix Sehat • Enhance Your Vision.
                </p>
                <div className="flex items-center gap-6 text-white/60 text-xs font-bold tracking-widest uppercase">
                    <span>Harmoni Optical Care</span>
                    <span>•</span>
                    <span>Phoenix Sehat</span>
                </div>
            </div>
        </footer>
    );
}
