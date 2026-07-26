import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import PageHeader from '@/Components/Admin/PageHeader';

export default function SettingsIndex({ settings }: { settings: Record<string, string> }) {
    const [showToast, setShowToast] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        whatsapp_number: settings?.whatsapp_number || '081199988877',
        whatsapp_message: settings?.whatsapp_message || 'Halo Harmoni Kacamata, saya tertarik ingin reservasi. Bisa jelaskan secara detail bagaimana prosesnya?',
        whatsapp_catalog_message: settings?.whatsapp_catalog_message || 'Halo Harmoni Kacamata, saya tertarik memesan kacamata [produk] di cabang [cabang].',
        whatsapp_booking_message: settings?.whatsapp_booking_message || "Halo Harmoni by Phoeinx Sehat ([cabang]), saya sudah membuat reservasi online dengan detail berikut:\n\n• No. Reservasi: [no_reservasi]\n• Nama: [nama]\n• WhatsApp: [whatsapp]\n• Cabang / Layanan: [cabang]\n• Tipe Keluhan: [keluhan]\n• Rencana Tanggal: [tanggal]\n\nMohon konfirmasinya, terima kasih!",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('settings.update'), {
            preserveScroll: true,
            onSuccess: () => {
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);
            }
        });
    };

    return (
        <AdminLayout>
            <Head title="Pengaturan Umum" />
            <PageHeader
                title="Pengaturan Umum"
                subtitle="Atur konfigurasi global untuk aplikasi Anda."
                icon="settings"
            />

            <div className="bg-surface rounded-2xl border border-outline-variant shadow-sm max-w-2xl mt-6">
                <div className="p-6 border-b border-outline-variant">
                    <h3 className="text-lg font-bold text-on-surface">Kontak & Media Sosial</h3>
                    <p className="text-sm text-on-surface-variant">
                        Konfigurasi nomor WhatsApp utama yang akan digunakan di tombol chat melayang dan default form reservasi.
                    </p>
                </div>

                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-on-surface mb-2">
                                Nomor WhatsApp Utama <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.whatsapp_number}
                                onChange={(e) => setData('whatsapp_number', e.target.value)}
                                placeholder="Contoh: 081234567890"
                                className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                            {errors.whatsapp_number && <p className="text-xs text-rose-500 mt-1">{errors.whatsapp_number}</p>}
                            <p className="text-xs text-on-surface-variant mt-2">
                                Gunakan format angka standar seperti 0812xxx atau 62812xxx. Nomor ini akan digunakan untuk tombol WhatsApp di seluruh halaman.
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-on-surface mb-2">
                                Template Pesan WhatsApp Default
                            </label>
                            <textarea
                                value={data.whatsapp_message}
                                onChange={(e) => setData('whatsapp_message', e.target.value)}
                                placeholder="Contoh: Halo admin, saya butuh bantuan..."
                                rows={3}
                                className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                            ></textarea>
                            {errors.whatsapp_message && <p className="text-xs text-rose-500 mt-1">{errors.whatsapp_message}</p>}
                            <p className="text-xs text-on-surface-variant mt-2">
                                Pesan ini akan otomatis terisi di aplikasi WhatsApp pelanggan saat mereka mengklik tombol chat melayang di pojok halaman.
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-on-surface mb-2">
                                Template Pesan Reservasi Katalog
                            </label>
                            <textarea
                                value={data.whatsapp_catalog_message}
                                onChange={(e) => setData('whatsapp_catalog_message', e.target.value)}
                                placeholder="Contoh: Halo Harmoni Kacamata, saya tertarik memesan kacamata [produk] di cabang [cabang]."
                                rows={3}
                                className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                            ></textarea>
                            {errors.whatsapp_catalog_message && <p className="text-xs text-rose-500 mt-1">{errors.whatsapp_catalog_message}</p>}
                            <p className="text-xs text-on-surface-variant mt-2">
                                Gunakan <code className="bg-surface-variant px-1 rounded text-primary">[produk]</code> untuk nama kacamata dan <code className="bg-surface-variant px-1 rounded text-primary">[cabang]</code> untuk nama cabang.
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-on-surface mb-2">
                                Template Pesan Reservasi Layanan (Booking)
                            </label>
                            <textarea
                                value={data.whatsapp_booking_message}
                                onChange={(e) => setData('whatsapp_booking_message', e.target.value)}
                                placeholder="Contoh: Halo, saya sudah membuat reservasi dengan No [no_reservasi]..."
                                rows={6}
                                className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                            ></textarea>
                            {errors.whatsapp_booking_message && <p className="text-xs text-rose-500 mt-1">{errors.whatsapp_booking_message}</p>}
                            <p className="text-xs text-on-surface-variant mt-2">
                                Placeholder yang tersedia: <code className="bg-surface-variant px-1 rounded text-primary">[cabang]</code>, <code className="bg-surface-variant px-1 rounded text-primary">[no_reservasi]</code>, <code className="bg-surface-variant px-1 rounded text-primary">[nama]</code>, <code className="bg-surface-variant px-1 rounded text-primary">[whatsapp]</code>, <code className="bg-surface-variant px-1 rounded text-primary">[keluhan]</code>, <code className="bg-surface-variant px-1 rounded text-primary">[tanggal]</code>.
                            </p>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-outline-variant">
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-sm shadow-md shadow-primary/20 hover:bg-primary/90 disabled:opacity-70 transition-all cursor-pointer"
                            >
                                {processing ? 'Menyimpan...' : 'Simpan Pengaturan'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Floating Toast */}
            {showToast && (
                <div className="fixed bottom-8 right-8 bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-bounce">
                    <span className="material-symbols-outlined text-[20px]">check_circle</span>
                    <span className="font-bold text-sm">Pengaturan berhasil disimpan!</span>
                </div>
            )}
        </AdminLayout>
    );
}
