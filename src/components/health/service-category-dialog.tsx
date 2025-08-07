
'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { type ServiceCategory } from '@/lib/serviceCategories';
import { healthAssistantQuery, HealthAssistantOutput } from '@/ai/flows/health-assistant-query';
import { Loader2, Sparkles, Stethoscope, CheckCircle } from 'lucide-react';
import { Product } from '@/lib/types';
import { products } from '@/lib/products';
import Image from 'next/image';
import Link from 'next/link';

interface ServiceCategoryDialogProps {
  category: ServiceCategory;
  isOpen: boolean;
  onClose: () => void;
}

const formatPrice = (priceInCents: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(priceInCents / 100);
};

export function ServiceCategoryDialog({ category, isOpen, onClose }: ServiceCategoryDialogProps) {
  const [content, setContent] = useState<HealthAssistantOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      const fetchContent = async () => {
        try {
            // AI prompt to get description and how-to
            const query = `Provide a detailed description for the medical specialty "${category.name}". Also include a "How to Get Service" section explaining the steps a patient should take. Finally, suggest three types of relevant medical products or devices for this specialty.`;
            const result = await healthAssistantQuery({ query });
            setContent(result);
            
            // Find actual products from the store based on AI suggestions
            if (result.suggestedProducts && result.suggestedProducts.length > 0) {
                const foundProducts: Product[] = [];
                result.suggestedProducts.forEach(suggestion => {
                    const searchRegex = new RegExp(suggestion.split(' ')[0], 'i'); // Simple search by first word
                    const found = products.find(p => searchRegex.test(p.name) || searchRegex.test(p.description));
                    if (found && !foundProducts.some(fp => fp.id === found.id)) {
                        foundProducts.push(found);
                    }
                });
                 // If not enough products found, fill with generic ones
                if (foundProducts.length < 3) {
                    const fallback = products.filter(p => p.category === "Chronic Care" && !foundProducts.some(fp => fp.id === p.id));
                    foundProducts.push(...fallback.slice(0, 3 - foundProducts.length));
                }
                setFeaturedProducts(foundProducts.slice(0, 3));
            } else {
                 // Fallback if AI gives no suggestions
                 setFeaturedProducts(products.filter(p => p.category === "Chronic Care").slice(0, 3));
            }

        } catch (error) {
          console.error("Failed to fetch service category details:", error);
          setContent({
            answer: "Sorry, we couldn't load the details for this service at the moment. Please try again later.",
            suggestedProducts: [],
          });
        } finally {
          setIsLoading(false);
        }
      };
      fetchContent();
    }
  }, [isOpen, category.name]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl font-headline">
            <category.icon className="h-8 w-8 text-primary" />
            {category.name}
          </DialogTitle>
          <DialogDescription>
            Detailed information about our {category.name} services.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading service details...</p>
          </div>
        ) : (
          <div className="py-4 space-y-6 max-h-[60vh] overflow-y-auto pr-2">
            
            <div className="prose dark:prose-invert max-w-none">
                <p>{content?.answer}</p>
            </div>
            
            {featuredProducts.length > 0 && (
                <div>
                    <h3 className="font-headline text-lg font-semibold mb-3 flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        Featured Products
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {featuredProducts.map(product => (
                            <Link key={product.id} href={`/products/${product.id}`} className="block group">
                                <div className="border rounded-lg p-3 h-full flex flex-col items-center text-center transition-shadow group-hover:shadow-lg">
                                    <div className="relative w-24 h-24 mb-2 rounded-md overflow-hidden">
                                        <Image src={product.image} alt={product.name} fill className="object-cover" data-ai-hint={product.dataAiHint}/>
                                    </div>
                                    <p className="text-sm font-semibold flex-grow">{product.name}</p>
                                    <p className="text-xs text-primary font-bold mt-1">{formatPrice(product.price)}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
          </div>
        )}

        <DialogFooter className="sm:justify-start gap-2 pt-4 border-t">
            <Button>
                <Stethoscope />
                Talk to a Physician
            </Button>
            <Button variant="outline">
                <CheckCircle />
                Select Service & Get Treatment
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
