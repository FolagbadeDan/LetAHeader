import Link from 'next/link'
import { Search } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="flex h-screen flex-col items-center justify-center bg-slate-50 text-slate-800 p-6">
            <div className="text-center">
                <h1 className="text-9xl font-black text-slate-200 mb-4">404</h1>
                <h2 className="text-3xl font-bold mb-4 text-slate-900">Page Not Found</h2>
                <p className="text-slate-500 mb-8 max-w-md mx-auto">The page you are looking for doesn't exist or has been moved.</p>
                <Link href="/" className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-xl transition-all active:scale-95">
                    Return Home
                </Link>
            </div>
        </div>
    )
}
