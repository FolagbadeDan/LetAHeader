'use client';

import React from 'react';
import { User, LogOut, FileText, Plus, ChevronDown, LayoutTemplate } from 'lucide-react';
import { useSession, signOut } from "next-auth/react";
import Link from 'next/link';

export const DashboardHeader = () => {
    const { data: session } = useSession();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    return (
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
                {/* Logo */}
                <Link href="/dashboard" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-xl tracking-tight text-slate-900 hidden sm:block">LetAHeader</span>
                </Link>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    {/* New Letter CTA */}
                    <Link
                        href="/editor"
                        className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-full hover:bg-slate-800 transition shadow-sm"
                    >
                        <Plus className="w-4 h-4" />
                        New Letter
                    </Link>

                    <div className="h-6 w-px bg-slate-200 mx-2 hidden sm:block"></div>

                    {/* User Menu */}
                    <div className="relative">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900 p-1 rounded-lg hover:bg-slate-50 transition"
                        >
                            <div className="w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold uppercase ring-2 ring-transparent group-hover:ring-indigo-100 transition">
                                {session?.user?.name?.[0] || 'U'}
                            </div>
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                        </button>

                        {isMenuOpen && (
                            <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-100 rounded-xl shadow-xl py-2 animate-in fade-in zoom-in-95 duration-100 origin-top-right z-50">
                                <div className="px-4 py-3 border-b border-slate-50 mb-1">
                                    <p className="text-sm font-bold text-slate-900">{session?.user?.name || 'User'}</p>
                                    <p className="text-xs text-slate-500 truncate">{session?.user?.email}</p>
                                </div>

                                <Link href="/editor" className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 sm:hidden">
                                    <Plus className="w-4 h-4" /> Create New Letter
                                </Link>

                                <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                                    <User className="w-4 h-4" /> Account Settings
                                </button>

                                <div className="border-t border-slate-50 my-1"></div>

                                <button
                                    onClick={() => signOut({ callbackUrl: '/' })}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                >
                                    <LogOut className="w-4 h-4" /> Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};
