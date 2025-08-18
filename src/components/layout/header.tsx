
"use client"

import Link from "next/link"
import { Menu, ShoppingCart, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible"
import { useCart } from "@/hooks/use-cart"
import { useEffect, useState } from "react"
import ThemeToggleButton from "./theme-toggle-button"
import AuthButton from "./auth-button"
import { chronicCareCategories } from "@/lib/chronicCareCategories"
import Image from "next/image"

const dropdownCategories = [
    ...chronicCareCategories.filter(c => ['cardiovascular', 'diabetes-care', 'respiratory'].includes(c.id)),
    { id: 'medical-tourism', name: 'Medical Tourism' },
    { id: 'organ-transplants', name: 'Organ Transplants' },
    { id: 'emergency-services', name: 'Emergency Services' }
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

function CartButton() {
    const { items } = useCart()
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
    return (
        <Button variant="ghost" size="icon" asChild>
            <Link href="/cart" aria-label="Open cart" className="relative">
            <ShoppingCart className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{totalItems}</span>
            )}
            </Link>
        </Button>
    )
}


function ClientHeaderItems() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <div className="flex items-center gap-2">
            <ThemeToggleButton />
            <CartButton />
            <AuthButton />
        </div>
    )
}


export default function Header() {
  const logoUrl = "https://firebasestorage.googleapis.com/v0/b/africa-heal-health-x8xrn.firebasestorage.app/o/FB_IMG_1754584185750.jpg?alt=media&token=447d8b93-7b65-4236-832b-9d9d89411946";
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center space-x-2 mr-auto">
            <Image src={logoUrl} alt="Africa Heal Health Logo" width={40} height={40} className="rounded-full" />
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
            <ClientHeaderItems />
        </div>
            
        <div className="md:hidden flex items-center ml-auto">
            <ClientHeaderItems />
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-background w-full max-w-xs flex flex-col">
                    <SheetHeader>
                        <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                    </SheetHeader>
                     <Link href="/" className="flex items-center space-x-2 mb-6">
                        <Image src={logoUrl} alt="Africa Heal Health Logo" width={32} height={32} className="rounded-full" />
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
