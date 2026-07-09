import React from 'react';

interface ShinyTextProps {
    text: string;
    disabled?: boolean;
    speed?: number;
    className?: string;
}

export default function ShinyText({
    text,
    disabled = false,
    speed = 3,
    className = '',
}: ShinyTextProps) {
    return (
        <span
            className={`inline-block bg-gradient-to-r from-primary via-[#4383a1] to-primary bg-clip-text text-transparent ${
                disabled ? '' : 'animate-shiny-text'
            } ${className}`}
            style={{
                animationDuration: `${speed}s`,
            }}
        >
            {text}
        </span>
    );
}
