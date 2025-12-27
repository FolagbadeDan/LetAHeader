'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { X, Mail, Lock, User, Loader2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, defaultTab = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'signup'>(defaultTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'signup') {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name })
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Registration failed');
        }

        // Auto login after register
        const loginRes = await signIn('credentials', { email, password, redirect: false });
        if (loginRes?.error) throw new Error("Login failed after registration");

        onClose();
      } else {
        const res = await signIn('credentials', { email, password, redirect: false });
        if (res?.error) {
          throw new Error("Invalid email or password");
        }
        onClose();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
        <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
          <h3 className="text-2xl font-bold text-slate-900">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg p-1.5 transition-all active:scale-90">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="space-y-2 animate-slide-down-fade">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <input type="text" value={name} onChange={e => setName(e.target.value)} required={mode === 'signup'}
                    className="w-full pl-11 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-sm transition-all hover:border-slate-300 bg-white" placeholder="John Doe" />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  className="w-full pl-11 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-sm transition-all hover:border-slate-300 bg-white" placeholder="you@company.com" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Password</label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                  className="w-full pl-11 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-sm transition-all hover:border-slate-300 bg-white" placeholder="••••••••" />
              </div>
            </div>

            {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl font-medium text-center animate-slide-down-fade">{error}</div>}

            <button type="submit" disabled={loading} className="w-full py-3.5 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl font-bold hover:from-slate-800 hover:to-slate-700 transition-all shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {mode === 'login' ? 'Sign In' : 'Create Free Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500">
              {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
              <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }} className="ml-1 text-blue-600 font-bold hover:underline">
                {mode === 'login' ? 'Sign up free' : 'Log in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};