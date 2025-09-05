
'use client';

import { useState, useEffect } from 'react';
import { Calendar, ChevronDown, Filter, Plus, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import AppointmentDialog from '@/components/patient/appointment-dialog';
import { useUsers } from '@/lib/users';
import { useBookingStore } from '@/hooks/use-booking-store';
import { useAppointments } from '@/lib/appointments';
import { useAuth } from '@/hooks/use-auth';

const statusVariant = {
    Upcoming: 'default',
    Completed: 'secondary',
    Cancelled: 'destructive',
    Pending: 'outline',
    Confirmed: 'default'
} as const;

export default function PatientAppointmentsPage() {
    const { user } = useAuth();
    const { users } = useUsers();
    const { appointments, isLoading } = useAppointments(false, user?.id);
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
                        {isLoading ? (
                            <div className="flex items-center justify-center h-48">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : (
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
                                {appointments.length > 0 ? appointments.map((apt) => (
                                    <TableRow key={apt.id}>
                                        <TableCell className="font-medium">{new Date(apt.appointmentDate).toLocaleDateString()}</TableCell>
                                        <TableCell>{new Date(apt.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</TableCell>
                                        <TableCell>{apt.doctorName}</TableCell>
                                        <TableCell>{apt.type}</TableCell>
                                        <TableCell>
                                            <Badge variant={statusVariant[apt.status]}>{apt.status}</Badge>
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
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                            You have no appointments yet.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
