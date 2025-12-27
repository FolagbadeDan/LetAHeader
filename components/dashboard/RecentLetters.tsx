'use client';

import React, { useEffect, useState } from 'react';
import { FileText, Calendar, Clock, MoreVertical, Trash2, Edit3, Loader2, ArrowRight } from 'lucide-react';
import { SavedLetter } from '@/types';
import { fetchMyLetters } from '@/services/letterService';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export const RecentLetters = () => {
    const [letters, setLetters] = useState<SavedLetter[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        loadLetters();
    }, []);

    const loadLetters = async () => {
        try {
            const data = await fetchMyLetters();
            setLetters(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpen = (letter: SavedLetter) => {
        // Since the main app is on '/', we need a way to pass this letter to it.
        // For now, we'll store it in localStorage 'current_letter' causing the main app to load it on mount if we add logic there,
        // OR we can pass it via URL param, OR (easiest for now given the architecture) just redirect to home 
        // and let the user open "My Letters" there, BUT that defeats the purpose of the dashboard.

        // BETTER APPROACH: Update the Editor to check for a letter ID in the query params.
        // But for this step, let's just push to /?letterId=... and handle it later or
        // Use a global state/context if we had one.
        // Let's stick to localStorage for simplicity in this transition phase.

        localStorage.setItem('open_letter_id', letter.id);
        router.push('/editor');
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-64 rounded-xl bg-white border border-slate-200 overflow-hidden animate-pulse">
                        <div className="h-32 bg-slate-100" />
                        <div className="p-5 space-y-3">
                            <div className="h-4 bg-slate-100 rounded w-3/4" />
                            <div className="h-3 bg-slate-100 rounded w-1/2" />
                            <div className="pt-4 flex justify-between">
                                <div className="h-3 bg-slate-50 rounded w-1/3" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (letters.length === 0) {
        return (
            <div className="text-center py-16 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <FileText className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">No letters created yet</h3>
                <p className="text-slate-500 mb-6 max-w-sm mx-auto">Create your first professional letterhead document in seconds.</p>
                <Link href="/editor" className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition shadow-lg hover:shadow-indigo-200">
                    <Edit3 className="w-4 h-4" /> Create Letter
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {letters.map((letter) => (
                <div
                    key={letter.id}
                    className="group bg-white rounded-xl border border-slate-200 hover:border-indigo-500 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col overflow-hidden"
                    onClick={() => handleOpen(letter)}
                >
                    {/* Preview Area */}
                    <div className="h-32 bg-slate-50 border-b border-slate-100 p-6 relative overflow-hidden">
                        <div className="absolute inset-x-6 top-6 bottom-0 bg-white shadow-sm border border-slate-100 rounded-t-lg p-3 opacity-80 group-hover:opacity-100 group-hover:-translate-y-1 transition-all">
                            <div className="space-y-2">
                                <div className="h-2 w-1/3 bg-indigo-100 rounded-full" />
                                <div className="h-1.5 w-full bg-slate-100 rounded-full" />
                                <div className="h-1.5 w-full bg-slate-100 rounded-full" />
                                <div className="h-1.5 w-2/3 bg-slate-100 rounded-full" />
                            </div>
                        </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                                {letter.name || "Untitled Document"}
                            </h4>
                        </div>

                        <p className="text-xs text-slate-500 line-clamp-2 mb-4 flex-1">
                            To: <span className='font-medium text-slate-700'>{letter.content.recipientName}</span> • {letter.content.subject || 'No Subject'}
                        </p>

                        <div className="flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-50">
                            <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> {new Date(letter.lastModified).toLocaleDateString()}
                            </span>
                            <span className="font-bold text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                Open <ArrowRight className="w-3 h-3" />
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
