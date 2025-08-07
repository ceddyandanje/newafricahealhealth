"use client"

import Link from "next/link"
import { Moon, ShoppingCart, Sun, Menu, ChevronDown, User, Plane, X } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const navLinks = [
  { href: "/products", label: "Products" },
  { href: "/emergency-services", label: "Emergency Services" },
]

const categories = ["Category 1", "Category 2", "Category 3"]

const services = [
  { href: "/chronic-care", label: "Chronic Care"},
  { href: "/emergency", label: "Emergency"},
  { href: "/wellness", label: "Wellness"},
]

export default function Header() {
  const { theme, setTheme } = useTheme()

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
                 <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white">
                      Services <ChevronDown className="h-4 w-4 ml-1" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {services.map((cat) => (
                        <DropdownMenuItem key={cat.href} asChild>
                          <Link href={cat.href}>{cat.label}</Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                 <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white">
                      Categories <ChevronDown className="h-4 w-4 ml-1" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {categories.map((cat) => (
                        <DropdownMenuItem key={cat} asChild>
                          <Link href={`/categories/${cat.toLowerCase().replace(" ", "-")}`}>{cat}</Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                <Link href="/wellness-blog" className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white">Wellness Blog</Link>
                 <div className="flex items-center pt-4 border-t">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href="/cart" aria-label="Open cart">
                        <ShoppingCart className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                      aria-label="Toggle theme"
                    >
                      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-gray-600" />
                      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-gray-300" />
                    </Button>
                     <Button variant="ghost" size="icon" asChild>
                        <Link href="/profile">
                            <User className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                        </Link>
                    </Button>
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
              <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">
                    Services <ChevronDown className="h-4 w-4 ml-1" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {services.map((cat) => (
                      <DropdownMenuItem key={cat.href} asChild>
                        <Link href={cat.href}>{cat.label}</Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">
                    Categories <ChevronDown className="h-4 w-4 ml-1" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {categories.map((cat) => (
                      <DropdownMenuItem key={cat} asChild>
                        <Link href={`/categories/${cat.toLowerCase().replace(" ", "-")}`}>{cat}</Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              <Link href="/wellness-blog" className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">Wellness Blog</Link>
            </nav>
          
            <div className="flex items-center justify-end space-x-2">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/cart" aria-label="Open cart">
                  <ShoppingCart className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                aria-label="Toggle theme"
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-gray-600" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-gray-300" />
              </Button>
               <Button variant="ghost" size="icon" asChild>
                  <Link href="/profile">
                      <User className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  </Link>
              </Button>
            </div>
        </div>
      </div>
    </header>
  )
}

    
