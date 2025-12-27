'use client';

import React from 'react';
import { X, Check, Zap, Crown, Shield } from 'lucide-react';
import { PaystackButton } from 'react-paystack';
import { useSession } from 'next-auth/react';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason?: string;
}

export const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose, reason }) => {
  const { data: session } = useSession();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden animate-scale-in relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg p-2 transition-all active:scale-90 z-10">
          <X className="w-6 h-6" />
        </button>

        <div className="grid md:grid-cols-2">
          {/* Left: Info */}
          <div className="p-12 bg-gradient-to-br from-slate-50 to-slate-100/50 flex flex-col justify-center">
            {reason && (
              <div className="inline-block px-3 py-1.5 bg-red-100 border border-red-200 text-red-700 text-xs font-bold rounded-full mb-6 self-start animate-pulse-glow">
                {reason}
              </div>
            )}
            <h2 className="text-4xl font-bold text-slate-900 mb-4 gradient-text">Upgrade to Pro</h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-8">
              Unlock the full power of LetAHeader for your business.
            </p>
            <div className="space-y-4">
              <Benefit text="Unlimited Document Storage" delay="0.1s" />
              <Benefit text="Unlimited AI Drafting" delay="0.2s" />
              <Benefit text="Editable DOCX Downloads" delay="0.3s" />
              <Benefit text="Priority Support" delay="0.4s" />
            </div>
          </div>

          {/* Right: Pricing */}
          <div className="p-12 flex flex-col items-center justify-center text-center bg-white">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30 animate-pulse-glow">
              <Crown className="w-10 h-10" />
            </div>
            <div className="text-5xl font-black text-slate-900 mb-2">₦3,500<span className="text-xl text-slate-400 font-medium">/mo</span></div>
            <p className="text-slate-500 mb-10 text-sm">Review drafts, edit, and export without limits.</p>

            {session?.user?.email ? (
              <PaystackButton
                {...{
                  email: session.user.email,
                  amount: 3500 * 100, // Kobo
                  metadata: {
                    name: session.user.name || 'User',
                    phone: '',
                    custom_fields: []
                  },
                  publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', // Default to test
                  text: "Pay with Paystack",
                  onSuccess: async () => {
                    try {
                      await fetch('/api/user/upgrade', { method: 'POST' });
                      alert("Payment Successful! Welcome to Pro.");
                      onClose();
                      window.location.reload();
                    } catch (e) {
                      console.error("Upgrade failed", e);
                      alert("Payment successful but upgrade failed. Please contact support.");
                    }
                  },
                  onClose: () => alert("Transaction was not completed, window closed."),
                }}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:shadow-blue-500/30 transition-all active:scale-[0.98] hover:-translate-y-0.5"
              />
            ) : (
              <button
                className="w-full py-4 bg-slate-200 text-slate-500 rounded-xl font-bold text-lg cursor-not-allowed"
                disabled
              >
                Log in to Upgrade
              </button>
            )}

            <p className="mt-6 text-xs text-slate-400 flex items-center gap-1.5 justify-center">
              <Shield className="w-3.5 h-3.5" /> Secured by Paystack
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Benefit = ({ text, delay }: { text: string; delay?: string }) => (
  <div className="flex items-center gap-3 animate-slide-up-fade" style={{ animationDelay: delay }}>
    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
      <Check className="w-3.5 h-3.5" />
    </div>
    <span className="text-slate-700 font-medium text-left">{text}</span>
  </div>
);