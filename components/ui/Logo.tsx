import React from 'react';
import { FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoProps {
    className?: string;
    variant?: 'default' | 'light';
}

export function Logo({ className, variant = 'default' }: LogoProps) {
    const isLight = variant === 'light';

    return (
        <div className={cn("flex items-center gap-2", className)}>
            <div className={cn(
                "flex items-center justify-center w-8 h-8 rounded-lg",
                isLight ? "bg-white/10 text-white" : "bg-brand-100 text-brand-600"
            )}>
                <FileText className="w-5 h-5 fill-current" />
            </div>
            <span className={cn(
                "text-2xl font-bold tracking-tight",
                isLight ? "text-white" : "text-slate-900"
            )}>
                Let<span className={isLight ? "text-blue-200" : "text-brand-500"}>A</span>Header
            </span>
        </div>
    );
}
