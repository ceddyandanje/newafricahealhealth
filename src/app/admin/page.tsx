
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { collection, getDocs, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

interface AppUser {
    id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    ageRange?: string;
    role?: 'admin' | 'user';
    createdAt?: any;
}

export default function AdminPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [users, setUsers] = useState<AppUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
            return;
        }

        if (user) {
            const checkAdmin = async () => {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists() && userDoc.data().role !== 'admin') {
                    router.push('/profile');
                } else {
                    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
                        const usersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AppUser));
                        setUsers(usersData);
                        setLoading(false);
                    });
                     return () => unsubscribe();
                }
            };
            checkAdmin();
        }

    }, [user, authLoading, router]);
    

    if (authLoading || loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }
    
    return (
        <div className="container mx-auto px-4 py-12">
            <Card>
                <CardHeader>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>A list of all users in the system.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Joined</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((appUser) => (
                                <TableRow key={appUser.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarFallback>{appUser.firstName?.[0]}{appUser.lastName?.[0]}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{appUser.firstName} {appUser.lastName}</p>
                                                <p className="text-sm text-muted-foreground">{appUser.ageRange}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{appUser.email}</TableCell>
                                    <TableCell>{appUser.phoneNumber}</TableCell>
                                    <TableCell>
                                        <Badge variant={appUser.role === 'admin' ? 'default' : 'secondary'}>
                                            {appUser.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {appUser.createdAt?.toDate().toLocaleDateString()}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
