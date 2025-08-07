"use client"

import Link from "next/link"
import { Moon, ShoppingCart, Sun, Menu, HeartPulse } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useCart } from "@/hooks/use-cart"
import { Badge } from "@/components/ui/badge"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/health-assistant", label: "AI Assistant" },
]

export default function Header() {
  const { theme, setTheme } = useTheme()
  const { items } = useCart()
  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <HeartPulse className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block font-headline">
              Africa Heal Health
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>
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
                <HeartPulse className="h-6 w-6 text-primary" />
                <span className="font-bold font-headline">Africa Heal Health</span>
              </Link>
              <nav className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
        
        <div className="flex flex-1 items-center justify-end space-x-2">
           <Link href="/cart" aria-label="Open cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge
                  variant="default"
                  className="absolute -right-2 -top-2 h-5 w-5 justify-center rounded-full p-0 text-xs bg-primary text-primary-foreground"
                >
                  {cartItemCount}
                </Badge>
              )}
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
        </div>
      </div>
    </header>
  )
}
