import React, { useState, useRef, useEffect, FormEventHandler } from 'react';

const branches = [
    { id: 'home_service', city: 'Home Service', name: 'Kunjungan ke Rumah / Kantor (Jabodetabek & Kota Besar)' },
    { id: 'jkt_senopati', city: 'Jakarta Selatan', name: 'Senopati Flagship Store' },
    { id: 'jkt_menteng', city: 'Jakarta Pusat', name: 'Menteng Studio' },
    { id: 'tgr_pik', city: 'Tangerang', name: 'PIK 2 Gallery & Lifestyle Store' },
    { id: 'bdg_dago', city: 'Bandung', name: 'Dago Heritage Concept Store' },
    { id: 'sby_dharma', city: 'Surabaya', name: 'Dharmahusada Clinical Care' },
    { id: 'jog_gejayan', city: 'Yogyakarta', name: 'Gejayan Optical Center' },
    { id: 'smg_simpang', city: 'Semarang', name: 'Simpang Lima Studio & Gallery' },
    { id: 'bali_canggu', city: 'Bali', name: 'Canggu Resort Edition' },
    { id: 'mdn_polonia', city: 'Medan', name: 'Polonia Eye Care Clinic' },
    { id: 'mks_panakkukang', city: 'Makassar', name: 'Panakkukang Optical Center' },
];

export default function BookingFormSection() {
    const [selectedBranch, setSelectedBranch] = useState(branches[0]);
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredBranches = branches.filter((item) =>
        `${item.city} ${item.name}`.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        // TODO: Connect to backend
    };

    return (
        <section id="booking" className="py-20 dotted-bg scroll-mt-24">
            <div className="max-w-[1200px] mx-auto px-6">
                <div className="max-w-3xl mx-auto bg-surface p-8 md:p-14 rounded-[40px] shadow-2xl border border-outline-variant relative overflow-visible">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-tertiary rounded-full -mr-16 -mt-16 pointer-events-none" />
                    
                    <div className="text-center mb-10 relative z-10">
                        <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest mb-3">
                            Reservasi Instan
                        </span>
                        <h2 className="font-semibold text-[32px] leading-[40px] tracking-tight text-primary mb-3">
                            Pesan Jadwal Online
                        </h2>
                        <p className="text-on-surface-variant max-w-lg mx-auto">
                            Lengkapi data di bawah ini, admin kami akan segera menghubungi Anda melalui WhatsApp.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-primary uppercase tracking-widest">
                                    Nama Lengkap
                                </label>
                                <input
                                    className="w-full h-14 px-5 rounded-2xl border-2 border-outline-variant bg-surface text-primary focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                                    placeholder="Contoh: Budi Santoso"
                                    type="text"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-primary uppercase tracking-widest">
                                    WhatsApp
                                </label>
                                <input
                                    className="w-full h-14 px-5 rounded-2xl border-2 border-outline-variant bg-surface text-primary focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                                    placeholder="0812xxxxxxx"
                                    type="tel"
                                    required
                                />
                            </div>
                        </div>

                        {/* Searchable Branch Select Dropdown */}
                        <div className="space-y-2 relative" ref={dropdownRef}>
                            <label className="text-sm font-bold text-primary uppercase tracking-widest">
                                Pilih Cabang / Layanan
                            </label>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsOpen(!isOpen);
                                        if (!isOpen) setSearchQuery('');
                                    }}
                                    className="w-full h-14 px-5 rounded-2xl border-2 border-outline-variant bg-surface text-left flex items-center justify-between hover:border-primary/60 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all cursor-pointer"
                                >
                                    <div className="truncate pr-4">
                                        <span className="font-bold text-primary">{selectedBranch.city}</span>
                                        <span className="text-on-surface-variant text-sm ml-2">({selectedBranch.name})</span>
                                    </div>
                                    <span className={`material-symbols-outlined text-on-surface-variant transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : ''}`}>
                                        expand_more
                                    </span>
                                </button>

                                {/* Dropdown Menu */}
                                {isOpen && (
                                    <div className="absolute left-0 right-0 top-full mt-2 bg-surface rounded-2xl border border-outline-variant shadow-2xl z-50 overflow-hidden animate-fadeIn">
                                        {/* Search Input Box */}
                                        <div className="p-3 border-b border-outline-variant bg-surface-variant/40">
                                            <div className="relative">
                                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
                                                    search
                                                </span>
                                                <input
                                                    type="text"
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                    placeholder="Cari kota atau nama cabang..."
                                                    className="w-full h-10 pl-10 pr-4 rounded-xl bg-surface border border-outline-variant text-sm text-primary focus:outline-none focus:border-primary"
                                                    autoFocus
                                                />
                                            </div>
                                        </div>

                                        {/* Filtered Branch Options */}
                                        <div className="max-h-60 overflow-y-auto divide-y divide-outline-variant/40">
                                            {filteredBranches.length > 0 ? (
                                                filteredBranches.map((branch) => {
                                                    const isSelected = selectedBranch.id === branch.id;
                                                    return (
                                                        <button
                                                            key={branch.id}
                                                            type="button"
                                                            onClick={() => {
                                                                setSelectedBranch(branch);
                                                                setIsOpen(false);
                                                            }}
                                                            className={`w-full text-left px-4 py-3 flex items-center justify-between hover:bg-tertiary/30 transition-colors cursor-pointer ${
                                                                isSelected ? 'bg-primary/10' : ''
                                                            }`}
                                                        >
                                                            <div>
                                                                <p className={`font-bold text-sm ${isSelected ? 'text-primary' : 'text-primary'}`}>
                                                                    {branch.city}
                                                                </p>
                                                                <p className="text-xs text-on-surface-variant">
                                                                    {branch.name}
                                                                </p>
                                                            </div>
                                                            {isSelected && (
                                                                <span className="material-symbols-outlined text-primary text-[20px]">
                                                                    check_circle
                                                                </span>
                                                            )}
                                                        </button>
                                                    );
                                                })
                                            ) : (
                                                <div className="p-4 text-center text-sm text-on-surface-variant">
                                                    Cabang tidak ditemukan
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-primary uppercase tracking-widest">
                                    Tipe Keluhan
                                </label>
                                <select className="w-full h-14 px-5 rounded-2xl border-2 border-outline-variant bg-surface text-primary focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none">
                                    <option>Mata Lelah / Sakit Kepala</option>
                                    <option>Pandangan Buram Jarak Jauh</option>
                                    <option>Kesulitan Membaca (Jarak Dekat)</option>
                                    <option>Ganti Frame / Lensa</option>
                                    <option>Lainnya</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-primary uppercase tracking-widest">
                                    Pilih Tanggal
                                </label>
                                <input
                                    className="w-full h-14 px-5 rounded-2xl border-2 border-outline-variant bg-surface text-primary focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                                    type="date"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            className="w-full bg-primary text-on-primary h-16 rounded-2xl font-bold text-lg hover:bg-primary/95 hover:shadow-2xl transition-all shadow-xl shadow-primary/20 mt-4 active:scale-[0.99] cursor-pointer"
                            type="submit"
                        >
                            Konfirmasi Jadwal
                        </button>
                        <p className="text-center text-xs text-on-surface-variant font-medium pt-1">
                            *Sistem kami aman dan data Anda bersifat rahasia.
                        </p>
                    </form>
                </div>
            </div>
        </section>
    );
}
