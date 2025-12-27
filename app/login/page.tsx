'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Mail, Lock, Loader2, ArrowRight, FileText } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
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
            const res = await signIn('credentials', { email, password, redirect: false });
            if (res?.error) {
                throw new Error("Invalid email or password");
            }
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
            <div className="hidden md:flex w-1/2 bg-slate-900 text-white flex-col justify-between p-12 lg:p-16">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-bold tracking-tight">LetAHeader</span>
                </div>

                <div>
                    <h1 className="text-5xl font-bold mb-6 leading-tight">Professional letters, <br />made simple.</h1>
                    <p className="text-slate-400 text-lg max-w-md leading-relaxed">Join thousands of professionals who have ditched Word for our streamlined, brand-perfect editor.</p>
                </div>

                <div className="text-sm text-slate-500">
                    &copy; {new Date().getFullYear()} LetAHeader Inc.
                </div>
            </div>

            {/* Form Side */}
            <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 lg:p-20 bg-slate-50 md:bg-white">
                <div className="w-full max-w-md space-y-8">
                    <div className="md:hidden flex items-center gap-2 mb-8 justify-center">
                        <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-slate-900">LetAHeader</span>
                    </div>

                    <div className="text-center md:text-left">
                        <h2 className="text-3xl font-bold text-slate-900">Welcome back</h2>
                        <p className="text-slate-500 mt-2">Enter your details to access your dashboard.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
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
                            <div className="flex justify-between">
                                <label className="text-sm font-bold text-slate-700">Password</label>
                                <a href="#" className="text-sm text-blue-600 font-bold hover:underline">Forgot?</a>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none"
                                    placeholder="••••••••"
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
                            className="w-full py-3.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition shadow-lg active:scale-[0.99] flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Sign In <ArrowRight className="w-4 h-4" /></>}
                        </button>
                    </form>

                    <p className="text-center text-slate-500 text-sm">
                        Don't have an account?
                        <Link href="/signup" className="text-blue-600 font-bold hover:underline ml-1">
                            Sign up for free
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
