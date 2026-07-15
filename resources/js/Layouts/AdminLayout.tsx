import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { useDarkMode } from '@/Hooks/useDarkMode';

interface AdminLayoutProps {
    children: React.ReactNode;
    title?: string;
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
    const { auth, flash } = usePage().props as any;
    const user = auth?.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { isDark, toggleDarkMode } = useDarkMode();

    const currentRoute = route().current() || '';

    const isAffiliator = user?.role?.name === 'affiliator';

    const adminNavSections = [
        {
            category: 'UTAMA',
            items: [
                { name: 'Dashboard', href: route('dashboard'), icon: 'dashboard', active: currentRoute === 'dashboard' },
            ],
        },
        {
            category: 'KASIR & RESERVASI',
            items: [
                { name: 'POS Kasir (Point of Sale)', href: route('pos.index'), icon: 'point_of_sale', active: currentRoute.startsWith('pos.index') },
                { name: 'Reservasi Cabang', href: route('reservations.index'), icon: 'event', active: currentRoute.startsWith('reservations.') },
                { name: 'POS Analytics Dashboard', href: route('pos.dashboard'), icon: 'leaderboard', active: currentRoute.startsWith('pos.dashboard') },
            ],
        },
        {
            category: 'MASTER DATA',
            items: [
                { name: 'Cabang Optik', href: route('branches.index'), icon: 'storefront', active: currentRoute.startsWith('branches.') },
                { name: 'Katalog Produk', href: route('products.index'), icon: 'eyeglasses', active: currentRoute.startsWith('products.') },
                { name: 'Layanan Optik', href: route('services.index'), icon: 'medical_services', active: currentRoute.startsWith('services.') },
                { name: 'Kategori Layanan', href: route('service-categories.index'), icon: 'category', active: currentRoute.startsWith('service-categories.') },
                { name: 'Layanan Spesialis', href: route('specialist-services.index'), icon: 'auto_fix_high', active: currentRoute.startsWith('specialist-services.') },
                { name: 'Tipe Keluhan', href: route('complaint-types.index'), icon: 'clinical_notes', active: currentRoute.startsWith('complaint-types.') },
                { name: 'FAQ / Pertanyaan Umum', href: route('faqs.index'), icon: 'quiz', active: currentRoute.startsWith('faqs.') },
                { name: 'Data Pelanggan', href: route('customers.index'), icon: 'groups', active: currentRoute.startsWith('customers.') },
            ],
        },
        {
            category: 'INVENTORI',
            items: [
                { name: 'Gudang Pusat', href: route('central-inventory.index'), icon: 'warehouse', active: currentRoute.startsWith('central-inventory.') },
                { name: 'Stok Cabang', href: route('branch-inventory.index'), icon: 'inventory_2', active: currentRoute.startsWith('branch-inventory.') },
            ],
        },
        {
            category: 'OPERASIONAL',
            items: [
                { name: 'Transfer Stok', href: route('stock-transfers.index'), icon: 'local_shipping', active: currentRoute.startsWith('stock-transfers.') },
                { name: 'Penyesuaian Stok', href: route('stock-adjustments.index'), icon: 'tune', active: currentRoute.startsWith('stock-adjustments.') },
                { name: 'Stock Opname', href: route('stock-opnames.index'), icon: 'fact_check', active: currentRoute.startsWith('stock-opnames.') },
            ],
        },
        {
            category: 'LAPORAN & ANALITIK',
            items: [
                { name: 'Pusat Laporan', href: route('reports.index'), icon: 'analytics', active: currentRoute.startsWith('reports.') },
            ],
        },
        {
            category: 'PENGATURAN',
            items: [
                { name: 'Manajemen User & Role', href: route('users.index'), icon: 'manage_accounts', active: currentRoute.startsWith('users.') },
                { name: 'User Affiliator', href: route('admin.affiliates.index'), icon: 'handshake', active: currentRoute.startsWith('admin.affiliates.') },
            ],
        },
    ];

    const affiliatorNavSections = [
        {
            category: 'AFFILIATOR',
            items: [
                { name: 'Dashboard Affiliator', href: route('dashboard'), icon: 'dashboard', active: currentRoute === 'dashboard' },
                { name: 'Riwayat Komisi', href: '#', icon: 'payments', active: false },
                { name: 'Materi Promosi', href: '#', icon: 'campaign', active: false },
                { name: 'Pengaturan Akun', href: '#', icon: 'manage_accounts', active: false },
            ],
        },
    ];

    const navSections = isAffiliator ? affiliatorNavSections : adminNavSections;

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
                <div className={`p-5 border-b border-outline-variant/60 flex items-center ${isCollapsed ? 'lg:justify-center' : 'gap-3'} transition-all`}>
                    <Link href="/" className="shrink-0">
                        <img src="/logo.png" alt="Harmoni Logo" className="h-9 w-auto object-contain" />
                    </Link>
                    <div className={`${isCollapsed ? 'lg:hidden' : 'block'}`}>
                        <span className="font-bold text-base text-primary tracking-tight block leading-tight">
                            Phoenix Sehat
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

                        {/* User Profile Pill & Logout */}
                        <div className="flex items-center gap-3 pl-3 border-l border-outline-variant">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs shadow-2xs">
                                    {user?.name?.charAt(0).toUpperCase() || 'A'}
                                </div>
                                <div className="hidden sm:block">
                                    <span className="font-semibold text-sm text-primary block leading-tight">
                                        {user?.name || 'Admin Optik'}
                                    </span>
                                    {user?.role && (
                                        <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-primary/10 text-primary">
                                            {user.role.display_name}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                title="Keluar dari Akun"
                                className="p-2 rounded-xl text-on-surface-variant hover:bg-red-500/10 hover:text-red-500 transition-colors cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-[20px]">logout</span>
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
                    {flash?.success && (
                        <div className="mb-6 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-medium text-sm flex items-center gap-2 shadow-xs">
                            <span className="material-symbols-outlined text-[20px]">check_circle</span>
                            <span>{flash.success}</span>
                        </div>
                    )}
                    {flash?.error && (
                        <div className="mb-6 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 font-medium text-sm flex items-center gap-2 shadow-xs">
                            <span className="material-symbols-outlined text-[20px]">error</span>
                            <span>{flash.error}</span>
                        </div>
                    )}
                    {children}
                </main>
            </div>
        </div>
    );
}
