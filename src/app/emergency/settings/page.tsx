
'use client';

import { useState, useEffect, useRef } from 'react';
import { Settings, User, Bell, Lock, Palette, Phone, ShieldAlert, Home, UploadCloud, Loader2, CreditCard, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useTheme } from 'next-themes';
import { useAuth } from '@/hooks/use-auth';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { updateUserInFirestore } from '@/lib/users';
import { useToast } from '@/hooks/use-toast';
import { addLog } from '@/lib/logs';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';


export default function EmergencySettingsPage() {
    const { theme, setTheme } = useTheme();
    const { user, reauthenticateAndChangePassword, setUser } = useAuth();
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);

    // State for profile form
    const [name, setName] = useState(user?.name || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [serviceName, setServiceName] = useState(user?.name || '');
    const [certificationLevel, setCertificationLevel] = useState(user?.certificationLevel || 'EMT');

    // State for password form
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isPasswordChangeDialogOpen, setIsPasswordChangeDialogOpen] = useState(false);
    const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);


    useEffect(() => {
        if (user) {
            setName(user.name);
            setPhone(user.phone || '');
            setServiceName(user.name); // Default service name to user name
            setCertificationLevel(user.certificationLevel || 'EMT');
        }
    }, [user]);

    const handleProfileUpdate = async () => {
        if (!user) return;
        
        const updates = { name, phone, certificationLevel };
        const success = await updateUserInFirestore(user.id, updates);

        if (success) {
            setUser(prev => prev ? { ...prev, ...updates } : null);
            addLog("INFO", `User ${user.email} updated their profile info.`);
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

            addLog("INFO", `User ${user.email} updated their profile picture.`);
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
                <p className="text-muted-foreground">Manage your emergency service profile and preferences.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><User /> Dispatcher & Service Profile</CardTitle>
                            <CardDescription>Update your personal and service details.</CardDescription>
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
                                    <Label htmlFor="name">Dispatcher Name</Label>
                                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                                </div>
                                 <div className="space-y-1">
                                    <Label htmlFor="service-name">Service Name</Label>
                                    <Input id="service-name" value={serviceName} onChange={(e) => setServiceName(e.target.value)} placeholder="e.g. Phoenix Aviation" />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="phone">Contact Phone</Label>
                                    <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+254 712 345 678" />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="certificationLevel">Top Certification Level</Label>
                                    <Select value={certificationLevel} onValueChange={setCertificationLevel}>
                                        <SelectTrigger id="certificationLevel">
                                            <SelectValue placeholder="Select..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="First Responder">First Responder</SelectItem>
                                            <SelectItem value="EMT">EMT</SelectItem>
                                            <SelectItem value="Paramedic">Paramedic</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <Button onClick={handleProfileUpdate}>Update Profile</Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Lock /> Security</CardTitle>
                            <CardDescription>Manage your password and account security.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <Button onClick={() => setIsPasswordChangeDialogOpen(true)}>Change Password</Button>
                        </CardContent>
                    </Card>
                </div>

                 {/* Right Column */}
                <div className="lg:col-span-1 space-y-8">
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Bell /> Notifications</CardTitle>
                            <CardDescription>Manage how you receive incident alerts.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="push-notifications" className="flex flex-col">
                                    <span>Desktop Notifications</span>
                                    <span className="text-xs text-muted-foreground">For new incidents.</span>
                                </Label>
                                <Switch id="push-notifications" defaultChecked />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                 <Label htmlFor="sms-notifications" className="flex flex-col">
                                    <span>SMS Alerts</span>
                                     <span className="text-xs text-muted-foreground">For critical incidents.</span>
                                 </Label>
                                <Switch id="sms-notifications" />
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
                            Enter your current password, followed by a new password.
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
