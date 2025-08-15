
'use client';

import Link from 'next/link';
import { 
    LayoutDashboard, Calendar, Users, MessageSquare, Pill, Settings, LogOut, HeartPulse 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';


const navItems = [
    { href: '/doctor/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/doctor/appointments', icon: Calendar, label: 'Appointments' },
    { href: '/doctor/patients', icon: Users, label: 'My Patients' },
    { href: '/doctor/messages', icon: MessageSquare, label: 'Messages' },
    { href: '/doctor/prescriptions', icon: Pill, label: 'Prescriptions' },
];

export default function DoctorSidebar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    return (
        <aside className="fixed left-0 top-0 h-full w-20 flex flex-col items-center py-4 bg-background border-r z-50">
            <Link href="/doctor/dashboard" className="mb-6">
                 <HeartPulse className="h-8 w-8 text-primary" />
            </Link>
            <TooltipProvider delayDuration={0}>
                <nav className="flex flex-col items-center gap-2 flex-grow">
                    {navItems.map(item => (
                        <Tooltip key={item.label}>
                            <TooltipTrigger asChild>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        'h-12 w-12 flex items-center justify-center rounded-lg transition-colors text-muted-foreground hover:bg-accent hover:text-foreground',
                                        pathname === item.href && 'bg-primary/20 text-primary'
                                    )}
                                >
                                    <item.icon className="h-6 w-6" />
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                                <p>{item.label}</p>
                            </TooltipContent>
                        </Tooltip>
                    ))}
                </nav>
                <div className="flex flex-col items-center gap-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                           <Link href="/doctor/settings">
                                <Button variant="ghost" size="icon" className="h-12 w-12 rounded-lg">
                                    <Settings className="h-6 w-6 text-muted-foreground" />
                                </Button>
                           </Link>
                        </TooltipTrigger>
                         <TooltipContent side="right"><p>Settings</p></TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                             <Button onClick={logout} variant="ghost" size="icon" className="h-12 w-12 rounded-lg">
                                <LogOut className="h-6 w-6 text-muted-foreground" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right"><p>Logout</p></TooltipContent>
                    </Tooltip>
                    <Avatar className="mt-2">
                        <AvatarImage src={user?.avatarUrl || ''} alt={user?.name} />
                        <AvatarFallback>{user?.name?.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                </div>
            </TooltipProvider>
        </aside>
    );
}
