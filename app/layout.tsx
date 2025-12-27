import React from 'react';
import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/layout/Providers";

export const metadata: Metadata = {
  metadataBase: new URL('https://letaheader.com'),
  title: {
    default: "LetAHeader - Professional Letterhead Maker & Editor",
    template: "%s | LetAHeader"
  },
  description: "Create official, branded business letters in seconds. The AI-powered letterhead generator for professionals, freelancers, and businesses.",
  keywords: ["letterhead maker", "business letter generator", "pdf letterhead", "professional document editor", "letter writing ai"],
  authors: [{ name: "LetAHeader Team" }],
  creator: "LetAHeader",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://letaheader.com",
    title: "LetAHeader - Professional Letterhead Maker",
    description: "Generate perfectly branded PDF letters in seconds. No design skills required.",
    siteName: "LetAHeader",
    images: [
      {
        url: "/og-image.png", // We should ideally create this or use a placeholder
        width: 1200,
        height: 630,
        alt: "LetAHeader Dashboard Preview",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LetAHeader - Professional Letterhead Maker",
    description: "Create official business letters in seconds.",
    creator: "@letaheader",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-slate-50 text-slate-900 antialiased" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}