"use client"

import Link from "next/link"
import { Moon, ShoppingCart, Sun, Menu, ChevronDown, User } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const navLinks = [
  { href: "/products", label: "Products" },
  { href: "/services", label: "Services" },
  { href: "/medical-tourism", label: "Medical Tourism" },
  { href: "/organ-transplants", label: "Organ Transplants" },
]

const categories = ["Category 1", "Category 2", "Category 3"]

export default function Header() {
  const { theme, setTheme } = useTheme()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Avatar>
              <AvatarFallback>AHH</AvatarFallback>
            </Avatar>
            <span className="font-bold hidden sm:inline-block">AHH</span>
          </Link>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <Link href="/" className="mr-6 flex items-center space-x-2 mb-6">
                <Avatar>
                  <AvatarFallback>AHH</AvatarFallback>
                </Avatar>
                <span className="font-bold">AHH</span>
              </Link>
              <nav className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                ))}
                 <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center transition-colors hover:text-foreground">
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
                <Link href="/wellness-blog" className="transition-colors hover:text-foreground">Wellness Blog</Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
        
        <div className="flex flex-1 items-center justify-center md:justify-start">
             <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
             <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center transition-colors hover:text-foreground">
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
            <Link href="/wellness-blog" className="transition-colors hover:text-foreground">Wellness Blog</Link>
          </nav>
        </div>
        
        <div className="flex items-center justify-end space-x-2">
           <Link href="/cart" aria-label="Open cart">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            aria-label="Toggle theme"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
           <Button variant="ghost" size="icon" asChild>
              <Link href="/profile">
                  <User className="h-5 w-5" />
              </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
