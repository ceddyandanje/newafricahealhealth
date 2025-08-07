
"use client"

import { useCart } from "@/hooks/use-cart"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Minus, Plus } from "lucide-react"

const formatPrice = (priceInCents: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(priceInCents / 100);
};

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice } = useCart()

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="font-headline text-4xl font-bold mb-8 text-center">Your Cart</h1>
      {items.length === 0 ? (
        <div className="text-center glassmorphic p-12">
          <p className="text-xl text-muted-foreground mb-4">Your cart is empty.</p>
          <Button asChild>
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div key={item.product.id} className="glassmorphic p-4 flex items-center gap-4">
                <div className="relative h-24 w-24 rounded-md overflow-hidden flex-shrink-0">
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    data-ai-hint={item.product.dataAiHint}
                  />
                </div>
                <div className="flex-grow">
                  <Link href={`/products/${item.product.id}`} className="font-headline font-semibold hover:text-primary">{item.product.name}</Link>
                  <p className="text-muted-foreground text-sm">{formatPrice(item.product.price)}</p>
                </div>
                <div className="flex items-center gap-2">
                   <Button variant="outline" size="icon" onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
                    <Minus className="h-4 w-4" />
                   </Button>
                  <Input 
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value) || 0)}
                    className="w-16 h-10 text-center"
                    min="0"
                  />
                  <Button variant="outline" size="icon" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                    <Plus className="h-4 w-4" />
                   </Button>
                </div>
                <p className="font-semibold w-24 text-right">{formatPrice(item.product.price * item.quantity)}</p>
                <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.product.id)}>
                  <X className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            ))}
          </div>
          <div className="lg:col-span-1">
            <div className="glassmorphic p-6 sticky top-24">
              <h2 className="font-headline text-2xl font-bold mb-4">Order Summary</h2>
              <div className="flex justify-between mb-2">
                <p>Subtotal</p>
                <p>{formatPrice(totalPrice)}</p>
              </div>
              <div className="flex justify-between mb-4">
                <p>Shipping</p>
                <p>Calculated at next step</p>
              </div>
              <div className="border-t border-border my-4"></div>
              <div className="flex justify-between font-bold text-lg mb-6">
                <p>Total</p>
                <p>{formatPrice(totalPrice)}</p>
              </div>
              <Button className="w-full" size="lg" asChild>
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
