"use client"

import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import { Product } from "@/lib/types"
import { ShoppingCart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart()
  const { toast } = useToast()

  const handleAddToCart = () => {
    addToCart(product)
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  return (
    <Button onClick={handleAddToCart}>
      <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
    </Button>
  )
}
