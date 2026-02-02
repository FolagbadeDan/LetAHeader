import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function HowItWorks() {
    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                        Create Your Letterhead in 3 Simple Steps
                    </h2>
                    <p className="mt-4 text-lg text-slate-600">
                        No design skills needed. Just pick a style and start writing.
                    </p>
                </div>

                <div className="relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-brand-100 via-brand-500 to-brand-100 dashed-line -z-10 opacity-30"></div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            {
                                step: "01",
                                title: "Select a Template",
                                desc: "Browse our gallery of professional headers and footers to find the perfect match for your brand."
                            },
                            {
                                step: "02",
                                title: "Customize & Write",
                                desc: "Enter your company details, upload your logo, and use our AI to draft your letter content."
                            },
                            {
                                step: "03",
                                title: "Download PDF",
                                desc: "Preview your document and download a print-ready PDF or share it digitally instantly."
                            }
                        ].map((item, i) => (
                            <div key={i} className="relative flex flex-col items-center text-center group">
                                <div className="w-24 h-24 bg-white rounded-full border-4 border-slate-50 shadow-xl flex items-center justify-center mb-8 relative z-10 group-hover:scale-110 transition-transform duration-300">
                                    <span className="text-3xl font-black text-brand-500">{item.step}</span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-4">{item.title}</h3>
                                <p className="text-slate-600 leading-relaxed max-w-sm">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-16 text-center">
                    <Link href="/login">
                        <Button size="lg" className="h-14 px-8 rounded-full text-lg gap-2 shadow-lg shadow-brand-500/20">
                            Start Creating Now <ArrowRight className="w-5 h-5" />
                        </Button>
                    </Link>
                </div>

            </div>
        </section>
    );
}
