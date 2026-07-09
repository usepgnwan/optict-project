import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface TiltedCardProps {
    children: React.ReactNode;
    className?: string;
    maxRotate?: number;
    scaleOnHover?: number;
}

export default function TiltedCard({
    children,
    className = '',
    maxRotate = 10,
    scaleOnHover = 1.02,
}: TiltedCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [maxRotate, -maxRotate]), {
        stiffness: 250,
        damping: 20,
    });
    const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-maxRotate, maxRotate]), {
        stiffness: 250,
        damping: 20,
    });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();

        const width = rect.width;
        const height = rect.height;

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
            }}
            whileHover={{ scale: scaleOnHover }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={`perspective-1000 ${className}`}
        >
            {children}
        </motion.div>
    );
}
