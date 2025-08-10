
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { kenyanCounties } from "@/lib/counties";
import Image from "next/image";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const signupSchema = z.object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    phone: z.string().min(10, "Phone number is required"),
    ageRange: z.string().min(1, "Please select an age range"),
    location: z.string().min(1, "Location is required"),
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});


function LoginForm() {
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    
    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "" },
    });

    async function onSubmit(values: z.infer<typeof loginSchema>) {
        setIsLoading(true);
        await login(values);
        setIsLoading(false);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField name="email" control={form.control} render={({ field }) => (
                    <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField name="password" control={form.control} render={({ field }) => (
                    <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Login
                </Button>
            </form>
        </Form>
    );
}

function SignUpForm() {
    const { signup } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("login");

    const form = useForm<z.infer<typeof signupSchema>>({
        resolver: zodResolver(signupSchema),
        defaultValues: { firstName: "", lastName: "", email: "", password: "", confirmPassword: "", phone: "", ageRange: "", location: "" },
    });

     async function onSubmit(values: z.infer<typeof signupSchema>) {
        setIsLoading(true);
        await signup({
            name: `${values.firstName} ${values.lastName}`,
            email: values.email,
            password: values.password,
            phone: values.phone,
            age: values.ageRange,
            location: values.location,
        });
        setIsLoading(false);
    }

    return (
        <div className="w-full max-w-lg">
             <div className="text-center mb-6">
                <h1 className="text-3xl font-bold">Sign Up</h1>
                <p className="text-muted-foreground">Create your AHH account</p>
             </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <FormField name="firstName" control={form.control} render={({ field }) => (
                            <FormItem><FormLabel>First name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField name="lastName" control={form.control} render={({ field }) => (
                            <FormItem><FormLabel>Last name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    </div>
                    <FormField name="email" control={form.control} render={({ field }) => (
                        <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <div className="grid grid-cols-2 gap-4">
                        <FormField name="phone" control={form.control} render={({ field }) => (
                            <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="ageRange" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Age Range</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select your age" /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="18-24">18-24</SelectItem>
                                        <SelectItem value="25-34">25-34</SelectItem>
                                        <SelectItem value="35-44">35-44</SelectItem>
                                        <SelectItem value="45-54">45-54</SelectItem>
                                        <SelectItem value="55+">55+</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                         <FormField name="password" control={form.control} render={({ field }) => (
                            <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                         <FormField name="confirmPassword" control={form.control} render={({ field }) => (
                            <FormItem><FormLabel>Confirm Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    </div>
                     <FormField control={form.control} name="location" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Location (County)</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Select your county" /></SelectTrigger></FormControl>
                                <SelectContent>
                                    {kenyanCounties.map(county => (
                                        <SelectItem key={county} value={county}>{county}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <Button type="submit" className="w-full bg-green-400 hover:bg-green-500 text-black" size="lg" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create an account
                    </Button>
                     <Button variant="outline" className="w-full" size="lg" type="button">
                         <Image src="https://www.google.com/favicon.ico" alt="Google" width={16} height={16} className="mr-2"/>
                         Sign up with Google
                    </Button>
                </form>
            </Form>
        </div>
    );
}


export default function LoginPage() {
  const [activeTab, setActiveTab] = useState("login");
  return (
    <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-128px)]">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-lg">
            <TabsContent value="login">
                <Card className="glassmorphic">
                <CardHeader>
                    <CardTitle>Welcome Back</CardTitle>
                    <CardDescription>Enter your credentials to access your account.</CardDescription>
                </CardHeader>
                <CardContent>
                    <LoginForm />
                     <p className="text-center text-sm text-muted-foreground mt-4">
                        Don't have an account? <Button variant="link" className="p-0 h-auto" onClick={() => setActiveTab("signup")}>Sign up</Button>
                    </p>
                </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="signup">
                 <Card className="glassmorphic">
                    <CardContent className="p-8">
                        <SignUpForm />
                        <p className="text-center text-sm text-muted-foreground mt-6">
                            Already have an account? <Button variant="link" className="p-0 h-auto" onClick={() => setActiveTab("login")}>Login</Button>
                        </p>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    </div>
  );
}
