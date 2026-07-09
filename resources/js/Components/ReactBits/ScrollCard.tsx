import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface ScrollCardProps {
    children: React.ReactNode;
    className?: string;
    index?: number;
    enableSpotlight?: boolean;
    spotlightColor?: string;
    enableTilt?: boolean;
    maxRotate?: number;
    direction?: 'up' | 'scale' | 'left' | 'right';
}

export default function ScrollCard({
    children,
    className = '',
    index = 0,
    enableSpotlight = true,
    spotlightColor = 'rgba(26, 58, 95, 0.10)',
    enableTilt = false,
    maxRotate = 6,
    direction = 'up',
}: ScrollCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);

    // Spotlight state
    const [isFocused, setIsFocused] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    // Tilt state
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

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        if (enableSpotlight) {
            setPosition({ x: mouseX, y: mouseY });
        }

        if (enableTilt) {
            const width = rect.width;
            const height = rect.height;
            const xPct = mouseX / width - 0.5;
            const yPct = mouseY / height - 0.5;
            x.set(xPct);
            y.set(yPct);
        }
    };

    const handleMouseEnter = () => {
        setIsFocused(true);
    };

    const handleMouseLeave = () => {
        setIsFocused(false);
        if (enableTilt) {
            x.set(0);
            y.set(0);
        }
    };

    const getInitialVariants = () => {
        switch (direction) {
            case 'scale':
                return { opacity: 0, scale: 0.88, y: 20 };
            case 'left':
                return { opacity: 0, x: -40 };
            case 'right':
                return { opacity: 0, x: 40 };
            case 'up':
            default:
                return { opacity: 0, y: 35 };
        }
    };

    return (
        <motion.div
            ref={cardRef}
            initial={getInitialVariants()}
            whileInView={{
                opacity: 1,
                y: 0,
                x: 0,
                scale: 1,
            }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{
                duration: 0.65,
                delay: index * 0.12,
                ease: [0.25, 0.4, 0.25, 1],
            }}
            style={{
                rotateX: enableTilt ? rotateX : 0,
                rotateY: enableTilt ? rotateY : 0,
                transformStyle: 'preserve-3d',
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`relative overflow-hidden ${className}`}
        >
            {enableSpotlight && (
                <div
                    className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 z-10"
                    style={{
                        opacity: isFocused ? 1 : 0,
                        background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 80%)`,
                    }}
                />
            )}
            <div className="relative z-20 h-full flex flex-col">{children}</div>
        </motion.div>
    );
}
