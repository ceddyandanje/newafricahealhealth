
"use client"

import Link from "next/link"
import { Menu, ShoppingCart, User, LogIn, ShieldCheck, LogOut, Settings } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"
import { Badge } from "@/components/ui/badge"
import ClientHeaderItems from "./client-header-items"
import ThemeToggleButton from "./theme-toggle-button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { auth } from "@/lib/firebase"
import { signOut } from "firebase/auth"
import { useToast } from "@/hooks/use-toast"

const navLinks = [
  { href: "/products", label: "Products" },
  { href: "/services", label: "Services" },
]

export default function Header() {
  const { items } = useCart()
  const { user, isAdmin, loading } = useAuth()
  const { toast } = useToast()
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  
  const handleLogout = async () => {
    try {
        await signOut(auth);
        toast({ title: "Logged Out", description: "You have been successfully logged out." });
    } catch (error) {
        toast({ variant: "destructive", title: "Logout Failed", description: "Could not log you out. Please try again." });
    }
  }

  const AuthButton = () => {
    if (loading) {
        return <Button variant="ghost" size="icon" disabled><User className="h-5 w-5" /></Button>
    }

    if (user) {
        return (
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <User className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    {isAdmin && (
                         <DropdownMenuItem asChild>
                            <Link href="/admin">
                                <ShieldCheck className="mr-2 h-4 w-4" />
                                <span>Admin Dashboard</span>
                            </Link>
                         </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                        <Link href="/profile">
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Profile Settings</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Logout</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }

    return (
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
  }

  const MobileAuthButton = () => {
     if (loading) return null;

    if (user) {
        return (
            <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
            </Button>
        );
    }
     return (
        <div className="flex flex-col space-y-2 pt-2 border-t">
             <Button asChild className="w-full justify-start">
                <Link href="/login">
                     <LogIn className="mr-2 h-4 w-4" /> Login
                </Link>
            </Button>
             <Button asChild className="w-full justify-start">
                <Link href="/login?tab=signup">
                    <User className="mr-2 h-4 w-4" /> Sign up
                </Link>
            </Button>
        </div>
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm">
      <div className="container flex h-16 items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 mr-auto">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200">AHH</AvatarFallback>
            </Avatar>
            <span className="font-bold sm:inline-block text-gray-800 dark:text-white">Africa Heal Health</span>
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center justify-end space-x-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <ClientHeaderItems />
          <Link href="/wellness-blog" className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">Wellness Blog</Link>
           <ThemeToggleButton />
          <Button variant="ghost" size="icon" asChild>
            <Link href="/cart" aria-label="Open cart" className="relative">
              <ShoppingCart className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              {totalItems > 0 && (
                <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 justify-center rounded-full p-0">{totalItems}</Badge>
              )}
            </Link>
          </Button>
          <AuthButton />
        </nav>
          
        <div className="flex items-center justify-end space-x-2 md:hidden">
            {/* Mobile Nav Trigger */}
            <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-white dark:bg-gray-900 w-full max-w-xs">
                <SheetHeader>
                <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                </SheetHeader>
                <Link href="/" className="flex items-center space-x-2 mb-6">
                    <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200">AHH</AvatarFallback>
                    </Avatar>
                    <span className="font-bold text-gray-800 dark:text-white">Africa Heal Health</span>
                </Link>
                <nav className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                    <Link
                    key={link.href}
                    href={link.href}
                    className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
                    >
                    {link.label}
                    </Link>
                ))}
                <ClientHeaderItems isMobile={true} />
                <Link href="/wellness-blog" className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white">Wellness Blog</Link>
                {isAdmin && (
                    <Link href="/admin" className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white flex items-center gap-2"><ShieldCheck />Admin</Link>
                )}
                <MobileAuthButton />
                </nav>
            </SheetContent>
            </Sheet>
            <ThemeToggleButton />
            <Button variant="ghost" size="icon" asChild>
                <Link href="/cart" aria-label="Open cart" className="relative">
                <ShoppingCart className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                {totalItems > 0 && (
                    <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 justify-center rounded-full p-0">{totalItems}</Badge>
                )}
                </Link>
            </Button>
        </div>
      </div>
    </header>
  )
}
