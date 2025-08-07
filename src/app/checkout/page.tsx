"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useCart } from "@/hooks/use-cart"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

const checkoutSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  country: z.string().min(2, "Country is required"),
  postalCode: z.string().min(3, "Postal code is required"),
  cardNumber: z.string().regex(/^[0-9]{16}$/, "Card number must be 16 digits"),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Invalid expiry date (MM/YY)"),
  cvc: z.string().regex(/^[0-9]{3}$/, "CVC must be 3 digits"),
})

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart()
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof checkoutSchema>>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: "", email: "", address: "", city: "", country: "", postalCode: "",
      cardNumber: "", expiryDate: "", cvc: ""
    },
  })

  function onSubmit(values: z.infer<typeof checkoutSchema>) {
    console.log(values)
    toast({
      title: "Order Placed!",
      description: "Thank you for your purchase. Your order is being processed.",
    })
    clearCart()
    router.push("/")
  }

  if (items.length === 0 && typeof window !== 'undefined') {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="glassmorphic p-12 max-w-md mx-auto">
          <h1 className="font-headline text-3xl mb-4">Your cart is empty.</h1>
          <p className="mb-6">Please add items to your cart before checking out.</p>
          <Button asChild><Link href="/products">Continue Shopping</Link></Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <h1 className="font-headline text-3xl font-bold mb-6">Checkout</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 glassmorphic p-8">
              <FormField name="name" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField name="email" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField name="address" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField name="city" control={form.control} render={({ field }) => (
                  <FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField name="country" control={form.control} render={({ field }) => (
                  <FormItem><FormLabel>Country</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField name="postalCode" control={form.control} render={({ field }) => (
                  <FormItem><FormLabel>Postal Code</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <div className="border-t pt-8">
                <h2 className="font-headline text-xl font-bold mb-4">Payment Details</h2>
                <FormField name="cardNumber" control={form.control} render={({ field }) => (
                  <FormItem><FormLabel>Card Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <div className="grid grid-cols-2 gap-4 mt-4">
                <FormField name="expiryDate" control={form.control} render={({ field }) => (
                  <FormItem><FormLabel>Expiry (MM/YY)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField name="cvc" control={form.control} render={({ field }) => (
                  <FormItem><FormLabel>CVC</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                </div>
              </div>
              <Button type="submit" className="w-full" size="lg">Place Order</Button>
            </form>
          </Form>
        </div>
        <div className="lg:sticky top-24 h-fit">
            <div className="glassmorphic p-8">
                <h2 className="font-headline text-2xl font-bold mb-6">Your Order</h2>
                <div className="space-y-4 mb-6">
                {items.map(item => (
                    <div key={item.product.id} className="flex items-center gap-4">
                        <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                        <Image src={item.product.image} alt={item.product.name} fill className="object-cover" data-ai-hint={item.product.dataAiHint}/>
                        <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">{item.quantity}</span>
                        </div>
                        <div className="flex-grow">
                        <p className="font-semibold">{item.product.name}</p>
                        </div>
                        <p className="font-semibold">${(item.product.price * item.quantity).toFixed(2)}</p>
                    </div>
                ))}
                </div>
                <div className="border-t border-border my-4"></div>
                <div className="flex justify-between font-bold text-lg">
                <p>Total</p>
                <p>${totalPrice.toFixed(2)}</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}
