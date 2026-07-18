import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    affiliate,
    isAffiliator,
    className = '',
}: {
    mustVerifyEmail: boolean;
    status?: string;
    affiliate?: any;
    isAffiliator?: boolean;
    className?: string;
}) {
    const user = usePage().props.auth.user;
    const [avatarPreview, setAvatarPreview] = useState<string | null>(
        user.avatar ? `/storage/${user.avatar}` : null
    );

    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm({
            _method: 'PATCH',
            name: user.name,
            email: user.email,
            bank_name: affiliate?.bank_name || '',
            bank_account_number: affiliate?.bank_account_number || '',
            bank_account_name: affiliate?.bank_account_name || '',
            avatar: null as File | null,
        });

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('avatar', file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(isAffiliator ? route('affiliate.settings.update') : route('profile.update'));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-bold text-primary">
                    Informasi Profil & Pembayaran
                </h2>
                <p className="mt-1 text-sm text-on-surface-variant">
                    Perbarui profil Anda dan pastikan informasi rekening tujuan komisi Anda sudah benar.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                {/* Avatar / Profile Picture Upload Section */}
                <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-outline-variant/60">
                    <div className="relative group w-24 h-24 rounded-full overflow-hidden border-2 border-primary/20 shadow-sm bg-surface-variant flex items-center justify-center cursor-pointer">
                        {avatarPreview ? (
                            <img src={avatarPreview} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="text-2xl font-black text-primary">
                                {user.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                            </div>
                        )}
                        <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                            <span className="material-symbols-outlined text-white text-[24px]">photo_camera</span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="hidden"
                            />
                        </label>
                    </div>
                    <div className="text-center sm:text-left">
                        <h4 className="text-sm font-bold text-on-surface">Foto Profil</h4>
                        <p className="text-xs text-on-surface-variant mb-3">Unggah foto format JPG/PNG, ukuran maks 1MB.</p>
                        <label className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-xl text-xs font-bold transition-colors cursor-pointer">
                            <span className="material-symbols-outlined text-[16px]">upload</span>
                            Pilih Foto Baru
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="hidden"
                            />
                        </label>
                        {errors.avatar && <p className="text-red-500 text-xs mt-1.5">{errors.avatar}</p>}
                    </div>
                </div>

                <div>
                    <InputLabel htmlFor="name" value="Nama Lengkap" />
                    <TextInput
                        id="name"
                        className="mt-1 block w-full bg-surface border-outline-variant focus:border-primary focus:ring-primary rounded-xl"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />
                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Alamat Email (Login)" />
                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full bg-surface-variant/30 border-outline-variant text-on-surface-variant rounded-xl cursor-not-allowed"
                        value={data.email}
                        disabled
                    />
                    <p className="text-[11px] text-on-surface-variant mt-1.5 font-medium">Alamat email digunakan untuk login dan tidak dapat diubah di sini.</p>
                </div>

                {/* Affiliate Specific Editable Fields */}
                {isAffiliator && (
                    <>
                        <div className="pt-4 mt-6 border-t border-outline-variant/60">
                            <h3 className="text-md font-bold text-primary mb-4">Informasi Rekening Bank</h3>
                            
                            <div className="space-y-4">
                                <div>
                                    <InputLabel htmlFor="bank_name" value="Nama Bank" />
                                    <TextInput
                                        id="bank_name"
                                        className="mt-1 block w-full bg-surface border-outline-variant focus:border-primary focus:ring-primary rounded-xl"
                                        value={data.bank_name}
                                        onChange={(e) => setData('bank_name', e.target.value)}
                                        placeholder="Contoh: BCA / Mandiri / BNI"
                                    />
                                    <InputError className="mt-2" message={errors.bank_name as string} />
                                </div>

                                <div>
                                    <InputLabel htmlFor="bank_account_number" value="Nomor Rekening" />
                                    <TextInput
                                        id="bank_account_number"
                                        className="mt-1 block w-full bg-surface border-outline-variant focus:border-primary focus:ring-primary rounded-xl"
                                        value={data.bank_account_number}
                                        onChange={(e) => setData('bank_account_number', e.target.value)}
                                    />
                                    <InputError className="mt-2" message={errors.bank_account_number as string} />
                                </div>

                                <div>
                                    <InputLabel htmlFor="bank_account_name" value="Nama Pemilik Rekening" />
                                    <TextInput
                                        id="bank_account_name"
                                        className="mt-1 block w-full bg-surface border-outline-variant focus:border-primary focus:ring-primary rounded-xl"
                                        value={data.bank_account_name}
                                        onChange={(e) => setData('bank_account_name', e.target.value)}
                                    />
                                    <InputError className="mt-2" message={errors.bank_account_name as string} />
                                </div>
                            </div>
                        </div>

                    </>
                )}

                <div className="flex items-center gap-4 pt-6 border-t border-outline-variant/60">
                    <button 
                        type="submit"
                        disabled={processing}
                        className="bg-primary text-on-primary px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                    >
                        Simpan Perubahan
                    </button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out duration-300"
                        enterFrom="opacity-0 -translate-x-2"
                        enterTo="opacity-100 translate-x-0"
                        leave="transition ease-in-out duration-300"
                        leaveFrom="opacity-100 translate-x-0"
                        leaveTo="opacity-0 -translate-x-2"
                    >
                        <p className="text-sm font-bold text-emerald-600 flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[18px]">check_circle</span>
                            Berhasil disimpan.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
