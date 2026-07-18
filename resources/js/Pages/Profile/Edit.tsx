import AdminLayout from '@/Layouts/AdminLayout';
import { PageProps } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({
    mustVerifyEmail,
    status,
    affiliate,
}: PageProps<{ mustVerifyEmail: boolean; status?: string; affiliate?: any }>) {
    const { auth } = usePage().props as any;
    const isAffiliator = auth.user.role?.name === 'affiliator';

    return (
        <AdminLayout title="Pengaturan Akun">
            <Head title="Pengaturan Akun" />

            {/* Gradient Banner Header */}
            <div className="relative rounded-3xl overflow-hidden mb-8 bg-gradient-to-r from-primary to-secondary p-8 md:p-10 shadow-lg shadow-primary/20">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent)] pointer-events-none"></div>
                <div className="relative z-10">
                    <p className="text-xs font-bold tracking-widest text-white/80 uppercase mb-2">PENGATURAN</p>
                    <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Pengaturan Akun</h1>
                    <p className="text-sm text-white/75 mt-2 max-w-xl">
                        Kelola data profil, rekening pencairan komisi, dan keamanan kata sandi Anda dalam satu tempat.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Summary & Registration Info */}
                {isAffiliator && (
                    <div className="lg:col-span-1 space-y-6">
                        {/* Profile Summary Card */}
                        <div className="bg-surface border border-outline-variant rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex flex-col items-center text-center pb-6 border-b border-outline-variant/60">
                                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary/20 shadow-inner bg-surface-variant flex items-center justify-center mb-4">
                                    {auth.user.avatar ? (
                                        <img src={`/storage/${auth.user.avatar}`} alt={auth.user.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-2xl font-black text-primary">
                                            {auth.user.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <h3 className="font-bold text-lg text-primary">{auth.user.name}</h3>
                                <p className="text-xs text-on-surface-variant mb-3">{auth.user.email}</p>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full border border-primary/20">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                                    Affiliator Partner
                                </span>
                            </div>

                            <div className="pt-6">
                                <div className="bg-surface-variant/30 border border-outline-variant/60 rounded-2xl p-4 flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">Kode Kupon Anda</p>
                                        <p className="font-mono font-bold text-md text-primary tracking-wide">{affiliate?.referral_code || '-'}</p>
                                    </div>
                                    <button 
                                        onClick={() => {
                                            navigator.clipboard.writeText(affiliate?.referral_code || '');
                                            alert('Kode kupon berhasil disalin!');
                                        }}
                                        className="w-8 h-8 rounded-xl bg-surface hover:bg-outline-variant/30 flex items-center justify-center text-primary transition-colors border border-outline-variant/50"
                                        title="Salin Kode Kupon"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">content_copy</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Registration Details Card */}
                        <div className="bg-surface border border-outline-variant rounded-3xl p-6 shadow-sm">
                            <h4 className="text-sm font-bold text-primary mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[20px]">assignment</span>
                                Data Registrasi
                            </h4>
                            
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-secondary text-[20px] mt-0.5">phone_iphone</span>
                                    <div>
                                        <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">No. WhatsApp</p>
                                        <p className="text-sm font-semibold text-on-surface">{affiliate?.phone || '-'}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-secondary text-[20px] mt-0.5">location_on</span>
                                    <div>
                                        <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Kota Asal</p>
                                        <p className="text-sm font-semibold text-on-surface">{affiliate?.city || '-'}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-secondary text-[20px] mt-0.5">calendar_month</span>
                                    <div>
                                        <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Usia</p>
                                        <p className="text-sm font-semibold text-on-surface">{affiliate?.age ? `${affiliate.age} Tahun` : '-'}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-secondary text-[20px] mt-0.5">campaign</span>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Media Promosi</p>
                                        <p className="text-sm font-semibold text-on-surface truncate" title={affiliate?.promotional_media}>{affiliate?.promotional_media || '-'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Right Column: Editable Forms */}
                <div className={`${isAffiliator ? 'lg:col-span-2' : 'lg:col-span-3'} space-y-8`}>
                    {/* Profile Information & Payment Form */}
                    <div className="bg-surface p-6 md:p-8 shadow-sm sm:rounded-3xl border border-outline-variant">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            affiliate={affiliate}
                            isAffiliator={isAffiliator}
                        />
                    </div>

                    {/* Change Password Form */}
                    <div className="bg-surface p-6 md:p-8 shadow-sm sm:rounded-3xl border border-outline-variant">
                        <UpdatePasswordForm />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
