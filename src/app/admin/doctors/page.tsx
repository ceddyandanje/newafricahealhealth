
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { HeartPulse, PlusCircle, Search, Edit, Trash2, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useUsers } from "@/lib/users";
import { useMemo } from "react";

export default function DoctorsPage() {
  const { users, isLoading } = useUsers();
  const doctors = useMemo(() => users.filter(user => user.role === 'doctor'), [users]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <HeartPulse className="w-8 h-8" />
          Doctors Management
        </h1>
        <Button><PlusCircle className="mr-2 h-4 w-4" /> Add Doctor</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Doctors</CardTitle>
          <CardDescription>View, edit, and manage all doctor profiles.</CardDescription>
           <div className="pt-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input placeholder="Search doctors by name or specialty..." className="pl-10 max-w-sm" />
          </div>
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
                        <TableHead>Doctor</TableHead>
                        <TableHead>Specialty</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {doctors.map((doctor) => (
                        <TableRow key={doctor.id}>
                        <TableCell>
                            <div className="flex items-center gap-3">
                            <Avatar>
                                <AvatarImage src={doctor.avatarUrl} alt={doctor.name} />
                                <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold whitespace-nowrap">{doctor.name}</p>
                                <p className="text-sm text-muted-foreground">{doctor.email}</p>
                            </div>
                            </div>
                        </TableCell>
                        <TableCell>{doctor.specialty || 'Not Set'}</TableCell>
                        <TableCell>
                            <Badge variant={doctor.status === 'active' ? 'default' : 'secondary'}>{doctor.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                            <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
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
