
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
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
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
            <div className="space-y-1">
                <Label htmlFor="signup-email">Email</Label>
                <Input id="signup-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-1">
                <Label htmlFor="signup-password">Password</Label>
                <Input id="signup-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full">Create Account</Button>
        </form>
    );
}

export default function LoginPage() {
    const { user } = useAuth();
    const [currentTab, setCurrentTab] = useState("login");
    const router = useRouter();

    useEffect(() => {
        if (user) {
            router.push('/profile');
        }
    }, [user, router]);

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
                        Please sign in or create an account to continue.
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
                </CardContent>
            </Card>
        </div>
    );
}
