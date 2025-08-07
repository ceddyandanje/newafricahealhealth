
'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown, Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

const categoryLinks = [
    { href: "/products?category=Chronic+Care", label: "Chronic Care"},
    { href: "/products?category=Cardiovascular", label: "Cardiovascular"},
    { href: "/products?category=Respiratory", label: "Respiratory"},
    { href: "/products?category=Diabetes+Care", label: "Diabetes Care"},
];

export default function ClientHeaderItems({ isMobile = false }: { isMobile?: boolean }) {
  const { theme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  
  const dropdownTrigger = (
    <DropdownMenuTrigger
      asChild
      className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
    >
      <Button variant="ghost" className="flex items-center gap-1 px-1">
        Categories
        <ChevronDown className="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
  );

  const themeSwitcher = (
      <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          aria-label="Toggle theme"
        >
        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-gray-600" />
        <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-gray-300" />
      </Button>
  );

  if (isMobile) {
    return (
        <DropdownMenu>
            {dropdownTrigger}
            <DropdownMenuContent>
                {categoryLinks.map((link) => (
                <DropdownMenuItem key={link.href} asChild>
                    <Link href={link.href}>{link.label}</Link>
                </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
  }

  return (
    <>
      <DropdownMenu>
        {dropdownTrigger}
        <DropdownMenuContent>
          {categoryLinks.map((link) => (
            <DropdownMenuItem key={link.href} asChild>
              <Link href={link.href}>{link.label}</Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
       {themeSwitcher}
    </>
  );
}
