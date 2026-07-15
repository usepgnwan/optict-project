import React, { useState, useRef, useEffect, FormEventHandler } from 'react';
import { router, usePage } from '@inertiajs/react';

const fallbackBranches = [
    { id: 'home_service', city: 'Home Service', name: 'Kunjungan ke Rumah / Kantor (Jabodetabek & Kota Besar)', phone: '081199988877' },
    { id: 'jkt_senopati', city: 'Jakarta Selatan', name: 'Senopati Flagship Store', phone: '081199988801' },
    { id: 'jkt_menteng', city: 'Jakarta Pusat', name: 'Menteng Studio', phone: '081199988801' },
    { id: 'tgr_pik', city: 'Tangerang', name: 'PIK 2 Gallery & Lifestyle Store', phone: '081199988801' },
    { id: 'bdg_dago', city: 'Bandung', name: 'Dago Heritage Concept Store', phone: '081199988802' },
    { id: 'sby_dharma', city: 'Surabaya', name: 'Dharmahusada Clinical Care', phone: '081199988803' },
    { id: 'jog_gejayan', city: 'Yogyakarta', name: 'Gejayan Optical Center', phone: '081199988803' },
    { id: 'smg_simpang', city: 'Semarang', name: 'Simpang Lima Studio & Gallery', phone: '081199988803' },
    { id: 'bali_canggu', city: 'Bali', name: 'Canggu Resort Edition', phone: '081199988803' },
    { id: 'mdn_polonia', city: 'Medan', name: 'Polonia Eye Care Clinic', phone: '081199988804' },
    { id: 'mks_panakkukang', city: 'Makassar', name: 'Panakkukang Optical Center', phone: '081199988804' },
];

const fallbackComplaintTypes = [
    { id: 1, name: 'Mata Lelah / Sakit Kepala' },
    { id: 2, name: 'Pandangan Buram Jarak Jauh' },
    { id: 3, name: 'Kesulitan Membaca (Jarak Dekat)' },
    { id: 4, name: 'Pemeriksaan Rutin / Ganti Lensa' },
    { id: 5, name: 'Konsultasi Frame Kacamata' },
    { id: 6, name: 'Lainnya' },
];

export default function BookingFormSection({
    branches = [],
    complaintTypes = [],
    isStandalone = false,
}: {
    branches?: any[];
    complaintTypes?: any[];
    isStandalone?: boolean;
}) {
    const activeBookingBranches =
        branches && branches.length > 0
            ? branches.map((b: any) => ({
                id: b.id,
                city: b.city || 'Cabang',
                name: b.name,
                phone: b.phone || '081199988877',
            }))
            : fallbackBranches;

    const { sharedComplaintTypes, complaintTypes: pageComplaintTypes } = usePage().props as any;
    const activeComplaintTypes =
        complaintTypes && complaintTypes.length > 0
            ? complaintTypes
            : sharedComplaintTypes && sharedComplaintTypes.length > 0
                ? sharedComplaintTypes
                : pageComplaintTypes && pageComplaintTypes.length > 0
                    ? pageComplaintTypes
                    : fallbackComplaintTypes;

    const [selectedBranch, setSelectedBranch] = useState(activeBookingBranches[0]);
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    const [fullName, setFullName] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [complaint, setComplaint] = useState(activeComplaintTypes[0]?.name || 'Mata Lelah / Sakit Kepala');
    const [date, setDate] = useState('');
    const [referralCode, setReferralCode] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Success Modal State
    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const [savedReservationNumber, setSavedReservationNumber] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const track = params.get('track');
            if (track) {
                setReferralCode(track);
            }
        }
    }, []);

    // Update default selection if activeBookingBranches or activeComplaintTypes loads
    useEffect(() => {
        if (activeBookingBranches.length > 0) {
            setSelectedBranch(activeBookingBranches[0]);
        }
    }, [branches]);

    useEffect(() => {
        if (activeComplaintTypes.length > 0 && (!complaint || complaint === fallbackComplaintTypes[0].name)) {
            setComplaint(activeComplaintTypes[0].name);
        }
    }, [sharedComplaintTypes, complaintTypes]);

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

    const filteredBranches = activeBookingBranches.filter((item) =>
        `${item.city} ${item.name}`.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        setSubmitting(true);

        router.post(
            route('booking.store'),
            {
                fullName,
                whatsapp,
                branch_id: selectedBranch.id,
                branch_name: selectedBranch.name,
                date,
                complaint,
                referral_code: referralCode,
            },
            {
                onSuccess: (page: any) => {
                    setSubmitting(false);
                    const flash = page?.props?.flash;
                    const resNumber = flash?.reservation_number || 'ONLINE';
                    setSavedReservationNumber(resNumber);
                    setSuccessModalOpen(true);
                },
                onError: () => {
                    setSubmitting(false);
                },
            }
        );
    };

    const openWhatsAppChat = () => {
        const rawPhone = selectedBranch?.phone || '081199988877';
        let cleanPhone = rawPhone.replace(/\D/g, '');
        if (cleanPhone.startsWith('0')) {
            cleanPhone = '62' + cleanPhone.slice(1);
        } else if (cleanPhone.startsWith('8')) {
            cleanPhone = '62' + cleanPhone;
        }

        const text = `Halo Harmoni by Phoeinx Sehat (${selectedBranch.city} - ${selectedBranch.name}), saya sudah membuat reservasi online dengan detail berikut:\n\n• No. Reservasi: ${savedReservationNumber}\n• Nama: ${fullName}\n• WhatsApp: ${whatsapp}\n• Cabang / Layanan: ${selectedBranch.city} (${selectedBranch.name})\n• Tipe Keluhan: ${complaint}\n• Rencana Tanggal: ${date || 'Segera'}\n\nMohon konfirmasinya, terima kasih!`;
        window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
    };

    return (
        <section
            id="booking"
            className={`${isStandalone ? 'py-4' : 'py-20 dotted-bg'} scroll-mt-24`}
        >
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
                <div className="max-w-3xl mx-auto bg-surface p-6 sm:p-10 md:p-14 rounded-[36px] shadow-2xl border border-outline-variant relative overflow-visible">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-tertiary rounded-full -mr-16 -mt-16 pointer-events-none opacity-50" />

                    <div className="text-center mb-10 relative z-10">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest mb-3">
                            Reservasi Online
                        </span>
                        <h2 className="font-bold text-2xl sm:text-[32px] leading-tight text-on-surface mb-3">
                            Pesan Jadwal Pemeriksaan Mata
                        </h2>
                        <p className="text-on-surface-variant max-w-lg mx-auto text-sm sm:text-base">
                            Lengkapi data di bawah ini, jadwal Anda akan langsung tercatat dalam sistem dan dikonfirmasi oleh tim Optometris kami.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-on-surface uppercase tracking-widest">
                                    Nama Lengkap <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full h-14 px-5 rounded-2xl border border-outline-variant bg-surface text-on-surface font-semibold focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                                    placeholder="Contoh: Budi Santoso"
                                    type="text"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-on-surface uppercase tracking-widest">
                                    No. WhatsApp <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    value={whatsapp}
                                    onChange={(e) => setWhatsapp(e.target.value)}
                                    className="w-full h-14 px-5 rounded-2xl border border-outline-variant bg-surface text-on-surface font-semibold focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                                    placeholder="0812xxxxxxx"
                                    type="tel"
                                    required
                                />
                            </div>
                        </div>

                        {/* Searchable Branch Select Dropdown */}
                        <div className="space-y-2 relative" ref={dropdownRef}>
                            <label className="text-xs font-bold text-on-surface uppercase tracking-widest">
                                Pilih Cabang / Layanan <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsOpen(!isOpen);
                                        if (!isOpen) setSearchQuery('');
                                    }}
                                    className="w-full h-14 px-5 rounded-2xl border border-outline-variant bg-surface text-left flex items-center justify-between hover:border-primary/60 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all cursor-pointer"
                                >
                                    <div className="truncate pr-4">
                                        <span className="font-bold text-on-surface">{selectedBranch.city}</span>
                                        <span className="text-on-surface-variant text-sm ml-2">
                                            ({selectedBranch.name})
                                        </span>
                                    </div>
                                    <span
                                        className={`material-symbols-outlined text-on-surface-variant transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : ''
                                            }`}
                                    >
                                        expand_more
                                    </span>
                                </button>

                                {/* Dropdown Menu */}
                                {isOpen && (
                                    <div className="absolute left-0 right-0 top-full mt-2 bg-surface rounded-2xl border border-outline-variant shadow-2xl z-50 overflow-hidden">
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
                                                    className="w-full h-10 pl-10 pr-4 rounded-xl bg-surface border border-outline-variant text-sm text-on-surface focus:outline-none focus:border-primary"
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
                                                            className={`w-full text-left px-4 py-3 flex items-center justify-between hover:bg-tertiary/30 transition-colors cursor-pointer ${isSelected ? 'bg-primary/10' : ''
                                                                }`}
                                                        >
                                                            <div>
                                                                <p className="font-bold text-sm text-on-surface">
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
                                <label className="text-xs font-bold text-on-surface uppercase tracking-widest">
                                    Tipe Keluhan / Kebutuhan
                                </label>
                                <select
                                    value={complaint}
                                    onChange={(e) => setComplaint(e.target.value)}
                                    className="w-full h-14 px-5 rounded-2xl border border-outline-variant bg-surface text-on-surface font-semibold focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                                >
                                    {activeComplaintTypes.map((ct: any) => (
                                        <option key={ct.id} value={ct.name}>
                                            {ct.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-on-surface uppercase tracking-widest">
                                    Rencana Tanggal Kunjungan <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full h-14 px-5 rounded-2xl border border-outline-variant bg-surface text-on-surface font-semibold focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                                    type="date"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-on-surface uppercase tracking-widest flex items-center justify-between">
                                <span>Kode Referal (Jika Ada)</span>
                            </label>
                            <input
                                value={referralCode}
                                onChange={(e) => setReferralCode(e.target.value)}
                                className="w-full h-14 px-5 rounded-2xl border border-outline-variant bg-surface text-on-surface font-semibold focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none uppercase"
                                placeholder="PHNX-XXXX"
                                type="text"
                            />
                        </div>

                        <button
                            disabled={submitting}
                            className="w-full bg-primary text-on-primary h-16 rounded-2xl font-bold text-lg hover:bg-primary/95 hover:shadow-2xl disabled:opacity-60 transition-all shadow-xl shadow-primary/20 mt-4 active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
                            type="submit"
                        >
                            <span className="material-symbols-outlined text-[24px]">
                                {submitting ? 'progress_activity' : 'calendar_month'}
                            </span>
                            {submitting ? 'Menyimpan Reservasi...' : 'Konfirmasi Jadwal Sekarang'}
                        </button>
                        <p className="text-center text-xs text-on-surface-variant font-medium pt-1">
                            *Sistem kami aman dan data Anda bersifat rahasia.
                        </p>
                    </form>
                </div>
            </div>

            {/* SUCCESS MODAL AFTER SAVING RESERVATION */}
            {successModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-surface border border-outline-variant rounded-3xl max-w-md w-full p-8 text-center shadow-2xl relative">
                        <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-5">
                            <span className="material-symbols-outlined text-4xl">check_circle</span>
                        </div>

                        <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-2">
                            Reservasi Berhasil
                        </span>
                        <h3 className="text-2xl font-bold text-on-surface mb-2">
                            Jadwal Anda Telah Disimpan!
                        </h3>
                        <p className="text-sm text-on-surface-variant mb-6">
                            Nomor Reservasi Anda adalah <span className="font-bold text-primary">{savedReservationNumber}</span>. Data reservasi telah tercatat di sistem kami.
                        </p>

                        <div className="space-y-3">
                            <button
                                type="button"
                                onClick={openWhatsAppChat}
                                className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
                            >
                                <span className="material-symbols-outlined">chat</span>
                                <span>Konfirmasi WhatsApp ({selectedBranch.city})</span>
                            </button>
                            <p className="text-xs text-on-surface-variant">
                                No. WhatsApp Cabang: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{selectedBranch.phone || '081199988877'}</span>
                            </p>
                            <button
                                type="button"
                                onClick={() => {
                                    setSuccessModalOpen(false);
                                    setFullName('');
                                    setWhatsapp('');
                                    setDate('');
                                }}
                                className="w-full py-3 px-6 rounded-xl border border-outline-variant text-on-surface font-semibold text-sm hover:bg-tertiary/40 transition-colors cursor-pointer"
                            >
                                Selesai
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
