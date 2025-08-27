
'use client';

import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Edit, FileText, ListTodo, Users, MessageSquare, Pill, Bot, UserCheck } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { updateUserInFirestore } from '@/lib/users';
import { serviceCategories } from '@/lib/serviceCategories';
import AvailabilityDialog from '@/components/doctor/availability-dialog';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { useAppointments } from '@/lib/appointments';
import { useRequests } from '@/lib/refillRequests';
import { Appointment } from '@/lib/types';

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

function AgendaTimeline({ appointments }: { appointments: Appointment[] }) {
    const hours = Array.from({ length: 9 }, (_, i) => i + 9); // 9 AM to 5 PM (17:00)
    
    const calculatePosition = (time: string) => {
        const appointmentTime = new Date(time);
        const hour = appointmentTime.getHours();
        const minute = appointmentTime.getMinutes();
        const totalMinutes = (hour * 60) + minute;
        const startMinute = 9 * 60;
        const endMinute = 17 * 60; // 5 PM
        const duration = endMinute - startMinute;
        const percentage = ((totalMinutes - startMinute) / duration) * 100;
        return Math.max(0, Math.min(100, percentage)); // Clamp between 0 and 100
    }

    return (
        <TooltipProvider>
            <div className="w-full space-y-2 pt-2">
                <div className="relative h-4 bg-muted rounded-full">
                     {appointments.map(item => (
                        <Tooltip key={item.id}>
                            <TooltipTrigger asChild>
                                <div 
                                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full hover:scale-125 transition-transform" 
                                    style={{ left: `${calculatePosition(item.appointmentDate)}%` }}
                                />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="font-semibold">{item.patientName}</p>
                                <p className="text-sm text-muted-foreground">{new Date(item.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'})}</p>
                            </TooltipContent>
                        </Tooltip>
                    ))}
                </div>
                 <div className="flex justify-between text-xs text-muted-foreground px-1">
                    {hours.map(hour => (
                        <span key={hour} className="w-8 text-center">{hour % 12 === 0 ? 12 : hour % 12}{hour < 12 ? 'a' : 'p'}</span>
                    ))}
                </div>
            </div>
        </TooltipProvider>
    )
}

export default function DoctorDashboardPage() {
    const { user, setUser } = useAuth();
    const { appointments } = useAppointments(false, user?.id);
    const { requests: refillRequests } = useRequests();
    const [showWelcome, setShowWelcome] = useState(false);
    const [isAvailabilityOpen, setIsAvailabilityOpen] = useState(false);
    const { toast } = useToast();

    const todaysAppointments = useMemo(() => {
        const today = new Date();
        return appointments
            .filter(apt => new Date(apt.appointmentDate).toDateString() === today.toDateString())
            .sort((a,b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime());
    }, [appointments]);

    const pendingRefillRequests = useMemo(() => {
        return refillRequests.filter(req => req.status === 'Pending');
    }, [refillRequests]);

    const actionItems = [
        { text: `Approve ${pendingRefillRequests.length} pending prescription refills`, icon: Pill, href: '/doctor/prescriptions', count: pendingRefillRequests.length },
        { text: 'Review 2 new lab results', icon: FileText, href: '#', count: 2 },
        { text: 'Respond to 5 unread patient messages', icon: MessageSquare, href: '/doctor/messages', count: 5 },
    ].filter(item => item.count > 0);

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
                        <h1 className="text-3xl font-bold">Welcome back, Dr. {user?.name.split(' ').slice(-1)}</h1>
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
                                <AgendaTimeline appointments={todaysAppointments} />
                               {todaysAppointments.length > 0 ? (
                                <ul className="space-y-2 mt-4">
                                    {todaysAppointments.map(item => (
                                        <li key={item.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 border border-transparent hover:border-border transition-all">
                                            <div className="flex flex-col items-center w-20">
                                                <div className="flex items-center gap-1 text-sm font-semibold text-primary">
                                                    <Clock className="w-4 h-4"/>
                                                    {new Date(item.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'})}
                                                </div>
                                                {item.status === 'Confirmed' && ( // Example status
                                                    <div className="text-xs font-bold text-blue-600 bg-blue-100 dark:bg-blue-900/50 px-2 py-0.5 rounded-full mt-1">CONFIRMED</div>
                                                )}
                                            </div>
                                            <div className="w-px bg-border h-10"></div>
                                            <div className="flex-grow">
                                                <p className="font-semibold">{item.patientName}</p>
                                                <p className="text-sm text-muted-foreground">{item.type}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button variant="outline" size="sm"><Bot className="mr-2 h-4 w-4"/> AI Briefing</Button>
                                                <Button variant="secondary" size="sm"><UserCheck className="mr-2 h-4 w-4"/> Open File</Button>
                                            </div>
                                        </li>
                                    ))}
                               </ul>
                               ) : (
                                <div className="text-center py-8 text-muted-foreground">No appointments scheduled for today.</div>
                               )}
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><ListTodo className="w-5 h-5"/> Action Items</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {actionItems.length > 0 ? (
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
                                ) : (
                                    <div className="text-center py-4 text-muted-foreground">No pending action items.</div>
                                )}
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
                                <Button className="w-full" asChild><Link href="/doctor/patients">Manage Patient Roster</Link></Button>
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
