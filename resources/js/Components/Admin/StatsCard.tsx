import React from 'react';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: string;
    description?: string;
    trend?: {
        value: string;
        positive: boolean;
    };
    color?: 'primary' | 'emerald' | 'amber' | 'rose' | 'sky';
}

export default function StatsCard({
    title,
    value,
    icon,
    description,
    trend,
    color = 'primary',
}: StatsCardProps) {
    const getColorClass = () => {
        switch (color) {
            case 'emerald':
                return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';
            case 'amber':
                return 'bg-amber-500/10 text-amber-600 dark:text-amber-400';
            case 'rose':
                return 'bg-rose-500/10 text-rose-600 dark:text-rose-400';
            case 'sky':
                return 'bg-sky-500/10 text-sky-600 dark:text-sky-400';
            default:
                return 'bg-primary/10 text-primary';
        }
    };

    return (
        <div className="p-5 rounded-2xl bg-surface border border-outline-variant/60 shadow-2xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                        {title}
                    </p>
                    <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-on-surface mt-1.5">
                        {value}
                    </p>
                </div>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${getColorClass()} shrink-0`}>
                    <span className="material-symbols-outlined text-[26px]">{icon}</span>
                </div>
            </div>

            {(description || trend) && (
                <div className="mt-4 pt-3 border-t border-outline-variant/40 flex items-center justify-between text-xs">
                    {description && (
                        <span className="text-on-surface-variant truncate">{description}</span>
                    )}
                    {trend && (
                        <span
                            className={`font-bold flex items-center gap-1 ${
                                trend.positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                            }`}
                        >
                            <span className="material-symbols-outlined text-[14px]">
                                {trend.positive ? 'trending_up' : 'trending_down'}
                            </span>
                            {trend.value}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}
