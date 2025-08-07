import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { products } from "@/lib/products"
import { Product } from "@/lib/types"
import { ArrowRight, Zap, Bot } from "lucide-react"
import AddToCartButton from "@/components/products/add-to-cart-button"

const ProductCard = ({ product }: { product: Product }) => (
  <div className="glassmorphic p-4 flex flex-col h-full group">
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
      <div className="flex justify-between items-center mt-auto">
        <p className="font-semibold text-lg">${product.price.toFixed(2)}</p>
        <AddToCartButton product={product} />
      </div>
    </div>
  </div>
)

export default function Home() {
  const featuredProducts = products.filter(p => p.featured)

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="text-center py-16 md:py-24">
        <div className="glassmorphic p-8 md:p-12">
          <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight mb-4">
            Embrace African Wellness
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Discover traditional remedies and natural products to heal your body and soul.
          </p>
          <Button asChild size="lg">
            <Link href="/products">Shop All Products <ArrowRight className="ml-2" /></Link>
          </Button>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <h2 className="font-headline text-3xl font-bold text-center mb-10">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Special Offers & AI Assistant */}
      <section className="py-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glassmorphic p-8 flex flex-col items-center text-center">
          <div className="p-3 bg-primary/20 rounded-full mb-4">
            <Zap className="h-8 w-8 text-primary" />
          </div>
          <h3 className="font-headline text-2xl font-bold mb-2">Subscription Benefits</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            Subscribe and save! Get exclusive discounts, early access to new products, and free shipping on every order.
          </p>
          <Button variant="secondary">Learn More</Button>
        </div>

        <div className="glassmorphic p-8 flex flex-col items-center text-center">
          <div className="p-3 bg-primary/20 rounded-full mb-4">
            <Bot className="h-8 w-8 text-primary" />
          </div>
          <h3 className="font-headline text-2xl font-bold mb-2">Need Health Advice?</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            Our AI Health Assistant can answer your questions and suggest products tailored to your needs.
          </p>
          <Button asChild>
            <Link href="/health-assistant">Ask our AI Assistant</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
