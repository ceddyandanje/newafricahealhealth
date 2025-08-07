
'use client';

import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ShoppingCart, User, LogIn, LogOut, LayoutDashboard, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useCart } from '@/hooks/use-cart';
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

export default function ClientHeaderItems({ isMobile = false }: { isMobile?: boolean }) {
  const [isMounted, setIsMounted] = useState(false);
  const { items } = useCart();
  const { user, appUser, isAdmin, loading } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = async () => {
    try {
        await signOut(auth);
        toast({ title: "Logged Out", description: "You have been successfully logged out." });
    } catch (error) {
        toast({ variant: "destructive", title: "Logout Failed", description: "Could not log you out. Please try again." });
    }
  };

  if (!isMounted) {
    // Render placeholders on the server to prevent layout shift
    return (
        <div className="flex items-center space-x-2">
            <div className="h-10 w-10" />
            <div className="h-10 w-10" />
        </div>
    );
  }

  // Mobile view rendering
  if (isMobile) {
    if (loading) return null;
    if (user) {
      return (
        <div className="flex flex-col space-y-2 pt-2 border-t">
          <Button asChild variant="ghost" className="w-full justify-start">
            <Link href={isAdmin ? "/admin" : "/profile"}><LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard</Link>
          </Button>
          <Button asChild variant="ghost" className="w-full justify-start">
              <Link href="/profile"><User className="mr-2 h-4 w-4" /> User Profile</Link>
          </Button>
           <Button asChild variant="ghost" className="w-full justify-start">
                <Link href="/profile"><Settings className="mr-2 h-4 w-4" /> Settings</Link>
            </Button>
          <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
          </Button>
        </div>
      )
    }
    return (
      <div className="flex flex-col space-y-2 pt-2 border-t">
           <Button asChild className="w-full justify-start">
              <Link href="/login">
                   <LogIn className="mr-2 h-4 w-4" /> Login
              </Link>
          </Button>
           <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/login?tab=signup">
                  <User className="mr-2 h-4 w-4" /> Sign up
              </Link>
          </Button>
      </div>
    )
  }

  // Desktop view rendering
  return (
    <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" asChild>
            <Link href="/cart" aria-label="Open cart" className="relative">
            <ShoppingCart className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            {totalItems > 0 && (
                <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 justify-center rounded-full p-0">{totalItems}</Badge>
            )}
            </Link>
        </Button>

        {loading ? <div className="h-10 w-10" /> : (
            user && appUser ? (
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                            <Avatar className="h-10 w-10">
                                <AvatarFallback>{appUser.firstName?.[0]}{appUser.lastName?.[0]}</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                          <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">My Account</p>
                            <p className="text-xs leading-none text-muted-foreground">
                              {appUser.email}
                            </p>
                          </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                         <DropdownMenuItem asChild>
                            <Link href={isAdmin ? "/admin" : "/profile"}>
                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                <span>Dashboard</span>
                            </Link>
                         </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/profile">
                                <User className="mr-2 h-4 w-4" />
                                <span>User Profile</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/profile">
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Settings</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                             <User className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem asChild>
                            <Link href="/login">
                                <LogIn className="mr-2 h-4 w-4" />
                                <span>Login</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/login?tab=signup">
                                <User className="mr-2 h-4 w-4" />
                                <span>Sign up</span>
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        )}
    </div>
  );
}
