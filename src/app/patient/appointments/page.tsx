
'use client';

import { useState, useEffect } from 'react';
import { Calendar, ChevronDown, Filter, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import AppointmentDialog from '@/components/patient/appointment-dialog';
import { useUsers } from '@/lib/users';
import { useBookingStore } from '@/hooks/use-booking-store';

const appointments = [
    { id: 'APT2301', date: 'October 30, 2024', time: '11:00 AM', doctor: 'Dr. Chen', type: 'Virtual Consultation', status: 'Upcoming' },
    { id: 'APT2289', date: 'August 15, 2024', time: '09:30 AM', doctor: 'Dr. Patel', type: 'Annual Check-up', status: 'Completed' },
    { id: 'APT2254', date: 'July 20, 2024', time: '02:00 PM', doctor: 'Dr. Singh', type: 'Follow-up', status: 'Completed' },
    { id: 'APT2198', date: 'May 05, 2024', time: '10:00 AM', doctor: 'Dr. Chen', type: 'Lab Results Review', status: 'Completed' },
];

const statusVariant = {
    Upcoming: 'default',
    Completed: 'secondary',
    Cancelled: 'destructive',
} as const;

export default function PatientAppointmentsPage() {
    const { users } = useUsers();
    const doctors = users.filter(u => u.role === 'doctor');
    const { isDialogOpen, openDialog, closeDialog, specialty } = useBookingStore();

    useEffect(() => {
        // This effect handles opening the dialog if the state indicates it should be open
        // (e.g., after redirect from services page).
        // The actual state change to open is done on the services page.
    }, [isDialogOpen]);

    return (
        <>
            <AppointmentDialog 
                isOpen={isDialogOpen} 
                onOpenChange={(open) => {
                    if (!open) {
                        closeDialog();
                    }
                }}
                doctors={doctors} 
                initialSpecialty={specialty}
            />
            <div className="p-6">
                <header className="py-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-3"><Calendar className="w-8 h-8"/> Appointments</h1>
                        <p className="text-muted-foreground">View and manage your appointments.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline"><Filter className="mr-2 h-4 w-4"/> Filter</Button>
                        <Button onClick={openDialog}><Plus className="mr-2 h-4 w-4"/> Book New</Button>
                    </div>
                </header>
                <Card>
                    <CardHeader>
                        <CardTitle>Your Appointment History</CardTitle>
                        <CardDescription>A log of your upcoming and past medical consultations.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Time</TableHead>
                                    <TableHead>Doctor</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {appointments.map((apt) => (
                                    <TableRow key={apt.id}>
                                        <TableCell className="font-medium">{apt.date}</TableCell>
                                        <TableCell>{apt.time}</TableCell>
                                        <TableCell>{apt.doctor}</TableCell>
                                        <TableCell>{apt.type}</TableCell>
                                        <TableCell>
                                            <Badge variant={statusVariant[apt.status as keyof typeof statusVariant]}>{apt.status}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm">
                                                        Options <ChevronDown className="ml-2 h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuItem>Reschedule</DropdownMenuItem>
                                                    <DropdownMenuItem>View Details</DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive">Cancel</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
