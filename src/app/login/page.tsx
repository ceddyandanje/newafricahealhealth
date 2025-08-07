
"use client"

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function LoginForm({ onLoginSuccess }: { onLoginSuccess?: () => void }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            toast({ title: "Login Successful", description: "Welcome back!" });
            if (onLoginSuccess) onLoginSuccess();
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
                <Label htmlFor="login-email">Email</Label>
                <Input id="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-1">
                <Label htmlFor="login-password">Password</Label>
                <Input id="login-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full">Login</Button>
        </form>
    );
}

function SignupForm({ onSignupSuccess }: { onSignupSuccess?: () => void }) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [ageRange, setAgeRange] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(db, "users", user.uid), {
                firstName,
                lastName,
                email: user.email,
                phoneNumber,
                ageRange,
                createdAt: serverTimestamp(),
            });

            toast({ title: "Signup Successful", description: "Your account has been created." });
            if (onSignupSuccess) onSignupSuccess();
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <Label htmlFor="first-name">First name</Label>
                    <Input id="first-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="last-name">Last name</Label>
                    <Input id="last-name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                </div>
            </div>
            <div className="space-y-1">
                <Label htmlFor="signup-email">Email</Label>
                <Input id="signup-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <Label htmlFor="phone-number">Phone Number</Label>
                    <Input id="phone-number" type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="age-range">Age Range</Label>
                     <Select onValueChange={setAgeRange} value={ageRange}>
                        <SelectTrigger id="age-range">
                            <SelectValue placeholder="Select your age" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="18-25">18-25</SelectItem>
                            <SelectItem value="26-35">26-35</SelectItem>
                            <SelectItem value="36-45">36-45</SelectItem>
                            <SelectItem value="46-55">46-55</SelectItem>
                            <SelectItem value="56+">56+</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="space-y-1">
                <Label htmlFor="signup-password">Password</Label>
                <Input id="signup-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div className="space-y-1">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full">Create Account</Button>
        </form>
    );
}

export default function LoginPage() {
    const { user } = useAuth();
    const searchParams = useSearchParams();
    const tabParam = searchParams.get('tab');
    const [currentTab, setCurrentTab] = useState(tabParam === 'signup' ? 'signup' : 'login');
    const router = useRouter();

    useEffect(() => {
        if (user) {
            router.push('/profile');
        }
    }, [user, router]);
    
    useEffect(() => {
        const newTab = searchParams.get('tab');
        if (newTab && newTab !== currentTab) {
            setCurrentTab(newTab === 'signup' ? 'signup' : 'login');
        }
    }, [searchParams, currentTab]);

    if (user) {
        return null; // or a loading spinner
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <Card className="max-w-md mx-auto glassmorphic">
                <CardHeader>
                        <CardTitle className="text-center text-2xl font-headline">
                           Welcome
                        </CardTitle>
                        <CardDescription className="text-center">
                            {currentTab === 'login' ? 'Sign in to your account' : 'Create your AHH account'}
                        </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="login">Login</TabsTrigger>
                            <TabsTrigger value="signup">Sign Up</TabsTrigger>
                        </TabsList>
                        <TabsContent value="login" className="mt-6">
                            <LoginForm onLoginSuccess={() => router.push('/profile')} />
                        </TabsContent>
                        <TabsContent value="signup" className="mt-6">
                            <SignupForm onSignupSuccess={() => setCurrentTab("login")} />
                        </TabsContent>
                    </Tabs>
                     <p className="text-center text-sm text-muted-foreground mt-6">
                        {currentTab === 'login' 
                            ? "Don't have an account? "
                            : "Already have an account? "
                        }
                        <Button variant="link" className="p-0 h-auto" onClick={() => setCurrentTab(currentTab === 'login' ? 'signup' : 'login')}>
                             {currentTab === 'login' ? "Sign up" : "Login"}
                        </Button>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
