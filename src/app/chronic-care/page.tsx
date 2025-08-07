
'use client';

import { useState } from 'react';
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, UploadCloud, ShoppingCart, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import GetStartedButton from "@/components/health/get-started-button";
import { chronicCareCategories, ChronicCareCategory } from '@/lib/chronicCareCategories';
import { ServiceCategoryDialog } from '@/components/health/service-category-dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

export default function ChronicCarePage() {
    const [selectedCategory, setSelectedCategory] = useState<ChronicCareCategory | null>(null);
    const { user } = useAuth();
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const router = useRouter();

    const handleCategoryClick = (category: ChronicCareCategory) => {
        if (user) {
            setSelectedCategory(category);
        } else {
            setShowLoginPrompt(true);
        }
    };
    
    const handleLoginRedirect = () => {
        setShowLoginPrompt(false);
        router.push('/login');
    };

    return (
        <div className="bg-background">
            {/* Hero Section */}
            <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center text-center text-white">
                <Image
                    src="https://images.unsplash.com/photo-1657028310103-f53dd49a856a?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Healthcare professional assisting a patient with a tablet"
                    fill
                    className="object-cover"
                    data-ai-hint="doctor patient tablet"
                    priority
                />
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative z-10 p-4">
                    <h1 className="text-4xl md:text-6xl font-bold font-headline">Simplified Chronic Disease Management</h1>
                    <p className="text-lg md:text-xl max-w-3xl mx-auto mt-4">
                        Reliable, convenient, and compassionate care for your long-term health needs, delivered right to your door.
                    </p>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-20 bg-muted/20">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                        Your Care Journey, Simplified
                    </h2>
                    <p className="text-lg text-muted-foreground mb-16 max-w-2xl mx-auto">
                        Getting the medication you need is as easy as one, two, three. We handle the details so you can focus on your health.
                    </p>
                    <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 items-start">
                        {/* Step 1 */}
                        <div className="relative flex flex-col items-center">
                             <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4 z-10">
                                <UploadCloud className="w-10 h-10" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-foreground">1. Upload Prescription</h3>
                            <p className="text-muted-foreground">Easily and securely upload your doctor's prescription to our platform.</p>
                        </div>
                        {/* Step 2 */}
                        <div className="relative flex flex-col items-center">
                            <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4 z-10">
                                <ShoppingCart className="w-10 h-10" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-foreground">2. Order Your Medicine</h3>
                            <p className="text-muted-foreground">Confirm your order from your digitized prescription and check out in minutes.</p>
                        </div>
                        {/* Step 3 */}
                        <div className="relative flex flex-col items-center">
                            <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4 z-10">
                                <Truck className="w-10 h-10" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-foreground">3. Delivered to You</h3>
                            <p className="text-muted-foreground">Receive your medication discreetly at your doorstep with our reliable delivery service.</p>
                        </div>
                    </div>
                     <div className="mt-16">
                        <GetStartedButton />
                    </div>
                </div>
            </section>

            {/* Shop by Condition Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center font-headline mb-12">Care for Your Condition</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                       {chronicCareCategories.map((category) => (
                         <div 
                            key={category.id}
                            onClick={() => handleCategoryClick(category)}
                            className="block group cursor-pointer"
                        >
                            <div className="glassmorphic p-8 h-full flex flex-col items-center text-center transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-1">
                                <div className="p-4 bg-primary/20 rounded-full w-fit mb-4">
                                    <category.icon className="h-10 w-10 text-primary"/>
                                </div>
                                <h3 className="font-headline text-2xl font-semibold mb-2">{category.name}</h3>
                                <p className="text-muted-foreground flex-grow">{category.description}</p>
                                <span className={cn(Button.styles, "mt-4 text-primary group-hover:underline")}>
                                    Learn More
                                </span>
                            </div>
                        </div>
                       ))}
                    </div>
                </div>
            </section>

            {selectedCategory && (
                <ServiceCategoryDialog
                    category={selectedCategory}
                    isOpen={!!selectedCategory}
                    onClose={() => setSelectedCategory(null)}
                />
            )}

            <AlertDialog open={showLoginPrompt} onOpenChange={setShowLoginPrompt}>
                <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Authentication Required</AlertDialogTitle>
                    <AlertDialogDescription>
                    Please log in to your account to view details about our chronic care services.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLoginRedirect}>Login</AlertDialogAction>
                </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
