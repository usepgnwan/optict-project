import React from 'react';

interface RupiahInputProps {
    value: number | string;
    onChange: (numericValue: number) => void;
    placeholder?: string;
    required?: boolean;
    className?: string;
    disabled?: boolean;
}

export default function RupiahInput({
    value,
    onChange,
    placeholder = '0',
    required = false,
    className = '',
    disabled = false,
}: RupiahInputProps) {
    // Convert current prop value to formatted rupiah string (without 'Rp ')
    const formatNumberToRupiah = (val: number | string): string => {
        if (val === undefined || val === null || val === '') return '';
        const num = typeof val === 'string' ? parseInt(val.replace(/\D/g, ''), 10) : val;
        if (isNaN(num) || num === 0) return '';
        return new Intl.NumberFormat('id-ID').format(num);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        // Strip non-digits and leading zeros (except single 0)
        const digits = raw.replace(/\D/g, '').replace(/^0+(?=\d)/, '');

        if (!digits) {
            onChange(0);
        } else {
            const num = parseInt(digits, 10);
            onChange(num);
        }
    };

    const displayValue = formatNumberToRupiah(value);

    return (
        <div className="relative flex items-center">
            <span className="absolute left-3.5 text-xs font-bold text-on-surface-variant pointer-events-none select-none">
                Rp
            </span>
            <input
                type="text"
                inputMode="numeric"
                value={displayValue}
                onChange={handleChange}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-surface-variant/50 border border-outline-variant text-sm font-semibold text-on-surface focus:outline-none focus:border-primary transition-colors ${className}`}
            />
        </div>
    );
}
