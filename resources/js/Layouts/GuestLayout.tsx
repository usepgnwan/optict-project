import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen relative flex flex-col justify-between items-center bg-background text-on-background selection:bg-primary selection:text-on-primary font-sans overflow-x-hidden pt-6 sm:pt-0">
            {/* Background Ambient Decorative Elements */}
            <div className="absolute inset-0 dotted-bg opacity-35 dark:opacity-20 pointer-events-none" />
            <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/10 dark:bg-primary/15 blur-3xl pointer-events-none" />
            <div className="absolute top-1/3 -right-32 w-96 h-96 rounded-full bg-secondary/15 dark:bg-secondary/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 w-full flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-10">
                {/* Centered Logo Badge */}
                <div className="flex flex-col items-center text-center mb-6">
                    <Link
                        href="/"
                        className="group relative inline-flex items-center justify-center mb-3 focus:outline-none"
                    >
                        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-primary to-secondary opacity-30 blur-md group-hover:opacity-60 transition-opacity duration-500" />
                        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20 text-on-primary group-hover:scale-105 transition-transform duration-300">
                            <ApplicationLogo className="w-10 h-10 fill-current text-on-primary" />
                        </div>
                    </Link>
                    <Link href="/" className="text-xl sm:text-2xl font-extrabold tracking-tight text-on-surface hover:text-primary transition-colors">
                        Optik Calm
                    </Link>
                </div>

                {/* Glassmorphic Container */}
                <div className="relative w-full overflow-hidden rounded-3xl bg-surface/90 dark:bg-surface/85 backdrop-blur-2xl border border-outline-variant px-6 py-8 shadow-2xl sm:max-w-md sm:px-10">
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-secondary to-primary" />
                    {children}
                </div>
            </div>

            <footer className="relative z-10 py-6 text-center text-xs text-on-surface-variant/80">
                <p>© {new Date().getFullYear()} Optik Calm • Pelayanan Kesehatan Mata Terpercaya</p>
            </footer>
        </div>
    );
}

