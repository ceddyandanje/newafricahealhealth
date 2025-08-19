
"use client"

import { useState, useEffect } from "react";
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
import { useAuth } from "@/hooks/use-auth";
import { Loader2, ClipboardCheck } from 'lucide-react';
import { addOrder } from "@/lib/orders";
import { addLog } from "@/lib/logs";
import { addNotification } from "@/lib/notifications";

const checkoutSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  mpesaCode: z.string().length(10, "Please enter a valid 10-character M-Pesa code.").regex(/^[A-Z0-9]{10}$/, "M-Pesa code should be 10 uppercase letters and numbers."),
})

const formatPrice = (priceInCents: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(priceInCents / 100);
};

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart()
  const { user } = useAuth();
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const orderId = `AHH-${Date.now().toString().slice(-6)}`;

  useEffect(() => {
    setIsClient(true);
  }, []);

  const form = useForm<z.infer<typeof checkoutSchema>>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: user?.name || "", 
      email: user?.email || "", 
      address: "", 
      city: user?.location || "", 
      mpesaCode: ""
    },
  })

  async function onSubmit(values: z.infer<typeof checkoutSchema>) {
    if (!user) {
        toast({ variant: 'destructive', title: "Not Logged In", description: "You must be logged in to place an order."});
        return;
    }
    setIsSubmitting(true);
    try {
        await addOrder({
            ...values,
            userId: user.id,
            orderId,
            items,
            totalPrice,
        });

        toast({
            title: "Order Submitted for Verification",
            description: "Thank you! We've received your order and will process it shortly after verifying payment.",
        });

        addLog("INFO", `New order ${orderId} submitted by ${user.name} pending verification.`);
        addNotification({ recipientId: 'admin_role', type: 'info', title: 'New Order Pending', description: `Order ${orderId} from ${user.name} requires payment verification.`});

        clearCart()
        router.push("/my-orders")

    } catch (error) {
        console.error("Failed to place order:", error);
        toast({ variant: 'destructive', title: "Order Failed", description: "There was a problem submitting your order. Please try again." });
    } finally {
        setIsSubmitting(false);
    }
  }

  if (!isClient) {
    // Render nothing or a loader on the server and initial client render
    return null;
  }
  
  if (items.length === 0) {
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="glassmorphic p-8">
                    <h2 className="font-headline text-xl font-bold mb-4">1. Shipping Details</h2>
                     <FormField name="name" control={form.control} render={({ field }) => (
                        <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField name="email" control={form.control} render={({ field }) => (
                        <FormItem className="mt-4"><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField name="address" control={form.control} render={({ field }) => (
                        <FormItem className="mt-4"><FormLabel>Address</FormLabel><FormControl><Input {...field} placeholder="e.g. 123 Health St, Apartment 4B" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField name="city" control={form.control} render={({ field }) => (
                        <FormItem className="mt-4"><FormLabel>City/Town</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
              
              <div className="glassmorphic p-8">
                <h2 className="font-headline text-xl font-bold mb-4">2. Payment via M-Pesa</h2>
                <div className="bg-muted/50 p-4 rounded-lg space-y-2 text-sm">
                    <p><strong>Paybill Number:</strong> 123456</p>
                    <p><strong>Account Number:</strong> <span className="font-mono bg-background p-1 rounded">{orderId}</span></p>
                    <p><strong>Amount:</strong> <span className="font-bold">{formatPrice(totalPrice)}</span></p>
                    <p className="text-xs text-muted-foreground pt-2">Use the Account Number above in your M-Pesa transaction to help us identify your payment.</p>
                </div>
                 <FormField name="mpesaCode" control={form.control} render={({ field }) => (
                  <FormItem className="mt-6">
                    <FormLabel>M-Pesa Transaction Code</FormLabel>
                    <FormControl><Input {...field} placeholder="e.g. SABC123DEF" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <ClipboardCheck className="mr-2 h-4 w-4" />}
                Submit for Verification
              </Button>
            </form>
          </Form>
        </div>
        <div className="lg:sticky top-24 h-fit">
            <div className="glassmorphic p-8">
                <h2 className="font-headline text-2xl font-bold mb-6">Your Order Summary</h2>
                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
                {items.map(item => (
                    <div key={item.product.id} className="flex items-center gap-4">
                        <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                        <Image src={item.product.image} alt={item.product.name} fill className="object-cover" data-ai-hint={item.product.dataAiHint}/>
                        <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">{item.quantity}</span>
                        </div>
                        <div className="flex-grow">
                        <p className="font-semibold">{item.product.name}</p>
                        <p className="text-sm text-muted-foreground">{formatPrice(item.product.price)}</p>
                        </div>
                        <p className="font-semibold">{formatPrice(item.product.price * item.quantity)}</p>
                    </div>
                ))}
                </div>
                <div className="border-t border-border my-4"></div>
                <div className="flex justify-between font-bold text-lg">
                <p>Total</p>
                <p>{formatPrice(totalPrice)}</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}
