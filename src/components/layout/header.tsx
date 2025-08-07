
"use client"

import Link from "next/link"
import { Menu, ShoppingCart, User, LogOut, LayoutDashboard, UserCircle, Settings, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import ThemeToggleButton from "./theme-toggle-button"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"
import { Badge } from "../ui/badge"
import { useEffect, useState } from "react"
import { Skeleton } from "../ui/skeleton"
import { chronicCareCategories } from "@/lib/chronicCareCategories"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/products", label: "Products" },
  { href: "/services", label: "Services" },
  { href: "/wellness-blog", label: "Wellness Blog" },
]

function AuthButton() {
    const { user, isAdmin, logout, isLoading } = useAuth();
    
    if (isLoading) {
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

const dropdownCategories = [
    ...chronicCareCategories.filter(c => ['cardiovascular', 'diabetes-care', 'respiratory'].includes(c.id)),
    { id: 'medical-tourism', name: 'Medical Tourism' },
    { id: 'organ-transplants', name: 'Organ Transplants' }
];

function CategoriesDropdown() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors text-sm font-medium">
                    Categories <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
                <DropdownMenuItem asChild>
                    <Link href="/chronic-care">All Chronic Care</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {dropdownCategories.map(category => (
                    <DropdownMenuItem key={category.id} asChild>
                        <Link href={`/${category.id}`}>{category.name}</Link>
                    </DropdownMenuItem>
                ))}
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
        <Link href="/" className="flex items-center space-x-2 mr-auto">
            <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200">AHH</AvatarFallback>
            </Avatar>
            <span className="font-bold sm:inline-block text-gray-800 dark:text-white">Africa Heal Health</span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-2">
            <nav className="flex items-center space-x-2">
                <Link
                    href="/products"
                    className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors text-sm font-medium px-2 py-1"
                >
                    Products
                </Link>
                <Link
                    href="/services"
                    className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors text-sm font-medium px-2 py-1"
                >
                    Services
                </Link>
                <CategoriesDropdown />
                <Link
                    href="/wellness-blog"
                    className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors text-sm font-medium px-2 py-1"
                >
                    Wellness Blog
                </Link>
            </nav>
            {isMounted && (
                <>
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
                </>
            )}
        </div>
            
        <div className="md:hidden flex items-center ml-auto">
             {isMounted && (
                <>
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
                </>
            )}
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
                    <nav className="flex flex-col space-y-2 flex-grow text-lg">
                        <SheetClose asChild>
                            <Link href="/products" className="py-2 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white">Products</Link>
                        </SheetClose>
                        <SheetClose asChild>
                            <Link href="/services" className="py-2 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white">Services</Link>
                        </SheetClose>
                        <SheetClose asChild>
                            <Link href="/wellness-blog" className="py-2 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white">Wellness Blog</Link>
                        </SheetClose>
                        <Collapsible>
                            <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white group">
                                <span>Categories</span>
                                <ChevronDown className="h-5 w-5 transition-transform duration-300 group-data-[state=open]:rotate-180" />
                            </CollapsibleTrigger>
                            <CollapsibleContent className="pl-4">
                                <SheetClose asChild>
                                    <Link href="/chronic-care" className="block py-2 text-muted-foreground hover:text-foreground">All Chronic Care</Link>
                                </SheetClose>
                                {dropdownCategories.map(category => (
                                    <SheetClose asChild key={category.id}>
                                        <Link href={`/${category.id}`} className="block py-2 text-muted-foreground hover:text-foreground">{category.name}</Link>
                                    </SheetClose>
                                ))}
                            </CollapsibleContent>
                        </Collapsible>
                    </nav>
                </SheetContent>
            </Sheet>
        </div>
      </div>
    </header>
  )
}
