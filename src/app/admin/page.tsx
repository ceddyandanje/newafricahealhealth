
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { AppUser } from '@/hooks/use-auth';


export default function AdminPage() {
    const { user, appUser, isAdmin, loading: authLoading } = useAuth();
    const router = useRouter();
    const [users, setUsers] = useState<AppUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                router.push('/login');
            } else if (!isAdmin) {
                router.push('/profile');
            } else {
                const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
                    const usersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AppUser));
                    setUsers(usersData);
                    setLoading(false);
                }, (error) => {
                    console.error("Error fetching users:", error);
                    setLoading(false);
                });
                return () => unsubscribe();
            }
        }
    }, [user, isAdmin, authLoading, router]);

    if (authLoading || loading || !isAdmin) {
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
                            {users.map((appUserItem) => (
                                <TableRow key={appUserItem.uid}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarFallback>{appUserItem.firstName?.[0]}{appUserItem.lastName?.[0]}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{appUserItem.firstName} {appUserItem.lastName}</p>
                                                <p className="text-sm text-muted-foreground">{appUserItem.ageRange}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{appUserItem.email}</TableCell>
                                    <TableCell>{appUserItem.phoneNumber}</TableCell>
                                    <TableCell>
                                        <Badge variant={appUserItem.role === 'admin' ? 'default' : 'secondary'}>
                                            {appUserItem.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {appUserItem.createdAt?.toDate().toLocaleDateString()}
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
