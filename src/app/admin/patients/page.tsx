
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Users, PlusCircle, Search, Edit, Trash2, FileDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const patients = [
  { id: 'PAT001', name: 'John Doe', email: 'john.doe@example.com', phone: '+254712345678', lastVisit: '2023-10-20', avatar: 'https://i.pravatar.cc/150?u=p1' },
  { id: 'PAT002', name: 'Jane Smith', email: 'jane.smith@example.com', phone: '+254712345679', lastVisit: '2023-09-15', avatar: 'https://i.pravatar.cc/150?u=p2' },
  { id: 'PAT003', name: 'Peter Pan', email: 'peter.pan@example.com', phone: '+254712345680', lastVisit: '2023-10-25', avatar: 'https://i.pravatar.cc/150?u=p3' },
  { id: 'PAT004', name: 'Mary Poppins', email: 'mary.poppins@example.com', phone: '+254712345681', lastVisit: '2023-08-01', avatar: 'https://i.pravatar.cc/150?u=p4' },
];

export default function PatientsPage() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Users className="w-8 h-8" />
          Patients Management
        </h1>
        <div className="flex gap-2">
            <Button variant="outline"><FileDown className="mr-2 h-4 w-4" /> Export</Button>
            <Button><PlusCircle className="mr-2 h-4 w-4" /> Add Patient</Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Patients</CardTitle>
          <CardDescription>View, edit, and manage all patient records.</CardDescription>
          <div className="pt-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input placeholder="Search patients by name, email, or phone..." className="pl-10 max-w-sm" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Last Visit</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={patient.avatar} alt={patient.name} />
                            <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold whitespace-nowrap">{patient.name}</p>
                            <p className="text-sm text-muted-foreground">{patient.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                            <p className="whitespace-nowrap">{patient.email}</p>
                            <p className="text-sm text-muted-foreground whitespace-nowrap">{patient.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">{patient.lastVisit}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
