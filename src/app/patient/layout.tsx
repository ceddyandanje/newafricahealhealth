
'use client';

import { useRef } from 'react';
import PatientSidebar from "@/components/patient/sidebar";

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const mainContentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative min-h-screen bg-muted/40">
      <div ref={mainContentRef} className="relative">
        <PatientSidebar mainContentRef={mainContentRef} />
        <main className="ml-20 transition-all duration-300">
          {children}
        </main>
      </div>
    </div>
  )
}
