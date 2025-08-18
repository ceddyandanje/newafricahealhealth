
'use client';

import { useState, useEffect, useRef } from 'react';
import { Settings, User, Bell, Lock, Palette, Phone, ShieldAlert, Home, UploadCloud, Loader2 } from 'lucide-react';
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
import { useUsers, updateUserInFirestore, getMedicalProfile, updateUserMedicalProfile } from '@/lib/users';
import { useToast } from '@/hooks/use-toast';
import { addLog } from '@/lib/logs';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';


export default function PatientSettingsPage() {
    const { theme, setTheme } = useTheme();
    const { user, reauthenticateAndChangePassword } = useAuth();
    const { setUsers } = useUsers();
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);

    // State for profile form
    const [name, setName] = useState(user?.name || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [address, setAddress] = useState('');
    
    // State for medical form
    const [height, setHeight] = useState<number | ''>('');
    const [bloodType, setBloodType] = useState('');
    const [allergies, setAllergies] = useState('');
    const [primaryPhysician, setPrimaryPhysician] = useState('');
    const [emergencyName, setEmergencyName] = useState('');
    const [emergencyPhone, setEmergencyPhone] = useState('');

    // State for password form
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isPasswordChangeDialogOpen, setIsPasswordChangeDialogOpen] = useState(false);
    const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);


    useEffect(() => {
        // When the user context loads, update the form state
        if (user) {
            setName(user.name);
            setPhone(user.phone || '');

            const fetchProfile = async () => {
                const profile = await getMedicalProfile(user.id);
                if (profile) {
                    setBloodType(profile.bloodType);
                    setAllergies(profile.allergies);
                    setPrimaryPhysician(profile.primaryPhysician);
                    setEmergencyName(profile.emergencyContact.name);
                    setEmergencyPhone(profile.emergencyContact.phone);
                    setAddress(profile.address || '');
                    setHeight(profile.height || '');
                }
            }
            fetchProfile();
        }
    }, [user]);

    const handleProfileUpdate = async () => {
        if (!user) return;
        
        const updates = { name, phone };
        const success = await updateUserInFirestore(user.id, updates);

        if (success) {
             setUsers(prevUsers => 
                prevUsers.map(u => 
                    u.id === user.id 
                        ? { ...u, ...updates }
                        : u
                )
            );
            addLog("INFO", `User ${user.email} updated their profile info.`);
            toast({ title: "Profile Updated", description: "Your profile information has been saved." });
        } else {
             toast({ variant: 'destructive', title: "Update Failed", description: "Could not save profile changes." });
        }
    };
    
    const handleMedicalUpdate = async () => {
        if (!user) return;
        const medicalData = {
            bloodType,
            allergies,
            primaryPhysician,
            address,
            height: Number(height) || undefined,
            emergencyContact: {
                name: emergencyName,
                phone: emergencyPhone
            }
        };

        const success = await updateUserMedicalProfile(user.id, medicalData);

        if (success) {
            addLog("INFO", `User ${user.email} updated their medical details.`);
            toast({ title: "Medical Details Updated", description: "Your medical information has been securely saved." });
        } else {
            toast({ variant: 'destructive', title: "Update Failed", description: "Could not save medical details." });
        }
    }

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

            setUsers(prevUsers =>
                prevUsers.map(u =>
                    u.id === user.id ? { ...u, avatarUrl: downloadURL } : u
                )
            );

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
                <p className="text-muted-foreground">Manage your account, profile, and preferences.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><User /> Profile Information</CardTitle>
                            <CardDescription>Update your personal and contact details.</CardDescription>
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
                                <div className="space-y-1">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+254 712 345 678" />
                                </div>
                            </div>
                            <Button onClick={handleProfileUpdate}>Update Profile</Button>
                        </CardContent>
                    </Card>

                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><ShieldAlert /> Medical Details</CardTitle>
                            <CardDescription>This information is vital for your care team. Please keep it updated.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div className="space-y-1">
                                <Label htmlFor="address">Shipping Address</Label>
                                <Textarea id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="123 Health St, Nairobi, Kenya" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-1">
                                    <Label htmlFor="blood-type">Blood Type</Label>
                                     <Select value={bloodType} onValueChange={setBloodType}>
                                        <SelectTrigger id="blood-type">
                                            <SelectValue placeholder="Select..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="A+">A+</SelectItem>
                                            <SelectItem value="A-">A-</SelectItem>
                                            <SelectItem value="B+">B+</SelectItem>
                                            <SelectItem value="B-">B-</SelectItem>
                                            <SelectItem value="AB+">AB+</SelectItem>
                                            <SelectItem value="AB-">AB-</SelectItem>
                                            <SelectItem value="O+">O+</SelectItem>
                                            <SelectItem value="O-">O-</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="height">Height (cm)</Label>
                                    <Input id="height" type="number" value={height} onChange={(e) => setHeight(e.target.value === '' ? '' : Number(e.target.value))} placeholder="e.g., 175" />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="primary-physician">Primary Physician</Label>
                                    <Input id="primary-physician" value={primaryPhysician} onChange={(e) => setPrimaryPhysician(e.target.value)} placeholder="Dr. Jane Smith" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="allergies">Known Allergies</Label>
                                <Textarea id="allergies" value={allergies} onChange={(e) => setAllergies(e.target.value)} placeholder="e.g., Penicillin, Peanuts, Pollen" />
                            </div>
                             <Separator />
                            <h3 className="text-base font-medium">Emergency Contact</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label htmlFor="emergency-name">Contact Name</Label>
                                    <Input id="emergency-name" value={emergencyName} onChange={(e) => setEmergencyName(e.target.value)} placeholder="John Doe" />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="emergency-phone">Contact Phone</Label>
                                    <Input id="emergency-phone" type="tel" value={emergencyPhone} onChange={(e) => setEmergencyPhone(e.target.value)} placeholder="+254 700 123 456" />
                                </div>
                            </div>
                             <Button onClick={handleMedicalUpdate}>Update Medical Details</Button>
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
                            <CardDescription>Manage how you receive alerts.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="email-notifications" className="flex flex-col">
                                    <span>Email Notifications</span>
                                    <span className="text-xs text-muted-foreground">For receipts and important updates.</span>
                                </Label>
                                <Switch id="email-notifications" defaultChecked />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                 <Label htmlFor="sms-notifications" className="flex flex-col">
                                    <span>SMS Reminders</span>
                                    <span className="text-xs text-muted-foreground">For appointments and refills.</span>
                                 </Label>
                                <Switch id="sms-notifications" defaultChecked />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                 <Label htmlFor="push-notifications" className="flex flex-col">
                                    <span>Promotional Updates</span>
                                     <span className="text-xs text-muted-foreground">For new products and offers.</span>
                                 </Label>
                                <Switch id="push-notifications" />
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
