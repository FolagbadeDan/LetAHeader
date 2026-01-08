
import React from 'react';
import {
    ArrowRight, Wand2, FileText, CheckCircle2, Upload, Cloud, Edit3, Shield, Building2
} from 'lucide-react';
import TextType from '@/components/TextType';
import { HeroShowcase } from './HeroShowcase';
import { Header } from '../layout/Header';

// Static Subcomponents defined here to avoid client imports in Server Component
const FeatureColumn = ({ icon: Icon, title, body }: any) => (
    <div className="flex flex-col items-start text-left">
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
            <Icon className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
        <p className="text-slate-500 leading-relaxed">{body}</p>
    </div>
);

const StepCard = ({ number, title, body }: any) => (
    <div className="relative z-10 bg-slate-800 p-8 rounded-2xl border border-slate-700">
        <div className="w-10 h-10 bg-blue-600 text-white font-bold rounded-full flex items-center justify-center mb-6 text-lg shadow-lg">
            {number}
        </div>
        <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
        <p className="text-slate-400 leading-relaxed">{body}</p>
    </div>
);

const TestimonialCard = ({ quote, author, role }: any) => (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
        <div className="flex gap-1 text-yellow-400 mb-4">
            {[1, 2, 3, 4, 5].map((i) => (
                <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
        <p className="text-slate-700 mb-6 italic text-lg leading-relaxed">"{quote}"</p>
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold">
                {author[0]}
            </div>
            <div>
                <div className="font-bold text-slate-900">{author}</div>
                <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">{role}</div>
            </div>
        </div>
    </div>
);

interface LandingPageServerProps {
    onStartButton: React.ReactNode;
    onTemplatesButton: React.ReactNode;
    onFooterStartButton: React.ReactNode;
    headerButtons?: React.ReactNode; // Optional: if we want to pass client buttons to Header
}

export const LandingPageServer: React.FC<LandingPageServerProps> = ({
    onStartButton,
    onTemplatesButton,
    onFooterStartButton,
    headerButtons
}) => {
    return (
        <div className="min-h-screen bg-white text-[#1D1D1F] font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">

            {/* We need to use the Client Header for interactivity, or a simplified Server Header */}
            {/* For now, we will assume Header handles its own client logic or is passed as hydration */}
            {/* Actually, let's just render the visual parts. The parent Page will wrap this. */}

            {/* SECTION 1: HERO */}
            <section className="pt-24 pb-20 px-4 text-center max-w-5xl mx-auto" aria-labelledby="hero-heading">
                {/* JSON-LD Structured Data */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "SoftwareApplication",
                            "name": "LetAHeader",
                            "applicationCategory": "BusinessApplication",
                            "operatingSystem": "Web",
                            "offers": {
                                "@type": "Offer",
                                "price": "0",
                                "priceCurrency": "USD"
                            },
                            "description": " AI-powered letterhead generator for professionals."
                        })
                    }}
                />

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-wider mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                    Now with AI Auto-Formatting
                </div>

                <h1 id="hero-heading" className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-6 leading-[1.05] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                    The <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                        <TextType
                            text={[
                                'Professional Letterhead',
                                'Business Letters',
                                'Resignation Letters',
                                'Cover Letters',
                                'Legal Letters'
                            ]}
                            typingSpeed={80}
                            deletingSpeed={40}
                            pauseDuration={2500}
                            loop={true}
                        />
                    </span> <br />
                    Maker for Business.
                </h1>
                <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-light animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                    <span className="text-slate-700 font-medium">Stop wasting 2+ hours</span> on document formatting.
                    Create <span className="text-slate-700 font-medium">perfectly branded PDFs in under 60 seconds</span> with AI-powered letterheads.
                </p>

                {/* Trust Indicators */}
                <div className="flex items-center justify-center gap-6 text-sm text-slate-500 mb-10 animate-in fade-in duration-700 delay-250">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span>No credit card required</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span>Free forever plan</span>
                    </div>
                </div>

                <div className="relative z-20 flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-in fade-in zoom-in duration-700 delay-300">
                    {onStartButton}
                    {onTemplatesButton}
                </div>

                {/* Visual Asset Mockup */}
                {/* Dynamic 3D Hero Showcase */}
                <div className="w-full mb-10">
                    <HeroShowcase />
                </div>
            </section>

            {/* SECTION 2: SOCIAL PROOF */}
            <section className="py-20 bg-slate-50 border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-8 mb-6 text-slate-600">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-slate-900">10,000+</div>
                                <div className="text-sm">Letters Generated</div>
                            </div>
                            <div className="w-px h-12 bg-slate-200"></div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-slate-900">4.9/5</div>
                                <div className="text-sm">User Rating</div>
                            </div>
                            <div className="w-px h-12 bg-slate-200"></div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-slate-900">73%</div>
                                <div className="text-sm">Time Saved</div>
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Join 2,500+ Professionals Who Switched</h2>
                        <p className="text-slate-500 max-w-2xl mx-auto">See why freelancers, small businesses, and legal consultants choose LetAHeader over Word and Google Docs.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <TestimonialCard
                            quote="I used to spend hours fighting with Word formatting. Now I get a perfect PDF in 2 minutes."
                            author="Sarah J."
                            role="Legal Consultant"
                        />
                        <TestimonialCard
                            quote="The AI rewriting is a game changer. I just type bullet points and it sounds professional instantly."
                            author="Michael R."
                            role="Small Business Owner"
                        />
                        <TestimonialCard
                            quote="Finally, a tool that makes my invoices and letters look like a Fortune 500 company sent them."
                            author="David K."
                            role="Freelance Developer"
                        />
                    </div>

                    <div className="mt-16 pt-10 border-t border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        <span className="text-xl font-serif font-bold text-slate-800">Freelancers Union</span>
                        <span className="text-xl font-sans font-black text-slate-800 tracking-tighter">SBA</span>
                        <span className="text-xl font-mono font-bold text-slate-800">TechStartups</span>
                        <span className="text-xl font-display font-bold text-slate-800">LegalZoom</span>
                    </div>
                </div>
            </section>

            {/* SECTION 3: VALUE PROP */}
            <section className="py-24 max-w-7xl mx-auto px-6">
                <div className="grid md:grid-cols-3 gap-12">
                    <FeatureColumn
                        icon={Shield}
                        title="Save 2+ Hours Per Letter"
                        body="What takes 30 minutes in Word - uploading logos, fixing alignment, checking fonts - takes 60 seconds here. Be
 done before your coffee gets cold."
                    />
                    <FeatureColumn
                        icon={Wand2}
                        title="AI Fixes Typos & Grammar Instantly"
                        body="Rough draft? No problem. Our AI proofreads, restructures, and polishes your text to C-suite quality. No more embarrassing typos in client emails."
                    />
                    <FeatureColumn
                        icon={FileText}
                        title="Print-Ready PDFs, Every Time"
                        body="Export crisp, high-resolution PDFs that look perfect on screen and paper. Impress clients with documents that scream 'Fortune 500' professionalism."
                    />
                </div>
            </section>

            {/* SECTION 4: HOW IT WORKS */}
            <section className="py-24 bg-slate-900 text-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">From Draft to Download in 3 Steps</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 relative">
                        <div className="hidden md:block absolute top-8 left-1/6 right-1/6 h-0.5 bg-slate-800 z-0"></div>
                        <StepCard number="1" title="Set Your Brand" body="Upload your company logo and set your footer details. You only have to do this once." />
                        <StepCard number="2" title="Input Your Content" body="Type directly, paste existing text, or let our AI turn your rough bullet points into a polished letter." />
                        <StepCard number="3" title="Generate & Download" body="Click generate. LetAHeader applies the formatting, checks spelling, and renders a professional PDF." />
                    </div>
                </div>
            </section>

            {/* SECTION 6: FOOTER CTA */}
            <section className="py-24 bg-white border-t border-slate-100">
                <div className="max-w-4xl mx-auto text-center px-6">
                    <h2 className="text-4xl font-bold text-slate-900 mb-4">Ready to 10x Your Document Workflow?</h2>
                    <p className="text-lg text-slate-500 mb-4">Create your first professional letterhead in under 60 seconds. No credit card. No setup fees.</p>
                    <p className="text-sm text-slate-400 mb-8">Join 2,500+ professionals who've already made the switch.</p>
                    {onFooterStartButton}
                </div>
            </section>

            {/* Simple Footer */}
            <footer className="py-8 border-t border-slate-100 text-center text-sm text-slate-400">
                <p>&copy; {new Date().getFullYear()} LetAHeader. All rights reserved.</p>
            </footer>
        </div>
    );
};
