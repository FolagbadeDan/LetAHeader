'use client';

// We want the Landing Page to be Server Rendered (SEO).
// AppWrapper contains the Landing Page, so we must allow it to be SSR'd.
// If AppWrapper contains browser-only code that crashes on server (like 'window is not defined'), 
// we handle that inside AppWrapper or its sub-components, NOT by disabling SSR for the whole page.

import AppWrapper from '../components/layout/AppWrapper';

export function HomeClient() {
    return <AppWrapper />;
}
