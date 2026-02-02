import React from 'react';
import { PenTool, Layout, Download, Palette, Zap, Globe } from 'lucide-react';

const features = [
    {
        icon: <PenTool className="w-6 h-6 text-brand-500" />,
        title: 'AI Composition',
        description: 'Struggling with words? Let our AI write professional letter content for you in seconds.',
    },
    {
        icon: <Layout className="w-6 h-6 text-purple-500" />,
        title: 'Premium Templates',
        description: 'Select from a curated collection of templates designed for business, legal, and creative use.',
    },
    {
        icon: <Download className="w-6 h-6 text-green-500" />,
        title: 'Instant Export',
        description: 'Download your finished letterhead as a high-quality PDF, Word document, or Image instantly.',
    },
    {
        icon: <Palette className="w-6 h-6 text-orange-500" />,
        title: 'Brand Customization',
        description: 'Upload your logo, set your colors, and save your brand profile for consistent headers.',
    },
    {
        icon: <Zap className="w-6 h-6 text-yellow-500" />,
        title: 'Smart Formatting',
        description: 'Automatic margin handling and layout adjustments ensure your letter always looks perfect.',
    },
    {
        icon: <Globe className="w-6 h-6 text-blue-500" />,
        title: 'Cloud Storage',
        description: 'Save your designs to the cloud and access them from any device, anywhere.',
    }
];

export function Features() {
    return (
        <section id="features" className="py-24 bg-slate-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                        Everything You Need <br /> to Write Professional Letters
                    </h2>
                    <p className="mt-4 text-lg text-slate-600">
                        Forget struggling with Word formatting. LetAHeader combines powerful design tools with smart AI assistance.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300"
                        >
                            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-6">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900 mb-3">{feature.title}</h3>
                            <p className="text-slate-600 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
