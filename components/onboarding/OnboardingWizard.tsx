'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Palette, Layers, User, ArrowRight, Check, Sparkles, Building, Globe, MapPin } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BrandData {
    companyName: string;
    slogan: string;
    primaryColor: string;
    website: string;
    address: string;
}

const DEFAULT_BRAND: BrandData = {
    companyName: '',
    slogan: '',
    primaryColor: '#0f172a',
    website: '',
    address: ''
};

const COLORS = [
    '#0f172a', // Slate
    '#2563eb', // Blue
    '#7c3aed', // Violet
    '#db2777', // Pink
    '#dc2626', // Red
    '#ea580c', // Orange
    '#059669', // Emerald
    '#0891b2', // Cyan
];

export const OnboardingWizard = () => {
    const router = useRouter();
    const { data: session } = useSession();
    const [step, setStep] = useState(1);
    const [data, setData] = useState<BrandData>(DEFAULT_BRAND);
    const [loading, setLoading] = useState(false);

    const updateData = (key: keyof BrandData, value: string) => {
        setData(prev => ({ ...prev, [key]: value }));
    };

    const handleFinish = async () => {
        setLoading(true);

        try {
            const res = await fetch('/api/brand', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!res.ok) throw new Error('Failed to save profile');

            // Trigger Confetti
            const duration = 3000;
            const end = Date.now() + duration;

            const frame = () => {
                confetti({
                    particleCount: 2,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: [data.primaryColor, '#ffffff']
                });
                confetti({
                    particleCount: 2,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: [data.primaryColor, '#ffffff']
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            };
            frame();

            // Redirect to Dashboard
            setTimeout(() => {
                router.push('/dashboard?onboarded=true');
                router.refresh();
            }, 1500);

        } catch (e) {
            console.error(e);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">

            {/* Progress */}
            <div className="w-full max-w-lg mb-8">
                <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                    <span className={step >= 1 ? 'text-blue-600' : ''}>Identity</span>
                    <span className={step >= 2 ? 'text-blue-600' : ''}>Branding</span>
                    <span className={step >= 3 ? 'text-blue-600' : ''}>Contact</span>
                </div>
                <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-blue-600 transition-all duration-500 ease-out"
                        style={{ width: `${(step / 3) * 100}%` }}
                    />
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-100 relative">

                {/* Step 1: Identity */}
                {step === 1 && (
                    <div className="p-8 animate-in slide-in-from-right-8 duration-300">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                            <Building className="w-6 h-6" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 mb-2">Tell us about your brand</h1>
                        <p className="text-slate-500 mb-8">This will appear on all your documents automatically.</p>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Company Name</label>
                                <input
                                    value={data.companyName}
                                    onChange={(e) => updateData('companyName', e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium"
                                    placeholder="Acme Inc."
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Slogan / Tagline <span className="text-slate-400 font-normal">(Optional)</span></label>
                                <input
                                    value={data.slogan}
                                    onChange={(e) => updateData('slogan', e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium"
                                    placeholder="Innovation for everyone"
                                />
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end">
                            <button
                                onClick={() => setStep(2)}
                                disabled={!data.companyName}
                                className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next Step <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 2: Branding */}
                {step === 2 && (
                    <div className="p-8 animate-in slide-in-from-right-8 duration-300">
                        <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                            <Palette className="w-6 h-6" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 mb-2">Pick your look</h1>
                        <p className="text-slate-500 mb-8">Select a primary color for your letters and headers.</p>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-4">Primary Brand Color</label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {COLORS.map(color => (
                                        <button
                                            key={color}
                                            onClick={() => updateData('primaryColor', color)}
                                            className={`h-12 rounded-xl transition-all relative ${data.primaryColor === color ? 'ring-2 ring-offset-2 ring-blue-500 scale-105 shadow-md' : 'hover:scale-105'}`}
                                            style={{ backgroundColor: color }}
                                        >
                                            {data.primaryColor === color && (
                                                <Check className="w-5 h-5 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 flex justify-between items-center">
                            <button onClick={() => setStep(1)} className="text-slate-500 font-bold hover:text-slate-800">Back</button>
                            <button
                                onClick={() => setStep(3)}
                                className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition flex items-center gap-2"
                            >
                                Next Step <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Contact */}
                {step === 3 && (
                    <div className="p-8 animate-in slide-in-from-right-8 duration-300">
                        <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-2xl flex items-center justify-center mb-6">
                            <Globe className="w-6 h-6" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 mb-2">Where can people find you?</h1>
                        <p className="text-slate-500 mb-8">This helps fill out the footer of your documents.</p>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Website</label>
                                <div className="relative">
                                    <Globe className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                                    <input
                                        value={data.website}
                                        onChange={(e) => updateData('website', e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium"
                                        placeholder="www.acme.com"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Office Address</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                                    <input
                                        value={data.address}
                                        onChange={(e) => updateData('address', e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium"
                                        placeholder="123 Business Rd, City"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 flex justify-between items-center">
                            <button onClick={() => setStep(2)} className="text-slate-500 font-bold hover:text-slate-800">Back</button>
                            <button
                                onClick={handleFinish}
                                disabled={loading}
                                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-blue-200 transition-all flex items-center gap-2 active:scale-95"
                            >
                                {loading ? 'Setting up...' : 'Finish Setup'}
                                {!loading && <Sparkles className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};
