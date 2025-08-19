
"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"
import { db } from "@/lib/firebase"
import { collection, addDoc } from "firebase/firestore"
import { addLog } from "@/lib/logs"
import { addNotification } from "@/lib/notifications"
import { useState } from "react"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters."),
})

export default function ConsultationForm() {
    const { toast } = useToast()
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            message: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        try {
            // Write the consultation request to Firestore
            await addDoc(collection(db, "consultations"), {
                ...values,
                createdAt: new Date().toISOString(),
                status: 'New'
            });
            
            // Log the event and notify admins
            addLog("INFO", `New consultation request received from ${values.name} (${values.email}).`);
            addNotification({
                recipientId: 'admin_role',
                type: 'info',
                title: 'New Consultation Request',
                description: `A new consultation request from ${values.name} has been submitted.`
            });

            toast({
                title: "Request Sent!",
                description: "Thank you for your request. We will contact you shortly.",
            })
            form.reset()
        } catch (error) {
            console.error("Error submitting consultation form:", error);
            addLog("ERROR", `Failed to submit consultation form for ${values.name}. Error: ${error}`);
            toast({
                variant: 'destructive',
                title: "Submission Failed",
                description: "There was a problem sending your request. Please try again later.",
            })
        } finally {
            setIsSubmitting(false);
        }
    }
  
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input placeholder="john.doe@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Phone (Optional)</FormLabel>
                        <FormControl>
                            <Input placeholder="+254 712 345 678" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                            <Textarea placeholder="Tell us about your health concern..." {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Book Your Session
                </Button>
            </form>
        </Form>
    )
}
