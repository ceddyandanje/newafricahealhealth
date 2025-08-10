
'use client';

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Input } from "@/components/ui/input";
import { Home, Hospital, Menu, Search, Truck, Users, Calendar, HeartPulse, Shield, FileText, ShoppingBag, Settings2, LogOut, Package, PenSquare, Database } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Notifications from "@/components/admin/notifications";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const sidebarNavItems = [
    { href: "/admin", icon: Home, label: "Dashboard" },
    { href: "/admin/appointments", icon: Calendar, label: "Appointments" },
    { href: "/admin/products", icon: Package, label: "Products" },
    { href: "/admin/patients", icon: Users, label: "Patients" },
    { href: "/admin/doctors", icon: HeartPulse, label: "Doctors" },
    { href: "/admin/users", icon: Shield, label: "Users" },
    { href: "/admin/services", icon: ShoppingBag, label: "Services" },
    { href: "/admin/blog", icon: PenSquare, label: "Blog" },
    { href: "/admin/logs", icon: FileText, label: "Logs" },
    { href: "/admin/firestore-test", icon: Database, label: "Firestore Test" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const { user, isAdmin, isLoading, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isLoading && !isAdmin) {
          router.push("/login");
        }
    }, [user, isAdmin, isLoading, router]);

    if (isLoading || !isAdmin) {
        return (
          <div className="flex h-screen w-full items-center justify-center bg-background">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
          </div>
        );
    }

  return (
    <div className="min-h-screen bg-background text-foreground flex">
        {/* Sidebar */}
        <aside className={cn(
            "bg-muted/40 text-foreground flex flex-col transition-all duration-300 ease-in-out border-r",
            isSidebarOpen ? "w-64" : "w-20"
        )}>
            <div className={cn("p-4 flex items-center gap-2 border-b h-[65px]", !isSidebarOpen && "justify-center")}>
                <HeartPulse className="h-8 w-8 text-primary flex-shrink-0" />
                <h1 className={cn("text-xl font-bold transition-opacity whitespace-nowrap", !isSidebarOpen && "opacity-0 w-0 h-0")}>Africa Heal</h1>
            </div>
            
            <nav className="flex-grow p-2 space-y-1">
                <p className={cn("px-4 py-2 text-xs font-semibold text-muted-foreground uppercase transition-all", !isSidebarOpen && "text-center")}>Menu</p>
                {sidebarNavItems.map(item => (
                    <Link key={item.label} href={item.href} className={cn(
                        "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-sm",
                        pathname === item.href ? 'bg-primary/20 text-primary font-semibold' : 'hover:bg-accent',
                        !isSidebarOpen && "justify-center"
                        )}>
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        <span className={cn("transition-opacity", isSidebarOpen ? 'block' : 'hidden')}>{item.label}</span>
                    </Link>
                ))}
            </nav>
            <div className="p-2 border-t">
                 <Link href="/admin/settings" className={cn(
                        "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-sm hover:bg-accent",
                        pathname === '/admin/settings' ? 'bg-primary/20 text-primary font-semibold' : 'hover:bg-accent',
                        !isSidebarOpen && "justify-center"
                        )}>
                    <Settings2 className="h-5 w-5 flex-shrink-0" />
                    <span className={cn(isSidebarOpen ? 'block' : 'hidden')}>Settings</span>
                </Link>
                <button onClick={logout} className={cn(
                        "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors w-full text-left text-sm hover:bg-accent",
                        !isSidebarOpen && "justify-center"
                        )}>
                    <LogOut className="h-5 w-5 flex-shrink-0" />
                    <span className={cn(isSidebarOpen ? 'block' : 'hidden')}>Logout</span>
                </button>
            </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
            {/* Header */}
            <header className="bg-background border-b flex items-center justify-between p-4 shadow-sm h-[65px]">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="p-2 rounded-md hover:bg-accent" onClick={() => setIsSidebarOpen(!isSidebarOpen)}><Menu /></Button>
                    <div className="relative hidden md:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"/>
                        <Input placeholder="Search..." className="bg-muted pl-10 w-64"/>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                   <div className="flex items-center gap-3">
                        {user && (
                            <>
                                <Avatar>
                                    <AvatarImage src={user.avatarUrl || `https://i.pravatar.cc/150?u=${user.email}`} alt={user.name} />
                                    <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="hidden md:block">
                                    <p className="font-semibold text-sm">{user.name}</p>
                                    <p className="text-xs text-muted-foreground">{user.role}</p>
                                </div>
                            </>
                        )}
                   </div>
                    <Notifications />
                </div>
            </header>

            {/* Page Content */}
            <main className="flex-grow bg-muted/40">
                {children}
            </main>
        </div>
    </div>
  )
}
