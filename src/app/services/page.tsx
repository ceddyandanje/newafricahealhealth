
'use client';

import { useState } from 'react';
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { ServiceCategoryDialog } from "@/components/health/service-category-dialog";
import { serviceCategories, ServiceCategory } from '@/lib/serviceCategories';

export default function ServicesPage() {
    const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);

    return (
        <div className="bg-background">
            <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center text-center text-white">
                <Image
                    src="https://images.unsplash.com/photo-1585421514738-01798e348b17?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
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
                            onClick={() => setSelectedCategory(category)}
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
             {selectedCategory && (
                <ServiceCategoryDialog
                    category={selectedCategory}
                    isOpen={!!selectedCategory}
                    onClose={() => setSelectedCategory(null)}
                />
            )}
        </div>
    );
}
