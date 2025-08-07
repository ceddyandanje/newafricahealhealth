
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, PlusCircle, Filter } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const appointments = [
  { id: 'APT001', patient: 'John Doe', doctor: 'Dr. Smith', date: '2023-10-27', time: '10:00 AM', status: 'Confirmed', patientAvatar: 'https://i.pravatar.cc/150?u=p1' },
  { id: 'APT002', patient: 'Jane Smith', doctor: 'Dr. Jones', date: '2023-10-27', time: '11:30 AM', status: 'Pending', patientAvatar: 'https://i.pravatar.cc/150?u=p2' },
  { id: 'APT003', patient: 'Peter Pan', doctor: 'Dr. Smith', date: '2023-10-28', time: '02:00 PM', status: 'Cancelled', patientAvatar: 'https://i.pravatar.cc/150?u=p3' },
  { id: 'APT004', patient: 'Mary Poppins', doctor: 'Dr. Brown', date: '2023-10-29', time: '09:00 AM', status: 'Completed', patientAvatar: 'https://i.pravatar.cc/150?u=p4' },
];

const statusVariant = {
    'Confirmed': 'default',
    'Pending': 'secondary',
    'Cancelled': 'destructive',
    'Completed': 'outline',
} as const;

export default function AppointmentsPage() {
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
                    <TableCell className="font-medium">{apt.id}</TableCell>
                    <TableCell>
                        <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={apt.patientAvatar} />
                                <AvatarFallback>{apt.patient.charAt(0)}</AvatarFallback>
                            </Avatar>
                            {apt.patient}
                        </div>
                    </TableCell>
                    <TableCell>{apt.doctor}</TableCell>
                    <TableCell>{apt.date} at {apt.time}</TableCell>
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
          </CardContent>
        </Card>
    </div>
  );
}
