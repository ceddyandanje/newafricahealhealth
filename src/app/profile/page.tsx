
"use client"

import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { Package, Heart, LogOut, User as UserIcon, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <UserDashboard />
        </div>
    );
}
