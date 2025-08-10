
'use client';

import { Pill, RefreshCcw, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const prescriptions = [
    { id: 'RX78901', name: 'Metformin 500mg', date: 'August 15, 2024', refillsLeft: 2, daysSupply: 30, daysLeft: 12, status: 'Active' },
    { id: 'RX78902', name: 'Lisinopril 10mg', date: 'August 15, 2024', refillsLeft: 5, daysSupply: 90, daysLeft: 72, status: 'Active' },
    { id: 'RX65432', name: 'Atorvastatin 20mg', date: 'May 10, 2024', refillsLeft: 0, daysSupply: 90, daysLeft: 0, status: 'Needs Refill' },
    { id: 'RX12345', name: 'Amoxicillin 500mg', date: 'April 01, 2024', refillsLeft: 0, daysSupply: 10, daysLeft: 0, status: 'Expired' },
];

const statusVariant = {
    Active: 'default',
    'Needs Refill': 'destructive',
    Expired: 'secondary',
} as const;

export default function PatientPrescriptionsPage() {
    return (
        <div className="p-6">
            <header className="py-6">
                <h1 className="text-3xl font-bold flex items-center gap-3"><Pill className="w-8 h-8"/> Prescriptions</h1>
                <p className="text-muted-foreground">Manage your medications and refills.</p>
            </header>
            <Card>
                <CardHeader>
                    <CardTitle>Your Medications</CardTitle>
                    <CardDescription>View your current and past prescriptions. You can request refills here.</CardDescription>
                     <div className="pt-4 flex justify-between items-center">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input placeholder="Search medications..." className="pl-10 max-w-sm" />
                        </div>
                        <Button variant="outline"><Filter className="mr-2 h-4 w-4"/> Filter by Status</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Medication</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Days Supply</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {prescriptions.map((rx) => (
                                <TableRow key={rx.id}>
                                    <TableCell className="font-medium">
                                        <p>{rx.name}</p>
                                        <p className="text-xs text-muted-foreground">Filled on {rx.date}</p>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={statusVariant[rx.status as keyof typeof statusVariant]}>{rx.status}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Progress value={(rx.daysLeft / rx.daysSupply) * 100} className="w-24"/>
                                            <span className="text-xs text-muted-foreground">{rx.daysLeft} days left</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button disabled={rx.status !== 'Needs Refill'}>
                                            <RefreshCcw className="mr-2 h-4 w-4"/> Request Refill
                                        </Button>
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
