

"use client"

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore"; 
import { Package, Heart, LogOut, User as UserIcon } from "lucide-react";

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

            // Create a user document in Firestore
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


function UserDashboard() {
    const { user } = useAuth();
    const { toast } = useToast();

    const handleLogout = async () => {
        await signOut(auth);
        toast({ title: "Logged Out", description: "You have been successfully logged out." });
    };

    // Mock order history
    const orderHistory = [
        { id: "ORD123", date: "2023-10-15", total: "Ksh 4,799", status: "Delivered" },
        { id: "ORD124", date: "2023-09-20", total: "Ksh 2,500", status: "Delivered" },
    ];
    
    if (!user) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <aside className="md:col-span-1">
                <Card className="glassmorphic">
                    <CardHeader className="items-center text-center">
                        <Avatar className="w-24 h-24 mb-4 border-2 border-primary">
                             <AvatarImage src={user.photoURL || "https://placehold.co/100x100.png"} alt={user.displayName || 'User'} data-ai-hint="smiling person"/>
                            <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <CardTitle>{user.displayName || "User"}</CardTitle>
                        <CardDescription>{user.email}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4">
                        <nav className="flex flex-col space-y-1">
                            <Button variant="ghost" className="justify-start gap-2"><UserIcon/> Profile</Button>
                            <Button variant="ghost" className="justify-start gap-2"><Package /> Orders</Button>
                            <Button variant="ghost" className="justify-start gap-2"><Heart/> Wishlist</Button>
                            <Button variant="ghost" onClick={handleLogout} className="justify-start text-destructive hover:text-destructive gap-2"><LogOut/> Logout</Button>
                        </nav>
                    </CardContent>
                </Card>
            </aside>

            <main className="md:col-span-3">
                <Card className="glassmorphic">
                    <CardHeader>
                        <CardTitle>Order History</CardTitle>
                        <CardDescription>View your past orders and their status.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <div className="space-y-4">
                         {orderHistory.map(order => (
                            <div key={order.id} className="flex justify-between items-center p-4 rounded-lg bg-background/50">
                                <div>
                                    <p className="font-bold">{order.id}</p>
                                    <p className="text-sm text-muted-foreground">{order.date}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold">{order.total}</p>
                                    <p className="text-sm text-green-500">{order.status}</p>
                                </div>
                            </div>
                         ))}
                       </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}


export default function ProfilePage() {
    const { user } = useAuth();
    const [currentTab, setCurrentTab] = useState("login");

    return (
        <div className="container mx-auto px-4 py-12">
            {user ? (
                <UserDashboard />
            ) : (
                <Card className="max-w-md mx-auto glassmorphic">
                    <CardHeader>
                         <CardTitle className="text-center text-2xl font-headline">
                           Welcome
                         </CardTitle>
                         <CardDescription className="text-center">
                           Please sign in or create an account to continue.
                         </cardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="login">Login</TabsTrigger>
                                <TabsTrigger value="signup">Sign Up</TabsTrigger>
                            </TabsList>
                            <TabsContent value="login" className="mt-6">
                                <LoginForm />
                            </TabsContent>
                            <TabsContent value="signup" className="mt-6">
                                <SignupForm onSignupSuccess={() => setCurrentTab("login")} />
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
