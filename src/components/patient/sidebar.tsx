
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LayoutGrid, Calendar, Mail, FileText, Pill, Phone, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const navItems = [
    { href: '/patient/dashboard', icon: LayoutGrid, label: 'Dashboard' },
    { href: '#', icon: Calendar, label: 'Appointments' },
    { href: '#', icon: Mail, label: 'Messages' },
    { href: '#', icon: FileText, label: 'Documents' },
    { href: '#', icon: Pill, label: 'Prescriptions' },
    { href: '#', icon: Phone, label: 'Contact' },
    { href: '#', icon: Settings, label: 'Settings' },
];

export default function PatientSidebar() {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <TooltipProvider>
            <aside
                className={cn(
                    'fixed left-4 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-1 py-3 px-1.5 rounded-full transition-all duration-300',
                    'bg-green-100/30 dark:bg-green-900/40 backdrop-blur-md border border-white/30 dark:border-white/10'
                )}
            >
                {navItems.map((item, index) => (
                    <Tooltip key={item.label}>
                        <TooltipTrigger asChild>
                            <Link
                                href={item.href}
                                onClick={index === 0 ? () => setIsExpanded(!isExpanded) : undefined}
                                className={cn(
                                    'h-10 w-10 flex items-center justify-center rounded-full transition-colors',
                                    'hover:bg-black/10 dark:hover:bg-white/10',
                                    index === 0 && 'bg-black/10 dark:bg-white/20'
                                )}
                            >
                                <item.icon className="h-5 w-5" />
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                            <p>{item.label}</p>
                        </TooltipContent>
                    </Tooltip>
                ))}
            </aside>
        </TooltipProvider>
    );
}
