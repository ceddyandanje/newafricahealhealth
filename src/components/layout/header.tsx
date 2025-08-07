
"use client"

import Link from "next/link"
import { Menu, ShoppingCart, User, LogOut, LayoutDashboard, UserCircle, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import ThemeToggleButton from "./theme-toggle-button"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"
import { Badge } from "../ui/badge"
import { useEffect, useState } from "react"
import { Skeleton } from "../ui/skeleton"

const navLinks = [
  { href: "/products", label: "Products" },
  { href: "/services", label: "Services" },
  { href: "/chronic-care", label: "Chronic Care" },
  { href: "/wellness-blog", label: "Wellness Blog" },
]

function AuthButton() {
    const { user, isAdmin, logout, isLoading } = useAuth();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted || isLoading) {
        return <Skeleton className="h-10 w-10 rounded-full" />;
    }

    if (!user) {
        return (
             <Button asChild>
                <Link href="/login">Login / Sign Up</Link>
            </Button>
        )
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                         <AvatarImage src={`https://i.pravatar.cc/150?u=${user.email}`} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                    <p className="font-bold">{user.name}</p>
                    <p className="text-xs text-muted-foreground font-normal">{user.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isAdmin ? (
                    <DropdownMenuItem asChild>
                        <Link href="/admin"><LayoutDashboard className="mr-2 h-4 w-4" />Admin Dashboard</Link>
                    </DropdownMenuItem>
                ) : (
                    <DropdownMenuItem asChild>
                        <Link href="/profile"><LayoutDashboard className="mr-2 h-4 w-4" />Dashboard</Link>
                    </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                    <Link href="/profile"><UserCircle className="mr-2 h-4 w-4" />Profile Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/my-orders"><ShoppingCart className="mr-2 h-4 w-4" />My Orders</Link>
                </DropdownMenuItem>
                 <DropdownMenuItem asChild>
                    <Link href="/my-subscriptions"><Settings className="mr-2 h-4 w-4" />My Subscriptions</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default function Header() {
  const [isMounted, setIsMounted] = useState(false)
  const { items } = useCart()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200">AHH</AvatarFallback>
            </Avatar>
            <span className="font-bold sm:inline-block text-gray-800 dark:text-white">Africa Heal Health</span>
        </Link>
        
        <div className="ml-auto flex items-center space-x-2">
            <nav className="hidden md:flex items-center space-x-4">
                {navLinks.map((link) => (
                    <Link
                    key={link.href}
                    href={link.href}
                    className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors text-sm font-medium"
                    >
                    {link.label}
                    </Link>
                ))}
            </nav>
            <ThemeToggleButton />
            <Button variant="ghost" size="icon" asChild>
                <Link href="/cart" aria-label="Open cart" className="relative">
                <ShoppingCart className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                {isMounted && totalItems > 0 && (
                    <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 justify-center rounded-full p-0">{totalItems}</Badge>
                )}
                </Link>
            </Button>
            <AuthButton />
        </div>
            
        <div className="md:hidden flex items-center ml-2">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-background w-full max-w-xs flex flex-col">
                     <Link href="/" className="flex items-center space-x-2 mb-6">
                        <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200">AHH</AvatarFallback>
                        </Avatar>
                        <span className="font-bold text-gray-800 dark:text-white">Africa Heal Health</span>
                    </Link>
                    <nav className="flex flex-col space-y-4 flex-grow">
                    {navLinks.map((link) => (
                        <Link
                        key={link.href}
                        href={link.href}
                        className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
                        >
                        {link.label}
                        </Link>
                    ))}
                    </nav>
                </SheetContent>
            </Sheet>
        </div>
      </div>
    </header>
  )
}
