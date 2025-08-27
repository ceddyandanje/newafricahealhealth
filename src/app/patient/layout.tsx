

'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import PatientSidebar from "@/components/patient/sidebar";
import { cn } from '@/lib/utils';
import { useSidebar } from '@/hooks/use-sidebar';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useAuth();
  const { isExpanded } = useSidebar();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.push('/login');
    } else if (user.role !== 'user') {
      // If user is not a 'user' (e.g., admin or doctor), redirect them away
      if (user.role === 'admin') {
        router.push('/admin');
      } else if (user.role === 'doctor') {
        router.push('/doctor/dashboard');
      } else {
        // Fallback for other roles
        router.push('/login');
      }
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || user.role !== 'user') {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow flex relative">
        <PatientSidebar />
        <main className={cn(
          "flex-grow bg-muted/40 transition-all duration-300 pb-24",
          isExpanded ? "pl-80" : "pl-24"
        )}>
          {children}
        </main>
      </div>
       <Footer />
    </div>
  )
}
