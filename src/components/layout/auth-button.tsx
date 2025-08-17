
"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, LogOut, LayoutDashboard, ListOrdered, Repeat, Heart, Stethoscope } from "lucide-react";

export default function AuthButton() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <Button asChild>
        <Link href="/login">Login / Sign Up</Link>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatarUrl || ''} alt={user.name} />
            <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuItem disabled>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        
        {user.role === 'user' && (
            <DropdownMenuItem asChild>
            <Link href="/patient/dashboard">
                <Heart className="mr-2 h-4 w-4" />
                <span>Patient Dashboard</span>
            </Link>
            </DropdownMenuItem>
        )}

        {user.role === 'doctor' && (
            <DropdownMenuItem asChild>
                <Link href="/doctor/dashboard">
                    <Stethoscope className="mr-2 h-4 w-4" />
                    <span>Doctor Dashboard</span>
                </Link>
            </DropdownMenuItem>
        )}

        {user.role === 'admin' && (
            <DropdownMenuItem asChild>
                <Link href="/admin">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Admin Dashboard</span>
                </Link>
            </DropdownMenuItem>
        )}

        <DropdownMenuItem asChild>
          <Link href="/patient/settings">
            <User className="mr-2 h-4 w-4" />
            <span>Profile & Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/my-orders">
            <ListOrdered className="mr-2 h-4 w-4" />
            <span>My Orders</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/my-subscriptions">
            <Repeat className="mr-2 h-4 w-4" />
            <span>My Subscriptions</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
