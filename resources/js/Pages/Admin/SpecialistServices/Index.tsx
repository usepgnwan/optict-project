import React, { useState, useEffect, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import PageHeader from '@/Components/Admin/PageHeader';
import DataTable from '@/Components/Admin/DataTable';
import StatusBadge from '@/Components/Admin/StatusBadge';
import SearchFilter from '@/Components/Admin/SearchFilter';

interface SpecialistService {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    thumbnail: string | null;
    is_active: boolean;
    sort_order: number;
}

interface ServicesPageProps {
    services: {
        data: SpecialistService[];
        links: any[];
    };
    filters: {
        search?: string;
    };
}

// Quill-based rich text editor loaded dynamically to avoid SSR issues
function QuillEditor({ value, onChange }: { value: string; onChange: (val: string) => void }) {
    const editorRef = useRef<HTMLDivElement>(null);
    const quillRef = useRef<any>(null);
    const isInitialized = useRef(false);

    useEffect(() => {
        if (!editorRef.current || isInitialized.current) return;
        isInitialized.current = true;

        import('quill').then(({ default: Quill }) => {
            // Dynamically inject Quill CSS
            if (!document.getElementById('quill-css')) {
                const link = document.createElement('link');
                link.id = 'quill-css';
                link.rel = 'stylesheet';
                link.href = 'https://cdn.jsdelivr.net/npm/quill@2/dist/quill.snow.css';
                document.head.appendChild(link);
            }

            const quill = new Quill(editorRef.current!, {
                theme: 'snow',
                placeholder: 'Tulis deskripsi layanan...',
                modules: {
                    toolbar: [
                        [{ header: [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ list: 'ordered' }, { list: 'bullet' }],
                        ['link'],
                        ['clean'],
                    ],
                },
            });

            if (value) {
                quill.clipboard.dangerouslyPasteHTML(value);
            }

            quill.on('text-change', () => {
                onChange(quill.root.innerHTML);
            });

            quillRef.current = quill;
        });

        return () => {
            isInitialized.current = false;
            quillRef.current = null;
        };
    }, []);

    // Update Quill when value changes from outside (e.g., editing different item)
    useEffect(() => {
        if (quillRef.current) {
            const currentHtml = quillRef.current.root.innerHTML;
            if (currentHtml !== value) {
                quillRef.current.clipboard.dangerouslyPasteHTML(value || '');
            }
        }
    }, [value]);

    return (
        <div className="rounded-xl overflow-hidden border border-outline-variant">
            <div ref={editorRef} style={{ minHeight: '180px' }} />
        </div>
    );
}

export default function SpecialistServicesIndex({ services, filters }: ServicesPageProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState<SpecialistService | null>(null);
    const [processing, setProcessing] = useState(false);

    const defaultForm = { title: '', description: '', is_active: true };
    const [form, setForm] = useState(defaultForm);
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

    const handleSearch = (val: string) => {
        setSearch(val);
        router.get(route('specialist-services.index'), { search: val }, { preserveState: true, replace: true });
    };

    const openCreateModal = () => {
        setEditingItem(null);
        setForm(defaultForm);
        setThumbnailFile(null);
        setThumbnailPreview(null);
        setShowModal(true);
    };

    const openEditModal = (item: SpecialistService) => {
        setEditingItem(item);
        setForm({
            title: item.title,
            description: item.description || '',
            is_active: item.is_active,
        });
        setThumbnailFile(null);
        setThumbnailPreview(item.thumbnail ? `/storage/${item.thumbnail}` : null);
        setShowModal(true);
    };

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setThumbnailFile(file);
            setThumbnailPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        const formData = new FormData();
        formData.append('title', form.title);
        formData.append('description', form.description);
        formData.append('is_active', form.is_active ? '1' : '0');
        if (thumbnailFile) formData.append('thumbnail', thumbnailFile);

        const url = editingItem
            ? route('specialist-services.update', editingItem.id)
            : route('specialist-services.store');

        if (editingItem) {
            formData.append('_method', 'PUT');
        }

        router.post(url, formData as any, {
            onSuccess: () => { setShowModal(false); setProcessing(false); },
            onError: () => setProcessing(false),
            forceFormData: true,
        });
    };

    const handleDelete = (item: SpecialistService) => {
        if (confirm(`Hapus layanan "${item.title}"?`)) {
            router.delete(route('specialist-services.destroy', item.id));
        }
    };

    const columns = [
        {
            header: 'No.',
            key: 'sort_order',
            render: (item: SpecialistService) => (
                <span className="font-mono font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-md text-xs">
                    #{item.sort_order}
                </span>
            ),
        },
        {
            header: 'Thumbnail',
            key: 'thumbnail',
            render: (item: SpecialistService) =>
                item.thumbnail ? (
                    <img
                        src={`/storage/${item.thumbnail}`}
                        alt={item.title}
                        className="w-16 h-12 object-cover rounded-lg border border-outline-variant"
                    />
                ) : (
                    <div className="w-16 h-12 rounded-lg bg-surface-variant flex items-center justify-center">
                        <span className="material-symbols-outlined text-on-surface-variant text-xl">image</span>
                    </div>
                ),
        },
        {
            header: 'Layanan',
            key: 'title',
            render: (item: SpecialistService) => (
                <div>
                    <p className="font-bold text-on-surface">{item.title}</p>
                    {item.slug && (
                        <span className="text-xs font-mono text-on-surface-variant bg-surface-variant/60 px-2 py-0.5 rounded mt-0.5 inline-block">
                            /{item.slug}
                        </span>
                    )}
                </div>
            ),
        },
        {
            header: 'Status',
            key: 'is_active',
            render: (item: SpecialistService) => <StatusBadge status={item.is_active} />,
        },
        {
            header: 'Aksi',
            key: 'id',
            render: (item: SpecialistService) => (
                <div className="flex items-center gap-1.5">
                    <a
                        href={`/layanan/${item.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Lihat Halaman Publik"
                        className="p-1.5 rounded-lg text-on-surface-variant hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                    </a>
                    <button
                        onClick={() => openEditModal(item)}
                        title="Edit"
                        className="p-1.5 rounded-lg text-on-surface-variant hover:bg-tertiary/60 hover:text-primary transition-colors cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button
                        onClick={() => handleDelete(item)}
                        title="Hapus"
                        className="p-1.5 rounded-lg text-on-surface-variant hover:bg-rose-500/10 hover:text-rose-500 transition-colors cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                </div>
            ),
        },
    ];

    return (
        <AdminLayout>
            <Head title="Layanan Spesialis - Admin" />

            <PageHeader
                title="Layanan Spesialis Kami"
                subtitle="Kelola daftar layanan spesialis yang ditampilkan di halaman beranda"
                icon="medical_services"
                action={
                    <button
                        onClick={openCreateModal}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-sm shadow-md shadow-primary/20 hover:bg-primary/90 transition-all cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-[20px]">add</span>
                        <span>Tambah Layanan</span>
                    </button>
                }
            />

            <SearchFilter
                search={search}
                onSearchChange={handleSearch}
                placeholder="Cari judul atau deskripsi layanan..."
            />

            <DataTable
                columns={columns}
                data={services.data}
                links={services.links}
                emptyMessage="Belum ada data layanan spesialis."
            />

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-surface rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-outline-variant">
                        <div className="flex items-center justify-between p-6 border-b border-outline-variant">
                            <h2 className="font-bold text-xl text-primary">
                                {editingItem ? 'Edit Layanan' : 'Tambah Layanan Baru'}
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 rounded-xl hover:bg-surface-variant transition-colors cursor-pointer"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            {/* Thumbnail Upload */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                                    Foto Thumbnail
                                </label>
                                <div className="flex items-start gap-4">
                                    {thumbnailPreview ? (
                                        <img
                                            src={thumbnailPreview}
                                            alt="preview"
                                            className="w-32 h-24 object-cover rounded-xl border border-outline-variant shrink-0"
                                        />
                                    ) : (
                                        <div className="w-32 h-24 rounded-xl border-2 border-dashed border-outline-variant flex flex-col items-center justify-center shrink-0 text-on-surface-variant">
                                            <span className="material-symbols-outlined text-3xl">image</span>
                                            <span className="text-xs mt-1">No image</span>
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <label
                                            htmlFor="thumbnail-input"
                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-outline-variant cursor-pointer hover:bg-tertiary/40 transition-colors text-sm font-semibold"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">upload</span>
                                            {thumbnailPreview ? 'Ganti Foto' : 'Upload Foto'}
                                        </label>
                                        <input
                                            id="thumbnail-input"
                                            type="file"
                                            accept="image/jpeg,image/png,image/jpg,image/webp"
                                            onChange={handleThumbnailChange}
                                            className="hidden"
                                        />
                                        <p className="text-xs text-on-surface-variant mt-2">
                                            Format: JPG, PNG, WEBP. Maks 2MB.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Title */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                                    Judul Layanan <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    placeholder="Contoh: Pemeriksaan Refraksi Digital"
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-variant/50 border border-outline-variant text-sm focus:outline-none focus:border-primary"
                                    required
                                />
                            </div>

                            {/* Description - Quill */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                                    Deskripsi
                                </label>
                                {showModal && (
                                    <QuillEditor
                                        key={editingItem?.id ?? 'new'}
                                        value={form.description}
                                        onChange={(val) => setForm({ ...form, description: val })}
                                    />
                                )}
                            </div>

                            {/* Is Active */}
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="is_active_ss"
                                    checked={form.is_active}
                                    onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                                    className="w-4 h-4 rounded text-primary border-outline-variant"
                                />
                                <label htmlFor="is_active_ss" className="text-sm font-semibold text-on-surface cursor-pointer">
                                    Tampilkan di Halaman Beranda
                                </label>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant/60">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 rounded-xl border border-outline-variant text-sm font-semibold hover:bg-tertiary/40 transition-colors cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-5 py-2 rounded-xl bg-primary text-on-primary text-sm font-bold shadow-md shadow-primary/20 hover:bg-primary/90 disabled:opacity-50 transition-all cursor-pointer"
                                >
                                    {processing ? 'Menyimpan...' : editingItem ? 'Simpan Perubahan' : 'Tambah Layanan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
