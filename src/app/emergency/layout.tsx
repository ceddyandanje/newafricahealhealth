

'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import EmergencySidebar from "@/components/emergency/sidebar";
import { cn } from '@/lib/utils';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

export default function EmergencyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user?.role !== 'emergency-services') {
      // Redirect non-emergency services users away
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || user?.role !== 'emergency-services') {
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
        <EmergencySidebar />
        <main className="flex-1 pl-20 bg-muted/40">
            {children}
        </main>
      </div>
      <Footer />
    </div>
  )
}
