
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Shield, PlusCircle, Search, Edit, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getAllUsers, createUser, saveAllUsers } from "@/lib/users";
import { type User } from "@/lib/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const userSchema = z.object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    role: z.enum(['admin', 'user']),
});

// A slightly different schema for editing, where password is not required
const editUserSchema = userSchema.extend({
    password: z.string().min(8, 'Password must be at least 8 characters').or(z.literal('')),
});


function UserForm({ user, onSave, onOpenChange }: { user?: User, onSave: (data: User) => void, onOpenChange: (open: boolean) => void }) {
    const form = useForm<z.infer<typeof userSchema>>({
        resolver: zodResolver(user ? editUserSchema : userSchema),
        defaultValues: user ? { ...user, password: '' } : { name: '', email: '', password: '', role: 'user' },
    });

    const handleSubmit = (values: z.infer<typeof userSchema>) => {
        let passwordToSave = values.password;
        if(user && !values.password) {
            passwordToSave = user.password; // Keep old password if field is blank during edit
        }

        onSave({ ...values, id: user?.id || '', password: passwordToSave });
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
                    <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} disabled={!!user} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="password" render={({ field }) => (
                    <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" {...field} placeholder={user ? "Leave blank to keep unchanged" : ""} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="role" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="user">User</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )} />
                <DialogFooter>
                    <Button type="submit">Save</Button>
                </DialogFooter>
            </form>
        </Form>
    );
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | undefined>(undefined);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [deletingUser, setDeletingUser] = useState<User | undefined>(undefined);
    const { toast } = useToast();

    useEffect(() => {
        setUsers(getAllUsers());
    }, []);

    const handleSaveUser = (userData: User) => {
        let updatedUsers;
        if (editingUser) {
            // Edit existing user
             updatedUsers = users.map(u => (u.id === editingUser.id ? { ...u, ...userData } : u));
             toast({ title: "User Updated", description: `Details for ${userData.name} have been saved.`});
        } else {
            // Add new user
            if (getAllUsers().some(u => u.email === userData.email)) {
                toast({ variant: 'destructive', title: "Creation Failed", description: "A user with this email already exists."});
                return;
            }
            const newUser = createUser({name: userData.name, email: userData.email, password: userData.password});
            updatedUsers = [...users, newUser];
            toast({ title: "User Created", description: `Account for ${newUser.name} has been created.`});
        }
        setUsers(updatedUsers);
        saveAllUsers(updatedUsers);
        setEditingUser(undefined);
    };
    
    const handleDeleteUser = (userToDelete: User) => {
        if (users.length <= 1) {
            toast({ variant: 'destructive', title: "Action Forbidden", description: "You cannot delete the last user."});
            return;
        }
        const updatedUsers = users.filter(u => u.id !== userToDelete.id);
        setUsers(updatedUsers);
        saveAllUsers(updatedUsers);
        setDeletingUser(undefined);
        setIsDeleteConfirmOpen(false);
        toast({ title: "User Deleted", description: `Account for ${userToDelete.name} has been removed.`});
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Shield className="w-8 h-8" />
                    Users Management
                </h1>
                <Dialog open={isFormOpen} onOpenChange={(isOpen) => { if(!isOpen) setEditingUser(undefined); setIsFormOpen(isOpen);}}>
                    <DialogTrigger asChild>
                        <Button onClick={() => { setEditingUser(undefined); setIsFormOpen(true); }}><PlusCircle className="mr-2 h-4 w-4" /> Add User</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingUser ? 'Edit User' : 'Add New User'}</DialogTitle>
                        </DialogHeader>
                        <UserForm user={editingUser} onSave={handleSaveUser} onOpenChange={setIsFormOpen} />
                    </DialogContent>
                </Dialog>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>All System Users</CardTitle>
                    <CardDescription>Manage user accounts and roles.</CardDescription>
                    <div className="pt-4 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input placeholder="Search users by name or email..." className="pl-10 max-w-sm" />
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={`https://i.pravatar.cc/150?u=${user.email}`} alt={user.name} />
                                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-semibold">{user.name}</p>
                                                <p className="text-sm text-muted-foreground">{user.email}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'}>{user.role}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => { setEditingUser(user); setIsFormOpen(true); }}><Edit className="h-4 w-4" /></Button>
                                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => { setDeletingUser(user); setIsDeleteConfirmOpen(true);}}><Trash2 className="h-4 w-4" /></Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            
             <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete the user account for {deletingUser?.name}.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={() => handleDeleteUser(deletingUser!)}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
