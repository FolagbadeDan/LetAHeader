import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Play, FileText, FileImage, File } from 'lucide-react';
import Link from 'next/link';

export function Hero() {
    return (
        <section className="relative overflow-hidden pt-36 pb-20 lg:pt-48 lg:pb-32 bg-white">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 -z-10 w-1/2 h-full bg-slate-50 rounded-bl-[100px]" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

                    {/* Left Content */}
                    <div className="flex flex-col items-start text-left space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1]">
                            The #1 Online <br />
                            <span className="text-brand-500">Letterhead Maker</span> <br />
                            with AI
                        </h1>

                        <p className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-500 to-purple-600">
                            Create, Design, and Impress in Seconds.
                        </p>

                        <ul className="space-y-3 text-slate-600">
                            {[
                                "Instantly convert text to professional documents.",
                                "Access 100+ premium templates for any industry.",
                                "Enhance content with AI writing assistance.",
                                "Export to high-quality PDF, Word, or Image."
                            ].map((item, index) => (
                                <li key={index} className="flex items-center gap-3 text-lg">
                                    <CheckCircle2 className="w-5 h-5 text-brand-500 flex-shrink-0" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-4">
                            <Link href="/editor">
                                <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-8 rounded-xl bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/25 transition-all hover:scale-105">
                                    Create Free Letterhead
                                </Button>
                            </Link>
                            <Link href="#video">
                                <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg h-14 px-8 rounded-xl border-slate-200 hover:bg-slate-50 text-slate-700 hover:text-brand-600 gap-2">
                                    <Play className="w-5 h-5 fill-current" />
                                    Watch Demo
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Right Visual */}
                    <div className="relative isolate animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
                        {/* Main Image Container */}
                        <div className="relative z-10 mx-auto max-w-lg lg:max-w-none">
                            <div className="relative rounded-2xl bg-slate-900/5 p-2 ring-1 ring-inset ring-slate-900/10 lg:rounded-3xl lg:p-4 perspective-1000">
                                <div className="relative rounded-xl bg-white shadow-2xl overflow-hidden aspect-[4/3] group transform transition-transform hover:rotate-y-2">
                                    {/* Realistic Editor UI Mockup */}
                                    <div className="absolute inset-0 bg-slate-50 flex flex-col">
                                        {/* Toolbar */}
                                        <div className="h-10 border-b bg-white flex items-center px-4 gap-4 justify-between">
                                            <div className="flex gap-2">
                                                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                            </div>
                                            <div className="flex gap-2">
                                                <div className="w-20 h-2 bg-slate-200 rounded-full"></div>
                                                <div className="w-8 h-8 bg-brand-50 rounded flex items-center justify-center">
                                                    <div className="w-4 h-4 bg-brand-200 rounded-sm"></div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Editor Workspace */}
                                        <div className="flex-1 flex overflow-hidden">
                                            {/* Sidebar */}
                                            <div className="w-16 border-r bg-white flex flex-col items-center py-4 gap-4">
                                                {[1, 2, 3, 4].map((i) => (
                                                    <div key={i} className="w-8 h-8 rounded-lg bg-slate-100/50 border border-slate-200"></div>
                                                ))}
                                            </div>

                                            {/* Canvas Area */}
                                            <div className="flex-1 bg-slate-100 p-6 flex justify-center items-start overflow-hidden relative">
                                                {/* The "Paper" */}
                                                <div className="w-full max-w-[280px] sm:max-w-[320px] aspect-[1/1.414] bg-white shadow-sm ring-1 ring-slate-900/5 rounded-sm p-6 flex flex-col gap-3 relative transform transition-transform group-hover:scale-[1.02] duration-500">

                                                    {/* Letterhead Header */}
                                                    <div className="flex justify-between items-start border-b border-slate-100 pb-4 mb-2">
                                                        <div className="flex gap-2 items-center">
                                                            <div className="w-8 h-8 bg-brand-600 rounded-md"></div>
                                                            <div className="flex flex-col gap-1">
                                                                <div className="w-24 h-2 bg-slate-800 rounded-full"></div>
                                                                <div className="w-16 h-1.5 bg-slate-400 rounded-full"></div>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col gap-1 items-end">
                                                            <div className="w-20 h-1.5 bg-slate-300 rounded-full"></div>
                                                            <div className="w-16 h-1.5 bg-slate-300 rounded-full"></div>
                                                        </div>
                                                    </div>

                                                    {/* Body Content (Skeleton) */}
                                                    <div className="space-y-2">
                                                        <div className="w-32 h-2 bg-slate-200 rounded-full mb-4"></div>
                                                        <div className="w-full h-1.5 bg-slate-200 rounded-full"></div>
                                                        <div className="w-full h-1.5 bg-slate-200 rounded-full"></div>
                                                        <div className="w-5/6 h-1.5 bg-slate-200 rounded-full"></div>
                                                        <div className="w-full h-1.5 bg-slate-200 rounded-full"></div>
                                                        <div className="w-4/5 h-1.5 bg-slate-200 rounded-full"></div>
                                                    </div>

                                                    <div className="space-y-2 mt-2">
                                                        <div className="w-full h-1.5 bg-slate-200 rounded-full"></div>
                                                        <div className="w-11/12 h-1.5 bg-slate-200 rounded-full"></div>
                                                        <div className="w-full h-1.5 bg-slate-200 rounded-full"></div>
                                                    </div>

                                                    {/* Signature */}
                                                    <div className="mt-8">
                                                        <div className="w-24 h-8 bg-slate-50 rounded mb-2 border border-dashed border-slate-300 flex items-center justify-center text-[10px] text-slate-400 font-serif italic">Signature</div>
                                                        <div className="w-32 h-2 bg-slate-800 rounded-full"></div>
                                                        <div className="w-20 h-1.5 bg-slate-400 rounded-full mt-1"></div>
                                                    </div>

                                                </div>

                                                {/* Floating UI Elements (Peeling/Badges) were requested to be improved/removed if irrelevant, keeping clean */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Icons Reimagined - More Professional */}
                        <div className="absolute -top-6 -right-6 w-16 h-16 bg-white rounded-xl shadow-lg flex items-center justify-center border border-slate-100 animate-bounce duration-[4000ms] z-20">
                            <div className="text-center">
                                <div className="text-[10px] font-bold text-slate-400 mb-0.5">PDF</div>
                                <FileText className="w-6 h-6 text-red-500 mx-auto" />
                            </div>
                        </div>
                        <div className="absolute bottom-12 -left-8 w-auto px-4 py-2 bg-white rounded-xl shadow-lg border border-slate-100 flex items-center gap-3 animate-in slide-in-from-bottom-4 duration-1000 delay-500 z-20">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-sm font-semibold text-slate-700">AI Writing Active</span>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
