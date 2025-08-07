

"use client"

import Link from "next/link"
import { Menu, ShoppingCart, User, LogIn } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"
import { Badge } from "@/components/ui/badge"
import ClientHeaderItems from "./client-header-items"
import ThemeToggleButton from "./theme-toggle-button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const navLinks = [
  { href: "/products", label: "Products" },
  { href: "/services", label: "Services" },
]

export default function Header() {
  const { items } = useCart()
  const { user } = useAuth()
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  
  const AuthButton = () => {
    if (user) {
        return (
            <Button variant="ghost" size="icon" asChild>
                <Link href="/profile">
                    <User className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </Link>
            </Button>
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
             <Button variant="ghost" size="icon" asChild>
                <Link href="/profile">
                    <User className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </Link>
            </Button>
        )
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
                 <div className="flex items-center pt-4 border-t">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href="/cart" aria-label="Open cart" className="relative">
                        <ShoppingCart className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                        {totalItems > 0 && (
                          <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 justify-center rounded-full p-0">{totalItems}</Badge>
                        )}
                      </Link>
                    </Button>
                    <MobileAuthButton />
                    <ThemeToggleButton />
                 </div>
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
