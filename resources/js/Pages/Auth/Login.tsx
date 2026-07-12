import ApplicationLogo from '@/Components/ApplicationLogo';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import { useDarkMode } from '@/Hooks/useDarkMode';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { isDark, toggleDarkMode } = useDarkMode();
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen relative flex flex-col justify-between bg-background text-on-background selection:bg-primary selection:text-on-primary overflow-x-hidden font-sans transition-colors duration-500">
            <Head title="Masuk ke Akun - Optik Calm" />

            {/* Background Ambient Decorative Elements */}
            <div className="absolute inset-0 dotted-bg opacity-35 dark:opacity-20 pointer-events-none" />
            <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/10 dark:bg-primary/15 blur-3xl pointer-events-none" />
            <div className="absolute top-1/3 -right-32 w-96 h-96 rounded-full bg-secondary/15 dark:bg-secondary/10 blur-3xl pointer-events-none" />

            {/* Top Bar Navigation */}
            <header className="relative z-10 w-full max-w-[1200px] mx-auto px-6 py-6 flex items-center justify-between">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface/80 dark:bg-surface/60 backdrop-blur-md border border-outline-variant text-on-surface hover:text-primary hover:border-primary/40 shadow-xs transition-all duration-300 text-sm font-semibold group"
                >
                    <span className="material-symbols-outlined text-[18px] transition-transform duration-300 group-hover:-translate-x-1">
                        arrow_back
                    </span>
                    <span>Kembali ke Beranda</span>
                </Link>

                <button
                    onClick={toggleDarkMode}
                    type="button"
                    title={isDark ? 'Beralih ke Mode Siang' : 'Beralih ke Mode Malam'}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface/80 dark:bg-surface/60 backdrop-blur-md border border-outline-variant text-on-surface hover:text-primary hover:border-primary/40 shadow-xs transition-all duration-300 cursor-pointer text-sm font-semibold"
                >
                    <span
                        className={`material-symbols-outlined text-[18px] transition-transform duration-500 ${
                            isDark ? 'rotate-180 text-amber-400' : 'text-primary'
                        }`}
                    >
                        {isDark ? 'light_mode' : 'dark_mode'}
                    </span>
                    <span>{isDark ? 'Mode Malam' : 'Mode Siang'}</span>
                </button>
            </header>

            {/* Main Centered Login Section */}
            <main className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 py-8">
                <div className="w-full max-w-md">
                    {/* Glassmorphism Card */}
                    <div className="relative rounded-3xl bg-surface/90 dark:bg-surface/85 backdrop-blur-2xl border border-outline-variant shadow-2xl p-7 sm:p-10 overflow-hidden transition-all duration-300">
                        {/* Top Gradient Decorative Accent Bar */}
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-secondary to-primary" />

                        {/* Centered Logo & Branding Header ("Logo di Tengah") */}
                        <div className="flex flex-col items-center text-center mb-8">
                            <Link
                                href="/"
                                className="group relative inline-flex items-center justify-center mb-5 focus:outline-none"
                                aria-label="Beranda Optik Calm"
                            >
                                {/* Glowing halo around logo */}
                                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-primary to-secondary opacity-30 blur-md group-hover:opacity-60 transition-opacity duration-500" />

                                {/* Logo Icon Badge */}
                                <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20 text-on-primary group-hover:scale-105 transition-transform duration-300">
                                    <ApplicationLogo className="w-10 h-10 fill-current text-on-primary" />
                                </div>
                            </Link>

                            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-on-surface">
                                Optik Calm
                            </h1>

                            <p className="mt-2 text-sm text-on-surface-variant max-w-xs leading-relaxed">
                                Selamat datang kembali! Masuk ke akun Anda untuk mengelola pesanan & janji temu.
                            </p>
                        </div>

                        {/* Status Message */}
                        {status && (
                            <div className="mb-6 flex items-center gap-3 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-medium animate-fadeIn">
                                <span className="material-symbols-outlined text-[20px] text-emerald-500">
                                    check_circle
                                </span>
                                <span>{status}</span>
                            </div>
                        )}

                        {/* Login Form */}
                        <form onSubmit={submit} className="space-y-5" noValidate>
                            {/* Email Input Field */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5"
                                >
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-on-surface-variant">
                                        <span className="material-symbols-outlined text-[20px]">
                                            mail
                                        </span>
                                    </div>
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        autoComplete="username"
                                        required
                                        placeholder="nama@email.com"
                                        className="w-full pl-11 pr-4 py-3 rounded-2xl bg-surface-variant/80 dark:bg-surface-variant/50 border border-outline-variant text-on-surface placeholder:text-on-surface-variant/50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                                    />
                                </div>
                                <InputError message={errors.email} className="mt-1.5" />
                            </div>

                            {/* Password Input Field */}
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label
                                        htmlFor="password"
                                        className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant"
                                    >
                                        Kata Sandi
                                    </label>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-on-surface-variant">
                                        <span className="material-symbols-outlined text-[20px]">
                                            lock
                                        </span>
                                    </div>
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        autoComplete="current-password"
                                        required
                                        placeholder="••••••••"
                                        className="w-full pl-11 pr-12 py-3 rounded-2xl bg-surface-variant/80 dark:bg-surface-variant/50 border border-outline-variant text-on-surface placeholder:text-on-surface-variant/50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                                        aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                                    >
                                        <span className="material-symbols-outlined text-[20px]">
                                            {showPassword ? 'visibility_off' : 'visibility'}
                                        </span>
                                    </button>
                                </div>
                                <InputError message={errors.password} className="mt-1.5" />
                            </div>

                            {/* Remember Me & Forgot Password */}
                            <div className="flex items-center justify-between pt-1">
                                <label className="flex items-center gap-2.5 cursor-pointer select-none group">
                                    <Checkbox
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) =>
                                            setData('remember', (e.target.checked || false) as false)
                                        }
                                        className="rounded-lg border-outline text-primary focus:ring-primary/30"
                                    />
                                    <span className="text-sm font-medium text-on-surface-variant group-hover:text-on-surface transition-colors">
                                        Ingat saya
                                    </span>
                                </label>

                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-sm font-semibold text-primary hover:text-secondary underline-offset-4 hover:underline transition-all"
                                    >
                                        Lupa kata sandi?
                                    </Link>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full py-3.5 px-6 rounded-2xl bg-primary hover:bg-primary/95 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed text-on-primary font-bold text-base shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer group"
                                >
                                    {processing ? (
                                        <>
                                            <span className="material-symbols-outlined animate-spin text-[20px]">
                                                progress_activity
                                            </span>
                                            <span>Memproses...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Masuk ke Akun</span>
                                            <span className="material-symbols-outlined text-[20px] transition-transform duration-300 group-hover:translate-x-1">
                                                arrow_forward
                                            </span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>

                        {/* Register Link Divider */}
                        <div className="mt-8 pt-6 border-t border-outline-variant/80 text-center">
                            <p className="text-sm text-on-surface-variant">
                                Belum punya akun?{' '}
                                <Link
                                    href={route('register')}
                                    className="font-bold text-primary hover:text-secondary underline-offset-4 hover:underline transition-all ml-1"
                                >
                                    Daftar Sekarang
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 py-6 text-center text-xs text-on-surface-variant/80">
                <p>© {new Date().getFullYear()} Optik Calm • Pelayanan Kesehatan Mata Modern & Terpercaya</p>
            </footer>
        </div>
    );
}

