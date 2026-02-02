import React from 'react';
import Link from 'next/link';
import { Twitter, Github, Linkedin, Mail } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

export function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-300 py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

                    {/* Brand */}
                    <div className="space-y-4">
                        <Link href="/" className="inline-block hover:opacity-90 transition-opacity">
                            <Logo variant="light" />
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            The professional letterhead maker for businesses and freelancers.
                            Create, design, and share beautiful documents in minutes.
                        </p>
                        <div className="flex gap-4 pt-2">
                            <a href="#" className="text-slate-400 hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
                            <a href="#" className="text-slate-400 hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
                            <a href="#" className="text-slate-400 hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-6">Product</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/#features" className="hover:text-brand-400 transition-colors">Features</Link></li>
                            <li><Link href="/#templates" className="hover:text-brand-400 transition-colors">Templates</Link></li>
                            <li><Link href="/#pricing" className="hover:text-brand-400 transition-colors">Pricing</Link></li>
                            <li><Link href="#" className="hover:text-brand-400 transition-colors">Changelog</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-6">Company</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="#" className="hover:text-brand-400 transition-colors">About Us</Link></li>
                            <li><Link href="#" className="hover:text-brand-400 transition-colors">Careers</Link></li>
                            <li><Link href="#" className="hover:text-brand-400 transition-colors">Contact</Link></li>
                            <li><Link href="#" className="hover:text-brand-400 transition-colors">Blog</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-6">Legal</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="#" className="hover:text-brand-400 transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="hover:text-brand-400 transition-colors">Terms of Service</Link></li>
                            <li><Link href="#" className="hover:text-brand-400 transition-colors">Cookie Policy</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
                    <p>&copy; {new Date().getFullYear()} LetAHeader. All rights reserved.</p>
                    <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span>support@letaheader.com</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
