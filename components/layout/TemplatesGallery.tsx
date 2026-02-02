import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Mock data for templates with CSS styling rules
const templates = [
    {
        id: 1,
        name: "Modern Minimal",
        color: "bg-blue-600",
        headerStyle: "h-16 w-full",
        layout: "default"
    },
    {
        id: 2,
        name: "Corporate Pro",
        color: "bg-slate-800",
        headerStyle: "h-24 w-full clip-path-slant",
        layout: "sidebar"
    },
    {
        id: 3,
        name: "Creative Studio",
        color: "bg-purple-600",
        headerStyle: "h-4 w-full mt-4 mx-4 rounded-full",
        layout: "centered"
    },
    {
        id: 4,
        name: "Legal Formal",
        color: "bg-emerald-700",
        headerStyle: "h-full w-2 absolute left-0 top-0 bottom-0",
        layout: "border"
    }
];

export function TemplatesGallery() {
    return (
        <section id="templates" className="py-24 bg-slate-50 border-t border-slate-200">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div className="max-w-2xl">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                            Professional Templates for Every Industry
                        </h2>
                        <p className="mt-4 text-lg text-slate-600">
                            Choose from our collection of professionally composed designs. Fully customizable to match your brand identity.
                        </p>
                    </div>
                    <Link href="/signup">
                        <Button variant="outline" className="hidden md:flex gap-2">
                            View All Templates
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {templates.map((template) => (
                        <div key={template.id} className="group relative">
                            {/* Card Container */}
                            <div className="aspect-[1/1.414] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">

                                {/* The "Paper" Mockup */}
                                <div className="absolute inset-4 bg-white shadow-inner border border-slate-100 flex flex-col pointer-events-none">

                                    {/* Dynamic Header based on template style */}
                                    <div className={`relative ${template.color} ${template.headerStyle} opacity-90`}></div>

                                    {/* Body Content Placeholder */}
                                    <div className="p-4 space-y-2 flex-1 pt-8">
                                        <div className="w-1/3 h-2 bg-slate-200 rounded-sm mb-6"></div>

                                        <div className="space-y-1.5">
                                            <div className="w-full h-1.5 bg-slate-100 rounded-sm"></div>
                                            <div className="w-full h-1.5 bg-slate-100 rounded-sm"></div>
                                            <div className="w-2/3 h-1.5 bg-slate-100 rounded-sm"></div>
                                        </div>

                                        <div className="space-y-1.5 pt-4">
                                            <div className="w-full h-1.5 bg-slate-100 rounded-sm"></div>
                                            <div className="w-5/6 h-1.5 bg-slate-100 rounded-sm"></div>
                                            <div className="w-full h-1.5 bg-slate-100 rounded-sm"></div>
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className={`h-8 w-full bg-slate-50 mt-auto flex items-center px-4`}>
                                        <div className="w-1/2 h-1 bg-slate-200 rounded-full"></div>
                                    </div>
                                </div>

                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <Link href="/signup">
                                        <Button className="bg-white text-slate-900 hover:bg-slate-100 font-semibold shadow-lg">
                                            Use This Template
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                            <h3 className="mt-4 text-lg font-semibold text-slate-900">{template.name}</h3>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center md:hidden">
                    <Link href="/signup">
                        <Button variant="outline" className="w-full">
                            View All Templates
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
