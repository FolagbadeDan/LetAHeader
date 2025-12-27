'use client';

import dynamic from 'next/dynamic';

const App = dynamic(() => import('../../components/layout/AppWrapper'), {
    ssr: false,
    loading: () => (
        <div className="h-screen w-full flex items-center justify-center bg-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
        </div>
    )
});

export default function EditorPage() {
    return <App startMode={true} />;
}
