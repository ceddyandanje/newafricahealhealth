
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, PlusCircle, Search, Trash2, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useUsers, createUserInFirestore, updateUserInFirestore, deleteUserInFirestore } from "@/lib/users";
import { useAuth } from '@/hooks/use-auth';
import { type User, type UserRole, type UserStatus } from "@/lib/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { addLog } from '@/lib/logs';
import { addNotification } from '@/lib/notifications';

const userSchema = z.object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    role: z.enum(['admin', 'user', 'delivery-driver', 'emergency-services', 'doctor']),
});

function AddUserForm({ onSave, onOpenChange }: { onSave: (data: z.infer<typeof userSchema>) => void, onOpenChange: (open: boolean) => void }) {
    const form = useForm<z.infer<typeof userSchema>>({
        resolver: zodResolver(userSchema),
        defaultValues: { name: '', email: '', password: '', role: 'user' },
    });

    const handleSubmit = (values: z.infer<typeof userSchema>) => {
        onSave(values);
        onOpenChange(false);
        form.reset();
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="password" render={({ field }) => (
                    <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="role" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="user">User</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="delivery-driver">Delivery Driver</SelectItem>
                                <SelectItem value="emergency-services">Emergency Services</SelectItem>
                                <SelectItem value="doctor">Doctor</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )} />
                <DialogFooter>
                    <Button type="submit">Create User</Button>
                </DialogFooter>
            </form>
        </Form>
    );
}

function ManageUserDialog({ user, currentUser, onUpdate, onDelete, onOpenChange }: { user: User, currentUser: User | null, onUpdate: (id: string, data: Partial<User>) => void, onDelete: (id: string) => void, onOpenChange: (open: boolean) => void }) {
    const [role, setRole] = useState(user.role);
    const [status, setStatus] = useState(user.status);
    const isEditingSelf = currentUser?.id === user.id;
    const isEditingAdmin = user.role === 'admin';

    const handleUpdate = () => {
        onUpdate(user.id, { role, status: isEditingAdmin ? 'active' : status });
        onOpenChange(false);
    }
    
    return (
        <DialogContent>
            <DialogHeader>
                 <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                        <AvatarImage src={user.avatarUrl || `https://i.pravatar.cc/150?u=${user.email}`} alt={user.name} />
                        <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <DialogTitle className="text-2xl">{user.name}</DialogTitle>
                        <DialogDescription>{user.email}</DialogDescription>
                    </div>
                </div>
            </DialogHeader>

            <div className="py-4 space-y-4">
                 <div>
                    <Label htmlFor="role-select">Role</Label>
                    <Select value={role} onValueChange={(value) => setRole(value as UserRole)} disabled={isEditingSelf}>
                        <SelectTrigger id="role-select"><SelectValue /></SelectTrigger>
                        <SelectContent>
                             <SelectItem value="user">User</SelectItem>
                             <SelectItem value="admin">Admin</SelectItem>
                             <SelectItem value="delivery-driver">Delivery Driver</SelectItem>
                             <SelectItem value="emergency-services">Emergency Services</SelectItem>
                             <SelectItem value="doctor">Doctor</SelectItem>
                        </SelectContent>
                    </Select>
                    {isEditingSelf && <p className="text-xs text-muted-foreground mt-1">You cannot change your own role.</p>}
                 </div>
                 <div>
                    <Label htmlFor="status-select">Account Status</Label>
                    <Select value={status} onValueChange={(value) => setStatus(value as UserStatus)} disabled={isEditingAdmin}>
                        <SelectTrigger id="status-select"><SelectValue /></SelectTrigger>
                        <SelectContent>
                             <SelectItem value="active">Active</SelectItem>
                             <SelectItem value="on-hold">On Hold</SelectItem>
                             <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                    </Select>
                     {isEditingAdmin && <p className="text-xs text-muted-foreground mt-1">An admin's status cannot be changed.</p>}
                 </div>
            </div>

            <DialogFooter className="grid grid-cols-2 gap-2">
                <Button variant="destructive" onClick={() => onDelete(user.id)} disabled={isEditingSelf}><Trash2 className="mr-2 h-4 w-4"/> Delete User</Button>
                <Button onClick={handleUpdate}>Save Changes</Button>
            </DialogFooter>
        </DialogContent>
    )
}


export default function UsersPage() {
    const { users, setUsers, isLoading } = useUsers();
    const { user: currentUser } = useAuth();
    const [isAddUserOpen, setIsAddUserOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
    const { toast } = useToast();

    const handleAddUser = async (userData: z.infer<typeof userSchema>) => {
        if (users.some(u => u.email === userData.email)) {
            toast({ variant: 'destructive', title: "Creation Failed", description: "A user with this email already exists."});
            return;
        }
        const newUser = await createUserInFirestore(userData);
        if (newUser) {
            setUsers(prev => [...prev, newUser]);
            addLog('INFO', `New user created: ${newUser.name} (${newUser.email}) with role ${newUser.role}.`);
            addNotification({ type: 'new_appointment', title: 'New User Created', description: `An account for ${newUser.name} has been created.`});
            toast({ title: "User Created", description: `Account for ${newUser.name} has been created.`});
        } else {
            toast({ variant: 'destructive', title: "Creation Failed", description: "Could not create user in Firestore."});
        }
    };
    
    const handleUpdateUser = async (id: string, updates: Partial<User>) => {
        const success = await updateUserInFirestore(id, updates);
        if (success) {
            setUsers(prevUsers => prevUsers.map(u => u.id === id ? { ...u, ...updates } : u));
            const userToUpdate = users.find(u => u.id === id);
            addLog('INFO', `User ${userToUpdate?.name}'s details were updated.`);
            addNotification({ type: 'system_update', title: 'User Updated', description: `Details for ${userToUpdate?.name} have been updated.`});
            toast({ title: "User Updated", description: `Details for ${userToUpdate?.name} have been saved.`});
        } else {
            toast({ variant: 'destructive', title: "Update Failed", description: "Could not update user details." });
        }
        setSelectedUser(undefined);
    }
    
    const handleDeleteUser = async (id: string) => {
        const userToDelete = users.find(u => u.id === id);
        if (!userToDelete) return;

        const success = await deleteUserInFirestore(id);
        if (success) {
            setUsers(prevUsers => prevUsers.filter(u => u.id !== id));
            addLog('WARN', `User ${userToDelete.name} (${userToDelete.email}) was deleted.`);
            addNotification({ type: 'system_update', title: 'User Deleted', description: `The account for ${userToDelete.name} has been removed.`});
            toast({ title: "User Deleted", description: `Account for ${userToDelete.name} has been removed.`});
        } else {
             toast({ variant: 'destructive', title: "Deletion Failed", description: "Could not delete user." });
        }
        setSelectedUser(undefined);
    };

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    const statusBadgeVariant = {
        'active': 'default',
        'inactive': 'destructive',
        'on-hold': 'secondary'
    } as const;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Shield className="w-8 h-8" />
                    Users Management
                </h1>
                <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                    <DialogTrigger asChild>
                        <Button><PlusCircle className="mr-2 h-4 w-4" /> Add User</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader><DialogTitle>Add New User</DialogTitle></DialogHeader>
                        <AddUserForm onSave={handleAddUser} onOpenChange={setIsAddUserOpen} />
                    </DialogContent>
                </Dialog>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>All System Users</CardTitle>
                    <CardDescription>Click a user row to manage their account.</CardDescription>
                    <div className="pt-4 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input placeholder="Search users by name or email..." className="pl-10 max-w-sm" />
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                         <div className="flex items-center justify-center h-48">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                         </div>
                    ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date Joined</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id} onClick={() => setSelectedUser(user)} className="cursor-pointer">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={user.avatarUrl || `https://i.pravatar.cc/150?u=${user.email}`} alt={user.name} />
                                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-semibold">{user.name}</p>
                                                <p className="text-sm text-muted-foreground">{user.email}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'} className="capitalize">{user.role.replace('-', ' ')}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={statusBadgeVariant[user.status]} className="capitalize">{user.status}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        {formatDate(user.createdAt)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    )}
                </CardContent>
            </Card>
            
            <Dialog open={!!selectedUser} onOpenChange={(isOpen) => !isOpen && setSelectedUser(undefined)}>
                {selectedUser && <ManageUserDialog user={selectedUser} currentUser={currentUser} onUpdate={handleUpdateUser} onDelete={handleDeleteUser} onOpenChange={(isOpen) => !isOpen && setSelectedUser(undefined)} />}
            </Dialog>
        </div>
    );
}
