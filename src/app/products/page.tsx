"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { products } from "@/lib/products"
import type { Product } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import AddToCartButton from "@/components/products/add-to-cart-button"

const ProductCard = ({ product }: { product: Product }) => (
  <div className="glassmorphic p-4 flex flex-col h-full group transition-all duration-300 hover:shadow-2xl">
    <Link href={`/products/${product.id}`} className="flex flex-col h-full">
      <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-4">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          data-ai-hint={product.dataAiHint}
        />
      </div>
      <div className="flex flex-col flex-grow">
        <h3 className="font-headline font-semibold text-lg">{product.name}</h3>
        <p className="text-muted-foreground text-sm flex-grow mb-4">{product.description}</p>
        <p className="font-semibold text-lg mt-auto">${product.price.toFixed(2)}</p>
      </div>
    </Link>
    <div className="mt-4">
      <AddToCartButton product={product} />
    </div>
  </div>
);

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [category, setCategory] = useState("all")
  const [sortBy, setSortBy] = useState("name-asc")

  const categories = ["all", ...Array.from(new Set(products.map(p => p.category)))]

  const filteredProducts = products
    .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(p => category === "all" || p.category === category)
    .sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price
        case "price-desc":
          return b.price - a.price
        case "name-desc":
          return b.name.localeCompare(a.name)
        case "name-asc":
        default:
          return a.name.localeCompare(b.name)
      }
    })

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">Our Products</h1>
        <p className="text-lg text-muted-foreground mt-2">Explore our collection of natural wellness products.</p>
      </div>
      
      <div className="mb-8 p-4 glassmorphic">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input 
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name-asc">Name (A-Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z-A)</SelectItem>
              <SelectItem value="price-asc">Price (Low to High)</SelectItem>
              <SelectItem value="price-desc">Price (High to Low)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
        {filteredProducts.length === 0 && (
          <p className="md:col-span-2 lg:col-span-3 xl:col-span-4 text-center text-muted-foreground">No products found.</p>
        )}
      </div>
    </div>
  )
}
