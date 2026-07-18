import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, useForm } from '@inertiajs/react';

export default function MarketingKitsIndex({ marketingKits = [], isAffiliator = false }: { marketingKits: any[], isAffiliator?: boolean }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        title: '',
        image: null as File | null,
        video_url: '',
        description: '',
        is_active: true,
        _method: 'POST', // Used for spoofing PUT with FormData
    });

    const openCreateModal = () => {
        clearErrors();
        reset();
        setData('_method', 'POST');
        setEditingId(null);
        setIsModalOpen(true);
    };

    const openEditModal = (kit: any) => {
        clearErrors();
        setData({
            title: kit.title,
            image: null,
            video_url: kit.video_url || '',
            description: kit.description || '',
            is_active: kit.is_active,
            _method: 'PUT',
        });
        setEditingId(kit.id);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (editingId) {
            post(route('marketing-kits.update', editingId), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('marketing-kits.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus materi promosi ini?')) {
            destroy(route('marketing-kits.destroy', id));
        }
    };

    return (
        <AdminLayout title="Materi Promosi">
            <Head title="Materi Promosi Affiliate" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <p className="text-[11px] font-bold tracking-widest text-secondary uppercase mb-1">AFFILIATOR</p>
                    <h1 className="text-3xl font-extrabold text-primary tracking-tight">Materi Promosi</h1>
                </div>
                {!isAffiliator && (
                    <button
                        onClick={openCreateModal}
                        className="flex items-center gap-2 bg-primary text-on-primary px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-95"
                    >
                        <span className="material-symbols-outlined text-[20px]">add</span>
                        Tambah Materi
                    </button>
                )}
            </div>

            {/* Grid List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {marketingKits.length > 0 ? (
                    marketingKits.map((kit: any) => (
                        <div key={kit.id} className="bg-surface border border-outline-variant rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col">
                            {/* Image Placeholder / Display */}
                            <div className="aspect-video bg-surface-variant relative overflow-hidden flex items-center justify-center">
                                {kit.image_path ? (
                                    <img src={`/storage/${kit.image_path}`} alt={kit.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <span className="material-symbols-outlined text-[48px] text-on-surface-variant/30">campaign</span>
                                )}
                                <div className="absolute top-3 left-3">
                                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold tracking-wider uppercase border shadow-sm backdrop-blur-md ${kit.is_active ? 'bg-emerald-500/90 text-white border-emerald-400' : 'bg-surface/90 text-on-surface-variant border-outline-variant'}`}>
                                        {kit.is_active ? 'Aktif' : 'Nonaktif'}
                                    </span>
                                </div>
                            </div>
                            
                            {/* Content */}
                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="font-bold text-lg text-primary mb-2 line-clamp-1">{kit.title}</h3>
                                <p className="text-sm text-on-surface-variant line-clamp-2 mb-4 flex-1">{kit.description || 'Tidak ada deskripsi.'}</p>
                                
                                {kit.video_url && (
                                    <div className="mb-4">
                                        <a href={kit.video_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold text-secondary hover:text-secondary/80 bg-secondary/10 px-2.5 py-1.5 rounded-lg transition-colors">
                                            <span className="material-symbols-outlined text-[16px]">smart_display</span>
                                            Lihat Video
                                        </a>
                                    </div>
                                )}
                                
                                <div className="flex flex-col gap-2 pt-4 border-t border-outline-variant/50 mt-auto">
                                    {isAffiliator ? (
                                        <>
                                            {kit.image_path && (
                                                <a 
                                                    href={`/storage/${kit.image_path}`} 
                                                    download 
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="w-full border-2 border-primary text-primary bg-transparent py-2 rounded-lg font-bold text-xs text-center hover:bg-primary hover:text-on-primary transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <span className="material-symbols-outlined text-[16px]">download</span> Unduh Gambar
                                                </a>
                                            )}
                                            {kit.description && (
                                                <button 
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(kit.description);
                                                        alert('Teks berhasil disalin!');
                                                    }}
                                                    className="w-full border-2 border-primary text-primary bg-transparent py-2 rounded-lg font-bold text-xs text-center hover:bg-primary hover:text-on-primary transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <span className="material-symbols-outlined text-[16px]">content_copy</span> Salin Teks
                                                </button>
                                            )}
                                        </>
                                    ) : (
                                        <div className="flex items-center gap-2 w-full">
                                            <button 
                                                onClick={() => openEditModal(kit)}
                                                className="flex-1 border-2 border-primary text-primary hover:bg-primary hover:text-on-primary py-2 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">edit</span>
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(kit.id)}
                                                className="w-10 h-10 shrink-0 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-xl flex items-center justify-center transition-colors"
                                                title="Hapus"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">delete</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center bg-surface-variant/30 rounded-3xl border-2 border-dashed border-outline-variant">
                        <span className="material-symbols-outlined text-[64px] text-on-surface-variant/40 mb-4">campaign</span>
                        <h3 className="text-lg font-bold text-on-surface mb-1">Belum Ada Materi</h3>
                        <p className="text-sm text-on-surface-variant mb-6 text-center max-w-sm">
                            {isAffiliator 
                                ? 'Admin belum menambahkan materi promosi apapun.'
                                : 'Anda belum menambahkan materi promosi apapun. Tambahkan materi pertama untuk membantu affiliator Anda.'}
                        </p>
                        {!isAffiliator && (
                            <button
                                onClick={openCreateModal}
                                className="text-primary font-bold text-sm bg-primary/10 hover:bg-primary/20 px-6 py-2.5 rounded-xl transition-colors"
                            >
                                + Tambah Materi Promosi
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Modal Form */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal}></div>
                    <div className="relative w-full max-w-lg bg-surface rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="px-6 py-4 border-b border-outline-variant bg-surface sticky top-0 z-10 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                                <span className="material-symbols-outlined">{editingId ? 'edit' : 'add_box'}</span>
                                {editingId ? 'Edit Materi Promosi' : 'Tambah Materi Baru'}
                            </h3>
                            <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-variant text-on-surface-variant transition-colors">
                                <span className="material-symbols-outlined text-[20px]">close</span>
                            </button>
                        </div>
                        
                        <div className="overflow-y-auto p-6">
                            <form id="marketingKitForm" onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-on-surface mb-1.5">Judul Materi <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={e => setData('title', e.target.value)}
                                        className="w-full border border-outline-variant rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-surface"
                                        placeholder="Misal: Brosur Digital Terapi"
                                        required
                                    />
                                    {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-bold text-on-surface mb-1.5">Upload Gambar {editingId && <span className="text-on-surface-variant text-xs font-normal">(Kosongkan jika tidak ingin mengubah)</span>}</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={e => setData('image', e.target.files ? e.target.files[0] : null)}
                                        className="w-full text-sm text-on-surface-variant file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-colors border border-outline-variant rounded-xl cursor-pointer"
                                    />
                                    <p className="text-[10px] text-on-surface-variant mt-1.5">Format: JPG, PNG. Maksimal 2MB.</p>
                                    {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-bold text-on-surface mb-1.5">Link Video (YouTube/Tiktok)</label>
                                    <input
                                        type="url"
                                        value={data.video_url}
                                        onChange={e => setData('video_url', e.target.value)}
                                        className="w-full border border-outline-variant rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-surface"
                                        placeholder="https://..."
                                    />
                                    {errors.video_url && <p className="text-red-500 text-xs mt-1">{errors.video_url}</p>}
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-bold text-on-surface mb-1.5">Deskripsi Campaign (Copywriting)</label>
                                    <textarea
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                        className="w-full border border-outline-variant rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-surface min-h-[120px] resize-y"
                                        placeholder="Tuliskan copywriting yang bisa disalin oleh affiliator..."
                                    ></textarea>
                                    {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                                </div>
                                
                                <label className="flex items-center gap-3 cursor-pointer group w-fit">
                                    <input 
                                        type="checkbox" 
                                        checked={data.is_active}
                                        onChange={e => setData('is_active', e.target.checked)}
                                        className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary"
                                    />
                                    <span className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors">Tampilkan untuk Affiliator</span>
                                </label>
                            </form>
                        </div>
                        
                        <div className="px-6 py-4 border-t border-outline-variant bg-surface flex items-center justify-end gap-3 sticky bottom-0">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="px-5 py-2.5 rounded-xl font-bold text-sm bg-surface-variant text-on-surface hover:bg-surface-variant/80 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                form="marketingKitForm"
                                disabled={processing}
                                className="px-6 py-2.5 rounded-xl font-bold text-sm bg-primary text-on-primary hover:bg-primary/90 transition-colors shadow-md disabled:opacity-50 flex items-center gap-2"
                            >
                                {processing ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                        Menyimpan...
                                    </>
                                ) : (
                                    'Simpan Materi'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
