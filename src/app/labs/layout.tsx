
'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import LabSidebar from "@/components/labs/sidebar";
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

export default function LabLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user?.role !== 'lab-technician') {
      // Redirect non-lab technicians away
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || user?.role !== 'lab-technician') {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow flex">
        <LabSidebar />
        <main className="flex-1 pl-20 transition-all duration-300">
            {children}
        </main>
      </div>
      <Footer />
    </div>
  )
}
