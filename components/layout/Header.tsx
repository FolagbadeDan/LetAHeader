'use client';

import React, { useState } from 'react';
import { Menu, X, FileText, User as UserIcon, LogOut, File, ChevronDown } from 'lucide-react';
import { useSession, signOut } from "next-auth/react";
import Link from 'next/link';

import { BrandSwitcher } from '../features/BrandSwitcher';
import { CompanyProfile } from '@/types';

interface HeaderProps {
  onStart: () => void;
  onOpenAuth: () => void;
  onOpenPricing: () => void;
  onOpenMyLetters: () => void;
  onOpenTemplates: () => void;

  // Brand Switching
  currentProfile?: CompanyProfile;
  profiles?: CompanyProfile[];
  onSwitchProfile?: (p: CompanyProfile) => void;
  onNewProfile?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onStart, onOpenAuth, onOpenPricing, onOpenMyLetters, onOpenTemplates,
  currentProfile, profiles, onSwitchProfile, onNewProfile
}) => {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const LOGO_URL = "https://i.ibb.co/MyRD18v8/by-Youmaximize.png";

  return (
    <header className="h-20 md:h-24 flex items-center justify-between px-6 md:px-12 bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-50 transition-all duration-300">

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 cursor-pointer group" onClick={onStart}>
          {!logoError ? (
            <img
              src={LOGO_URL}
              alt="LetAHeader"
              className="w-[200px] md:w-[240px] h-auto max-h-[100px] object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
              onError={() => setLogoError(true)}
            />
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/30 transition-shadow">
                <FileText className="w-6 h-6" />
              </div>
              <span className="font-bold text-2xl tracking-tight text-slate-900">LetAHeader</span>
            </div>
          )}
        </div>

        {/* Brand Switcher (Visible if user is logged in and features provided) */}
        {session && profiles && onSwitchProfile && currentProfile && (
          <div className="hidden md:block pl-6 border-l border-slate-200 h-8 flex items-center">
            <BrandSwitcher
              currentProfile={currentProfile}
              profiles={profiles}
              onSwitch={onSwitchProfile}
              onNew={onNewProfile!}
            />
          </div>
        )}
      </div>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-8">
        <button onClick={onOpenTemplates} className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Templates</button>
        <button onClick={onOpenPricing} className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Pricing</button>

        {session ? (
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900"
            >
              <div className="w-9 h-9 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold uppercase">
                {session.user?.name?.[0] || 'U'}
              </div>
              <span>{session.user?.name}</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-xl py-2 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-4 py-2 border-b border-slate-50 mb-1">
                  <p className="text-xs text-slate-500 uppercase font-bold">{(session.user as any).plan || 'FREE'} Plan</p>
                </div>
                <Link href="/dashboard" className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                  <File className="w-4 h-4" /> Dashboard
                </Link>
                <button onClick={() => signOut()} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <button onClick={onOpenAuth} className="text-sm font-bold text-slate-600 hover:text-slate-900">
              Log In
            </button>
            <button
              onClick={onStart}
              className="text-sm font-bold bg-slate-900 text-white px-6 py-3 rounded-full hover:bg-slate-800 transition shadow-sm active:scale-95"
            >
              Get Started
            </button>
          </div>
        )}
      </div>

      {/* Mobile Toggle */}
      <button
        className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
      </button>


      {/* Mobile Menu Dropdown */}
      {
        isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 shadow-xl animate-in slide-in-from-top-5 duration-200">
            <div className="flex flex-col p-6 gap-6">
              {!session && (
                <button onClick={() => { setIsMobileMenuOpen(false); onOpenAuth(); }} className="text-base font-medium text-slate-700 text-left">Log In</button>
              )}
              <button onClick={() => { setIsMobileMenuOpen(false); onOpenTemplates(); }} className="text-base font-medium text-slate-700 text-left">Templates</button>
              <button onClick={() => { setIsMobileMenuOpen(false); onOpenPricing(); }} className="text-base font-medium text-slate-700 text-left">Pricing</button>
              {session && (
                <button onClick={() => { setIsMobileMenuOpen(false); onOpenMyLetters(); }} className="text-base font-medium text-slate-700 text-left flex items-center gap-2">
                  <File className="w-4 h-4" /> My Letters
                </button>
              )}
              <hr className="border-slate-100" />
              <button
                onClick={() => {
                  onStart();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-center font-bold bg-slate-900 text-white px-6 py-3 rounded-xl hover:bg-slate-800"
              >
                {session ? 'Create New Letter' : 'Get Started Free'}
              </button>
              {session && (
                <button onClick={() => signOut()} className="text-red-600 font-medium text-sm text-left">Sign Out</button>
              )}
            </div>
          </div>
        )
      }
    </header >
  );
};