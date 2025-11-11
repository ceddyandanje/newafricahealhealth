
'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import AdminSidebar from '@/components/admin/sidebar';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

function AdminAuthGuard({ children }: { children: React.ReactNode }) {
    const { user, isAdmin, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAdmin) {
          router.push("/login");
        }
    }, [user, isAdmin, isLoading, router]);

    if (isLoading || !isAdmin) {
        return (
          <div className="flex h-screen w-full items-center justify-center bg-background">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
          </div>
        );
    }

    return <>{children}</>;
}


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
     <AdminAuthGuard>
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex-grow flex items-start">
                <AdminSidebar />
                <main className="flex-grow bg-muted/40">
                    {children}
                </main>
            </div>
            <Footer />
        </div>
    </AdminAuthGuard>
  )
}
