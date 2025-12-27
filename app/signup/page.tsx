'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Mail, Lock, Loader2, ArrowRight, FileText, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
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

            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col md:flex-row">

            {/* Branding Side (Desktop) */}
            <div className="hidden md:flex w-1/2 bg-blue-600 text-white flex-col justify-between p-12 lg:p-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="relative z-10 flex items-center gap-2">
                    <div className="w-10 h-10 bg-white text-blue-600 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-bold tracking-tight">LetAHeader</span>
                </div>

                <div className="relative z-10">
                    <h1 className="text-5xl font-bold mb-6 leading-tight">Start looking professional today.</h1>
                    <ul className="space-y-4 text-blue-100 text-lg font-medium">
                        <li className="flex items-center gap-3"><span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-sm">✓</span> Free branding setup</li>
                        <li className="flex items-center gap-3"><span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-sm">✓</span> 3 free AI-generated letters</li>
                        <li className="flex items-center gap-3"><span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-sm">✓</span> No credit card required</li>
                    </ul>
                </div>

                <div className="relative z-10 text-sm text-blue-200">
                    &copy; {new Date().getFullYear()} LetAHeader Inc.
                </div>
            </div>

            {/* Form Side */}
            <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 lg:p-20 bg-slate-50 md:bg-white">
                <div className="w-full max-w-md space-y-8">
                    <div className="md:hidden flex items-center gap-2 mb-8 justify-center">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-slate-900">LetAHeader</span>
                    </div>

                    <div className="text-center md:text-left">
                        <h2 className="text-3xl font-bold text-slate-900">Create your account</h2>
                        <p className="text-slate-500 mt-2">Get started with your free workspace.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none"
                                    placeholder="name@company.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none"
                                    placeholder="Min 8 characters"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm font-bold rounded-lg border border-red-100 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-red-600 rounded-full" /> {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200 active:scale-[0.99] flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Create Account <ArrowRight className="w-4 h-4" /></>}
                        </button>
                    </form>

                    <p className="text-center text-slate-500 text-sm">
                        Already have an account?
                        <Link href="/login" className="text-slate-900 font-bold hover:underline ml-1">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
