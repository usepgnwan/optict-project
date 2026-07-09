import React, { useEffect, useState } from 'react';

export default function FloatingOrbsBackground() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({
                x: e.clientX,
                y: e.clientY,
            });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
            {/* Interactive Orb following mouse with slow damping feel */}
            <div
                className="absolute w-[450px] h-[450px] rounded-full bg-primary/5 blur-[120px] transition-transform duration-1000 ease-out"
                style={{
                    transform: `translate(${mousePos.x * 0.15}px, ${mousePos.y * 0.15}px)`,
                }}
            />
            {/* Floating ambient orb 1 */}
            <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-secondary/10 blur-[100px] animate-float" />
            {/* Floating ambient orb 2 */}
            <div
                className="absolute bottom-1/3 -right-32 w-96 h-96 rounded-full bg-tertiary/60 blur-[100px] animate-float"
                style={{ animationDelay: '-3s' }}
            />
        </div>
    );
}
