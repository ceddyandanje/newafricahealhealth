
'use client';

import { useState, useEffect, useRef } from 'react';
import { Settings, User, Bell, Lock, Palette, UploadCloud, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useTheme } from 'next-themes';
import { useAuth } from '@/hooks/use-auth';
import { updateUserInFirestore, forceResetPassword } from '@/lib/users';
import { useToast } from '@/hooks/use-toast';
import { addLog } from '@/lib/logs';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';


export default function AdminSettingsPage() {
    const { theme, setTheme } = useTheme();
    const { user, setUser, reauthenticateAndChangePassword } = useAuth();
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);

    // State for profile form
    const [name, setName] = useState(user?.name || '');

    // State for password form
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isPasswordChangeDialogOpen, setIsPasswordChangeDialogOpen] = useState(false);
    const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);
    
    // State for force password reset
    const [newPasswordForce, setNewPasswordForce] = useState('');
    const [confirmPasswordForce, setConfirmPasswordForce] = useState('');
    const [isForceResetSubmitting, setIsForceResetSubmitting] = useState(false);


    useEffect(() => {
        if (user) {
            setName(user.name);
        }
    }, [user]);

    const handleProfileUpdate = async () => {
        if (!user) return;
        
        const updates = { name };
        const success = await updateUserInFirestore(user.id, updates);

        if (success) {
            setUser(prev => prev ? { ...prev, ...updates } : null);
            addLog("INFO", `Admin user ${user.email} updated their profile name.`);
            toast({ title: "Profile Updated", description: "Your profile information has been saved." });
        } else {
             toast({ variant: 'destructive', title: "Update Failed", description: "Could not save profile changes." });
        }
    };

    const handlePasswordChange = async () => {
        if (newPassword !== confirmPassword) {
            toast({ variant: 'destructive', title: "Password Mismatch", description: "The new passwords do not match." });
            return;
        }
        if (newPassword.length < 8) {
            toast({ variant: 'destructive', title: "Password Too Short", description: "Password must be at least 8 characters long." });
            return;
        }
        
        setIsPasswordSubmitting(true);
        const success = await reauthenticateAndChangePassword(currentPassword, newPassword);
        setIsPasswordSubmitting(false);

        if (success) {
            setIsPasswordChangeDialogOpen(false);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        }
    };

    const handleForcePasswordReset = async () => {
        if (!user) return;
        if (newPasswordForce !== confirmPasswordForce) {
            toast({ variant: 'destructive', title: "Password Mismatch", description: "The new passwords do not match." });
            return;
        }
        if (newPasswordForce.length < 8) {
            toast({ variant: 'destructive', title: "Password Too Short", description: "Password must be at least 8 characters long." });
            return;
        }

        setIsForceResetSubmitting(true);
        try {
            await forceResetPassword(newPasswordForce);
            addLog('WARN', `Admin ${user.email} set or reset their own password.`);
            toast({ title: 'Password Set Successfully', description: 'Your password has been changed. You can now log in using your email and new password.' });
            setNewPasswordForce('');
            setConfirmPasswordForce('');
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Reset Failed', description: error.message });
        } finally {
            setIsForceResetSubmitting(false);
        }
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !user) return;

        setIsUploading(true);
        const storageRef = ref(storage, `profile-pictures/${user.id}`);

        try {
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);

            await updateUserInFirestore(user.id, { avatarUrl: downloadURL });
            setUser(prev => prev ? { ...prev, avatarUrl: downloadURL } : null);

            addLog("INFO", `Admin user ${user.email} updated their profile picture.`);
            toast({ title: "Avatar Updated", description: "Your new profile picture has been saved." });

        } catch (error) {
            console.error("Error uploading image:", error);
            toast({ variant: 'destructive', title: "Upload Failed", description: "Could not upload your profile picture." });
        } finally {
            setIsUploading(false);
        }
    };
    
    return (
        <div className="p-6">
            <header className="py-6">
                <h1 className="text-3xl font-bold flex items-center gap-3"><Settings className="w-8 h-8"/> Settings</h1>
                <p className="text-muted-foreground">Manage your administrator account and application preferences.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><User /> Administrator Profile</CardTitle>
                            <CardDescription>Update your personal details.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div className="flex items-center gap-4">
                                <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                                    <Avatar className="h-24 w-24">
                                        <AvatarImage src={user?.avatarUrl || ''} alt={user?.name} />
                                        <AvatarFallback className="text-3xl">{user?.name?.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                    </Avatar>
                                    <div className={cn(
                                        "absolute inset-0 bg-black/50 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity",
                                        isUploading && "opacity-100"
                                    )}>
                                        {isUploading ? <Loader2 className="h-8 w-8 animate-spin text-white"/> : <UploadCloud className="h-8 w-8 text-white" />}
                                    </div>
                                    <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">{user?.name}</h3>
                                    <p className="text-muted-foreground">{user?.email}</p>
                                    <Button variant="link" className="p-0 h-auto" onClick={handleAvatarClick}>Change Photo</Button>
                                </div>
                            </div>
                            <Separator/>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" value={user?.email || ""} disabled />
                                </div>
                            </div>
                            <Button onClick={handleProfileUpdate}>Update Profile</Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Lock /> Account Security</CardTitle>
                            <CardDescription>Manage your password and account security.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <Button onClick={() => setIsPasswordChangeDialogOpen(true)}>Change Password...</Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Lock className="text-primary"/> Set or Reset Account Password</CardTitle>
                            <CardDescription>Use this to set a password if you signed up with Google, or to reset a forgotten password without needing the old one.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label htmlFor="new-password-force">New Password</Label>
                                    <Input id="new-password-force" type="password" value={newPasswordForce} onChange={(e) => setNewPasswordForce(e.target.value)} />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="confirm-password-force">Confirm New Password</Label>
                                    <Input id="confirm-password-force" type="password" value={confirmPasswordForce} onChange={(e) => setConfirmPasswordForce(e.target.value)} />
                                </div>
                            </div>
                            <Button variant="secondary" onClick={handleForcePasswordReset} disabled={isForceResetSubmitting}>
                                {isForceResetSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save New Password
                            </Button>
                        </CardContent>
                    </Card>
                </div>
                
                <div className="lg:col-span-1 space-y-8">
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Bell /> Notifications</CardTitle>
                            <CardDescription>Manage how you receive admin notifications.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="email-notifications" className="flex flex-col">
                                    <span>System Alerts</span>
                                    <span className="text-xs text-muted-foreground">For critical system events.</span>
                                </Label>
                                <Switch id="email-notifications" defaultChecked />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                 <Label htmlFor="sms-notifications" className="flex flex-col">
                                    <span>New User Signups</span>
                                    <span className="text-xs text-muted-foreground">When a new user registers.</span>
                                 </Label>
                                <Switch id="sms-notifications" defaultChecked />
                            </div>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Palette /> Appearance</CardTitle>
                            <CardDescription>Customize the look and feel.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="dark-mode" className="font-medium">Dark Mode</Label>
                                <Switch
                                id="dark-mode"
                                checked={theme === 'dark'}
                                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <AlertDialog open={isPasswordChangeDialogOpen} onOpenChange={setIsPasswordChangeDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Change Your Password</AlertDialogTitle>
                        <AlertDialogDescription>
                            Enter your current password, followed by a new password. This only works if you have an existing password.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-1">
                            <Label htmlFor="current-password">Current Password</Label>
                            <Input id="current-password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="new-password">New Password</Label>
                            <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="confirm-password">Confirm New Password</Label>
                            <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        </div>
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => {
                            setCurrentPassword('');
                            setNewPassword('');
                            setConfirmPassword('');
                        }}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handlePasswordChange} disabled={isPasswordSubmitting}>
                            {isPasswordSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Change Password
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
