import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import PageHeader from '@/Components/Admin/PageHeader';
import DataTable from '@/Components/Admin/DataTable';
import StatusBadge from '@/Components/Admin/StatusBadge';
import FormModal from '@/Components/Admin/FormModal';
import SearchFilter from '@/Components/Admin/SearchFilter';
import SelectSearch from '@/Components/Admin/SelectSearch';
import { User } from '@/types';

interface Affiliate {
    id: number;
    user_id: number;
    referral_code: string;
    phone: string;
    city: string;
    age: number;
    promotional_media: string[];
    promotional_link: string;
    commission_rate: number;
    balance: string;
    status: 'pending' | 'active' | 'suspended' | 'rejected';
    bank_name: string;
    bank_account_number: string;
    bank_account_name: string;
    created_at: string;
    user: User;
}

interface AffiliatesPageProps {
    affiliates: {
        data: Affiliate[];
        links: any[];
    };
    filters: {
        search?: string;
        status?: string;
    };
}

export default function AffiliatesIndex({ affiliates, filters }: AffiliatesPageProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || '');
    const [showModal, setShowModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [selectedAffiliate, setSelectedAffiliate] = useState<Affiliate | null>(null);

    const { data: passData, setData: setPassData, post: passPost, processing: passProcessing, errors: passErrors, reset: passReset } = useForm({
        password: '',
    });

    const handleSearch = (val: string) => {
        setSearch(val);
        router.get(
            route('admin.affiliates.index'),
            { search: val, status: selectedStatus },
            { preserveState: true, replace: true }
        );
    };

    const handleStatusChange = (val: string) => {
        setSelectedStatus(val);
        router.get(
            route('admin.affiliates.index'),
            { search, status: val },
            { preserveState: true, replace: true }
        );
    };

    const handleApproveClick = (affiliate: Affiliate) => {
        setSelectedAffiliate(affiliate);
        setPassData('password', '');
        setShowPasswordModal(true);
    };

    const submitApproval = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedAffiliate) return;
        
        passPost(route('admin.affiliates.approve', selectedAffiliate.id), {
            onSuccess: () => {
                setShowPasswordModal(false);
                setShowModal(false);
                
                // Format phone number to replace leading 0 with 62 or +62
                let phone = selectedAffiliate.phone.replace(/[^0-9]/g, '');
                if (phone.startsWith('0')) {
                    phone = '62' + phone.substring(1);
                }

                const loginUrl = `${window.location.origin}/login`;
                const message = `Halo ${selectedAffiliate.user.name},\n\npengajuan affiliator sudah di setujui berikut akun anda:\nemail: ${selectedAffiliate.user.email}\npassword: ${passData.password}\n\nlogin melalui link ${loginUrl}`;
                
                const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
                window.open(waUrl, '_blank');
                
                passReset();
            }
        });
    };

    const handleReject = (affiliate: Affiliate) => {
        if (confirm(`Tolak pendaftaran affiliator "${affiliate.user?.name}"?`)) {
            router.post(route('admin.affiliates.reject', affiliate.id));
        }
    };

    const openDetailsModal = (affiliate: Affiliate) => {
        setSelectedAffiliate(affiliate);
        setShowModal(true);
    };

    const columns = [
        {
            header: 'Nama & Kontak',
            key: 'name',
            render: (aff: Affiliate) => (
                <div>
                    <p className="font-bold text-on-surface">{aff.user?.name}</p>
                    <p className="text-xs text-on-surface-variant mt-0.5">{aff.user?.email}</p>
                    <p className="text-xs text-on-surface-variant mt-0.5">{aff.phone}</p>
                </div>
            ),
        },
        {
            header: 'Kode Referral',
            key: 'referral_code',
            render: (aff: Affiliate) => (
                <span className="font-bold text-primary font-mono tracking-wider">{aff.referral_code}</span>
            ),
        },
        {
            header: 'Domisili & Usia',
            key: 'city',
            render: (aff: Affiliate) => (
                <div>
                    <p className="text-sm text-on-surface">{aff.city}</p>
                    <p className="text-xs text-on-surface-variant mt-0.5">{aff.age} thn</p>
                </div>
            ),
        },
        {
            header: 'Saldo Komisi',
            key: 'balance',
            render: (aff: Affiliate) => (
                <span className="font-bold text-emerald-600">Rp {Number(aff.balance).toLocaleString('id-ID')}</span>
            ),
        },
        {
            header: 'Status',
            key: 'status',
            render: (aff: Affiliate) => {
                const statusMap: Record<string, { label: string; color: string }> = {
                    pending: { label: 'Menunggu', color: 'bg-amber-100 text-amber-700 border border-amber-300' },
                    active: { label: 'Aktif', color: 'bg-emerald-100 text-emerald-700 border border-emerald-300' },
                    suspended: { label: 'Ditangguhkan', color: 'bg-rose-100 text-rose-700 border border-rose-300' },
                    rejected: { label: 'Ditolak', color: 'bg-gray-100 text-gray-700 border border-gray-300' },
                };
                const config = statusMap[aff.status] || { label: aff.status, color: 'bg-gray-100 text-gray-700' };
                return (
                    <span className={`inline-block px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider ${config.color}`}>
                        {config.label}
                    </span>
                );
            },
        },
        {
            header: 'Aksi',
            key: 'id',
            render: (aff: Affiliate) => (
                <div className="flex items-center gap-1.5">
                    <button
                        onClick={() => openDetailsModal(aff)}
                        title="Detail"
                        className="p-1.5 rounded-lg text-on-surface-variant hover:bg-tertiary/60 hover:text-primary transition-colors cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                    </button>
                    {aff.status === 'pending' && (
                        <>
                            <button
                                onClick={() => handleApproveClick(aff)}
                                title="Setujui"
                                className="p-1.5 rounded-lg text-on-surface-variant hover:bg-emerald-500/10 hover:text-emerald-600 transition-colors cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                            </button>
                            <button
                                onClick={() => handleReject(aff)}
                                title="Tolak"
                                className="p-1.5 rounded-lg text-on-surface-variant hover:bg-rose-500/10 hover:text-rose-500 transition-colors cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-[18px]">cancel</span>
                            </button>
                        </>
                    )}
                </div>
            ),
        },
    ];

    return (
        <AdminLayout>
            <Head title="Manajemen User Affiliator - Harmoni by Phoeinx Sehat" />

            <PageHeader
                title="Manajemen User Affiliator"
                subtitle="Kelola pendaftaran, persetujuan, dan data affiliator aktif"
                icon="handshake"
            />

            <SearchFilter
                search={search}
                onSearchChange={handleSearch}
                placeholder="Cari nama, email, atau kode referral..."
            >
                <div className="w-48">
                    <SelectSearch
                        value={selectedStatus}
                        onChange={(val) => handleStatusChange(val)}
                        placeholder="Semua Status"
                    >
                        <option value="">Semua Status</option>
                        <option value="pending">Menunggu (Pending)</option>
                        <option value="active">Aktif</option>
                        <option value="suspended">Ditangguhkan</option>
                        <option value="rejected">Ditolak</option>
                    </SelectSearch>
                </div>
            </SearchFilter>

            <DataTable
                columns={columns}
                data={affiliates.data}
                links={affiliates.links}
                emptyMessage="Belum ada pendaftaran affiliator."
            />

            <FormModal
                show={showModal}
                onClose={() => setShowModal(false)}
                title="Detail Pendaftaran Affiliator"
                maxWidth="2xl"
            >
                {selectedAffiliate && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Informasi Akun</h4>
                                <div className="space-y-2 text-sm text-on-surface">
                                    <p><span className="font-medium text-on-surface-variant inline-block w-24">Nama:</span> {selectedAffiliate.user?.name}</p>
                                    <p><span className="font-medium text-on-surface-variant inline-block w-24">Email:</span> {selectedAffiliate.user?.email}</p>
                                    <p><span className="font-medium text-on-surface-variant inline-block w-24">WhatsApp:</span> {selectedAffiliate.phone}</p>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Data Demografi</h4>
                                <div className="space-y-2 text-sm text-on-surface">
                                    <p><span className="font-medium text-on-surface-variant inline-block w-24">Kota:</span> {selectedAffiliate.city}</p>
                                    <p><span className="font-medium text-on-surface-variant inline-block w-24">Usia:</span> {selectedAffiliate.age} thn</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Promosi & Media</h4>
                            <div className="space-y-2 text-sm text-on-surface bg-surface-variant/30 p-4 rounded-xl border border-outline-variant">
                                <p><span className="font-medium text-on-surface-variant inline-block w-32">Platform:</span> 
                                    {selectedAffiliate.promotional_media?.join(', ') || '-'}
                                </p>
                                <p><span className="font-medium text-on-surface-variant inline-block w-32">Link/Tautan:</span> 
                                    <a href={selectedAffiliate.promotional_link.startsWith('http') ? selectedAffiliate.promotional_link : `https://${selectedAffiliate.promotional_link}`} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                                        {selectedAffiliate.promotional_link}
                                    </a>
                                </p>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Informasi Pembayaran (Bank/E-Wallet)</h4>
                            <div className="space-y-2 text-sm text-on-surface bg-surface-variant/30 p-4 rounded-xl border border-outline-variant">
                                <p><span className="font-medium text-on-surface-variant inline-block w-32">Nama Bank:</span> {selectedAffiliate.bank_name}</p>
                                <p><span className="font-medium text-on-surface-variant inline-block w-32">No. Rekening:</span> <span className="font-mono">{selectedAffiliate.bank_account_number}</span></p>
                            </div>
                        </div>

                        {selectedAffiliate.user?.avatar && (
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Foto Diri</h4>
                                <img src={`/storage/${selectedAffiliate.user.avatar}`} alt="Foto Affiliator" className="h-40 rounded-xl border border-outline-variant object-cover" />
                            </div>
                        )}

                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant/60">
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="px-5 py-2.5 rounded-xl bg-surface-variant text-on-surface-variant font-bold text-sm hover:bg-tertiary/40 transition-colors cursor-pointer border border-outline-variant"
                            >
                                Tutup Detail
                            </button>
                            {selectedAffiliate.status === 'pending' && (
                                <button
                                    type="button"
                                    onClick={() => handleApproveClick(selectedAffiliate)}
                                    className="px-5 py-2.5 rounded-xl bg-emerald-500 text-white font-bold text-sm shadow-md shadow-emerald-500/20 hover:bg-emerald-600 transition-all cursor-pointer flex items-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                                    Setujui Pendaftaran
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </FormModal>

            {/* Modal Setup Password */}
            <FormModal
                show={showPasswordModal}
                onClose={() => !passProcessing && setShowPasswordModal(false)}
                title="Atur Password Akses & Approve"
                maxWidth="md"
            >
                <form onSubmit={submitApproval} className="space-y-6">
                    <p className="text-sm text-on-surface-variant leading-relaxed">
                        Silakan atur kata sandi untuk akun <span className="font-bold text-primary">{selectedAffiliate?.user?.name}</span>. Setelah disimpan, sistem akan mengarahkan Anda ke WhatsApp untuk mengirimkan detail akun kepada affiliator.
                    </p>
                    
                    <div>
                        <label className="block font-bold text-sm text-on-surface mb-2">Password Akses</label>
                        <input 
                            type="text" 
                            value={passData.password}
                            onChange={e => setPassData('password', e.target.value)}
                            required 
                            minLength={6}
                            placeholder="Minimal 6 karakter"
                            className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-variant/30 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-mono"
                        />
                        {passErrors.password && <p className="text-red-500 text-xs mt-1">{passErrors.password}</p>}
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant/60">
                        <button
                            type="button"
                            disabled={passProcessing}
                            onClick={() => setShowPasswordModal(false)}
                            className="px-5 py-2.5 rounded-xl bg-surface-variant text-on-surface-variant font-bold text-sm hover:bg-tertiary/40 transition-colors cursor-pointer border border-outline-variant"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={passProcessing || passData.password.length < 6}
                            className="px-5 py-2.5 rounded-xl bg-emerald-500 text-white font-bold text-sm shadow-md shadow-emerald-500/20 hover:bg-emerald-600 disabled:opacity-50 transition-all cursor-pointer flex items-center gap-2"
                        >
                            {passProcessing ? (
                                'Memproses...'
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-[18px]">send</span>
                                    Simpan & Kirim WA
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </FormModal>
        </AdminLayout>
    );
}
