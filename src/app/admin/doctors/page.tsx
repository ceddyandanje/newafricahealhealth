
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { HeartPulse, PlusCircle, Search, Edit, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const doctors = [
  { id: 'DOC001', name: 'Dr. John Smith', specialty: 'Cardiology', email: 'j.smith@health.com', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=doc1' },
  { id: 'DOC002', name: 'Dr. Emily Jones', specialty: 'Neurology', email: 'e.jones@health.com', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=doc2' },
  { id: 'DOC003', name: 'Dr. Michael Brown', specialty: 'Pediatrics', email: 'm.brown@health.com', status: 'On Leave', avatar: 'https://i.pravatar.cc/150?u=doc3' },
  { id: 'DOC004', name: 'Dr. Sarah Wilson', specialty: 'Dermatology', email: 's.wilson@health.com', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=doc4' },
];

export default function DoctorsPage() {
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
                        <AvatarImage src={doctor.avatar} alt={doctor.name} />
                        <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{doctor.name}</p>
                        <p className="text-sm text-muted-foreground">{doctor.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{doctor.specialty}</TableCell>
                  <TableCell>
                    <Badge variant={doctor.status === 'Active' ? 'default' : 'secondary'}>{doctor.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
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
