

'use client';

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Input } from "@/components/ui/input";
import { Home, Hospital, Menu, Search, Truck, Users, Calendar, HeartPulse, Shield, FileText, ShoppingBag, Settings2, LogOut, Package, PenSquare, Database, ListChecks, ListOrdered } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Notifications from "@/components/admin/notifications";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const sidebarNavItems = [
    { href: "/admin", icon: Home, label: "Dashboard" },
    { href: "/admin/roadmap", icon: ListChecks, label: "Roadmap" },
    { href: "/admin/appointments", icon: Calendar, label: "Appointments" },
    { href: "/admin/orders", icon: ListOrdered, label: "Orders" },
    { href: "/admin/products", icon: Package, label: "Products" },
    { href: "/admin/patients", icon: Users, label: "Patients" },
    { href: "/admin/doctors", icon: HeartPulse, label: "Doctors" },
    { href: "/admin/users", icon: Shield, label: "Users" },
    { href: "/admin/services", icon: ShoppingBag, label: "Services" },
    { href: "/admin/blog", icon: PenSquare, label: "Blog" },
    { href: "/admin/logs", icon: FileText, label: "Logs" },
    { href: "/admin/firestore-test", icon: Database, label: "Firestore Test" },
];


export default function AdminSidebar() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const { logout } = useAuth();
    const pathname = usePathname();

  return (
        <aside className={cn(
            "bg-muted/40 text-foreground flex-col transition-all duration-300 ease-in-out border-r flex sticky top-16 h-[calc(100vh-4rem)]",
            isSidebarOpen ? "w-64" : "w-20"
        )}>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="absolute -right-3 top-8 bg-primary text-primary-foreground rounded-full p-1 z-10 hidden lg:block">
                <Menu className="h-4 w-4" />
            </button>
            
            <nav className="flex-grow p-2 space-y-1 mt-4 overflow-y-auto">
                <p className={cn("px-4 py-2 text-xs font-semibold text-muted-foreground uppercase transition-all", !isSidebarOpen && "text-center")}>Menu</p>
                {sidebarNavItems.map(item => (
                    <Link key={item.label} href={item.href} title={item.label} className={cn(
                        "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-sm",
                        pathname === item.href ? 'bg-primary/20 text-primary font-semibold' : 'hover:bg-accent',
                        !isSidebarOpen && "justify-center"
                        )}>
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        <span className={cn("transition-opacity", isSidebarOpen ? 'block' : 'hidden')}>{item.label}</span>
                    </Link>
                ))}
            </nav>
            <div className="p-2 border-t flex-shrink-0">
                 <Link href="/admin/settings" title="Settings" className={cn(
                        "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-sm hover:bg-accent",
                        pathname === '/admin/settings' ? 'bg-primary/20 text-primary font-semibold' : 'hover:bg-accent',
                        !isSidebarOpen && "justify-center"
                        )}>
                    <Settings2 className="h-5 w-5 flex-shrink-0" />
                    <span className={cn(isSidebarOpen ? 'block' : 'hidden')}>Settings</span>
                </Link>
                <button onClick={logout} title="Logout" className={cn(
                        "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors w-full text-left text-sm hover:bg-accent",
                        !isSidebarOpen && "justify-center"
                        )}>
                    <LogOut className="h-5 w-5 flex-shrink-0" />
                    <span className={cn(isSidebarOpen ? 'block' : 'hidden')}>Logout</span>
                </button>
            </div>
        </aside>
  )
}
