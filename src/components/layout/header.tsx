
"use client"

import Link from "next/link"
import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import ClientHeaderItems from "./client-header-items"
import ThemeToggleButton from "./theme-toggle-button"

const navLinks = [
  { href: "/products", label: "Products" },
  { href: "/services", label: "Services" },
  { href: "/chronic-care", label: "Chronic Care" },
  { href: "/wellness-blog", label: "Wellness Blog" },
]

export default function Header() {
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
        
        <div className="flex items-center space-x-2 ml-auto">
            <ThemeToggleButton />
            <ClientHeaderItems />
        </div>
            
        {/* Mobile Nav Trigger */}
        <div className="md:hidden flex items-center">
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
                    <div className="mt-auto">
                        <ClientHeaderItems isMobile={true}/>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
      </div>
    </header>
  )
}
