
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
import { useUsers } from '@/lib/users';
import { useToast } from '@/hooks/use-toast';
import { addLog } from '@/lib/logs';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';


export default function PatientSettingsPage() {
    const { theme, setTheme } = useTheme();
    const { user } = useAuth();
    const { users, setUsers } = useUsers();
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);

    // State for profile form
    const [name, setName] = useState(user?.name || '');
    const [phone, setPhone] = useState('');
    const [dob, setDob] = useState('');
    const [address, setAddress] = useState('');
    
    // State for medical form
    const [bloodType, setBloodType] = useState('');
    const [allergies, setAllergies] = useState('');
    const [primaryPhysician, setPrimaryPhysician] = useState('');
    const [emergencyName, setEmergencyName] = useState('');
    const [emergencyPhone, setEmergencyPhone] = useState('');

    useEffect(() => {
        // When the user context loads, update the name in our local state
        if (user) {
            setName(user.name);
        }
    }, [user]);

    const handleProfileUpdate = () => {
        if (!user) return;
        
        setUsers(prevUsers => 
            prevUsers.map(u => 
                u.id === user.id 
                    ? { ...u, name: name }
                    : u
            )
        );

        addLog("INFO", `User ${user.email} updated their profile name to "${name}".`);
        toast({ title: "Profile Updated", description: "Your profile information has been saved." });
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
                                        <AvatarImage src={user?.avatarUrl || `https://i.pravatar.cc/150?u=${user?.email}`} alt={user?.name} />
                                        <AvatarFallback className="text-3xl">{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
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
                                <div className="space-y-1">
                                    <Label htmlFor="dob">Date of Birth</Label>
                                    <Input id="dob" type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
                                </div>
                            </div>
                             <div className="space-y-1">
                                <Label htmlFor="address">Shipping Address</Label>
                                <Textarea id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="123 Health St, Nairobi, Kenya" />
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                             <Button onClick={() => toast({ title: "Coming Soon!", description: "This feature is not yet implemented."})}>Update Medical Details</Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Lock /> Security</CardTitle>
                            <CardDescription>Manage your password and account security.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div className="space-y-1">
                                <Label htmlFor="current-password">Current Password</Label>
                                <Input id="current-password" type="password" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label htmlFor="new-password">New Password</Label>
                                    <Input id="new-password" type="password" />
                                </div>
                                 <div className="space-y-1">
                                    <Label htmlFor="confirm-password">Confirm Password</Label>
                                    <Input id="confirm-password" type="password" />
                                </div>
                            </div>
                            <Button onClick={() => toast({ title: "Coming Soon!", description: "This feature is not yet implemented."})}>Change Password</Button>
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
        </div>
    );
}
