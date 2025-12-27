'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from 'motion/react';
import { CheckCircle2, Wand2, FileText, MousePointer2 } from 'lucide-react';

export const HeroShowcase = () => {
    const ref = useRef<HTMLDivElement>(null);

    // Mouse tilt effect
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Smooth out the mouse values
    const mouseX = useSpring(x, { stiffness: 50, damping: 10 });
    const mouseY = useSpring(y, { stiffness: 50, damping: 10 });

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        // Calculate normalized position (-1 to 1)
        const xPct = (clientX - left) / width - 0.5;
        const yPct = (clientY - top) / height - 0.5;

        // Update motion values (max tilt range)
        x.set(xPct);
        y.set(yPct);
    }

    function handleMouseLeave() {
        x.set(0);
        y.set(0);
    }

    // Create transform templates for style
    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["5deg", "-5deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-5deg", "5deg"]);
    const brightness = useTransform(mouseY, [-0.5, 0.5], [1.1, 0.9]);

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative w-full max-w-6xl mx-auto perspective-1000 py-10"
            style={{ perspective: "1000px" }}
        >
            {/* 3D Container */}
            <motion.div
                style={{
                    rotateX,
                    rotateY,
                    filter: useMotionTemplate`brightness(${brightness})`,
                    transformStyle: "preserve-3d",
                }}
                className="relative mx-auto rounded-3xl shadow-2xl bg-slate-900/5 transition-shadow duration-500 ease-out hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)]"
            >
                {/* Main Screenshot Card */}
                <div className="relative rounded-3xl overflow-hidden border border-white/20 bg-white shadow-xl aspect-[16/10] group">
                    <div className="absolute inset-0 bg-slate-100 animate-pulse group-hover:hidden" /> {/* Loading placeholder */}
                    <img
                        src="/hero-screenshot.png"
                        alt="LetAHeader Editor Interface"
                        className="w-full h-full object-cover object-top"
                    />

                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                    {/* Dark Overlay gradient for depth */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
                </div>

                {/* Floating Badge 1: AI Power */}
                <motion.div
                    style={{ translateZ: 60 }}
                    className="absolute -top-6 -right-6 md:top-8 md:-right-12 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/40 flex items-center gap-3 w-max"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                >
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                        <Wand2 className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="font-bold text-slate-800 text-sm">AI Powered</div>
                        <div className="text-xs text-slate-500 font-medium">Auto-formatting</div>
                    </div>
                </motion.div>

                {/* Floating Badge 2: PDF Ready */}
                <motion.div
                    style={{ translateZ: 40 }}
                    className="absolute -bottom-6 -left-4 md:bottom-12 md:-left-8 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/40 flex items-center gap-3 w-max"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                >
                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-500/30">
                        <FileText className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="font-bold text-slate-800 text-sm">Print Ready</div>
                        <div className="text-xs text-slate-500 font-medium">Export high-res PDF</div>
                    </div>
                </motion.div>

                {/* Floating Badge 3: Smart Cursor (Visual Only) */}
                <motion.div
                    style={{ translateZ: 80 }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                >
                    <div className="relative">
                        <div className="absolute -inset-4 bg-blue-500/20 rounded-full blur-xl animate-pulse" />
                    </div>
                </motion.div>

            </motion.div>

            {/* Reflection / Ground Shadow */}
            <div className="absolute -bottom-12 left-10 right-10 h-10 bg-black/20 blur-2xl rounded-[100%] opacity-40 transform scale-y-50" />
        </motion.div>
    );
};
