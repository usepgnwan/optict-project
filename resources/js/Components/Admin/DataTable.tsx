import React from 'react';
import { Link } from '@inertiajs/react';

interface Column<T> {
    header: string;
    key: string;
    render?: (item: T) => React.ReactNode;
    className?: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    links?: PaginationLink[];
    emptyMessage?: string;
}

export default function DataTable<T extends { id: number | string }>({
    columns,
    data,
    links,
    emptyMessage = 'Tidak ada data ditemukan.',
}: DataTableProps<T>) {
    return (
        <div className="bg-surface rounded-2xl border border-outline-variant/60 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-outline-variant/60 bg-surface-variant/40">
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className={`px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-on-surface-variant ${
                                        col.className || ''
                                    }`}
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/40">
                        {data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="px-5 py-12 text-center text-sm text-on-surface-variant"
                                >
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            data.map((item) => (
                                <tr
                                    key={item.id}
                                    className="hover:bg-tertiary/20 transition-colors"
                                >
                                    {columns.map((col) => (
                                        <td
                                            key={col.key}
                                            className={`px-5 py-4 text-sm text-on-surface ${
                                                col.className || ''
                                            }`}
                                        >
                                            {col.render
                                                ? col.render(item)
                                                : (item as Record<string, unknown>)[col.key] as React.ReactNode}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {links && links.length > 3 && (
                <div className="px-5 py-3.5 border-t border-outline-variant/60 bg-surface-variant/20 flex items-center justify-between flex-wrap gap-2">
                    <p className="text-xs text-on-surface-variant font-medium">
                        Navigasi halaman
                    </p>
                    <div className="flex items-center gap-1">
                        {links.map((link, index) => {
                            const label = link.label
                                .replace('&laquo; Previous', '←')
                                .replace('Next &raquo;', '→');

                            return link.url ? (
                                <Link
                                    key={index}
                                    href={link.url}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                        link.active
                                            ? 'bg-primary text-on-primary shadow-xs'
                                            : 'text-on-surface-variant hover:bg-tertiary/60 hover:text-primary'
                                    }`}
                                >
                                    {label}
                                </Link>
                            ) : (
                                <span
                                    key={index}
                                    className="px-3 py-1.5 rounded-lg text-xs text-on-surface-variant/40 cursor-not-allowed"
                                >
                                    {label}
                                </span>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
