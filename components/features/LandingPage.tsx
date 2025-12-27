
'use client';

import React, { useState, useRef } from 'react';
import { CompanyProfile, DEFAULT_PROFILE, LetterContent } from '@/types';
import { Header } from '../layout/Header';
import { LandingPageServer } from './LandingPageServer';
import {
  ArrowRight, Upload, Cloud, Building2, CheckCircle2,
  Loader2, Sparkles, MessageSquare, User, Target, PenTool
} from 'lucide-react';
import { ArrowLeft, Wand2, Edit3, FileText } from 'lucide-react';

interface LandingPageProps {
  onStart: (initialContent: Partial<LetterContent>, initialProfile?: Partial<CompanyProfile>, openSetup?: boolean) => void;
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

export const LandingPage: React.FC<LandingPageProps> = ({
  onStart, onOpenAuth, onOpenPricing, onOpenMyLetters, onOpenTemplates,
  currentProfile, profiles, onSwitchProfile, onNewProfile
}) => {
  const [wizardStep, setWizardStep] = useState(0);
  const [showAiWizard, setShowAiWizard] = useState(false);
  const [tempProfile, setTempProfile] = useState<CompanyProfile>(DEFAULT_PROFILE);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleStartFlow = () => {
    setWizardStep(1);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempProfile(prev => ({ ...prev, logoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleWizardComplete = (mode: 'ai' | 'manual') => {
    if (mode === 'manual') {
      onStart({}, tempProfile, false);
    } else {
      setShowAiWizard(true);
      setWizardStep(0); // Close onboarding wizard
    }
  };

  // Client-side interactions
  if (showAiWizard) {
    return (
      <AiDraftingWizard
        onClose={() => setShowAiWizard(false)}
        onDraftGenerated={(content) => onStart(content, tempProfile, false)}
      />
    );
  }

  if (wizardStep > 0) {
    return (
      <WizardOverlay
        step={wizardStep}
        setStep={setWizardStep}
        profile={tempProfile}
        setProfile={setTempProfile}
        fileInputRef={fileInputRef}
        handleLogoUpload={handleLogoUpload}
        onComplete={handleWizardComplete}
      />
    );
  }

  // Buttons to be injected into the Server Layout
  const StartButton = (
    <button
      onClick={handleStartFlow}
      title="Start creating your letter for free"
      className="px-8 py-4 bg-slate-900 text-white text-lg font-bold rounded-full hover:bg-slate-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 ring-4 ring-slate-100"
    >
      Create My First Letter
    </button>
  );

  const TemplatesButton = (
    <button
      onClick={onOpenTemplates}
      className="px-8 py-4 bg-white text-slate-700 text-lg font-bold rounded-full hover:bg-slate-50 border border-slate-200 transition-all shadow-sm hover:shadow-md"
    >
      View Templates
    </button>
  );

  const FooterStartButton = (
    <button
      onClick={handleStartFlow}
      className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold rounded-full transition-all shadow-lg hover:shadow-blue-200"
    >
      Start Generating for Free
    </button>
  );

  return (
    <>
      <Header
        onStart={handleStartFlow}
        onOpenAuth={onOpenAuth}
        onOpenPricing={onOpenPricing}
        onOpenMyLetters={onOpenMyLetters}
        onOpenTemplates={onOpenTemplates}
        currentProfile={currentProfile}
        profiles={profiles}
        onSwitchProfile={onSwitchProfile}
        onNewProfile={onNewProfile}
      />
      <LandingPageServer
        onStartButton={StartButton}
        onTemplatesButton={TemplatesButton}
        onFooterStartButton={FooterStartButton}
      />
    </>
  );
};


// ----------------------------------------------------------------------
// WIZARD COMPONENTS (Previously inside LandingPage.tsx, kept here for client interactivity)
// ----------------------------------------------------------------------

interface WizardProps {
  step: number;
  setStep: (s: number) => void;
  profile: CompanyProfile;
  setProfile: React.Dispatch<React.SetStateAction<CompanyProfile>>;
  fileInputRef: any;
  handleLogoUpload: any;
  onComplete: (mode: 'ai' | 'manual') => void;
}

const WizardOverlay: React.FC<WizardProps> = ({
  step, setStep, profile, setProfile,
  fileInputRef, handleLogoUpload, onComplete
}) => {
  const [logoError, setLogoError] = React.useState(false);
  const LOGO_URL = "https://i.ibb.co/MyRD18v8/by-Youmaximize.png";

  return (
    <div className="fixed inset-0 z-[100] bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex flex-col animate-in fade-in duration-300">

      {/* Header with Logo */}
      <header className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {!logoError ? (
              <img
                src={LOGO_URL}
                alt="LetAHeader"
                className="w-[240px] md:w-[300px] h-auto max-h-[120px] object-contain mix-blend-multiply"
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-slate-900 text-white rounded-lg flex items-center justify-center shadow-md">
                  <FileText className="w-6 h-6" />
                </div>
                <span className="font-bold text-2xl tracking-tight text-slate-900">LetAHeader</span>
              </div>
            )}
          </div>
          <div className="text-sm text-slate-500 font-medium">
            Step {step} of 2
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="w-full bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-6">
          <div className="h-1.5 bg-slate-100 relative overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500 ease-out shadow-lg shadow-blue-500/20"
              style={{ width: `${(step / 2) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-12 md:py-16">

          {step === 1 && (
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
              {/* Icon */}
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/25">
                  <Upload className="w-10 h-10" />
                </div>
              </div>

              {/* Title & Description */}
              <div className="text-center space-y-3 max-w-2xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
                  Let's set up your digital letterhead.
                </h2>
                <p className="text-lg text-slate-600 leading-relaxed">
                  First, upload your company logo. We'll position it perfectly at the top of every document you create.
                </p>
              </div>

              {/* Upload Area */}
              <div className="max-w-xl mx-auto">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="relative mt-8 border-2 border-dashed border-slate-300 rounded-2xl p-16 cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition-all group bg-white shadow-sm"
                >
                  {profile.logoUrl ? (
                    <div className="space-y-4">
                      <img src={profile.logoUrl} alt="Uploaded" className="h-24 mx-auto object-contain" />
                      <p className="text-center text-sm text-green-600 font-medium">✓ Logo uploaded successfully</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                        <Cloud className="w-8 h-8 text-slate-400 group-hover:text-blue-500 transition-colors" />
                      </div>
                      <div className="text-center">
                        <span className="text-base font-semibold text-slate-700 block mb-1">Click to Upload Logo</span>
                        <span className="text-sm text-slate-500">Recommended: 300x100px PNG or SVG</span>
                      </div>
                    </div>
                  )}
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                </div>
              </div>

              {/* Actions */}
              <div className="max-w-xl mx-auto space-y-3 pt-4">
                <button
                  onClick={() => setStep(2)}
                  className="w-full py-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl font-bold hover:from-slate-800 hover:to-slate-700 transition-all shadow-lg hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  Next: Add Contact Info <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setStep(2)}
                  className="w-full text-sm text-slate-500 hover:text-slate-700 font-medium transition-colors py-2"
                >
                  Skip for now
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
              {/* Icon */}
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-500/25">
                  <Building2 className="w-10 h-10" />
                </div>
              </div>

              {/* Title & Description */}
              <div className="text-center space-y-3 max-w-2xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
                  Where should people reply?
                </h2>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Enter the details you want to appear in the footer of your letters.
                </p>
              </div>

              {/* Form */}
              <div className="max-w-2xl mx-auto">
                <div className="space-y-5 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Company Name</label>
                    <input
                      type="text"
                      placeholder="Acme Corp Solutions"
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Office Address</label>
                    <textarea
                      placeholder="123 Innovation Way, Tech City, TC 90210"
                      rows={2}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
                      value={profile.address}
                      onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        placeholder="contact@acmecorp.com"
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Website</label>
                      <input
                        type="text"
                        placeholder="www.acmecorp.com"
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
                        value={profile.website}
                        onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="max-w-2xl mx-auto pt-4">
                <button
                  onClick={() => onComplete('manual')}
                  className="w-full py-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl font-bold hover:from-slate-800 hover:to-slate-700 transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
                >
                  Looks Good – Start Writing
                </button>
              </div>
            </div>
          )}



        </div>
      </div>
    </div>
  );
};

interface AiWizardProps {
  onClose: () => void;
  onDraftGenerated: (content: Partial<LetterContent>) => void;
}

const AiDraftingWizard: React.FC<AiWizardProps> = ({ onClose, onDraftGenerated }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    recipient: '',
    goal: '',
    keyPoints: '',
    tone: 'Professional'
  });

  const generateDraft = async () => {
    if (!formData.goal || !formData.keyPoints) return;
    setLoading(true);

    try {
      const prompt = `
        Role: Write a ${formData.tone} business letter.
        Recipient: ${formData.recipient || 'To whom it may concern'}
        Goal: ${formData.goal}
        Key Details: ${formData.keyPoints}
        
        Output: ONLY the HTML body of the letter. No wrapping markdown.
      `;

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      const data = await res.json();

      if (!res.ok) {
        // Handle specific error cases
        if (data.error === 'LOGIN_REQUIRED') {
          alert('Please login first to use AI drafting. Click the "Login" button at the top right.');
          setLoading(false);
          return;
        }
        if (data.error === 'LIMIT_REACHED') {
          alert('You have reached your free AI limit. Upgrade to Pro for unlimited AI drafts!');
          setLoading(false);
          return;
        }
        throw new Error(data.error || 'Generation failed');
      }

      onDraftGenerated({
        recipientName: formData.recipient,
        subject: formData.goal, // Auto-use goal as subject draft
        body: data.text
      });

      onClose(); // Close wizard after success

    } catch (e: any) {
      console.error('AI Generation Error:', e);
      alert(e.message || "Failed to generate draft. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-2 bg-white/10 w-fit px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
              <Sparkles className="w-4 h-4 text-blue-200" />
              <span className="text-xs font-bold tracking-wide text-blue-100 uppercase">AI Drafting Assistant</span>
            </div>
            <h2 className="text-2xl font-bold">What are we writing?</h2>
            <p className="text-blue-100 text-sm mt-1">Answer 3 questions, get a perfect draft.</p>
          </div>
          <button onClick={onClose} className="text-blue-100 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors">
            ✕
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-2">
                <User className="w-3.5 h-3.5" /> Who is this for?
              </label>
              <input
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
                placeholder="e.g. My Landlord, HR Department, Client"
                value={formData.recipient}
                onChange={e => setFormData(prev => ({ ...prev, recipient: e.target.value }))}
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-2">
                <Target className="w-3.5 h-3.5" /> What is the goal?
              </label>
              <input
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
                placeholder="e.g. Request a refund, Dispute a charge, Proposal"
                value={formData.goal}
                onChange={e => setFormData(prev => ({ ...prev, goal: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5" /> Key Details
              </label>
              <textarea
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition min-h-[100px] resize-none"
                placeholder="- Invoice #1234 was incorrect&#10;- I was charged $500 instead of $400&#10;- Please refund the difference"
                value={formData.keyPoints}
                onChange={e => setFormData(prev => ({ ...prev, keyPoints: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-2">
                <PenTool className="w-3.5 h-3.5" /> Tone
              </label>
              <div className="flex gap-2">
                {['Professional', 'Friendly', 'Firm', 'Urgent'].map(t => (
                  <button
                    key={t}
                    onClick={() => setFormData(prev => ({ ...prev, tone: t }))}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${formData.tone === t
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={generateDraft}
            disabled={loading || !formData.goal || !formData.keyPoints}
            className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Writing your letter...
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5" /> Generate Draft
              </>
            )}
          </button>

        </div>
      </div>
    </div>
  );
};
