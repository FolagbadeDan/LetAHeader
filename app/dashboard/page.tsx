import React from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { RecentLetters } from '@/components/dashboard/RecentLetters';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from 'next/navigation';
import { Plus, LayoutTemplate } from 'lucide-react';
import Link from 'next/link';
import { db } from "@/lib/db";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect('/');
    }

    // Check if user has onboarded
    const userId = (session.user as any).id;
    const profile = await db.brandProfile.findUnique({
        where: { userId }
    });

    if (!profile) {
        redirect('/onboarding');
    }

    return (
        <div className="min-h-screen bg-slate-50/50">
            <DashboardHeader />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">

                {/* Welcome Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
                        <p className="text-slate-500 mt-1">Welcome back, {session.user?.name}</p>
                    </div>
                    <div className="flex gap-3">
                        <Link href="/" className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition shadow-sm flex items-center gap-2">
                            <LayoutTemplate className="w-4 h-4" /> Browse Templates
                        </Link>
                        <Link href="/editor" className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 flex items-center gap-2">
                            <Plus className="w-4 h-4" /> Create New
                        </Link>
                    </div>
                </div>

                {/* Recent Documents */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            Recent Documents
                        </h2>
                    </div>
                    <RecentLetters />
                </section>

            </main>
        </div>
    );
}
