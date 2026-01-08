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
                <div className="flex items-center gap-2 mb-8">
                    <img
                        src="https://i.ibb.co/MyRD18v8/by-Youmaximize.png"
                        alt="LetAHeader"
                        className="w-[200px] h-auto object-contain brightness-0 invert"
                    />
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
                        <img
                            src="https://i.ibb.co/MyRD18v8/by-Youmaximize.png"
                            alt="LetAHeader"
                            className="w-[160px] h-auto object-contain"
                        />
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

                    {/* Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-slate-500 font-medium">Or continue with</span>
                        </div>
                    </div>

                    {/* Google Sign In */}
                    <button
                        onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
                        className="w-full py-3.5 border-2 border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition flex items-center justify-center gap-3"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Sign in with Google
                    </button>

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
