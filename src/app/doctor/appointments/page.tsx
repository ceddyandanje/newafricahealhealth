
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppointments } from "@/lib/appointments";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, Calendar, User, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const statusVariant = {
    'Upcoming': 'default',
    'Confirmed': 'default',
    'Pending': 'secondary',
    'Cancelled': 'destructive',
    'Completed': 'outline',
} as const;

export default function DoctorAppointmentsPage() {
    const { user } = useAuth();
    const { appointments, isLoading } = useAppointments(false, user?.id);

    return (
        <div className="p-6">
            <header className="py-6">
                 <h1 className="text-3xl font-bold flex items-center gap-3"><Calendar className="w-8 h-8"/> My Appointments</h1>
                <p className="text-muted-foreground">An overview of all your scheduled appointments.</p>
            </header>
            <Card>
                <CardHeader>
                    <CardTitle>Appointment Schedule</CardTitle>
                    <CardDescription>Review upcoming, pending, and past appointments.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center items-center h-48">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : appointments.length > 0 ? (
                        <div className="space-y-4">
                            {appointments.map(apt => (
                                <div key={apt.id} className="border p-4 rounded-lg flex items-center justify-between hover:bg-muted/50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="flex flex-col items-center justify-center w-24">
                                            <p className="font-bold text-lg">{new Date(apt.appointmentDate).toLocaleDateString('en-US', { day: 'numeric' })}</p>
                                            <p className="text-sm text-muted-foreground">{new Date(apt.appointmentDate).toLocaleDateString('en-US', { month: 'short' })}</p>
                                        </div>
                                        <div className="border-l pl-4">
                                            <p className="font-semibold text-base">{apt.type}</p>
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                                <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> {apt.patientName}</span>
                                                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {new Date(apt.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Badge variant={statusVariant[apt.status]}>{apt.status}</Badge>
                                        <Button size="sm" variant="outline">View Details</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-muted-foreground">
                            <Calendar className="mx-auto h-12 w-12 mb-4" />
                            <p>No appointments found.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
