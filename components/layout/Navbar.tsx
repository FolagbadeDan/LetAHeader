'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
    ChevronDown,
    Menu,
    X,
    Search,
    Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '@/components/ui/Logo';

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Features', href: '/#features', hasDropdown: false },
        { name: 'Templates', href: '/#templates', hasDropdown: true },
        { name: 'Pricing', href: '/#pricing', hasDropdown: false },
    ];

    return (
        <header
            className={cn(
                'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent',
                isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm border-slate-200 py-3' : 'bg-transparent py-5'
            )}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">

                    {/* Logo & Desktop Nav */}
                    <div className="flex items-center gap-10">
                        <Link href="/" className="hover:opacity-90 transition-opacity">
                            <Logo />
                        </Link>

                        <nav className="hidden lg:flex items-center gap-6">
                            {navLinks.map((link) => (
                                <div key={link.name} className="relative group cursor-pointer">
                                    <div className="flex items-center gap-1 text-[15px] font-medium text-slate-600 hover:text-brand-600 transition-colors">
                                        {link.name}
                                        {link.hasDropdown && <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />}
                                    </div>
                                    {/* Dropdown Placeholder (Visual only for now) */}
                                    {link.hasDropdown && (
                                        <div className="absolute top-full left-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                                            <div className="w-56 bg-white rounded-xl shadow-xl border border-slate-100 p-2">
                                                <Link href="/#templates" className="block px-4 py-2 hover:bg-slate-50 rounded-lg text-sm text-slate-600">Business Letterheads</Link>
                                                <Link href="/#templates" className="block px-4 py-2 hover:bg-slate-50 rounded-lg text-sm text-slate-600">Creative Designs</Link>
                                                <Link href="/#templates" className="block px-4 py-2 hover:bg-slate-50 rounded-lg text-sm text-slate-600">Legal Documents</Link>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </nav>
                    </div>

                    {/* Right Actions */}
                    <div className="hidden lg:flex items-center gap-4">
                        <button className="p-2 text-slate-500 hover:text-brand-600 transition-colors">
                            <Search className="w-5 h-5" />
                        </button>
                        <button className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors mr-2">
                            <Globe className="w-4 h-4" />
                            <span>EN</span>
                        </button>
                        <div className="h-6 w-px bg-slate-200 mx-1"></div>
                        <Link href="/login">
                            <Button variant="ghost" className="font-semibold text-slate-700 hover:text-brand-600 hover:bg-brand-50">
                                Log in
                            </Button>
                        </Link>
                        <Link href="/editor">
                            <Button className="rounded-full px-6 bg-brand-500 hover:bg-brand-600 text-white shadow-md shadow-brand-500/20">
                                Try for Free
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden bg-white border-t border-slate-200 overflow-hidden"
                    >
                        <div className="container mx-auto px-4 py-6 space-y-4">
                            {navLinks.map((link) => (
                                <div key={link.name} className="py-2 border-b border-slate-100 last:border-0">
                                    <div className="flex justify-between items-center text-lg font-medium text-slate-800">
                                        {link.name}
                                        {link.hasDropdown && <ChevronDown className="w-5 h-5 text-slate-400" />}
                                    </div>
                                </div>
                            ))}
                            <div className="pt-6 space-y-4">
                                <Link href="/login" className="block">
                                    <Button variant="outline" className="w-full text-lg h-12 rounded-xl border-slate-200 text-slate-700">
                                        Log in
                                    </Button>
                                </Link>
                                <Link href="/signup" className="block">
                                    <Button className="w-full text-lg h-12 rounded-xl bg-brand-500 hover:bg-brand-600 text-white shadow-lg btn-press">
                                        Try for Free
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
