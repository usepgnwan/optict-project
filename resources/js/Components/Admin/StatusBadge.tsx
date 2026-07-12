import React from 'react';

interface StatusBadgeProps {
    status: string | boolean;
    label?: string;
}

export default function StatusBadge({ status, label }: StatusBadgeProps) {
    const getBadgeStyle = () => {
        if (typeof status === 'boolean') {
            return status
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
        }

        switch (status.toLowerCase()) {
            case 'approved':
            case 'completed':
            case 'received':
                return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
            case 'shipped':
            case 'counting':
            case 'comparing':
                return 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20';
            case 'draft':
                return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
            case 'cancelled':
                return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
            default:
                return 'bg-surface-variant text-on-surface-variant border-outline-variant';
        }
    };

    const getLabel = () => {
        if (label) return label;
        if (typeof status === 'boolean') return status ? 'Aktif' : 'Nonaktif';
        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    return (
        <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getBadgeStyle()}`}
        >
            {getLabel()}
        </span>
    );
}
