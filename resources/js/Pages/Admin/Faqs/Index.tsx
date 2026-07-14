import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import PageHeader from '@/Components/Admin/PageHeader';
import DataTable from '@/Components/Admin/DataTable';
import StatusBadge from '@/Components/Admin/StatusBadge';
import FormModal from '@/Components/Admin/FormModal';
import SearchFilter from '@/Components/Admin/SearchFilter';

interface Faq {
    id: number;
    question: string;
    answer: string;
    is_active: boolean;
    sort_order: number;
}

interface FaqsPageProps {
    faqs: {
        data: Faq[];
        links: any[];
    };
    filters: {
        search?: string;
    };
}

export default function FaqsIndex({ faqs, filters }: FaqsPageProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState<Faq | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        question: '',
        answer: '',
        sort_order: 1,
        is_active: true,
    });

    const handleSearch = (val: string) => {
        setSearch(val);
        router.get(
            route('faqs.index'),
            { search: val },
            { preserveState: true, replace: true }
        );
    };

    const openCreateModal = () => {
        setEditingItem(null);
        reset();
        setShowModal(true);
    };

    const openEditModal = (item: Faq) => {
        setEditingItem(item);
        setData({
            question: item.question,
            answer: item.answer,
            sort_order: item.sort_order,
            is_active: item.is_active,
        });
        setShowModal(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingItem) {
            put(route('faqs.update', editingItem.id), {
                onSuccess: () => setShowModal(false),
            });
        } else {
            post(route('faqs.store'), {
                onSuccess: () => setShowModal(false),
            });
        }
    };

    const handleDelete = (item: Faq) => {
        if (confirm(`Apakah Anda yakin ingin menghapus FAQ "${item.question}"?`)) {
            router.delete(route('faqs.destroy', item.id));
        }
    };

    const columns = [
        {
            header: 'No. Urut',
            key: 'sort_order',
            render: (item: Faq) => (
                <span className="font-mono font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-md text-xs">
                    #{item.sort_order}
                </span>
            ),
        },
        {
            header: 'Pertanyaan',
            key: 'question',
            render: (item: Faq) => (
                <div>
                    <p className="font-bold text-on-surface">{item.question}</p>
                </div>
            ),
        },
        {
            header: 'Jawaban',
            key: 'answer',
            render: (item: Faq) => (
                <div className="text-sm text-on-surface-variant max-w-md">
                    <p className="line-clamp-2">{item.answer}</p>
                </div>
            ),
        },
        {
            header: 'Status',
            key: 'is_active',
            render: (item: Faq) => <StatusBadge status={item.is_active} />,
        },
        {
            header: 'Aksi',
            key: 'id',
            render: (item: Faq) => (
                <div className="flex items-center gap-1.5">
                    <button
                        onClick={() => openEditModal(item)}
                        title="Edit FAQ"
                        className="p-1.5 rounded-lg text-on-surface-variant hover:bg-tertiary/60 hover:text-primary transition-colors cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button
                        onClick={() => handleDelete(item)}
                        title="Hapus FAQ"
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
            <Head title="Master FAQ - Harmoni by Phoeinx Sehat" />

            <PageHeader
                title="Master Pertanyaan Umum (FAQ)"
                subtitle="Daftar pertanyaan dan jawaban yang ditampilkan di halaman beranda"
                icon="quiz"
                action={
                    <button
                        onClick={openCreateModal}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-sm shadow-md shadow-primary/20 hover:bg-primary/90 transition-all cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-[20px]">add</span>
                        <span>Tambah FAQ</span>
                    </button>
                }
            />

            <SearchFilter
                search={search}
                onSearchChange={handleSearch}
                placeholder="Cari pertanyaan atau jawaban..."
            />

            <DataTable
                columns={columns}
                data={faqs.data}
                links={faqs.links}
                emptyMessage="Belum ada data FAQ."
            />

            <FormModal
                show={showModal}
                onClose={() => setShowModal(false)}
                title={editingItem ? 'Edit FAQ' : 'Tambah FAQ Baru'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                        <div className="sm:col-span-3">
                            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                                Pertanyaan <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.question}
                                onChange={(e) => setData('question', e.target.value)}
                                placeholder="Contoh: Berapa lama proses pembuatan kacamata?"
                                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-variant/50 border border-outline-variant text-sm focus:outline-none focus:border-primary"
                                required
                            />
                            {errors.question && <p className="text-xs text-rose-500 mt-1">{errors.question}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                                Urutan
                            </label>
                            <input
                                type="number"
                                value={data.sort_order}
                                onChange={(e) => setData('sort_order', Number(e.target.value))}
                                min={0}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-variant/50 border border-outline-variant text-sm focus:outline-none focus:border-primary text-center font-bold"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                            Jawaban <span className="text-rose-500">*</span>
                        </label>
                        <textarea
                            value={data.answer}
                            onChange={(e) => setData('answer', e.target.value)}
                            rows={4}
                            placeholder="Jawaban lengkap untuk pertanyaan ini..."
                            className="w-full px-3.5 py-2.5 rounded-xl bg-surface-variant/50 border border-outline-variant text-sm focus:outline-none focus:border-primary"
                            required
                        />
                        {errors.answer && <p className="text-xs text-rose-500 mt-1">{errors.answer}</p>}
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                        <input
                            type="checkbox"
                            id="is_active_faq"
                            checked={data.is_active}
                            onChange={(e) => setData('is_active', e.target.checked)}
                            className="w-4 h-4 rounded text-primary border-outline-variant"
                        />
                        <label htmlFor="is_active_faq" className="text-sm font-semibold text-on-surface cursor-pointer">
                            Tampilkan di Halaman Beranda (Home)
                        </label>
                    </div>

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
                            {processing ? 'Menyimpan...' : editingItem ? 'Simpan Perubahan' : 'Tambah FAQ'}
                        </button>
                    </div>
                </form>
            </FormModal>
        </AdminLayout>
    );
}
