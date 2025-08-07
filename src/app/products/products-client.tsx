
"use client";

import { useState, useEffect, useMemo, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { type Product } from "@/lib/types";
import { useDebounce } from "@/hooks/use-debounce";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AddToCartButton from "@/components/products/add-to-cart-button";
import { Loader2, PackageSearch, Search } from "lucide-react";

interface ProductsClientProps {
  initialProducts: Product[];
  brands: string[];
  categories: string[];
  maxPrice: number;
}

const formatPrice = (priceInCents: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(priceInCents / 100);
};

function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="glass-card flex flex-col h-full group transition-all duration-300 hover:shadow-2xl">
        <Link href={`/products/${product.id}`} className="flex flex-col h-full">
            <div className="relative w-full aspect-square rounded-t-lg overflow-hidden">
            <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                data-ai-hint={product.dataAiHint}
            />
            </div>
            <div className="p-4 flex flex-col flex-grow">
            <div className="flex gap-2 mb-2">
                {product.tags?.map((tag) => (
                <Badge key={tag} variant={tag === "featured" ? "default" : "secondary"}>
                    {tag}
                </Badge>
                ))}
            </div>
            <h3 className="font-headline font-semibold text-lg flex-grow">{product.name}</h3>
            <p className="text-primary font-semibold text-lg mt-2">{formatPrice(product.price)}</p>
            </div>
        </Link>
        <div className="p-4 pt-0 mt-auto">
            <AddToCartButton product={product} />
        </div>
    </Card>
  );
}

export default function ProductsClient({
  initialProducts,
  brands,
  categories,
  maxPrice,
}: ProductsClientProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // State for filters
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [priceRange, setPriceRange] = useState<[number]>([
    parseInt(searchParams.get("price") || `${maxPrice}`),
  ]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.getAll("category") || []
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    searchParams.getAll("brand") || []
  );
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "featured");
  
  const debouncedSearch = useDebounce(searchTerm, 300);

  // Update URL when filters change
  useEffect(() => {
    startTransition(() => {
        const params = new URLSearchParams();
        if (debouncedSearch) params.set("search", debouncedSearch);
        if (priceRange[0] < maxPrice) params.set("price", `${priceRange[0]}`);
        selectedCategories.forEach((cat) => params.append("category", cat));
        selectedBrands.forEach((brand) => params.append("brand", brand));
        if (sortBy) params.set("sortBy", sortBy);
        
        router.replace(`${pathname}?${params.toString()}`);
    });
  }, [debouncedSearch, priceRange, selectedCategories, selectedBrands, sortBy, router, pathname, maxPrice]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleBrandChange = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  // Filter products based on state
  const filteredProducts = useMemo(() => {
    return initialProducts
      .filter((p) => p.name.toLowerCase().includes(debouncedSearch.toLowerCase()))
      .filter((p) => p.price <= priceRange[0])
      .filter(
        (p) =>
          selectedCategories.length === 0 || selectedCategories.includes(p.category)
      )
      .filter(
        (p) => selectedBrands.length === 0 || selectedBrands.includes(p.brand)
      )
      .sort((a, b) => {
        switch (sortBy) {
          case "price-asc":
            return a.price - b.price;
          case "price-desc":
            return b.price - a.price;
          case "name-asc":
            return a.name.localeCompare(b.name);
          case "name-desc":
            return b.name.localeCompare(a.name);
          case "featured":
            return (b.tags?.includes("featured") ? 1 : 0) - (a.tags?.includes("featured") ? 1 : 0);
          default:
            return 0;
        }
      });
  }, [debouncedSearch, priceRange, selectedCategories, selectedBrands, sortBy, initialProducts]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Column: Filters */}
        <aside className="lg:col-span-1 lg:sticky top-24 h-fit">
          <Card className="p-6 glass-card">
            <h2 className="font-headline text-2xl font-bold mb-2">Filters</h2>
            <p className="text-muted-foreground mb-6">Refine your search.</p>
            
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div>
              <h3 className="font-semibold mb-2">Price Range</h3>
              <Slider
                value={priceRange}
                onValueChange={(value) => setPriceRange(value as [number])}
                max={maxPrice}
                step={100}
              />
              <p className="text-sm text-muted-foreground mt-2">
                Up to: {formatPrice(priceRange[0])}
              </p>
            </div>

            <Accordion type="multiple" defaultValue={["category", "brand"]} className="w-full mt-4">
              <AccordionItem value="category">
                <AccordionTrigger className="font-semibold">Category</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <div key={cat} className="flex items-center space-x-2">
                        <Checkbox
                          id={`cat-${cat}`}
                          checked={selectedCategories.includes(cat)}
                          onCheckedChange={() => handleCategoryChange(cat)}
                        />
                        <label htmlFor={`cat-${cat}`} className="text-sm">
                          {cat}
                        </label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="brand">
                <AccordionTrigger className="font-semibold">Brand</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {brands.map((brand) => (
                      <div key={brand} className="flex items-center space-x-2">
                        <Checkbox
                          id={`brand-${brand}`}
                          checked={selectedBrands.includes(brand)}
                          onCheckedChange={() => handleBrandChange(brand)}
                        />
                        <label htmlFor={`brand-${brand}`} className="text-sm">
                          {brand}
                        </label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Card>
        </aside>

        {/* Right Column: Product Display */}
        <main className="lg:col-span-3">
          <div className="flex justify-between items-center mb-8">
            <h1 className="font-headline text-4xl font-bold">All Products</h1>
            <div className="flex items-center gap-2">
              <label htmlFor="sort-by" className="text-sm font-medium">Sort by:</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger id="sort-by" className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="name-asc">Name: A-Z</SelectItem>
                  <SelectItem value="name-desc">Name: Z-A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="relative">
            {isPending && (
              <div className="absolute inset-0 bg-background/50 z-10 flex items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
            )}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <PackageSearch className="mx-auto h-16 w-16 text-muted-foreground" />
                <h2 className="mt-4 text-2xl font-bold">No products found</h2>
                <p className="mt-2 text-muted-foreground">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

