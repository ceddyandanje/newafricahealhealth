
'use client';

import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ServiceCategoryDialog } from "@/components/health/service-category-dialog";
import { serviceCategories, ServiceCategory } from '@/lib/serviceCategories';
import { Button } from '@/components/ui/button';

export default function ChronicCarePage() {
    const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);

    return (
        <div className="bg-background">
            <div className="container mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">Specialized Medical Services</h1>
                    <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                        Explore our wide range of medical specialties. Click on a category to learn more and access care.
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
