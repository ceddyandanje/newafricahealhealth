
'use client';

import { useState, useRef, useEffect, RefObject } from 'react';
import Link from 'next/link';
import { LayoutGrid, Calendar, Mail, FileText, Pill, Phone, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

const navItems = [
    { href: '/patient/dashboard', icon: LayoutGrid, label: 'Dashboard' },
    { href: '/patient/appointments', icon: Calendar, label: 'Appointments' },
    { href: '/patient/messages', label: 'Messages', icon: Mail },
    { href: '/patient/documents', icon: FileText, label: 'Documents' },
    { href: '/patient/prescriptions', icon: Pill, label: 'Prescriptions' },
    { href: '/patient/contact', icon: Phone, label: 'Contact' },
    { href: '/patient/settings', icon: Settings, label: 'Settings' },
];

interface PatientSidebarProps {
  mainContentRef: RefObject<HTMLDivElement>;
}

export default function PatientSidebar({ mainContentRef }: PatientSidebarProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isFixed, setIsFixed] = useState(true);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const sidebarRef = useRef<HTMLElement>(null);
    const pathname = usePathname();

    const handleMouseEnter = () => {
        timerRef.current = setTimeout(() => {
            setIsExpanded(true);
        }, 800);
    };

    const handleMouseLeave = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        setIsExpanded(false);
    };

    useEffect(() => {
        const handleScroll = () => {
            if (!sidebarRef.current || !mainContentRef.current) return;

            const scrollY = window.scrollY;
            const headerHeight = 64; 
            const mainTop = mainContentRef.current.offsetTop;
            const mainHeight = mainContentRef.current.offsetHeight;
            const mainBottom = mainTop + mainHeight;
            const sidebarHeight = sidebarRef.current.offsetHeight;
            const viewportHeight = window.innerHeight;

            const isBelowHeader = scrollY > headerHeight;
            const isSidebarWithinViewport = scrollY + viewportHeight < mainBottom + sidebarHeight;
            
            if (isBelowHeader && isSidebarWithinViewport) {
                setIsFixed(true);
            } else {
                setIsFixed(false);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial check

        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [mainContentRef]);

    return (
        <aside
            ref={sidebarRef}
            className={cn(
                'left-4 z-50 flex flex-col items-start gap-1 p-2 transition-all duration-300',
                'bg-green-100/30 dark:bg-green-900/40 backdrop-blur-md border border-white/30 dark:border-white/10 rounded-2xl',
                isExpanded ? 'w-48' : 'w-14 items-center',
                isFixed ? 'fixed top-1/2 -translate-y-1/2' : 'absolute'
            )}
            style={isFixed ? {} : { 
                top: mainContentRef.current ? mainContentRef.current.offsetTop + 16 : 16,
                bottom: 'auto'
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {navItems.map((item) => (
                <Link
                    key={item.label}
                    href={item.href}
                    className={cn(
                        'h-10 flex items-center justify-start rounded-lg transition-colors w-full',
                        'hover:bg-black/10 dark:hover:bg-white/10',
                        pathname === item.href && 'bg-black/10 dark:bg-white/20'
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
