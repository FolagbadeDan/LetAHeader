'use client';

import React, { useState, useRef } from 'react';
import { CompanyProfile, DEFAULT_PROFILE } from '@/types';
import { X, Upload, Building2, Globe, Mail, Phone, MapPin, Palette } from 'lucide-react';

interface ProfileManagerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (profile: CompanyProfile) => void;
    initialProfile?: CompanyProfile;
}

export const ProfileManagerModal: React.FC<ProfileManagerModalProps> = ({
    isOpen, onClose, onSave, initialProfile
}) => {
    const [profile, setProfile] = useState<CompanyProfile>(initialProfile || { ...DEFAULT_PROFILE, name: '', logoUrl: null });
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfile(prev => ({ ...prev, logoUrl: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(profile);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">
                            {initialProfile ? 'Edit Brand Profile' : 'Create New Brand'}
                        </h2>
                        <p className="text-sm text-slate-500">Manage your company identity and settings</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                {/* Scrollable Form */}
                <div className="flex-1 overflow-y-auto p-6">
                    <form id="profile-form" onSubmit={handleSubmit} className="space-y-8">

                        {/* Logo Section */}
                        <div className="flex gap-6 items-start">
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="w-32 h-32 rounded-xl border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50/50 flex flex-col items-center justify-center cursor-pointer transition gap-2 shrink-0 bg-slate-50 overflow-hidden relative group"
                            >
                                {profile.logoUrl ? (
                                    <img src={profile.logoUrl} className="w-full h-full object-contain p-2" />
                                ) : (
                                    <>
                                        <Upload className="w-6 h-6 text-slate-400" />
                                        <span className="text-[10px] text-slate-500 font-medium">Upload Logo</span>
                                    </>
                                )}
                                {profile.logoUrl && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                        <span className="text-white text-xs font-bold">Change</span>
                                    </div>
                                )}
                            </div>
                            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />

                            <div className="flex-1 space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Company Name</label>
                                    <input
                                        required
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg font-bold text-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
                                        placeholder="Acme Inc."
                                        value={profile.name}
                                        onChange={e => setProfile({ ...profile, name: e.target.value })}
                                    />
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex-1">
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">
                                            <Palette className="w-3 h-3" /> Brand Color
                                        </label>
                                        <div className="flex gap-2 items-center">
                                            <input
                                                type="color"
                                                value={profile.primaryColor}
                                                onChange={e => setProfile({ ...profile, primaryColor: e.target.value })}
                                                className="w-10 h-10 rounded cursor-pointer border-0"
                                            />
                                            <span className="text-sm font-mono text-slate-500">{profile.primaryColor}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-slate-100" />

                        {/* Contact Info */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">
                                    <Globe className="w-3 h-3" /> Website
                                </label>
                                <input
                                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                                    placeholder="www.example.com"
                                    value={profile.website}
                                    onChange={e => setProfile({ ...profile, website: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">
                                    <Mail className="w-3 h-3" /> Email
                                </label>
                                <input
                                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                                    placeholder="contact@example.com"
                                    value={profile.email}
                                    onChange={e => setProfile({ ...profile, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">
                                    <Phone className="w-3 h-3" /> Phone
                                </label>
                                <input
                                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                                    placeholder="+1 (555) 000-0000"
                                    value={profile.phone}
                                    onChange={e => setProfile({ ...profile, phone: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">
                                <MapPin className="w-3 h-3" /> Office Address
                            </label>
                            <textarea
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm resize-none h-24"
                                placeholder="123 Business St, Suite 100, City, ST"
                                value={profile.address}
                                onChange={e => setProfile({ ...profile, address: e.target.value })}
                            />
                        </div>

                    </form>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 text-slate-600 font-bold hover:bg-slate-200 rounded-xl transition"
                    >
                        Cancel
                    </button>
                    <button
                        form="profile-form"
                        type="submit"
                        className="px-5 py-2.5 bg-slate-900 text-white font-bold hover:bg-slate-800 rounded-xl shadow-lg transition"
                    >
                        Save Brand Profile
                    </button>
                </div>

            </div>
        </div>
    );
};
