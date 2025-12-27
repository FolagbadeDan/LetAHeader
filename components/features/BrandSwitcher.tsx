'use client';

import React, { useState } from 'react';
import { CompanyProfile } from '@/types';
import { ChevronDown, Plus, Check, Building2 } from 'lucide-react';

interface BrandSwitcherProps {
    currentProfile: CompanyProfile;
    profiles: CompanyProfile[];
    onSwitch: (profile: CompanyProfile) => void;
    onNew: () => void;
}

export const BrandSwitcher: React.FC<BrandSwitcherProps> = ({ currentProfile, profiles, onSwitch, onNew }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
            >
                <div className="w-6 h-6 rounded-md bg-slate-900 text-white flex items-center justify-center overflow-hidden shrink-0">
                    {currentProfile.logoUrl ? (
                        <img src={currentProfile.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                        <Building2 className="w-3.5 h-3.5" />
                    )}
                </div>
                <span className="text-sm font-bold text-slate-800 max-w-[120px] truncate hidden sm:block">
                    {currentProfile.name || 'My Brand'}
                </span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-[40]" onClick={() => setIsOpen(false)} />
                    <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 p-2 z-[50] animate-in fade-in zoom-in-95 duration-100">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 mb-1">
                            Your Brands
                        </div>

                        <div className="space-y-1 max-h-[300px] overflow-y-auto">
                            {profiles.map(p => (
                                <button
                                    key={p.id || p.name}
                                    onClick={() => {
                                        onSwitch(p);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full flex items-center gap-3 px-2 py-2 rounded-lg text-left transition-colors ${p.id === currentProfile.id
                                            ? 'bg-blue-50 text-blue-700'
                                            : 'hover:bg-slate-50 text-slate-700'
                                        }`}
                                >
                                    <div className="w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center overflow-hidden shrink-0 border border-slate-200">
                                        {p.logoUrl ? (
                                            <img src={p.logoUrl} alt={p.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <Building2 className="w-4 h-4 text-slate-400" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-bold truncate">{p.name}</div>
                                        <div className="text-[10px] text-slate-500 truncate">{p.website || 'No website'}</div>
                                    </div>
                                    {p.id === currentProfile.id && <Check className="w-4 h-4" />}
                                </button>
                            ))}
                        </div>

                        <div className="h-px bg-slate-100 my-2" />

                        <button
                            onClick={() => {
                                onNew();
                                setIsOpen(false);
                            }}
                            className="w-full flex items-center gap-2 px-2 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                        >
                            <div className="w-8 h-8 rounded-md border border-dashed border-slate-300 flex items-center justify-center">
                                <Plus className="w-4 h-4" />
                            </div>
                            Create New Brand
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};
