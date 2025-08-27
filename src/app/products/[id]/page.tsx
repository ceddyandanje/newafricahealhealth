
import { getProduct, getAllProducts } from "@/lib/products"
import Image from "next/image"
import { notFound } from "next/navigation"
import AddToCartButton from "@/components/products/add-to-cart-button"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"

const formatPrice = (priceInCents: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(priceInCents / 100);
};

export async function generateStaticParams() {
    const products = await getAllProducts();
    return products.map(product => ({ id: product.id }));
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound()
  }

  return (
    <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
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
                <div className="flex gap-2 items-center mb-2">
                    <Badge variant="secondary">{product.category}</Badge>
                    {product.tags?.map(tag => (
                        <Badge key={tag} variant={tag === "featured" ? "default" : "outline"}>{tag}</Badge>
                    ))}
                </div>

                <h1 className="font-headline text-4xl font-bold mb-4">{product.name}</h1>
                <p className="text-2xl font-semibold text-primary mb-6">{formatPrice(product.price)}</p>
                <p className="text-muted-foreground leading-relaxed mb-8">{product.description}</p>
                <div className="w-full md:w-1/2">
                    <AddToCartButton product={product} />
                </div>
                </div>
            </div>
            </div>
        </main>
        <Footer />
    </div>
  )
}
