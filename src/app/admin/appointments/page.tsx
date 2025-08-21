
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, PlusCircle, Filter, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppointments } from "@/lib/appointments";
import { type Appointment } from "@/lib/types";

const statusVariant = {
    'Upcoming': 'default',
    'Confirmed': 'default',
    'Pending': 'secondary',
    'Cancelled': 'destructive',
    'Completed': 'outline',
} as const;

export default function AppointmentsPage() {
    const { appointments, isLoading } = useAppointments();

  return (
    <div className="p-6">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold flex items-center gap-2">
                <Calendar className="w-8 h-8" />
                Appointments
            </h1>
            <div className="flex gap-2">
                <Button variant="outline"><Filter className="mr-2 h-4 w-4" /> Filter</Button>
                <Button><PlusCircle className="mr-2 h-4 w-4" /> New Appointment</Button>
            </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Upcoming & Recent Appointments</CardTitle>
            <CardDescription>
              Manage all patient appointments from this dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
             {isLoading ? (
                <div className="flex items-center justify-center h-48">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
             ) : (
                <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Appointment ID</TableHead>
                          <TableHead>Patient</TableHead>
                          <TableHead>Doctor</TableHead>
                          <TableHead>Date & Time</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {appointments.map((apt) => (
                          <TableRow key={apt.id}>
                            <TableCell className="font-medium whitespace-nowrap">{apt.appointmentId}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={apt.patientAvatar} />
                                        <AvatarFallback>{apt.patientName.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <span className="whitespace-nowrap">{apt.patientName}</span>
                                </div>
                            </TableCell>
                            <TableCell className="whitespace-nowrap">{apt.doctorName}</TableCell>
                            <TableCell className="whitespace-nowrap">{new Date(apt.appointmentDate).toLocaleDateString()} at {new Date(apt.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</TableCell>
                            <TableCell>
                              <Badge variant={statusVariant[apt.status as keyof typeof statusVariant]}>{apt.status}</Badge>
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm">Details</Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                </div>
             )}
          </CardContent>
        </Card>
    </div>
  );
}
