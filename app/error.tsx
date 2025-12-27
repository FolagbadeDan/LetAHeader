'use client'

import { useEffect } from 'react'
import { AlertCircle } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="flex h-screen flex-col items-center justify-center bg-slate-50 text-slate-800 p-6">
            <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full border border-slate-100">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Something went wrong!</h2>
                <p className="text-slate-500 mb-6">We apologize for the inconvenience. An unexpected error occurred.</p>
                <button
                    onClick={() => reset()}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all active:scale-95 w-full"
                >
                    Try again
                </button>
            </div>
        </div>
    )
}
