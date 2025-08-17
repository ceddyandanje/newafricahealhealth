
'use client';

import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Edit, FileText, ListTodo, Users, MessageSquare, Pill, HandHeart, Bot, UserCheck } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { updateUserInFirestore } from '@/lib/users';
import { serviceCategories } from '@/lib/serviceCategories';
import AvailabilityDialog from '@/components/doctor/availability-dialog';

// Mock data - replace with real data fetching
const agenda = [
    { time: '09:00', patient: 'John Doe', type: 'Virtual Consultation', status: 'Confirmed' },
    { time: '10:30', patient: 'Jane Smith', type: 'Follow-up', status: 'Confirmed' },
    { time: '11:15', patient: 'Alex Johnson', type: 'New Patient Assessment', status: 'Arrived' },
    { time: '14:00', patient: 'Peter Pan', type: 'Lab Results Review', status: 'Confirmed' },
    { time: '15:30', patient: 'Mary Poppins', type: 'Post-Op Check-in', status: 'Confirmed' },
];

const actionItems = [
    { text: 'Approve 3 pending prescription refills', icon: Pill, href: '/doctor/prescriptions' },
    { text: 'Review new lab results for Jane Smith', icon: FileText, href: '/doctor/patients/jane-smith' },
    { text: 'Respond to 5 unread patient messages', icon: MessageSquare, href: '/doctor/messages' },
];

const specialtySchema = z.object({
    specialty: z.string().min(1, { message: "Please select your specialty" }),
});

function WelcomeDialog({ user, onSave }: { user: any; onSave: (specialty: string) => void }) {
    const form = useForm({
        resolver: zodResolver(specialtySchema),
    });

    const onSubmit = (data: z.infer<typeof specialtySchema>) => {
        onSave(data.specialty);
    };

    return (
        <Dialog open={true}>
            <DialogContent showCloseButton={false}>
                <DialogHeader>
                    <DialogTitle className="text-2xl">Welcome, {user.name}!</DialogTitle>
                    <DialogDescription>
                        To get started, please select your primary medical specialty. This will help us tailor your dashboard experience.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                        <FormField
                            control={form.control}
                            name="specialty"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Your Specialty</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select from the list..." />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {serviceCategories.map(cat => (
                                                <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full">Continue to Dashboard</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

function AgendaTimeline() {
    // This would be dynamically generated from agenda data
    const hours = Array.from({ length: 9 }, (_, i) => i + 9); // 9 AM to 5 PM
    return (
        <div className="relative w-full h-10 bg-muted rounded-full">
            {agenda.map(item => {
                const [hour, minute] = item.time.split(':').map(Number);
                const totalMinutes = (hour * 60) + minute;
                const startMinute = 9 * 60;
                const endMinute = 17 * 60;
                const percentage = ((totalMinutes - startMinute) / (endMinute - startMinute)) * 100;
                
                return (
                    <div key={item.time} className="absolute h-full flex items-center" style={{ left: `${percentage}%`}}>
                        <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    </div>
                )
            })}
        </div>
    )
}

export default function DoctorDashboardPage() {
    const { user, setUser } = useAuth();
    const [showWelcome, setShowWelcome] = useState(false);
    const [isAvailabilityOpen, setIsAvailabilityOpen] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        if (user && !user.specialty) {
            setShowWelcome(true);
        }
    }, [user]);

    const handleSaveSpecialty = async (specialty: string) => {
        if (!user) return;
        
        const success = await updateUserInFirestore(user.id, { specialty });

        if (success) {
            setUser(prevUser => prevUser ? { ...prevUser, specialty } : null);
            setShowWelcome(false);
            toast({
                title: "Profile Updated",
                description: `Your specialty has been set to ${specialty}.`
            });
        } else {
            toast({
                variant: 'destructive',
                title: "Update Failed",
                description: "Could not save your specialty. Please try again."
            });
        }
    };
    
    return (
        <>
            {showWelcome && user && <WelcomeDialog user={user} onSave={handleSaveSpecialty} />}
            
            <AvailabilityDialog isOpen={isAvailabilityOpen} onOpenChange={setIsAvailabilityOpen} />

            <div className="p-6">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Welcome back, {user?.name}</h1>
                        <p className="text-muted-foreground">Here’s what’s on your plate today. {user?.specialty && <span className="font-semibold text-primary">({user.specialty})</span>}</p>
                    </div>
                    <Button onClick={() => setIsAvailabilityOpen(true)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Set Availability
                    </Button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Agenda & Action Items */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><Calendar className="w-5 h-5"/> Today's Smart Agenda</CardTitle>
                                <CardDescription>A summary of your confirmed appointments for today.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <AgendaTimeline />
                               <ul className="space-y-2 mt-4">
                                    {agenda.map(item => (
                                        <li key={item.time} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 border border-transparent hover:border-border transition-all">
                                            <div className="flex flex-col items-center w-20">
                                                <div className="flex items-center gap-1 text-sm font-semibold text-primary">
                                                    <Clock className="w-4 h-4"/>
                                                    {item.time}
                                                </div>
                                                {item.status === 'Arrived' && (
                                                    <div className="text-xs font-bold text-green-600 bg-green-100 dark:bg-green-900/50 px-2 py-0.5 rounded-full mt-1">ARRIVED</div>
                                                )}
                                            </div>
                                            <div className="w-px bg-border h-10"></div>
                                            <div className="flex-grow">
                                                <p className="font-semibold">{item.patient}</p>
                                                <p className="text-sm text-muted-foreground">{item.type}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button variant="outline" size="sm"><Bot className="mr-2 h-4 w-4"/> AI Briefing</Button>
                                                <Button variant="secondary" size="sm"><UserCheck className="mr-2 h-4 w-4"/> Open File</Button>
                                            </div>
                                        </li>
                                    ))}
                               </ul>
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><ListTodo className="w-5 h-5"/> Action Items</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3">
                                    {actionItems.map(item => {
                                        const Icon = item.icon;
                                        return (
                                        <li key={item.text} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted">
                                            <div className="flex items-center gap-3">
                                                <Icon className="w-5 h-5 text-muted-foreground"/>
                                                <p>{item.text}</p>
                                            </div>
                                            <Link href={item.href}>
                                                <Button variant="secondary" size="sm">Go</Button>
                                            </Link>
                                        </li>
                                    )})}
                               </ul>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Stats & Quick Access */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5"/> My Patients</CardTitle>
                                <CardDescription>Quick statistics about your patient panel.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-around text-center">
                                    <div>
                                        <p className="text-3xl font-bold">128</p>
                                        <p className="text-xs text-muted-foreground">Total Patients</p>
                                    </div>
                                    <div>
                                        <p className="text-3xl font-bold">5</p>
                                        <p className="text-xs text-muted-foreground">New This Month</p>
                                    </div>
                                </div>
                                <Button className="w-full">Manage Patient Roster</Button>
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader>
                                <CardTitle>Recent Activity</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3 text-sm">
                                    <li className="flex items-center gap-3">
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback>JD</AvatarFallback>
                                        </Avatar>
                                        <p><span className="font-semibold">John Doe</span> scheduled a new virtual visit.</p>
                                    </li>
                                     <li className="flex items-center gap-3">
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback>SS</AvatarFallback>
                                        </Avatar>
                                        <p><span className="font-semibold">Sarah Smith</span> sent you a new message.</p>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

    