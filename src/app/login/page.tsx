

"use client";

import { useState, useEffect } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { kenyanCounties } from "@/lib/counties";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, fetchSignInMethodsForEmail, linkWithCredential } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { addLog } from "@/lib/logs";
import { addNotification } from "@/lib/notifications";


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


function LoginForm({ onSwitchTab }: { onSwitchTab: () => void }) {
    const { login } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    
    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "" },
    });

    async function onSubmit(values: z.infer<typeof loginSchema>) {
        setIsSubmitting(true);
        await login(values);
        setIsSubmitting(false);
    }
    
    const signInWithGoogle = async () => {
        setIsSubmitting(true);
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            // The onAuthStateChanged listener in useAuth will handle the rest
        } catch (error: any) {
            console.error("Google sign in error", error);
            // This is the core of the account linking flow
            if (error.code === 'auth/account-exists-with-different-credential') {
                const email = error.customData.email;
                if (email) {
                    const methods = await fetchSignInMethodsForEmail(auth, email);
                    if (methods.includes(EmailAuthProvider.PROVIDER_ID)) {
                        try {
                            const result = await signInWithEmailAndPassword(auth, email, ''); // This will fail, but we need the user object
                            if (auth.currentUser) {
                                await linkWithCredential(auth.currentUser, error.credential);
                            }
                        } catch (linkError) {
                            toast({
                                variant: "destructive",
                                title: "Account Linking Failed",
                                description: "Could not link Google account. Please try signing in with your password first."
                            });
                        }
                    }
                }
            } else {
                toast({
                    variant: "destructive",
                    title: "Sign-In Error",
                    description: "An unexpected error occurred during Google sign-in. Please try again."
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <Card className="glassmorphic">
            <CardHeader>
                <CardTitle>Welcome Back</CardTitle>
                <CardDescription>Enter your credentials to access your account.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField name="email" control={form.control} render={({ field }) => (
                            <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField name="password" control={form.control} render={({ field }) => (
                            <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Login
                        </Button>
                    </form>
                </Form>
                 <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                    </div>
                </div>
                 <Button variant="outline" className="w-full" onClick={signInWithGoogle} disabled={isSubmitting}>
                    {isSubmitting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Image src="https://www.google.com/favicon.ico" alt="Google" width={16} height={16} className="mr-2"/>
                    )}
                    Sign in with Google
                </Button>
                <p className="text-center text-sm text-muted-foreground mt-4">
                    Don't have an account? <Button variant="link" className="p-0 h-auto" onClick={onSwitchTab}>Sign up</Button>
                </p>
            </CardContent>
        </Card>
    );
}

function SignUpForm({ onSwitchTab }: { onSwitchTab: () => void }) {
    const { signup } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
     const { toast } = useToast();

     const form = useForm<z.infer<typeof signupSchema>>({
        resolver: zodResolver(signupSchema),
        defaultValues: { firstName: "", lastName: "", email: "", password: "", confirmPassword: "", phone: "", ageRange: "", location: "" },
    });

     async function onSubmit(values: z.infer<typeof signupSchema>) {
        setIsSubmitting(true);
        await signup({
            name: `${values.firstName} ${values.lastName}`,
            email: values.email,
            phone: values.phone,
            age: values.ageRange,
            location: values.location,
        });
        setIsSubmitting(false);
    }
    
     const signInWithGoogle = async () => {
        setIsSubmitting(true);
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (error: any) {
             console.error("Google sign up error", error);
             if (error.code !== 'auth/popup-closed-by-user') {
                toast({
                    variant: "destructive",
                    title: "Sign-Up Error",
                    description: "An unexpected error occurred. Please try again."
                });
             }
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
         <Card className="glassmorphic">
            <CardHeader className="text-center">
                <h1 className="text-3xl font-bold">Sign Up</h1>
                <p className="text-muted-foreground">Create your AHH account</p>
            </CardHeader>
            <CardContent>
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

                        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create an account
                        </Button>
                         <div className="relative my-2">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-card px-2 text-muted-foreground">Or</span>
                            </div>
                        </div>
                         <Button variant="outline" className="w-full" size="lg" type="button" onClick={signInWithGoogle} disabled={isSubmitting}>
                             {isSubmitting ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                             ) : (
                                <Image src="https://www.google.com/favicon.ico" alt="Google" width={16} height={16} className="mr-2"/>
                             )}
                             Sign up with Google
                        </Button>
                    </form>
                </Form>
                 <p className="text-center text-sm text-muted-foreground mt-6">
                    Already have an account? <Button variant="link" className="p-0 h-auto" onClick={onSwitchTab}>Login</Button>
                </p>
            </CardContent>
        </Card>
    );
}


export default function LoginPage() {
  const [activeTab, setActiveTab] = useState("login");
  const { isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
        // This effect will run when the user state is confirmed.
        // The redirect logic is now centralized in the useAuth hook.
    }
  }, [user, isLoading, router]);

  return (
    <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
            <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-128px)]">
                {isLoading ? (
                    <Loader2 className="h-16 w-16 animate-spin text-primary" />
                ) : (
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-lg">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="login">Login</TabsTrigger>
                            <TabsTrigger value="signup">Sign Up</TabsTrigger>
                        </TabsList>
                        <TabsContent value="login">
                            <LoginForm onSwitchTab={() => setActiveTab("signup")} />
                        </TabsContent>
                        <TabsContent value="signup">
                            <SignUpForm onSwitchTab={() => setActiveTab("login")} />
                        </TabsContent>
                    </Tabs>
                )}
            </div>
        </main>
      <Footer />
    </div>
  );
}

    

    