import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { useDarkMode } from '@/Hooks/useDarkMode';

export default function Navbar() {
    const { isDark, toggleDarkMode } = useDarkMode();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { url } = usePage();

    const isCatalogActive = url.startsWith('/katalog-kacamata');
    const isBookingActive = url.startsWith('/booking');
    const isHomeActive = url === '/' && !isCatalogActive && !isBookingActive;

    const isLayananActive = url.startsWith('/layanan');

    const navLinks = [
        { name: 'Home', href: '/', icon: 'home', isAnchor: false, active: isHomeActive },
        { name: 'Catalog', href: '/katalog-kacamata', icon: 'eyeglasses', isAnchor: false, active: isCatalogActive },
        { name: 'Booking', href: '/booking', icon: 'calendar_month', isAnchor: false, active: isBookingActive },
        { name: 'Services', href: '/layanan', icon: 'medical_services', isAnchor: false, active: isLayananActive },
        { name: 'Affiliate', href: '/#affiliate', icon: 'handshake', isAnchor: true, active: false },
        { name: 'Admin', href: '/dashboard', icon: 'admin_panel_settings', isAnchor: false, active: false },
    ];

    return (
        <>
            <header className="bg-surface/90 backdrop-blur-md sticky top-0 z-40 border-b border-outline-variant transition-colors duration-300">
                <nav className="flex justify-between items-center w-full px-6 max-w-[1200px] mx-auto h-20">
                    {/* Logo & Desktop Nav Links */}
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-3 group">
                            <img
                                src="/logo.png"
                                alt="Harmoni by Phoenix Sehat Logo"
                                className="h-10 md:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                            />
                        </Link>

                        {/* Desktop Menu */}
                        <div className="hidden lg:flex items-center gap-1.5 bg-outline-variant/50 p-1.5 rounded-full">
                            {navLinks.map((link) =>
                                link.isAnchor ? (
                                    <a
                                        key={link.name}
                                        href={link.href}
                                        className="text-on-surface-variant hover:bg-surface hover:text-primary hover:shadow-sm px-4 py-2 rounded-full transition-all font-medium text-sm tracking-wide"
                                    >
                                        {link.name}
                                    </a>
                                ) : (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className={`px-4 py-2 rounded-full font-medium text-sm tracking-wide transition-all ${link.active
                                                ? 'bg-primary text-on-primary shadow-sm'
                                                : 'text-on-surface-variant hover:bg-surface hover:text-primary hover:shadow-sm'
                                            }`}
                                    >
                                        {link.name}
                                    </Link>
                                )
                            )}
                        </div>
                    </div>

                    {/* Right Actions (Desktop & Mobile buttons) */}
                    <div className="flex items-center gap-3">
                        {/* Interactive Dark Mode Toggle Button */}
                        <button
                            onClick={toggleDarkMode}
                            title={isDark ? 'Beralih ke Mode Siang' : 'Beralih ke Mode Malam'}
                            className="flex items-center gap-2 px-3.5 py-2 rounded-full border border-outline-variant hover:border-primary/50 bg-surface-variant text-on-surface-variant hover:text-primary transition-all duration-300 cursor-pointer shadow-xs"
                        >
                            <span className={`material-symbols-outlined text-[18px] transition-transform duration-500 ${isDark ? 'rotate-180 text-amber-400' : 'text-primary'}`}>
                                {isDark ? 'light_mode' : 'dark_mode'}
                            </span>
                            <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">
                                {isDark ? 'Dark' : 'Light'}
                            </span>
                        </button>

                        {/* Desktop Book Appointment CTA */}

                        {/* Mobile Hamburger Drawer Trigger */}
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            aria-label="Buka Drawer Menu"
                            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-outline-variant/60 text-primary hover:bg-primary hover:text-on-primary transition-all cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-[24px]">menu</span>
                        </button>
                    </div>
                </nav>
            </header>

            {/* Mobile Side Drawer Overlay */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 lg:hidden transition-opacity animate-fadeIn"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Mobile Off-Canvas Side Drawer */}
            <aside
                className={`fixed top-0 right-0 z-50 h-full w-[85%] max-w-sm bg-surface border-l border-outline-variant shadow-2xl flex flex-col justify-between p-6 transition-transform duration-300 lg:hidden ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {/* Drawer Header */}
                <div>
                    <div className="flex items-center justify-between pb-6 border-b border-outline-variant mb-6">
                        <div className="flex items-center gap-2.5">
                            <img
                                src="/logo.png"
                                alt="Harmoni by Phoenix Sehat Logo"
                                className="h-9 w-auto object-contain"
                            />
                        </div>
                        <button
                            onClick={() => setMobileMenuOpen(false)}
                            aria-label="Tutup Menu"
                            className="w-10 h-10 rounded-full bg-outline-variant/60 hover:bg-primary hover:text-on-primary text-primary flex items-center justify-center transition-all cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-[22px]">close</span>
                        </button>
                    </div>

                    {/* Drawer Links */}
                    <div className="space-y-2">
                        <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider px-2 mb-3">
                            Navigasi Utama
                        </p>
                        {navLinks.map((link) =>
                            link.isAnchor ? (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center justify-between px-4 py-3.5 rounded-2xl font-semibold text-on-surface hover:bg-tertiary/40 hover:text-primary transition-all"
                                >
                                    <div className="flex items-center gap-3.5">
                                        <span className="material-symbols-outlined text-[22px] text-primary">
                                            {link.icon}
                                        </span>
                                        <span className="text-base">{link.name}</span>
                                    </div>
                                    <span className="material-symbols-outlined text-sm text-secondary">
                                        arrow_forward_ios
                                    </span>
                                </a>
                            ) : (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center justify-between px-4 py-3.5 rounded-2xl font-semibold transition-all ${link.active
                                            ? 'bg-primary text-on-primary shadow-md'
                                            : 'text-on-surface hover:bg-tertiary/40 hover:text-primary'
                                        }`}
                                >
                                    <div className="flex items-center gap-3.5">
                                        <span className="material-symbols-outlined text-[22px]">
                                            {link.icon}
                                        </span>
                                        <span className="text-base">{link.name}</span>
                                    </div>
                                    {link.name === 'Admin' && (
                                        <span className="px-2.5 py-0.5 rounded-full bg-secondary/20 text-secondary text-xs font-bold uppercase">
                                            Panel
                                        </span>
                                    )}
                                </Link>
                            )
                        )}
                    </div>
                </div>

                {/* Drawer Footer Actions */}
                <div className="pt-6 border-t border-outline-variant space-y-4">
                    {/* Theme Mode row inside Drawer */}
                    <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-surface-variant border border-outline-variant">
                        <div className="flex items-center gap-3">
                            <span className={`material-symbols-outlined text-xl ${isDark ? 'text-amber-400' : 'text-primary'}`}>
                                {isDark ? 'light_mode' : 'dark_mode'}
                            </span>
                            <span className="text-sm font-bold text-primary">
                                {isDark ? 'Mode Malam Aktif' : 'Mode Siang Aktif'}
                            </span>
                        </div>
                        <button
                            onClick={toggleDarkMode}
                            className="px-3.5 py-1.5 rounded-full bg-primary text-on-primary text-xs font-bold uppercase tracking-wider shadow-sm cursor-pointer"
                        >
                            Ganti Mode
                        </button>
                    </div>

                    <Link
                        href="/booking"
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary py-4 rounded-2xl font-bold text-base shadow-xl hover:bg-primary/95 transition-all"
                    >
                        <span className="material-symbols-outlined text-[20px]">calendar_month</span>
                        Book Appointment
                    </Link>
                </div>
            </aside>
        </>
    );
}
