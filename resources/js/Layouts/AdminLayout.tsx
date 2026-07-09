import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { useDarkMode } from '@/Hooks/useDarkMode';

interface AdminLayoutProps {
    children: React.ReactNode;
    title?: string;
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
    const user = usePage().props.auth?.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { isDark, toggleDarkMode } = useDarkMode();

    const navSections = [
        {
            category: 'UTAMA',
            items: [
                { name: 'Dashboard', href: route('dashboard'), icon: 'dashboard', active: true },
                { name: 'Analitik', href: '#', icon: 'analytics', active: false },
                { name: 'Kalender Reservasi', href: '#', icon: 'calendar_month', active: false },
            ],
        },
        {
            category: 'TRANSAKSI & LAYANAN',
            items: [
                { name: 'Fitur POS', href: '#', icon: 'point_of_sale', active: false },
                { name: 'Reservasi & Pesanan', href: '#', icon: 'shopping_cart', active: false },
                { name: 'Laporan Optometris', href: '#', icon: 'clinical_notes', active: false },
                { name: 'Voucher & Promo', href: '#', icon: 'local_offer', active: false },
            ],
        },
        {
            category: 'KONTEN OPTIK',
            items: [
                { name: 'Katalog Frame', href: '#', icon: 'category', active: false },
                { name: 'Testimoni', href: '#', icon: 'rate_review', active: false },
                { name: 'Artikel Kesehatan', href: '#', icon: 'health_and_safety', active: false },
                { name: 'Program Affiliate', href: '#', icon: 'handshake', active: false },
            ],
        },
    ];

    return (
        <div className="min-h-screen bg-background text-on-surface font-sans transition-colors duration-300 flex">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-xs"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed lg:sticky top-0 left-0 z-50 h-screen bg-surface border-r border-outline-variant flex flex-col transition-all duration-300 ${
                    isCollapsed ? 'lg:w-20' : 'lg:w-64'
                } w-64 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
            >
                {/* Brand Logo Header */}
                <div className={`p-6 border-b border-outline-variant/60 flex items-center ${isCollapsed ? 'lg:justify-center' : 'gap-3'} transition-all`}>
                    <Link href="/" className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary font-bold text-xl shadow-md shrink-0">
                        O
                    </Link>
                    <div className={`${isCollapsed ? 'lg:hidden' : 'block'}`}>
                        <span className="font-bold text-lg text-primary tracking-tight block leading-tight">
                            Optik Calm
                        </span>
                        <span className="text-[10px] uppercase font-semibold text-secondary tracking-widest block">
                            Admin Panel
                        </span>
                    </div>
                </div>

                {/* Navigation Links */}
                <div className="flex-1 overflow-y-auto px-3 py-6 space-y-6">
                    {navSections.map((section) => (
                        <div key={section.category}>
                            {/* Section Header */}
                            <div className="mb-2.5 px-3">
                                {isCollapsed ? (
                                    <div className="hidden lg:block h-px bg-outline-variant my-2" title={section.category} />
                                ) : null}
                                <p className={`text-[11px] font-bold text-on-surface-variant uppercase tracking-wider ${isCollapsed ? 'lg:hidden' : 'block'}`}>
                                    {section.category}
                                </p>
                            </div>

                            <div className="space-y-1.5">
                                {section.items.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        title={item.name}
                                        className={`flex items-center ${
                                            isCollapsed ? 'lg:justify-center px-3.5' : 'gap-3 px-3.5'
                                        } py-2.5 rounded-xl font-medium text-sm transition-all ${
                                            item.active
                                                ? 'bg-primary text-on-primary shadow-lg shadow-primary/20 font-semibold'
                                                : 'text-on-surface-variant hover:bg-tertiary/60 hover:text-primary'
                                        }`}
                                    >
                                        <span
                                            className={`material-symbols-outlined text-[20px] shrink-0 ${
                                                item.active ? 'text-on-primary' : 'text-on-surface-variant'
                                            }`}
                                        >
                                            {item.icon}
                                        </span>
                                        <span className={`${isCollapsed ? 'lg:hidden' : 'block'} truncate`}>
                                            {item.name}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Sidebar User Footer */}
                <div className="p-4 border-t border-outline-variant/60 bg-surface-variant/40">
                    <div className={`flex items-center ${isCollapsed ? 'lg:justify-center' : 'gap-3'} px-2 py-1.5`}>
                        <div
                            className="w-9 h-9 rounded-full bg-secondary/20 text-primary flex items-center justify-center font-bold text-sm shrink-0"
                            title={user?.name || 'Admin Optik'}
                        >
                            {user?.name?.charAt(0).toUpperCase() || 'A'}
                        </div>
                        <div className={`flex-1 min-w-0 ${isCollapsed ? 'lg:hidden' : 'block'}`}>
                            <p className="text-sm font-bold text-primary truncate">
                                {user?.name || 'Admin Optik'}
                            </p>
                            <p className="text-xs text-on-surface-variant truncate">
                                {user?.email || 'admin@optikcalm.com'}
                            </p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Wrapper */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Header Navbar */}
                <header className="h-16 bg-surface border-b border-outline-variant px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30 shadow-2xs transition-colors duration-300">
                    <div className="flex items-center gap-3">
                        {/* Mobile Sidebar Trigger */}
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="lg:hidden p-2 rounded-xl text-on-surface-variant hover:bg-tertiary/50 cursor-pointer"
                            aria-label="Buka Menu Mobile"
                        >
                            <span className="material-symbols-outlined">menu</span>
                        </button>

                        {/* Desktop Collapse Sidebar Trigger */}
                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            title={isCollapsed ? 'Perluas Sidebar' : 'Ciutkan Sidebar'}
                            className="hidden lg:flex p-2 rounded-xl text-on-surface-variant hover:bg-tertiary/50 hover:text-primary transition-all cursor-pointer items-center justify-center"
                        >
                            <span className="material-symbols-outlined text-[24px]">
                                {isCollapsed ? 'menu' : 'menu_open'}
                            </span>
                        </button>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4">
                        {/* Interactive Theme Mode Toggle */}
                        <button
                            onClick={toggleDarkMode}
                            title={isDark ? 'Beralih ke Mode Siang' : 'Beralih ke Mode Malam'}
                            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-outline-variant hover:border-primary/50 bg-surface-variant text-on-surface-variant hover:text-primary transition-all cursor-pointer shadow-2xs"
                        >
                            <span className={`material-symbols-outlined text-[18px] transition-transform duration-500 ${isDark ? 'rotate-180 text-amber-400' : 'text-primary'}`}>
                                {isDark ? 'light_mode' : 'dark_mode'}
                            </span>
                            <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">
                                {isDark ? 'Dark' : 'Light'}
                            </span>
                        </button>

                        {/* Notifications */}
                        <div className="relative">
                            <button className="p-2.5 rounded-full hover:bg-tertiary/50 text-on-surface-variant transition-colors relative cursor-pointer">
                                <span className="material-symbols-outlined text-[22px]">
                                    notifications
                                </span>
                                <span className="absolute top-1.5 right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-surface">
                                    23
                                </span>
                            </button>
                        </div>

                        {/* User Profile Pill */}
                        <div className="flex items-center gap-2.5 pl-3 border-l border-outline-variant">
                            <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs">
                                {user?.name?.charAt(0).toUpperCase() || 'A'}
                            </div>
                            <span className="font-semibold text-sm text-primary hidden sm:block">
                                {user?.name || 'Admin Optik'}
                            </span>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6 lg:p-8 overflow-y-auto">{children}</main>
            </div>
        </div>
    );
}
