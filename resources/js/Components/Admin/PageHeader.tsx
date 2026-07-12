import React from 'react';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    icon?: string;
    action?: React.ReactNode;
}

export default function PageHeader({ title, subtitle, icon, action }: PageHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-outline-variant/60">
            <div className="flex items-center gap-3">
                {icon && (
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[24px]">{icon}</span>
                    </div>
                )}
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-on-surface">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>

            {action && <div className="flex items-center gap-2.5 shrink-0">{action}</div>}
        </div>
    );
}
