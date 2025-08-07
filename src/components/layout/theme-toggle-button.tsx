
'use client';

import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ThemeToggleButton() {
  const { theme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // Render a placeholder or null on the server to prevent layout shift
    return <div className="h-10 w-10" />;
  }

  return (
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
}
