
'use client';

import { Settings, User, Bell, Lock, Palette, Heart, Phone, ShieldAlert, Home } from 'lucide-react';
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

export default function PatientSettingsPage() {
    const { theme, setTheme } = useTheme();
    const { user } = useAuth();

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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input id="name" defaultValue={user?.name || "Sarah"} />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" defaultValue={user?.email || "sarah@example.com"} disabled />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input id="phone" type="tel" placeholder="+254 712 345 678" />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="dob">Date of Birth</Label>
                                    <Input id="dob" type="date" />
                                </div>
                            </div>
                             <div className="space-y-1">
                                <Label htmlFor="address">Shipping Address</Label>
                                <Textarea id="address" placeholder="123 Health St, Nairobi, Kenya" />
                            </div>
                            <Button>Update Profile</Button>
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
                                     <Select>
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
                                    <Input id="primary-physician" placeholder="Dr. Jane Smith" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="allergies">Known Allergies</Label>
                                <Textarea id="allergies" placeholder="e.g., Penicillin, Peanuts, Pollen" />
                            </div>
                             <Separator />
                            <h3 className="text-base font-medium">Emergency Contact</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label htmlFor="emergency-name">Contact Name</Label>
                                    <Input id="emergency-name" placeholder="John Doe" />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="emergency-phone">Contact Phone</Label>
                                    <Input id="emergency-phone" type="tel" placeholder="+254 700 123 456" />
                                </div>
                            </div>
                             <Button>Update Medical Details</Button>
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
                            <Button>Change Password</Button>
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
