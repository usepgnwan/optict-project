export default function Footer() {
    return (
        <footer className="bg-primary text-on-primary w-full py-20 px-6 mt-20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-secondary" />
            <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between gap-20 relative z-10">
                <div className="max-w-sm space-y-8">
                    <div className="font-semibold text-[32px] leading-[40px] tracking-tight text-white">Optik Calm</div>
                    <p className="text-white/70 leading-relaxed">
                        Memberikan pengalaman pemeriksaan mata yang menenangkan dan profesional dengan hasil yang presisi demi kenyamanan visual optimal Anda.
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
                            <li><a className="text-white/70 hover:text-white transition-colors text-sm font-medium" href="#">Optical Health Guide</a></li>
                            <li><a className="text-white/70 hover:text-white transition-colors text-sm font-medium" href="#">Clinic Locations</a></li>
                            <li><a className="text-white/70 hover:text-white transition-colors text-sm font-medium" href="#">Contact Experts</a></li>
                        </ul>
                    </div>
                    <div className="space-y-6">
                        <h5 className="font-bold text-secondary uppercase tracking-[0.2em] text-sm">Legal</h5>
                        <ul className="space-y-4">
                            <li><a className="text-white/70 hover:text-white transition-colors text-sm font-medium" href="#">Privacy Policy</a></li>
                            <li><a className="text-white/70 hover:text-white transition-colors text-sm font-medium" href="#">Terms of Service</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="max-w-[1200px] mx-auto mt-20 pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
                <p className="text-white/50 text-sm">
                    © 2024 Optik Calm. Professional Serenity for your Eyes.
                </p>
                <div className="flex items-center gap-6 text-white/50 text-xs font-bold tracking-widest uppercase">
                    <span>Inter Font Family</span>
                    <span>•</span>
                    <span>Design System v2.0</span>
                </div>
            </div>
        </footer>
    );
}
