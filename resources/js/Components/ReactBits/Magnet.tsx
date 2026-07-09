import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface MagnetProps {
    children: React.ReactNode;
    className?: string;
    padding?: number;
    disabled?: boolean;
}

export default function Magnet({
    children,
    className = '',
    padding = 50,
    disabled = false,
}: MagnetProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (disabled || !ref.current) return;

        const { clientX, clientY } = e;
        const { left, top, width, height } = ref.current.getBoundingClientRect();

        const middleX = clientX - (left + width / 2);
        const middleY = clientY - (top + height / 2);

        setPosition({ x: middleX * 0.25, y: middleY * 0.25 });
    };

    const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 });
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            animate={{ x: position.x, y: position.y }}
            transition={{ type: 'spring', stiffness: 350, damping: 20, mass: 0.5 }}
            className={`inline-block ${className}`}
        >
            {children}
        </motion.div>
    );
}
