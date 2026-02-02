'use client';

// We want the Landing Page to be Server Rendered (SEO).
// AppWrapper contains the Landing Page, so we must allow it to be SSR'd.
// If AppWrapper contains browser-only code that crashes on server (like 'window is not defined'), 
// we handle that inside AppWrapper or its sub-components, NOT by disabling SSR for the whole page.

import { Navbar } from '@/components/layout/Navbar';
import { Hero } from '@/components/layout/Hero';
import { Features } from '@/components/layout/Features';
import { TemplatesGallery } from '@/components/layout/TemplatesGallery';
import { HowItWorks } from '@/components/layout/HowItWorks';
import { Footer } from '@/components/layout/Footer';

export function HomeClient() {
    return (
        <main className="min-h-screen bg-white">
            <Navbar />
            <Hero />
            <Features />
            <TemplatesGallery />
            <HowItWorks />
            <Footer />
        </main>
    );
}
