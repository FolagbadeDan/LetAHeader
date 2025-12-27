
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSession, signOut } from "next-auth/react";
import { ConfigPanel } from '../features/ConfigPanel';
import { DocumentPreview } from '../features/DocumentPreview';
import { Editor } from '../features/Editor';
import { BrandSwitcher } from '../features/BrandSwitcher';
import { AIAssistantModal } from '../modals/AIAssistantModal';
import { LandingPage } from '../features/LandingPage';
import { AuthModal } from '../modals/AuthModal';
import { PricingModal } from '../modals/PricingModal';
import { MyLettersModal } from '../modals/MyLettersModal';

import { TemplatesModal } from '../modals/TemplatesModal';
import { ProfileManagerModal } from '../modals/ProfileManagerModal';
import { Download, Printer, Loader2, Settings, Edit3, Eye, FileText, ArrowLeft, Cloud, User as UserIcon, LogOut, File, ChevronDown } from 'lucide-react';
import { CompanyProfile, LetterContent, SavedTemplate, SavedLetter, DEFAULT_PROFILE, DEFAULT_CONTENT } from '@/types';
import { saveLetterToCloud } from '@/services/letterService';

type ViewMode = 'config' | 'editor' | 'preview';

interface AppWrapperProps {
  startMode?: boolean;
}

const AppWrapper: React.FC<AppWrapperProps> = ({ startMode = false }) => {
  const { data: session } = useSession();
  const [hasStarted, setHasStarted] = useState(startMode);
  const [profile, setProfile] = useState<CompanyProfile>(DEFAULT_PROFILE);
  const [content, setContent] = useState<LetterContent>(DEFAULT_CONTENT);
  const [templates, setTemplates] = useState<SavedTemplate[]>([]);
  const [savedProfiles, setSavedProfiles] = useState<CompanyProfile[]>([]);

  // UI States
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [isMyLettersModalOpen, setIsMyLettersModalOpen] = useState(false);
  const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isPdfMenuOpen, setIsPdfMenuOpen] = useState(false);
  const [pdfQuality, setPdfQuality] = useState<'hd' | 'compressed'>('hd');
  const [pricingReason, setPricingReason] = useState('');

  const [viewMode, setViewMode] = useState<ViewMode>('editor');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [initialSetupTab, setInitialSetupTab] = useState<'identity' | 'design' | 'templates'>('identity');
  const [logoError, setLogoError] = useState(false);

  const printRef = useRef<HTMLDivElement>(null);
  const LOGO_URL = "https://i.ibb.co/MyRD18v8/by-Youmaximize.png";

  const [userPlan, setUserPlan] = useState<'FREE' | 'PRO'>('FREE');
  const [usageStats, setUsageStats] = useState({ aiUsage: 0, letterCount: 0 });

  // Load local templates
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTemplates = localStorage.getItem('proletter_templates');
      if (savedTemplates) {
        try { setTemplates(JSON.parse(savedTemplates)); } catch (e) { }
      }
    }
  }, []);

  // Fetch real-time user status
  useEffect(() => {
    if (session?.user?.email) {
      // Fetch Status
      fetch('/api/user/status')
        .then(res => res.json())
        .then(data => {
          setUserPlan(data.plan);
          setUsageStats({ aiUsage: data.aiUsage, letterCount: data.letterCount });
        })
        .catch(err => console.error("Failed to fetch status", err));

      // Fetch Profiles
      fetch('/api/profiles')
        .then(res => res.json())
        .then((data: CompanyProfile[]) => {
          if (Array.isArray(data) && data.length > 0) {
            setSavedProfiles(data);
            // Optionally set default if not already started
            if (!hasStarted) {
              const def = data.find(p => p.isDefault) || data[0];
              setProfile(def);
            }
          }
        })
        .catch(e => console.error(e));
    }
  }, [session]);

  // Load letter from Dashboard if selected
  useEffect(() => {
    const letterId = localStorage.getItem('open_letter_id');
    if (letterId && session) {
      fetch('/api/letters')
        .then(res => res.json())
        .then((letters: SavedLetter[]) => {
          const target = letters.find(l => l.id === letterId);
          if (target) {
            handleLoadLetter(target);
            localStorage.removeItem('open_letter_id');
            setHasStarted(true);
          }
        });
    }
  }, [session]);

  // Automatically bypass onboarding for logged-in users
  useEffect(() => {
    if (session) {
      setHasStarted(true);
    }
  }, [session]);

  const handleStart = (initialContent: Partial<LetterContent>, initialProfile?: Partial<CompanyProfile>, openSetup = false) => {
    if (initialProfile) setProfile(prev => ({ ...prev, ...initialProfile }));
    if (Object.keys(initialContent).length > 0) {
      setContent(prev => ({
        ...prev,
        ...initialContent,
        date: initialContent.date || prev.date,
        recipientName: initialContent.recipientName || prev.recipientName,
        recipientAddress: initialContent.recipientAddress || prev.recipientAddress,
      }));
    }
    setHasStarted(true);

    if (openSetup) {
      setIsSidebarOpen(true);
      setInitialSetupTab('identity');
      if (window.innerWidth < 1024) setViewMode('config');
    } else {
      // User requested setup to be hidden by default on large screens
      setIsSidebarOpen(false);
    }
  };

  const handleCloudSave = async () => {
    if (!session) {
      setIsAuthModalOpen(true);
      return;
    }

    // Storage Gate: Free users max 100 letters (effectively unlimited for now)
    if (userPlan === 'FREE' && usageStats.letterCount >= 100) {
      setPricingReason("Free Plan Limit: 100 Letters Storage");
      setIsPricingModalOpen(true);
      return;
    }

    const name = prompt("Name this letter:");
    if (!name) return;

    try {
      await saveLetterToCloud(name, content, profile);
      alert("Letter saved to cloud!");
      // usageStats should update but we might just reload or optimistically increment
      setUsageStats(prev => ({ ...prev, letterCount: prev.letterCount + 1 }));
    } catch (error: any) {
      alert("Failed to save letter.");
    }
  };

  const saveTemplate = () => {
    if (!session) {
      setIsAuthModalOpen(true);
      return;
    }
    const name = prompt("Name your template:");
    if (!name) return;
    const newTemplate: SavedTemplate = {
      id: Date.now().toString(),
      name,
      profile,
      lastModified: Date.now()
    };
    const updated = [...templates, newTemplate];
    setTemplates(updated);
    localStorage.setItem('proletter_templates', JSON.stringify(updated));
  };

  const loadTemplate = (t: SavedTemplate) => setProfile(t.profile);

  const handleLoadLetter = (letter: SavedLetter) => {
    setProfile(letter.profile);
    setContent(letter.content);
    setHasStarted(true);
  };

  const handleSaveProfile = async (newProfile: CompanyProfile) => {
    if (!session) {
      setIsAuthModalOpen(true);
      return;
    }

    // Optimistic Update
    setProfile(newProfile);
    setSavedProfiles(prev => [...prev.filter(p => p.id !== newProfile.id), newProfile]);

    try {
      const method = newProfile.id ? 'PUT' : 'POST';
      const url = newProfile.id ? `/api/profiles/${newProfile.id}` : '/api/profiles';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProfile)
      });

      if (res.ok) {
        const saved = await res.json();
        // Update with real ID from server
        setSavedProfiles(prev => [...prev.filter(p => p.id !== newProfile.id), saved]);
        setProfile(saved);
      }
    } catch (e) {
      console.error("Failed to save profile", e);
    }
  };

  const handleDownloadDocument = async (type: 'pdf' | 'docx') => {
    setIsPdfMenuOpen(false);

    // Export Gate: UNLIMITED for all users
    // if (type === 'docx' && userPlan === 'FREE') { ... }

    if (!printRef.current) return;
    setIsGenerating(true);
    try {
      if (window.innerWidth < 1024) setViewMode('preview');
      await new Promise(resolve => setTimeout(resolve, 800));

      const safeName = content.recipientName.replace(/[^a-z0-9]/gi, '_').replace(/_+/g, '_') || 'Letter';
      const filename = `${safeName}_Letter.${type}`;

      const { generateDocument } = await import('@/services/pdfService');
      await generateDocument(printRef.current, filename, type, pdfQuality);

    } catch (error: any) {
      console.error("Download Error:", error);
      alert(`Failed to generate ${type.toUpperCase()}: ${error.message || 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOpenAI = () => {
    // Guest Usage (Local Storage)
    if (!session) {
      const localUsage = parseInt(localStorage.getItem('guest_ai_usage') || '0');
      // Updated Limit: 10 uses for guests
      if (localUsage >= 10) {
        setPricingReason("Guest Limit Reached: 10 AI Drafts. Please create a free account for unlimited access.");
        setIsAuthModalOpen(true);
        return;
      }
      setIsAIModalOpen(true);
      return;
    }

    // AI Gate: UNLIMITED for all signed-in users (as per user request)
    // if (userPlan === 'FREE' && usageStats.aiUsage >= 3) { ... }

    setIsAIModalOpen(true);
  };

  const handleOpenTemplates = () => {
    setIsTemplatesModalOpen(true);
  };

  if (!hasStarted) {
    return (
      <>
        <LandingPage
          onStart={handleStart}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onOpenPricing={() => setIsPricingModalOpen(true)}
          onOpenMyLetters={() => {
            if (!session) setIsAuthModalOpen(true);
            else setIsMyLettersModalOpen(true);
          }}
          onOpenTemplates={handleOpenTemplates}
          currentProfile={profile}
          profiles={savedProfiles}
          onSwitchProfile={(p) => setProfile(p)}
          onNewProfile={() => setIsProfileModalOpen(true)}
        />
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        <PricingModal isOpen={isPricingModalOpen} onClose={() => setIsPricingModalOpen(false)} />
        <MyLettersModal isOpen={isMyLettersModalOpen} onClose={() => setIsMyLettersModalOpen(false)} onLoad={handleLoadLetter} />
        <TemplatesModal
          isOpen={isTemplatesModalOpen}
          onClose={() => setIsTemplatesModalOpen(false)}
          onApply={(p) => {
            setProfile(prev => ({ ...prev, ...p }));
            setIsTemplatesModalOpen(false);
            setHasStarted(true);
          }}
          savedTemplates={templates}

        />
        <ProfileManagerModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          onSave={handleSaveProfile}
          initialProfile={profile.id ? undefined : profile} // If editing, pass current. If new, undefined. Logic can be improved.
        />
      </>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col bg-white text-slate-900 font-sans overflow-hidden selection:bg-blue-100 selection:text-blue-900">

      {/* Header */}

      {/* Wait, the Header inside return was inlined. I need to check where Header is used. The viewed file showed <header> HTML tag but not the component <Header /> usage in the main return block. Let me check line 269. */}
      <header className="h-20 lg:h-24 border-b border-slate-200 flex justify-between items-center px-4 lg:px-6 z-30 bg-white/80 backdrop-blur-sm sticky top-0 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => setHasStarted(false)} className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition" title="Back to Home">
            <ArrowLeft className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-2 mr-2">
            <a href="/" className="block hover:opacity-80 transition-opacity" title="Return to Home">
              {!logoError ? (
                <img
                  src={LOGO_URL}
                  alt="LetAHeader"
                  className="w-[240px] lg:w-[300px] h-auto max-h-[120px] object-contain mix-blend-multiply"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-slate-900 text-white rounded flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-lg hidden sm:block">LetAHeader</span>
                </div>
              )}
            </a>
          </div>

          {/* Brand Switcher Desktop */}
          {session && (
            <div className="hidden lg:block ml-4 border-l border-slate-200 pl-4">
              <BrandSwitcher
                currentProfile={profile}
                profiles={savedProfiles}
                onSwitch={setProfile}
                onNew={() => setIsProfileModalOpen(true)}
              />
            </div>
          )}

          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors border ${isSidebarOpen ? 'bg-slate-100 text-slate-900 border-slate-200' : 'bg-white text-slate-500 border-transparent hover:bg-slate-50'}`}
          >
            <Settings className="w-4 h-4" />
            {isSidebarOpen ? 'Close Setup' : 'Setup'}
          </button>
        </div>

        <div className="flex items-center gap-3">
          {/* User Dropdown */}
          {session ? (
            <div className="relative hidden md:block">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900"
              >
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold uppercase">
                  {session.user?.name?.[0] || 'U'}
                </div>
                <ChevronDown className="w-4 h-4" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-xl py-2 animate-in fade-in zoom-in-95 duration-100">
                  <button onClick={() => { setIsUserMenuOpen(false); setIsMyLettersModalOpen(true); }} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                    <File className="w-4 h-4" /> My Letters
                  </button>
                  <button onClick={() => { setIsUserMenuOpen(false); setIsPricingModalOpen(true); }} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                    <Cloud className="w-4 h-4" /> Upgrade Plan
                  </button>
                  <button onClick={() => signOut()} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button onClick={() => setIsAuthModalOpen(true)} className="hidden md:block text-xs font-bold text-slate-600 hover:text-slate-900">Log In</button>
          )}

          <div className="h-4 w-px bg-slate-200 hidden md:block"></div>

          <button
            onClick={handleCloudSave}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-md text-xs font-bold transition"
          >
            <Cloud className="w-4 h-4" />
            Save
          </button>

          <div className="relative">
            <button
              onClick={() => setIsPdfMenuOpen(!isPdfMenuOpen)}
              disabled={isGenerating}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-xs font-bold transition-all active:scale-95 disabled:opacity-70 shadow-sm"
            >
              {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
              {isGenerating ? 'Exporting...' : 'Download PDF'}
              <ChevronDown className="w-3 h-3 ml-1 opacity-70" />
            </button>

            {isPdfMenuOpen && !isGenerating && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-100 rounded-xl shadow-xl py-2 animate-in fade-in zoom-in-95 duration-100 z-50">
                <div className="px-4 py-2 border-b border-slate-100 mb-2">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Quality</div>
                  <div className="flex bg-slate-100 p-1 rounded-lg">
                    <button
                      onClick={() => setPdfQuality('hd')}
                      className={`flex-1 py-1 text-[10px] font-bold rounded-md transition-all ${pdfQuality === 'hd' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      HD (Print)
                    </button>
                    <button
                      onClick={() => setPdfQuality('compressed')}
                      className={`flex-1 py-1 text-[10px] font-bold rounded-md transition-all ${pdfQuality === 'compressed' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      Web (Small)
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => handleDownloadDocument('pdf')}
                  className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <FileText className="w-4 h-4 text-red-600" />
                  <div>
                    <span className="block text-slate-900">Download PDF</span>
                    <span className="block text-[10px] text-slate-500">Best for printing</span>
                  </div>
                </button>
                <button
                  onClick={() => handleDownloadDocument('docx')}
                  className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <File className="w-4 h-4 text-blue-600" />
                  <div>
                    <span className="block text-slate-900">Download Word</span>
                    <span className="block text-[10px] text-slate-500">Editable .docx file</span>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        <aside className={`
          bg-white z-20 transition-all duration-300 ease-[cubic-bezier(0.2,0.0,0.2,1)] border-r border-slate-200 pb-20 lg:pb-0
          lg:absolute lg:inset-y-0 lg:left-0 lg:shadow-[5px_0_25px_-5px_rgba(0,0,0,0.05)]
          ${viewMode === 'config' ? 'absolute inset-0 w-full translate-x-0' : 'absolute inset-0 -translate-x-full'}
          ${isSidebarOpen ? 'lg:translate-x-0 lg:w-[340px]' : 'lg:-translate-x-full lg:w-[340px]'}
        `}>
          <ConfigPanel
            profile={profile}
            setProfile={setProfile}
            templates={templates}
            loadTemplate={loadTemplate}
            saveCurrentAsTemplate={saveTemplate}
            initialTab={initialSetupTab}
          />
        </aside>

        <div className={`flex-1 flex transition-all duration-500 ease-[cubic-bezier(0.2,0.0,0.2,1)] ${isSidebarOpen ? 'lg:ml-[340px]' : 'lg:ml-0'}`}>
          <section className={`
            bg-slate-50/50 z-10 flex flex-col transition-all duration-500 ease-in-out pb-20 lg:pb-0
            ${viewMode === 'editor' ? 'absolute inset-0 w-full translate-x-0' : 'absolute inset-0 translate-x-full lg:translate-x-0'}
            ${isPreviewOpen ? 'lg:!w-[50%] lg:flex-none lg:!relative' : 'lg:flex-1 lg:w-full'}
          `}>
            <Editor
              content={content}
              setContent={setContent}
              onAIAssist={handleOpenAI}
            />
          </section>

          <main className={`
            bg-[#E5E5E5] overflow-hidden transition-all duration-500 ease-in-out pb-20 lg:pb-0
            border-l border-slate-200 shadow-xl lg:z-20
            ${viewMode === 'preview' ? 'absolute inset-0 w-full translate-x-0' : 'absolute inset-0 translate-x-full'}
            ${isPreviewOpen ? 'lg:!w-[50%] lg:flex-none lg:!static lg:translate-x-0' : 'lg:!w-[50%] lg:!absolute lg:right-0 lg:inset-y-0 lg:translate-x-full lg:opacity-0 lg:pointer-events-none'}
          `}>
            <DocumentPreview
              ref={printRef}
              profile={profile}
              content={content}
            />
          </main>
        </div>
      </div>

      {/* Floating Action Dock (Desktop & Mobile) */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 animate-in slide-in-from-bottom-10 duration-500">
        <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-xl border border-white/10 shadow-2xl rounded-full px-3 py-2 text-white ring-1 ring-black/5">

          {/* View Switchers (Mobile Only) */}
          <div className="flex lg:hidden items-center gap-1 border-r border-white/10 pr-2 mr-1">
            <DockBtn icon={Settings} label="Setup" active={viewMode === 'config'} onClick={() => setViewMode('config')} />
            <DockBtn icon={Edit3} label="Editor" active={viewMode === 'editor'} onClick={() => setViewMode('editor')} />
            <DockBtn icon={Eye} label="Preview" active={viewMode === 'preview'} onClick={() => setViewMode('preview')} />
          </div>

          {/* Primary Actions */}
          <div className="flex items-center gap-1">
            <DockBtn
              icon={Cloud}
              label="Save"
              onClick={handleCloudSave}
              tooltip="Save to Cloud"
            />
            <DockBtn
              icon={isGenerating ? Loader2 : Download}
              label={isGenerating ? 'Exporting' : 'Download'}
              onClick={() => setIsPdfMenuOpen(true)}
              active={isPdfMenuOpen}
              tooltip="Download PDF/DOCX"
            />
            <div className="w-px h-4 bg-white/20 mx-1 hidden lg:block"></div>
            <DockBtn
              icon={Settings}
              label="Setup"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              active={isSidebarOpen}
              tooltip="Configure Letterhead"
              className="hidden lg:flex"
            />
            <DockBtn
              icon={Eye}
              label="Preview"
              onClick={() => setIsPreviewOpen(!isPreviewOpen)}
              active={isPreviewOpen}
              tooltip="Toggle Split View"
              className="hidden lg:flex"
            />
          </div>

        </div>
      </div>

      <AIAssistantModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onApply={(t) => {
          setContent(prev => ({ ...prev, body: t }));

          if (!session) {
            // Increment Guest Usage
            const current = parseInt(localStorage.getItem('guest_ai_usage') || '0');
            localStorage.setItem('guest_ai_usage', (current + 1).toString());
          } else {
            // Optimistic update for logged in user (Server should verify on generation, but we track UI state here)
            setUsageStats(prev => ({ ...prev, aiUsage: prev.aiUsage + 1 }));
            // Note: The actual API call to generate text should handle the DB increment
          }
        }}
      />

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      <PricingModal
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
        reason={pricingReason}
      />

      <MyLettersModal
        isOpen={isMyLettersModalOpen}
        onClose={() => setIsMyLettersModalOpen(false)}
        onLoad={handleLoadLetter}
      />

      <TemplatesModal
        isOpen={isTemplatesModalOpen}
        onClose={() => setIsTemplatesModalOpen(false)}
        onApply={(p) => {
          setProfile(prev => ({ ...prev, ...p }));
          setHasStarted(true);
        }}
        savedTemplates={templates}
        onDeleteTemplate={(id) => {
          const updated = templates.filter(t => t.id !== id);
          setTemplates(updated);
          localStorage.setItem('proletter_templates', JSON.stringify(updated));
        }}
      />
      <ProfileManagerModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onSave={handleSaveProfile}
      />

    </div>
  );
};

const DockBtn = ({ icon: Icon, label, active, onClick, tooltip, className = '' }: any) => (
  <button
    onClick={onClick}
    title={tooltip}
    className={`relative flex items-center gap-2 px-3 py-2 rounded-full transition-all active:scale-95 group ${active
      ? 'bg-white text-slate-900 shadow-lg'
      : 'text-slate-400 hover:text-white hover:bg-white/10'
      } ${className}`}
  >
    <Icon className={`w-5 h-5 ${active ? 'fill-current' : ''}`} strokeWidth={active ? 2.5 : 2} />
    {active && <span className="text-xs font-bold max-w-[100px] truncate hidden md:block">{label}</span>}

    {/* Tooltip */}
    {!active && tooltip && (
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-2 py-1 bg-white text-slate-900 text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl">
        {tooltip}
        <div className="absolute top-100 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-white"></div>
      </div>
    )}
  </button>
);

export default AppWrapper;
