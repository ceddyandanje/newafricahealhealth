
"use client"

import Link from "next/link"
import { Menu, ShoppingCart, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import ThemeToggleButton from "./theme-toggle-button"
import { useCart } from "@/hooks/use-cart"
import { Badge } from "../ui/badge"
import { useEffect, useState } from "react"

const navLinks = [
  { href: "/products", label: "Products" },
  { href: "/services", label: "Services" },
  { href: "/chronic-care", label: "Chronic Care" },
  { href: "/wellness-blog", label: "Wellness Blog" },
]

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
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 mr-auto">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200">AHH</AvatarFallback>
            </Avatar>
            <span className="font-bold sm:inline-block text-gray-800 dark:text-white">Africa Heal Health</span>
        </Link>
        
        {/* Desktop Nav and actions */}
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
        
        <div className="flex items-center space-x-2 ml-4">
            <ThemeToggleButton />
            <Button variant="ghost" size="icon" asChild>
                <Link href="/cart" aria-label="Open cart" className="relative">
                <ShoppingCart className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                {isMounted && totalItems > 0 && (
                    <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 justify-center rounded-full p-0">{totalItems}</Badge>
                )}
                </Link>
            </Button>
             <Button variant="ghost" size="icon" asChild>
                <Link href="/login" aria-label="Login">
                    <User className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </Link>
            </Button>
        </div>
            
        {/* Mobile Nav Trigger */}
        <div className="md:hidden flex items-center ml-auto">
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
                    <div className="mt-auto border-t pt-4 flex justify-around">
                        <Button asChild variant="ghost"><Link href="/login">Login</Link></Button>
                        <Button asChild><Link href="/login?tab=signup">Sign Up</Link></Button>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
      </div>
    </header>
  )
}
