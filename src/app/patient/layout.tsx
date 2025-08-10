
'use client';

import PatientSidebar from "@/components/patient/sidebar";

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen bg-muted/40">
      <PatientSidebar />
      <main className="ml-20 transition-all duration-300">
        {children}
      </main>
    </div>
  )
}
