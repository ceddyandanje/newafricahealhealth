

"use client"

import Link from "next/link"
import { Menu, ShoppingCart, User, LogIn, ShieldCheck, LogOut } from "lucide-react"

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
  const { user, isAdmin } = useAuth()
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
                         <>
                            <DropdownMenuItem asChild>
                                <Link href="/admin">Admin Dashboard</Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                         </>
                    )}
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
                    <Link href="/login">Login</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/login?tab=signup">Sign up</Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
  }

  const MobileAuthButton = () => {
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
             <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
            </Button>
             <Button variant="ghost" asChild>
                <Link href="/login?tab=signup">Sign up</Link>
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
        

        {/* Mobile Nav */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-white dark:bg-gray-900">
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
                 <div className="flex items-center pt-4 border-t">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href="/cart" aria-label="Open cart" className="relative">
                        <ShoppingCart className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                        {totalItems > 0 && (
                          <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 justify-center rounded-full p-0">{totalItems}</Badge>
                        )}
                      </Link>
                    </Button>
                    <ThemeToggleButton />
                 </div>
                 <MobileAuthButton />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-6 text-sm font-medium">
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
              {isAdmin && (
                  <Link href="/admin" className="text-primary hover:text-primary/90 transition-colors flex items-center gap-2"><ShieldCheck />Admin</Link>
              )}
            </nav>
          
            <div className="flex items-center justify-end space-x-2">
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
            </div>
        </div>
      </div>
    </header>
  )
}
