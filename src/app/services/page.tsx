

'use client';

import { useState } from 'react';
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { ServiceCategoryDialog } from "@/components/health/service-category-dialog";
import { serviceCategories, type ServiceCategory } from '@/lib/serviceCategories';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useBookingStore } from '@/hooks/use-booking-store';
import { Scissors, ShieldPlus, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ServicesPage() {
    const { user } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const { setSpecialty, openDialog } = useBookingStore();

    const handleServiceClick = (category: ServiceCategory) => {
        if (!user) {
            // Not logged in: remember specialty and redirect to login
            setSpecialty(category);
            router.push('/login');
        } else if (user.role === 'user') {
            // Logged in as patient: remember specialty and go to appointments page
            setSpecialty(category);
            openDialog();
            router.push('/patient/appointments');
        } else {
            // Logged in as doctor, admin, etc.
            toast({
                title: "Action Not Allowed",
                description: `Users with the "${user.role}" role cannot book appointments. Please use a patient account.`,
            });
        }
    };

    return (
        <div className="bg-background">
            <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center text-center text-white">
                <Image
                    src="https://images.unsplash.com/photo-1582719471384-894c86c97e54?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format=fit=crop&w=870&q=80"
                    alt="Surgical team performing a procedure"
                    fill
                    className="object-cover"
                    data-ai-hint="surgery operation"
                    priority
                />
                <div className="absolute inset-0 bg-black/60" />
                <div className="relative z-10 p-4">
                    <h1 className="text-4xl md:text-6xl font-bold font-headline">Our Services</h1>
                    <p className="text-lg md:text-xl max-w-3xl mx-auto mt-4">
                        Comprehensive healthcare solutions designed to meet your needs, from chronic care to specialized medical services.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-16">
                 <div className="py-8 text-center bg-muted/30 rounded-2xl mb-16">
                    <h2 className="text-3xl font-bold font-headline mb-4">Professional Surgical Equipment</h2>
                    <p className="text-muted-foreground mb-10 max-w-3xl mx-auto">
                        We supply a comprehensive range of high-quality surgical equipment to medical professionals and facilities, ensuring they have the tools they need for optimal patient outcomes.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-10">
                        <div className="glassmorphic p-6">
                            <Scissors className="h-10 w-10 text-primary mx-auto mb-3" />
                            <h3 className="font-semibold text-lg">Precision Instruments</h3>
                            <p className="text-sm text-muted-foreground">Scalpels, forceps, retractors, and more, crafted for accuracy.</p>
                        </div>
                        <div className="glassmorphic p-6">
                            <ShieldPlus className="h-10 w-10 text-primary mx-auto mb-3" />
                            <h3 className="font-semibold text-lg">Sterilization & Disposables</h3>
                            <p className="text-sm text-muted-foreground">Autoclaves, surgical gloves, gowns, and sterile drapes.</p>
                        </div>
                         <div className="glassmorphic p-6">
                            <Package className="h-10 w-10 text-primary mx-auto mb-3" />
                            <h3 className="font-semibold text-lg">General Supplies</h3>
                            <p className="text-sm text-muted-foreground">Sutures, staples, sponges, and other essential operating room supplies.</p>
                        </div>
                    </div>
                     <Button size="lg" asChild>
                        <Link href="/products?category=Surgical+Equipment">Browse Surgical Equipment</Link>
                    </Button>
                </div>

                 <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary">Explore Our Medical Specialties</h2>
                    <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                        We offer a wide range of specialized services to cater to your unique health needs. Click on any specialty to learn more.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {serviceCategories.map((category) => (
                        <Card
                            key={category.id}
                            className="glassmorphic p-4 text-center group cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition-all"
                            onClick={() => handleServiceClick(category)}
                        >
                            <CardContent className="p-2 flex flex-col items-center justify-center h-full">
                                 <div className="p-3 bg-primary/10 rounded-full mb-3 text-primary">
                                    <category.icon className="h-8 w-8" />
                                </div>
                                <h3 className="font-headline font-semibold text-base">{category.name}</h3>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
            {/* The dialog is now managed globally and opened on the appointments page */}
        </div>
    );
}
