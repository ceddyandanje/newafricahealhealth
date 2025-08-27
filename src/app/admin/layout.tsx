

'use client';

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import AdminSidebar from "@/components/admin/sidebar";


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
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

  return (
     <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow flex">
            <AdminSidebar />
            <main className="flex-grow bg-muted/40 pl-64">
                {children}
            </main>
        </div>
        <Footer />
    </div>
  )
}
