import React from 'react';
import { motion } from 'framer-motion';

interface BlurTextProps {
    text: string;
    delay?: number;
    className?: string;
    animateBy?: 'words' | 'letters';
    direction?: 'top' | 'bottom';
}

export default function BlurText({
    text,
    delay = 100,
    className = '',
    animateBy = 'words',
    direction = 'top',
}: BlurTextProps) {
    const elements = animateBy === 'words' ? text.split(' ') : text.split('');

    return (
        <span className={`inline-flex flex-wrap ${className}`}>
            {elements.map((element, index) => (
                <motion.span
                    key={index}
                    initial={{
                        filter: 'blur(10px)',
                        opacity: 0,
                        y: direction === 'top' ? -18 : 18,
                    }}
                    whileInView={{
                        filter: 'blur(0px)',
                        opacity: 1,
                        y: 0,
                    }}
                    viewport={{ once: true }}
                    transition={{
                        duration: 0.6,
                        delay: index * (delay / 1000),
                        ease: [0.25, 0.4, 0.25, 1],
                    }}
                    className="inline-block mr-2 last:mr-0"
                >
                    {element}
                </motion.span>
            ))}
        </span>
    );
}
