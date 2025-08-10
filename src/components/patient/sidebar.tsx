
'use client';

import Link from 'next/link';
import { 
    LayoutGrid, Calendar, Mail, FileText, Pill, Phone, Settings, Search, CheckCircle, Video, Users, MapPin, ChevronDown, LifeBuoy 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { useSidebar } from '@/hooks/use-sidebar';
import { Input } from '../ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';


const mainNavItems = [
    { href: '/patient/appointments', icon: Calendar, label: 'Visits' },
    { href: '/patient/messages', icon: Mail, label: 'Messages' },
    { href: '/patient/documents', icon: FileText, label: 'Test Result' },
    { href: '/patient/prescriptions', icon: Pill, label: 'Medications' },
]

const findCareItems = [
    { href: '#', icon: CheckCircle, label: 'Symptom Checker' },
    { href: '/patient/contact', icon: Phone, label: 'Talk to a Doctor' },
    { href: '/patient/appointments', icon: Calendar, label: 'Schedule an Appointment' },
    { href: '#', icon: Video, label: 'E-Visit' },
    { href: '#', icon: Users, label: 'View Care Team' },
    { href: '#', icon: Search, label: 'Search for Provider' },
    { href: '#', icon: MapPin, label: 'Find Urgent Care' },
];

const secondaryNavItems = [
    { href: '/patient/messages', icon: Mail, label: 'Communications' },
    { href: '/patient/documents', icon: FileText, label: 'My Record' },
    { href: '/patient/settings', icon: Settings, label: 'Settings' },
];

export default function PatientSidebar() {
    const { isExpanded, setIsExpanded } = useSidebar();
    const pathname = usePathname();

    const handleMouseEnter = () => {
        setIsExpanded(true);
    };

    const handleMouseLeave = () => {
        setIsExpanded(false);
    };

    return (
        <aside
            className={cn(
                'fixed left-4 top-20 bottom-4 z-50 flex flex-col items-start transition-all duration-300',
                'bg-background/20 dark:bg-black/20 backdrop-blur-lg border border-white/30 dark:border-white/10 rounded-2xl shadow-lg',
                isExpanded ? 'w-72 p-4' : 'w-14 p-2 items-center',
            )}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {isExpanded ? (
                // Expanded View
                <div className="w-full flex flex-col h-full overflow-y-auto">
                    <div className="grid grid-cols-2 gap-2 mb-4">
                        {mainNavItems.map(item => (
                             <Link
                                key={item.label}
                                href={item.href}
                                className={cn(
                                    'p-2 flex flex-col items-center justify-center rounded-lg transition-colors',
                                    pathname.startsWith(item.href) ? 'bg-primary/80 text-primary-foreground' : 'bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10'
                                )}
                            >
                                <item.icon className="h-6 w-6 mb-1" />
                                <span className="text-xs font-semibold">{item.label}</span>
                            </Link>
                        ))}
                    </div>
                    
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search the menu" className="pl-9 h-9" />
                    </div>

                    <div className="flex-grow">
                        <Collapsible defaultOpen>
                            <CollapsibleTrigger className="w-full text-left font-semibold text-sm flex items-center gap-2 mb-2 text-primary">
                                 <div className="w-1 h-4 bg-primary rounded-full" />
                                Find Care
                            </CollapsibleTrigger>
                            <CollapsibleContent className="space-y-1 pl-1">
                                {findCareItems.map(item => (
                                    <Link key={item.label} href={item.href} className="flex items-center gap-3 p-2 rounded-md hover:bg-black/5 dark:hover:bg-white/10 text-sm">
                                        <item.icon className="h-5 w-5 text-muted-foreground" />
                                        <span>{item.label}</span>
                                    </Link>
                                ))}
                            </CollapsibleContent>
                        </Collapsible>
                        
                        {secondaryNavItems.map(item => (
                             <Collapsible key={item.label}>
                                <CollapsibleTrigger className="w-full text-left font-semibold text-sm flex items-center gap-2 my-3 group">
                                    <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                                    {item.label}
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <Link href={item.href} className="block p-2 rounded-md hover:bg-black/5 dark:hover:bg-white/10 text-sm">
                                        View {item.label}
                                    </Link>
                                </CollapsibleContent>
                            </Collapsible>
                        ))}
                    </div>
                </div>
            ) : (
                // Collapsed View
                <div className="flex flex-col gap-2">
                    {mainNavItems.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            title={item.label}
                            className={cn(
                                'h-10 w-10 flex items-center justify-center rounded-lg transition-colors',
                                'hover:bg-black/10 dark:hover:bg-white/10',
                                pathname.startsWith(item.href) && 'bg-black/10 dark:bg-white/20'
                            )}
                        >
                            <item.icon className="h-5 w-5" />
                        </Link>
                    ))}
                    <div className="my-1 h-px w-full bg-border" />
                    {findCareItems.slice(0, 1).map((item) => (
                         <Link key={item.label} href={item.href} title={item.label} className={cn( 'h-10 w-10 flex items-center justify-center rounded-lg transition-colors', 'hover:bg-black/10 dark:hover:bg-white/10' )}>
                            <LifeBuoy className="h-5 w-5" />
                        </Link>
                    ))}
                     <Link href={'/patient/settings'} title="Settings" className={cn( 'h-10 w-10 flex items-center justify-center rounded-lg transition-colors', 'hover:bg-black/10 dark:hover:bg-white/10', pathname.startsWith('/patient/settings') && 'bg-black/10 dark:bg-white/20' )}>
                        <Settings className="h-5 w-5" />
                    </Link>
                </div>
            )}
        </aside>
    );
}
