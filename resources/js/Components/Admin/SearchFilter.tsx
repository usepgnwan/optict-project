import React from 'react';

interface SearchFilterProps {
    search: string;
    onSearchChange: (value: string) => void;
    placeholder?: string;
    children?: React.ReactNode;
}

export default function SearchFilter({
    search,
    onSearchChange,
    placeholder = 'Cari data...',
    children,
}: SearchFilterProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 bg-surface p-4 rounded-2xl border border-outline-variant/60 shadow-2xs">
            <div className="relative flex-1 max-w-md">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                    search
                </span>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-surface-variant/50 border border-outline-variant/60 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
                />
            </div>

            {children && (
                <div className="flex items-center gap-2.5 flex-wrap">{children}</div>
            )}
        </div>
    );
}
