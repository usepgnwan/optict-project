import React, { useState, useRef, useEffect, useMemo } from 'react';

export interface SelectOption {
    value: string | number;
    label: string;
}

interface SelectSearchProps {
    options?: SelectOption[];
    value?: string | number;
    onChange?: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    isClearable?: boolean;
    children?: React.ReactNode;
}

export default function SelectSearch({
    options,
    value = '',
    onChange,
    placeholder = 'Pilih Opsi...',
    disabled = false,
    className = '',
    isClearable = false,
    children,
}: SelectSearchProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Extract options from children if options prop is not provided
    const parsedOptions = useMemo<SelectOption[]>(() => {
        if (options && options.length > 0) {
            return options;
        }
        const extracted: SelectOption[] = [];
        React.Children.forEach(children, (child) => {
            if (React.isValidElement(child) && child.type === 'option') {
                const el = child as React.ReactElement<{ value?: string | number; children?: React.ReactNode }>;
                const val = el.props.value !== undefined ? String(el.props.value) : '';
                const label = typeof el.props.children === 'string'
                    ? el.props.children
                    : String(el.props.children || val);
                extracted.push({ value: val, label });
            }
        });
        return extracted;
    }, [options, children]);

    const filteredOptions = useMemo(() => {
        if (!searchQuery.trim()) return parsedOptions;
        const q = searchQuery.toLowerCase();
        return parsedOptions.filter(
            (opt) =>
                opt.label.toLowerCase().includes(q) ||
                String(opt.value).toLowerCase().includes(q)
        );
    }, [parsedOptions, searchQuery]);

    const selectedOption = useMemo(() => {
        return parsedOptions.find((opt) => String(opt.value) === String(value));
    }, [parsedOptions, value]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
                setSearchQuery('');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isOpen]);

    const handleSelect = (val: string | number) => {
        onChange?.(String(val));
        setIsOpen(false);
        setSearchQuery('');
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange?.('');
    };

    return (
        <div ref={containerRef} className={`relative inline-block w-full text-left ${className}`}>
            <div
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl bg-surface-variant/50 border ${isOpen ? 'border-primary ring-2 ring-primary/20' : 'border-outline-variant/60'
                    } text-sm transition-all select-none ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-outline'
                    }`}
            >
                <span className={`block truncate ${selectedOption ? 'text-on-surface font-medium' : 'text-on-surface-variant'}`}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>

                <div className="flex items-center gap-1 ml-2 shrink-0">
                    {isClearable && selectedOption && String(selectedOption.value) !== '' && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="p-0.5 rounded-full hover:bg-tertiary/60 text-on-surface-variant hover:text-on-surface transition-colors"
                        >
                            <span className="material-symbols-outlined text-[16px]">close</span>
                        </button>
                    )}
                    <span className={`material-symbols-outlined text-[20px] text-on-surface-variant transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                        expand_more
                    </span>
                </div>
            </div>

            {isOpen && (
                <div className="absolute z-50 w-full mt-1.5 bg-surface border border-outline-variant rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                    <div className="p-2 border-b border-outline-variant/60 bg-surface-variant/30">
                        <div className="relative flex items-center">
                            <span className="material-symbols-outlined absolute left-2.5 text-[18px] text-on-surface-variant">
                                search
                            </span>
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari opsi..."
                                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-surface border border-outline-variant/60 text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary"
                            />
                        </div>
                    </div>

                    <div className="max-h-56 overflow-y-auto p-1.5 space-y-0.5">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((opt, idx) => {
                                const isSelected = String(opt.value) === String(value);
                                return (
                                    <div
                                        key={`${opt.value}-${idx}`}
                                        onClick={() => handleSelect(opt.value)}
                                        className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${isSelected
                                                ? 'bg-primary text-on-primary font-bold'
                                                : 'text-on-surface hover:bg-tertiary/40'
                                            }`}
                                    >
                                        <span className="truncate">{opt.label}</span>
                                        {isSelected && (
                                            <span className="material-symbols-outlined text-[16px]">check</span>
                                        )}
                                    </div>
                                );
                            })
                        ) : (
                            <div className="px-3 py-4 text-center text-xs text-on-surface-variant italic">
                                Tidak ada opsi yang cocok
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
