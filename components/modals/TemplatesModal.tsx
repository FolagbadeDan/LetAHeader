'use client';

import React, { useState } from 'react';
import { X, LayoutTemplate, Check, Trash2, Plus, ArrowRight } from 'lucide-react';
import { SavedTemplate, PRESETS, CompanyProfile } from '@/types';

interface TemplatesModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApply: (profile: Partial<CompanyProfile>) => void;
    savedTemplates: SavedTemplate[];
    onDeleteTemplate?: (id: string) => void;
}

export const TemplatesModal: React.FC<TemplatesModalProps> = ({
    isOpen,
    onClose,
    onApply,
    savedTemplates,
    onDeleteTemplate
}) => {
    const [activeTab, setActiveTab] = useState<'presets' | 'saved'>('presets');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in zoom-in duration-200 flex flex-col max-h-[85vh]">

                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-slate-100 shrink-0">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                            <LayoutTemplate className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">Template Library</h3>
                            <p className="text-xs text-slate-500 font-medium">Choose a starting point for your letterhead</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="px-6 pt-4 flex gap-6 border-b border-slate-100">
                    <button
                        onClick={() => setActiveTab('presets')}
                        className={`pb-3 text-sm font-bold transition-all relative ${activeTab === 'presets' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        Professional Presets
                        {activeTab === 'presets' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t-full" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('saved')}
                        className={`pb-3 text-sm font-bold transition-all relative ${activeTab === 'saved' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        My Saved Designs
                        {activeTab === 'saved' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t-full" />
                        )}
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 custom-scrollbar">

                    {activeTab === 'presets' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {PRESETS.map((preset) => (
                                <div
                                    key={preset.id}
                                    onClick={() => { onApply(preset.profile); onClose(); }}
                                    className="group bg-white rounded-xl border border-slate-200 overflow-hidden cursor-pointer hover:shadow-xl hover:border-indigo-500 transition-all duration-300 relative"
                                >
                                    {/* Mock Preview Header */}
                                    <div className="h-24 bg-slate-50 border-b border-slate-100 p-4 relative overflow-hidden">
                                        <div className="absolute inset-0 opacity-10" style={{ backgroundColor: preset.profile.primaryColor }} />
                                        <div className="flex gap-3">
                                            <div className="w-8 h-8 rounded-md shadow-sm" style={{ backgroundColor: preset.profile.primaryColor }} />
                                            <div className="space-y-1.5 flex-1">
                                                <div className="h-2 w-2/3 bg-slate-200 rounded-sm" />
                                                <div className="h-1.5 w-1/2 bg-slate-100 rounded-sm" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-5">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{preset.name}</h4>
                                            <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">{preset.profile.layout}</span>
                                        </div>
                                        <p className="text-xs text-slate-500 line-clamp-2 mb-4">
                                            A professional layout featuring {preset.profile.fontFamily} typography and clean lines.
                                        </p>
                                        <div className="flex items-center text-xs font-bold text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                                            Use Template <ArrowRight className="w-3 h-3 ml-1" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'saved' && (
                        <div className="space-y-4">
                            {savedTemplates.length === 0 ? (
                                <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-xl bg-white">
                                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                                        <Plus className="w-6 h-6" />
                                    </div>
                                    <p className="text-slate-500 font-medium mb-1">No custom templates yet</p>
                                    <p className="text-sm text-slate-400">Customize your design in the settings panel and save it.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {savedTemplates.map((template) => (
                                        <div
                                            key={template.id}
                                            className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-indigo-500 transition-all duration-300"
                                        >
                                            <div className="h-24 bg-slate-50 border-b border-slate-100 p-4 relative">
                                                <div className="flex gap-3">
                                                    {template.profile.logoUrl ? (
                                                        <img src={template.profile.logoUrl} className="w-8 h-8 object-contain rounded-md bg-white border border-slate-100" />
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-md shadow-sm border border-slate-200 bg-white flex items-center justify-center text-[10px] font-bold text-slate-400">LOG</div>
                                                    )}
                                                    <div className="space-y-1.5 flex-1">
                                                        <div className="h-2 w-2/3 bg-slate-200 rounded-sm" />
                                                        <div className="h-2 w-1/3 bg-slate-200 rounded-sm" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-5">
                                                <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-1">{template.name}</h4>
                                                <p className="text-xs text-slate-400 mb-4">Saved {new Date(template.lastModified).toLocaleDateString()}</p>

                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => { onApply(template.profile); onClose(); }}
                                                        className="flex-1 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition"
                                                    >
                                                        Apply
                                                    </button>
                                                    {onDeleteTemplate && (
                                                        <button
                                                            onClick={() => onDeleteTemplate(template.id)}
                                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                                                            title="Delete Template"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
