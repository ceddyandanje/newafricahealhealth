
'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { LayoutGrid, Calendar, Mail, FileText, Pill, Phone, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

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
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const handleMouseEnter = () => {
        timerRef.current = setTimeout(() => {
            setIsExpanded(true);
        }, 1500);
    };

    const handleMouseLeave = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        setIsExpanded(false);
    };

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    return (
        <aside
            className={cn(
                'fixed left-4 top-1/2 -translate-y-1/2 z-50 flex flex-col items-start gap-1 p-2 transition-all duration-300',
                'bg-green-100/30 dark:bg-green-900/40 backdrop-blur-md border border-white/30 dark:border-white/10 rounded-2xl',
                isExpanded ? 'w-48' : 'w-14 items-center'
            )}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {navItems.map((item, index) => (
                <Link
                    key={item.label}
                    href={item.href}
                    className={cn(
                        'h-10 flex items-center justify-start rounded-lg transition-colors w-full',
                        'hover:bg-black/10 dark:hover:bg-white/10',
                        index === 0 && 'bg-black/10 dark:bg-white/20'
                    )}
                >
                    <div className="h-10 w-10 flex-shrink-0 flex items-center justify-center">
                      <item.icon className="h-5 w-5" />
                    </div>
                    {isExpanded && <span className="ml-2 text-sm font-medium whitespace-nowrap">{item.label}</span>}
                </Link>
            ))}
        </aside>
    );
}
