import React, { useState, useEffect } from 'react';
import HomeLayout from '@/Layouts/HomeLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import CtaSection from '@/Components/Home/CtaSection';

export default function Affiliate({ products = [], services = [] }: { products?: any[], services?: any[] }) {
    const { flash } = usePage<any>().props;
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (flash?.success) {
            setShowSuccessModal(true);
        }
    }, [flash?.success]);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        city: '',
        age: '',
        promotional_media: [] as string[],
        promotional_link: '',
        photo: null as File | null,
        bank_name: '',
        bank_account_number: '',
        agreement: false,
    });

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('photo', file);
            setPhotoPreview(URL.createObjectURL(file));
        } else {
            setData('photo', null);
            setPhotoPreview(null);
        }
    };

    const handleMediaChange = (media: string, checked: boolean) => {
        if (checked) {
            setData('promotional_media', [...data.promotional_media, media]);
        } else {
            setData('promotional_media', data.promotional_media.filter(m => m !== media));
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('affiliate.store'), {
            onSuccess: () => {
                reset();
                setPhotoPreview(null);
                setShowSuccessModal(true);
            },
            onError: (errs) => {
                if (errs.email || errs.phone) {
                    setErrorMessage('Email atau No. WhatsApp sudah terdaftar. Silakan gunakan akun lain.');
                    setShowErrorModal(true);
                }
            },
            preserveScroll: true
        });
    };

    return (
        <HomeLayout title="Program Afiliasi | Harmoni by Phoeinx Sehat">
            <Head title="Program Afiliasi Kemitraan" />

            <div className="max-w-[800px] mx-auto px-6 py-16">

                {/* Hero Section */}
                <div className="text-center p-10 md:p-14 bg-surface-variant/40 rounded-[32px] mb-16 border border-outline-variant shadow-sm">
                    <div className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full font-bold text-xs mb-6 tracking-wide uppercase">
                        Slot Rekrutmen Affiliate Terbatas
                    </div>
                    <h1 className="text-primary text-3xl md:text-[40px] leading-tight font-extrabold mb-5 tracking-tight">
                        Program Afiliasi Kemitraan Harmoni by Phoeinx Sehat
                    </h1>
                    <p className="text-on-surface-variant text-base mb-8 max-w-xl mx-auto">
                        Hasilkan pendapatan tambahan tanpa modal langsung dari HP Anda. Mari berkolaborasi mengenalkan ekosistem solusi kesehatan mata menyeluruh.
                    </p>
                    <a href="#pendaftaran" className="inline-block bg-primary text-on-primary px-8 py-3.5 font-bold rounded-2xl shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all hover:-translate-y-0.5">
                        Mulai Daftar Gratis
                    </a>
                </div>

                {/* Introduction */}
                <h2 className="text-2xl font-bold text-primary mt-12 mb-5 tracking-tight">
                    Mulai Langkah Kreatif Tanpa Modal
                </h2>
                <p className="text-on-surface-variant text-[15px] mb-5 leading-relaxed">
                    Banyak orang ingin menambah penghasilan namun terhambat modal operasional stok barang, atau rumitnya manajemen pengiriman produk. Harmoni by Phoeinx Sehat hadir memberikan ruang kemitraan yang simpel dan bermakna.
                </p>
                <p className="text-on-surface-variant text-[15px] mb-6 leading-relaxed">
                    Anda hanya perlu memanfaatkan aset digital berharga yang sudah Anda miliki sekarang:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
                    <div className="bg-surface p-6 border border-outline-variant rounded-2xl shadow-sm">
                        <strong className="block text-primary text-lg mb-2">WhatsApp</strong>
                        <p className="text-[13.5px] text-on-surface-variant m-0">
                            Jaringan kontak kerabat dekat yang mendambakan solusi kesehatan mata yang nyata.
                        </p>
                    </div>
                    <div className="bg-surface p-6 border border-outline-variant rounded-2xl shadow-sm">
                        <strong className="block text-primary text-lg mb-2">Media Sosial</strong>
                        <p className="text-[13.5px] text-on-surface-variant m-0">
                            Pengikut aktif di Instagram, TikTok, atau Facebook Anda sehari-hari.
                        </p>
                    </div>
                    <div className="bg-surface p-6 border border-outline-variant rounded-2xl shadow-sm">
                        <strong className="block text-primary text-lg mb-2">Komunitas & Relasi</strong>
                        <p className="text-[13.5px] text-on-surface-variant m-0">
                            Jaringan pertemanan luas yang didasari rasa saling percaya.
                        </p>
                    </div>
                </div>

                <div className="h-px bg-outline-variant my-12" />

                {/* Cara Kerja */}
                <h2 id="cara-kerja" className="text-2xl font-bold text-primary mb-6 tracking-tight">
                    Alur Sederhana Kemitraan
                </h2>
                <ol className="list-decimal pl-5 space-y-3 text-[15px] text-on-surface-variant mb-8">
                    <li><strong className="text-on-surface">Daftar Akun:</strong> Isi data diri secara lengkap pada formulir di bawah.</li>
                    <li><strong className="text-on-surface">Dapatkan Tautan:</strong> Dapatkan link afiliasi unik dan kode kupon personal setelah akun disetujui.</li>
                    <li><strong className="text-on-surface">Edukasi & Share:</strong> Bagikan informasi kesehatan mata bermanfaat beserta link Anda ke kanal digital.</li>
                    <li><strong className="text-on-surface">Sistem Mencatat:</strong> Pasien melakukan registrasi pemesanan kacamata atau layanan cek mata.</li>
                    <li><strong className="text-on-surface">Komisi Cair:</strong> Saldo akumulasi transaksi Anda akan ditransfer rapi setiap bulannya.</li>
                </ol>

                {/* Komisi */}
                <h2 id="skema-komisi" className="text-2xl font-bold text-primary mt-12 mb-6 tracking-tight">
                    Skema Komisi Layanan & Produk
                </h2>
                <div className="overflow-x-auto mb-6">
                    <table className="w-full border-collapse border border-outline-variant bg-surface rounded-2xl overflow-hidden shadow-sm">
                        <thead>
                            <tr>
                                <th className="bg-surface-variant/50 text-left p-4 font-bold text-primary border-b-2 border-outline-variant text-sm">Kategori</th>
                                <th className="bg-surface-variant/50 text-left p-4 font-bold text-primary border-b-2 border-outline-variant text-sm">Layanan & Produk</th>
                                <th className="bg-surface-variant/50 text-left p-4 font-bold text-primary border-b-2 border-outline-variant text-sm">Komisi Affiliate</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {services.length > 0 || products.length > 0 ? (
                                <>
                                    {/* Services */}
                                    {services.map((item: any, idx: number) => (
                                        <tr key={`service-${idx}`}>
                                            <td className="p-4 border-b border-outline-variant font-bold text-on-surface">Layanan</td>
                                            <td className="p-4 border-b border-outline-variant text-on-surface-variant">{item.name}</td>
                                            <td className="p-4 border-b border-outline-variant text-on-surface">
                                                <strong className="text-primary">
                                                    {item.commission_type === 'percentage' 
                                                        ? `${item.commission_amount}%` 
                                                        : new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(item.commission_amount))
                                                    }
                                                </strong> / Kunjungan
                                            </td>
                                        </tr>
                                    ))}
                                    {/* Products */}
                                    {products.map((item: any, idx: number) => {
                                        let catLabel = 'Produk';
                                        if (item.category === 'frame') catLabel = 'Kacamata (Frame)';
                                        else if (item.category === 'lens') catLabel = 'Kacamata (Lensa)';
                                        else if (item.category === 'accessory') catLabel = 'Aksesoris';
                                        else if (item.category === 'package') catLabel = 'Paket';

                                        return (
                                            <tr key={`product-${idx}`}>
                                                <td className="p-4 border-b border-outline-variant font-bold text-on-surface">{catLabel}</td>
                                                <td className="p-4 border-b border-outline-variant text-on-surface-variant">{item.name}</td>
                                                <td className="p-4 border-b border-outline-variant text-on-surface">
                                                    <strong className="text-primary">
                                                        {item.commission_type === 'percentage' 
                                                            ? `${item.commission_amount}%` 
                                                            : new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(item.commission_amount))
                                                        }
                                                    </strong> / Transaksi
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </>
                            ) : (
                                <>
                                    <tr>
                                        <td className="p-4 border-b border-outline-variant font-bold text-on-surface">Kacamata</td>
                                        <td className="p-4 border-b border-outline-variant text-on-surface-variant">Pembelian Frame & Lensa Premium</td>
                                        <td className="p-4 border-b border-outline-variant text-on-surface"><strong className="text-primary">Rp 100.000</strong> / Transaksi</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 border-b border-outline-variant font-bold text-on-surface">Layanan</td>
                                        <td className="p-4 border-b border-outline-variant text-on-surface-variant">Pemeriksaan Mata (Home Service)</td>
                                        <td className="p-4 border-b border-outline-variant text-on-surface"><strong className="text-primary">Rp 75.000</strong> / Kunjungan</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-bold text-on-surface">Aksesoris</td>
                                        <td className="p-4 text-on-surface-variant">Cairan Softlens, Lap Anti Embun, dll.</td>
                                        <td className="p-4 text-on-surface"><strong className="text-primary">20%</strong> dari Total Harga</td>
                                    </tr>
                                </>
                            )}
                        </tbody>
                    </table>
                </div>
                <p className="text-[13.5px] text-on-surface-variant/80 italic mb-8">
                    * Catatan: Komisi Anda akan berada dalam masa tunggu verifikasi dan otomatis disetujui siap cair pada hari ke-8 setelah transaksi selesai.
                </p>

                <div className="h-px bg-outline-variant my-12" />

                {/* Etika */}
                <h2 className="text-2xl font-bold text-primary mb-4 tracking-tight">Etika & Ketentuan Promosi</h2>
                <p className="text-[15px] text-on-surface-variant mb-6">
                    Demi kenyamanan bersama dan menjaga standar reputasi pelayanan Harmoni by Phoeinx Sehat, para mitra diharapkan memperhatikan panduan berikut:
                </p>

                <h3 className="text-primary font-bold text-lg mb-3">✓ Metode yang Disarankan</h3>
                <ul className="list-disc pl-5 space-y-2 text-[15px] text-on-surface-variant mb-6">
                    <li>Berbagi cerita jujur atau testimoni edukatif seputar manfaat menjaga kesehatan mata.</li>
                    <li>Memberikan rekomendasi langsung di komunitas, teman kantor, atau keluarga.</li>
                </ul>

                <h3 className="text-rose-600 font-bold text-lg mb-3">❌ Praktik yang Dilarang</h3>
                <ul className="list-disc pl-5 space-y-2 text-[15px] text-on-surface-variant mb-8">
                    <li>Menggunakan link pribadi untuk pembelian keperluan diri sendiri demi manipulasi harga.</li>
                    <li>Melakukan tindakan pengiriman massal tanpa izin (Spamming) di forum atau WhatsApp grup.</li>
                    <li>Membuat klaim medis berlebihan yang tidak sesuai standar Harmoni by Phoeinx Sehat.</li>
                </ul>

                <div className="h-px bg-outline-variant my-12" />

                {/* FAQ */}
                <h2 id="faq" className="text-2xl font-bold text-primary mb-6 tracking-tight">Pertanyaan Populer (FAQ)</h2>
                <div className="space-y-6 mb-8">
                    <div>
                        <h3 className="text-primary font-bold text-[17px] mb-2">Kapan dana komisi akan dicairkan?</h3>
                        <p className="text-[15px] text-on-surface-variant">
                            Seluruh saldo komisi yang berstatus aman (Approved) akan ditransfer serentak setiap <strong className="text-on-surface">tanggal 28 setiap bulannya</strong> dengan batas minimum penarikan Rp 100.000.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-primary font-bold text-[17px] mb-2">Bagaimana sistem mendeteksi rujukan saya?</h3>
                        <p className="text-[15px] text-on-surface-variant">
                            Sistem menggunakan pelacakan Cookie selama 30 hari. Selain itu, penggunaan Kode Kupon khusus Anda oleh pasien memiliki prioritas mutlak di sistem kasir kami.
                        </p>
                    </div>
                </div>

                <div className="h-px bg-outline-variant my-12" />

                {/* Alur Pendaftaran */}
                <div className="mb-14 bg-surface-variant/20 rounded-[24px] p-8 border border-outline-variant">
                    <h3 className="text-xl font-bold text-primary mb-8 text-center tracking-tight">Alur Pendaftaran Kemitraan</h3>
                    <div className="flex flex-col md:flex-row items-start justify-between relative gap-8 md:gap-0">
                        {/* Garis Penghubung (Hanya Desktop) */}
                        <div className="hidden md:block absolute top-6 left-12 right-12 h-[2px] bg-outline-variant/80 -z-10" />
                        
                        {/* Step 1 */}
                        <div className="flex flex-row md:flex-col items-center text-center gap-4 md:gap-4 flex-1 relative bg-transparent px-2 group">
                            <div className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-lg shadow-lg shadow-primary/20 shrink-0 group-hover:scale-110 transition-transform">1</div>
                            <div className="text-left md:text-center">
                                <h4 className="font-bold text-on-surface text-[15px]">Daftar Affiliator</h4>
                                <p className="text-[13px] text-on-surface-variant mt-1.5 leading-relaxed max-w-[200px] mx-auto">Isi formulir dengan data diri yang benar.</p>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="flex flex-row md:flex-col items-center text-center gap-4 md:gap-4 flex-1 relative bg-transparent px-2 group">
                            <div className="w-12 h-12 rounded-full bg-surface text-primary border-2 border-primary/30 flex items-center justify-center font-bold text-lg shadow-sm shrink-0 group-hover:border-primary transition-colors">2</div>
                            <div className="text-left md:text-center">
                                <h4 className="font-bold text-on-surface text-[15px]">Proses Approval</h4>
                                <p className="text-[13px] text-on-surface-variant mt-1.5 leading-relaxed max-w-[200px] mx-auto">Tim kami akan meninjau dan menyetujui akun.</p>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="flex flex-row md:flex-col items-center text-center gap-4 md:gap-4 flex-1 relative bg-transparent px-2 group">
                            <div className="w-12 h-12 rounded-full bg-surface text-primary border-2 border-primary/30 flex items-center justify-center font-bold text-lg shadow-sm shrink-0 group-hover:border-primary transition-colors">3</div>
                            <div className="text-left md:text-center">
                                <h4 className="font-bold text-on-surface text-[15px]">Masuk Dashboard</h4>
                                <p className="text-[13px] text-on-surface-variant mt-1.5 leading-relaxed max-w-[200px] mx-auto">Login ke panel untuk melihat kode Anda.</p>
                            </div>
                        </div>

                        {/* Step 4 */}
                        <div className="flex flex-row md:flex-col items-center text-center gap-4 md:gap-4 flex-1 relative bg-transparent px-2 group">
                            <div className="w-12 h-12 rounded-full bg-surface text-primary border-2 border-primary/30 flex items-center justify-center font-bold text-lg shadow-sm shrink-0 group-hover:border-primary transition-colors">4</div>
                            <div className="text-left md:text-center">
                                <h4 className="font-bold text-on-surface text-[15px]">Mulai Promosi</h4>
                                <p className="text-[13px] text-on-surface-variant mt-1.5 leading-relaxed max-w-[200px] mx-auto">Bagikan kode referal dan nikmati komisi.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Pendaftaran */}
                <h2 id="pendaftaran" className="text-2xl font-bold text-primary mb-3 tracking-tight">
                    Formulir Pendaftaran Afiliasi
                </h2>
                <p className="text-[15px] text-on-surface-variant mb-8">
                    Isi data kualifikasi di bawah ini untuk memulai langkah kemitraan Anda bersama kami.
                </p>

                <form className="bg-surface border border-outline-variant p-8 md:p-10 rounded-[24px] shadow-sm" onSubmit={submit}>
                    <div className="mb-6">
                        <label className="block font-bold text-sm text-on-surface mb-2">Nama Lengkap</label>
                        <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} required placeholder="Nama sesuai identitas resmi" className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-variant/30 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block font-bold text-sm text-on-surface mb-2">Alamat Email</label>
                            <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} required placeholder="budi@email.com" className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-variant/30 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>
                        <div>
                            <label className="block font-bold text-sm text-on-surface mb-2">Nomor WhatsApp</label>
                            <input type="text" value={data.phone} onChange={e => setData('phone', e.target.value)} required placeholder="08123456789" className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-variant/30 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
                            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="md:col-span-2">
                            <label className="block font-bold text-sm text-on-surface mb-2">Domisili Kota</label>
                            <input type="text" value={data.city} onChange={e => setData('city', e.target.value)} required placeholder="Contoh: Bandung" className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-variant/30 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
                            {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                        </div>
                        <div>
                            <label className="block font-bold text-sm text-on-surface mb-2">Umur</label>
                            <input type="number" value={data.age} onChange={e => setData('age', e.target.value)} required placeholder="Tahun" className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-variant/30 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
                            {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block font-bold text-sm text-on-surface mb-3">Media Utama yang Digunakan untuk Promosi</label>
                        <div className="space-y-2">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input type="checkbox" checked={data.promotional_media.includes('WhatsApp')} onChange={e => handleMediaChange('WhatsApp', e.target.checked)} className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" />
                                <span className="text-[15px] text-on-surface-variant group-hover:text-on-surface transition-colors">WhatsApp</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input type="checkbox" checked={data.promotional_media.includes('Instagram / Facebook')} onChange={e => handleMediaChange('Instagram / Facebook', e.target.checked)} className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" />
                                <span className="text-[15px] text-on-surface-variant group-hover:text-on-surface transition-colors">Instagram / Facebook</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input type="checkbox" checked={data.promotional_media.includes('TikTok / YouTube')} onChange={e => handleMediaChange('TikTok / YouTube', e.target.checked)} className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" />
                                <span className="text-[15px] text-on-surface-variant group-hover:text-on-surface transition-colors">TikTok / YouTube</span>
                            </label>
                        </div>
                        {errors.promotional_media && <p className="text-red-500 text-xs mt-1">{errors.promotional_media}</p>}
                    </div>

                    <div className="mb-6">
                        <label className="block font-bold text-sm text-on-surface mb-2">Link / Tautan Akun Media Promosi</label>
                        <input type="text" value={data.promotional_link} onChange={e => setData('promotional_link', e.target.value)} required placeholder="Link profil media sosial atau website Anda" className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-variant/30 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
                        {errors.promotional_link && <p className="text-red-500 text-xs mt-1">{errors.promotional_link}</p>}
                    </div>

                    <div className="mb-8">
                        <label className="block font-bold text-sm text-on-surface mb-2">Unggah Foto Diri Jelas (Maks 5MB)</label>
                        <label className="block bg-surface-variant/30 border-2 border-dashed border-outline-variant p-8 text-center rounded-xl cursor-pointer hover:bg-surface-variant/60 transition-colors relative overflow-hidden">
                            <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handlePhotoChange} />
                            {photoPreview ? (
                                <img src={photoPreview} alt="Preview" className="mx-auto h-32 object-contain rounded-lg" />
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-4xl text-primary/50 mb-2 block">cloud_upload</span>
                                    <span className="block text-sm font-bold text-primary">Pilih berkas foto profil digital Anda</span>
                                </>
                            )}
                        </label>
                        {errors.photo && <p className="text-red-500 text-xs mt-1">{errors.photo}</p>}
                    </div>

                    <h3 className="font-bold text-lg text-primary border-t border-outline-variant/60 pt-8 mb-6">
                        Data Informasi Pencairan Komisi
                    </h3>

                    <div className="mb-6">
                        <label className="block font-bold text-sm text-on-surface mb-2">Nama Bank / Pilihan E-Wallet</label>
                        <select value={data.bank_name} onChange={e => setData('bank_name', e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-variant/30 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all">
                            <option value="">-- Pilih Rekening Tujuan --</option>
                            <option value="BCA">Bank Central Asia (BCA)</option>
                            <option value="Mandiri">Bank Mandiri</option>
                            <option value="BRI">Bank Rakyat Indonesia (BRI)</option>
                            <option value="BNI">Bank Negara Indonesia (BNI)</option>
                            <option value="DANA">DANA</option>
                            <option value="OVO">OVO</option>
                            <option value="GOPAY">GoPay</option>
                        </select>
                        {errors.bank_name && <p className="text-red-500 text-xs mt-1">{errors.bank_name}</p>}
                    </div>

                    <div className="mb-8">
                        <label className="block font-bold text-sm text-on-surface mb-2">Nomor Rekening / ID Akun E-Wallet</label>
                        <input type="text" value={data.bank_account_number} onChange={e => setData('bank_account_number', e.target.value)} required placeholder="Masukkan nomor akun pembayaran Anda" className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-variant/30 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
                        {errors.bank_account_number && <p className="text-red-500 text-xs mt-1">{errors.bank_account_number}</p>}
                    </div>

                    <label className="flex items-start gap-3 cursor-pointer group mb-8">
                        <input type="checkbox" checked={data.agreement} onChange={e => setData('agreement', e.target.checked)} required className="mt-1 w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" />
                        <span className="text-[13.5px] text-on-surface-variant leading-relaxed">
                            Saya setuju untuk mematuhi segala syarat, ketentuan kebijakan operasional, dan komitmen kode etik promosi dari Harmoni by Phoeinx Sehat.
                        </span>
                    </label>
                    {errors.agreement && <p className="text-red-500 text-xs mt-1 mb-4">{errors.agreement}</p>}

                    <div className="text-center">
                        <button type="submit" disabled={processing} className="bg-primary text-on-primary px-10 py-4 font-bold rounded-2xl shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all hover:-translate-y-0.5 w-full sm:w-auto text-base disabled:opacity-50 disabled:hover:translate-y-0">
                            {processing ? 'Mengirim...' : 'Kirim Formulir Pendaftaran'}
                        </button>
                    </div>
                </form>

            </div>

            {/* Modal Sukses Pendaftaran */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
                    <div className="bg-surface rounded-3xl p-8 max-w-md w-full shadow-2xl relative text-center">
                        <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                            <span className="material-symbols-outlined text-[40px]">check_circle</span>
                        </div>
                        <h3 className="text-2xl font-bold text-primary mb-3">Pendaftaran Berhasil!</h3>
                        <p className="text-on-surface-variant leading-relaxed mb-8">
                            Pendaftaran mu sedang di proses tunggu konfirmasi dari admin akan menghubungi anda dalam waktu dekat
                        </p>
                        <button
                            onClick={() => setShowSuccessModal(false)}
                            className="bg-primary text-on-primary w-full py-3.5 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-md"
                        >
                            Tutup & Kembali
                        </button>
                    </div>
                </div>
            )}

            {/* Modal Error Validasi */}
            {showErrorModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
                    <div className="bg-surface rounded-3xl p-8 max-w-md w-full shadow-2xl relative text-center">
                        <div className="w-20 h-20 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                            <span className="material-symbols-outlined text-[40px]">warning</span>
                        </div>
                        <h3 className="text-2xl font-bold text-primary mb-3">Pendaftaran Gagal</h3>
                        <p className="text-on-surface-variant leading-relaxed mb-8">
                            {errorMessage}
                        </p>
                        <button
                            onClick={() => setShowErrorModal(false)}
                            className="bg-surface text-primary border-2 border-primary/20 w-full py-3.5 rounded-xl font-bold hover:bg-primary/5 transition-all shadow-sm cursor-pointer"
                        >
                            Coba Lagi
                        </button>
                    </div>
                </div>
            )}
        </HomeLayout>
    );
}
