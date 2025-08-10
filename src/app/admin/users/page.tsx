
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Shield, PlusCircle, Search, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getAllUsers, createUser, saveAllUsers } from "@/lib/users";
import { type User, type UserRole, type UserStatus } from "@/lib/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

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

function ManageUserDialog({ user, onUpdate, onDelete, onOpenChange }: { user: User, onUpdate: (data: Partial<User>) => void, onDelete: () => void, onOpenChange: (open: boolean) => void }) {
    const [role, setRole] = useState(user.role);
    const [status, setStatus] = useState(user.status);

    const handleUpdate = () => {
        onUpdate({ role, status });
        onOpenChange(false);
    }
    
    return (
        <DialogContent>
            <DialogHeader>
                 <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                        <AvatarImage src={`https://i.pravatar.cc/150?u=${user.email}`} alt={user.name} />
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
                    <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
                        <SelectTrigger id="role-select"><SelectValue /></SelectTrigger>
                        <SelectContent>
                             <SelectItem value="user">User</SelectItem>
                             <SelectItem value="admin">Admin</SelectItem>
                             <SelectItem value="delivery-driver">Delivery Driver</SelectItem>
                             <SelectItem value="emergency-services">Emergency Services</SelectItem>
                             <SelectItem value="doctor">Doctor</SelectItem>
                        </SelectContent>
                    </Select>
                 </div>
                 <div>
                    <Label htmlFor="status-select">Account Status</Label>
                    <Select value={status} onValueChange={(value) => setStatus(value as UserStatus)}>
                        <SelectTrigger id="status-select"><SelectValue /></SelectTrigger>
                        <SelectContent>
                             <SelectItem value="active">Active</SelectItem>
                             <SelectItem value="on-hold">On Hold</SelectItem>
                             <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                    </Select>
                 </div>
            </div>

            <DialogFooter className="grid grid-cols-2 gap-2">
                <Button variant="destructive" onClick={onDelete}><Trash2 className="mr-2 h-4 w-4"/> Delete User</Button>
                <Button onClick={handleUpdate}>Save Changes</Button>
            </DialogFooter>
        </DialogContent>
    )
}


export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [isAddUserOpen, setIsAddUserOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
    const { toast } = useToast();

    useEffect(() => {
        setUsers(getAllUsers());
    }, []);

    const handleAddUser = (userData: z.infer<typeof userSchema>) => {
        if (getAllUsers().some(u => u.email === userData.email)) {
            toast({ variant: 'destructive', title: "Creation Failed", description: "A user with this email already exists."});
            return;
        }
        const newUser = createUser(userData);
        const updatedUsers = [...users, newUser];
        setUsers(updatedUsers);
        saveAllUsers(updatedUsers);
        toast({ title: "User Created", description: `Account for ${newUser.name} has been created.`});
    };
    
    const handleUpdateUser = (updates: Partial<User>) => {
        if (!selectedUser) return;
        const updatedUsers = users.map(u => u.id === selectedUser.id ? { ...u, ...updates } : u);
        setUsers(updatedUsers);
        saveAllUsers(updatedUsers);
        toast({ title: "User Updated", description: `Details for ${selectedUser.name} have been saved.`});
        setSelectedUser(undefined);
    }
    
    const handleDeleteUser = () => {
        if (!selectedUser) return;

        if (users.length <= 1) {
            toast({ variant: 'destructive', title: "Action Forbidden", description: "You cannot delete the last user."});
            return;
        }
        const updatedUsers = users.filter(u => u.id !== selectedUser.id);
        setUsers(updatedUsers);
        saveAllUsers(updatedUsers);
        toast({ title: "User Deleted", description: `Account for ${selectedUser.name} has been removed.`});
        setSelectedUser(undefined);
    };

    const formatDate = (dateString: string) => {
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
                </CardContent>
            </Card>
            
            <Dialog open={!!selectedUser} onOpenChange={(isOpen) => !isOpen && setSelectedUser(undefined)}>
                {selectedUser && <ManageUserDialog user={selectedUser} onUpdate={handleUpdateUser} onDelete={handleDeleteUser} onOpenChange={(isOpen) => !isOpen && setSelectedUser(undefined)} />}
            </Dialog>
        </div>
    );
}
