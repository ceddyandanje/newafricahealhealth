
'use client';

import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';

const categoryLinks = [
    { href: "/products?category=Chronic+Care", label: "Chronic Care"},
    { href: "/products?category=Cardiovascular", label: "Cardiovascular"},
    { href: "/products?category=Respiratory", label: "Respiratory"},
    { href: "/products?category=Diabetes+Care", label: "Diabetes Care"},
];

export default function ClientHeaderItems({ isMobile = false }: { isMobile?: boolean }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // Render a placeholder or null on the server to prevent hydration mismatch
    if (isMobile) {
      return <div className="h-10"></div>; // Placeholder for mobile
    }
    return <div className="w-24 h-10"></div>; // Placeholder for desktop
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
