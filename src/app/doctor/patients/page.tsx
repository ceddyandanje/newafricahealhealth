
'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppointments } from "@/lib/appointments";
import { useAuth } from "@/hooks/use-auth";
import { useUsers } from "@/lib/users";
import { Loader2, Users, Search, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';

export default function DoctorPatientsPage() {
    const { user } = useAuth();
    const { users: allUsers, isLoading: isUsersLoading } = useUsers();
    const { appointments, isLoading: isAppointmentsLoading } = useAppointments(false, user?.id);
    const [searchTerm, setSearchTerm] = useState('');

    const patientList = useMemo(() => {
        if (!allUsers.length || !appointments.length) return [];

        const patientIds = new Set(appointments.map(apt => apt.patientId));
        const uniquePatients = allUsers.filter(u => patientIds.has(u.id));

        if (!searchTerm) {
            return uniquePatients;
        }

        return uniquePatients.filter(p => 
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.email.toLowerCase().includes(searchTerm.toLowerCase())
        );

    }, [allUsers, appointments, searchTerm]);
    
    const isLoading = isUsersLoading || isAppointmentsLoading;

    return (
        <div className="p-6">
            <header className="py-6">
                 <h1 className="text-3xl font-bold flex items-center gap-3"><Users className="w-8 h-8"/> My Patients</h1>
                <p className="text-muted-foreground">A list of patients you have had appointments with.</p>
            </header>
             <Card>
                <CardHeader>
                    <CardTitle>Patient Roster</CardTitle>
                    <CardDescription>Search for patients and view their profiles.</CardDescription>
                     <div className="pt-4 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input 
                            placeholder="Search patients by name or email..." 
                            className="pl-10 max-w-sm" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center items-center h-48">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : patientList.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {patientList.map(patient => (
                                <div key={patient.id} className="border p-4 rounded-lg flex items-center justify-between hover:bg-muted/50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage src={patient.avatarUrl} alt={patient.name} />
                                            <AvatarFallback>{patient.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-semibold">{patient.name}</p>
                                            <p className="text-sm text-muted-foreground">{patient.email}</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm">Profile</Button>
                                </div>
                            ))}
                        </div>
                    ) : (
                         <div className="text-center py-12 text-muted-foreground">
                            <User className="mx-auto h-12 w-12 mb-4" />
                            <p>No patients found matching your criteria.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
