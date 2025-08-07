import { products } from "@/lib/products"
import Image from "next/image"
import { notFound } from "next/navigation"
import AddToCartButton from "@/components/products/add-to-cart-button"
import { Badge } from "@/components/ui/badge"

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = products.find(p => p.id === params.id)

  if (!product) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <div className="glassmorphic p-6">
          <div className="relative aspect-square rounded-lg overflow-hidden">
            <Image 
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              data-ai-hint={product.dataAiHint}
            />
          </div>
        </div>

        <div>
          <Badge variant="secondary" className="mb-2">{product.category}</Badge>
          <h1 className="font-headline text-4xl font-bold mb-4">{product.name}</h1>
          <p className="text-2xl font-semibold text-primary mb-6">${product.price.toFixed(2)}</p>
          <p className="text-muted-foreground leading-relaxed mb-8">{product.description}</p>
          <div className="w-full md:w-1/2">
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </div>
  )
}
