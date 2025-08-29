
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Beaker, Search, Loader2, FileUp, CheckCircle, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useLabRequests, updateLabRequestStatus } from '@/lib/lab';
import { type LabRequest, LabRequestStatus } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { addLog } from '@/lib/logs';

const statusVariant: { [key in LabRequestStatus]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
    'Pending': 'secondary',
    'In Progress': 'default',
    'Completed': 'outline',
    'Cancelled': 'destructive',
};

const statusIcon = {
    'Pending': Beaker,
    'In Progress': Clock,
    'Completed': CheckCircle,
    'Cancelled': Clock,
}

export default function LabRequestsPage() {
    const { requests, isLoading } = useLabRequests();
    const [filter, setFilter] = useState<string>('all');
    const { toast } = useToast();

    const filteredRequests = requests.filter(req => {
        if (filter === 'all') return true;
        return req.status.toLowerCase().replace(' ', '-') === filter;
    });

    const handleUpdateStatus = async (id: string, status: LabRequestStatus) => {
        try {
            await updateLabRequestStatus(id, status);
            addLog("INFO", `Lab request ${id} status updated to ${status}.`);
            toast({ title: 'Status Updated', description: `Request status has been changed to ${status}.` });
        } catch (error) {
            toast({ variant: 'destructive', title: 'Update Failed', description: 'Could not update request status.' });
        }
    };

    return (
        <div className="p-6">
            <header className="py-6">
                <h1 className="text-3xl font-bold flex items-center gap-3"><Beaker className="w-8 h-8"/> Test Requests</h1>
                <p className="text-muted-foreground">Manage incoming and ongoing lab test requests.</p>
            </header>
            <Card>
                <CardHeader>
                    <CardTitle>All Test Requests</CardTitle>
                    <CardDescription>View, manage, and update the status of all requests.</CardDescription>
                     <div className="pt-4 flex justify-between items-center">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input placeholder="Search by patient or test..." className="pl-10 max-w-sm" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex items-center justify-center h-48"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Test Name</TableHead>
                                        <TableHead>Patient</TableHead>
                                        <TableHead>Date Requested</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredRequests.map((req) => (
                                        <TableRow key={req.id}>
                                            <TableCell className="font-medium">{req.testName}</TableCell>
                                            <TableCell>{req.patientName}</TableCell>
                                            <TableCell>{new Date(req.requestedAt).toLocaleDateString()}</TableCell>
                                            <TableCell><Badge variant={statusVariant[req.status]}>{req.status}</Badge></TableCell>
                                            <TableCell className="text-right space-x-2">
                                                 {req.status === 'Pending' && (
                                                    <Button size="sm" onClick={() => handleUpdateStatus(req.id, 'In Progress')}>Start Test</Button>
                                                )}
                                                 {req.status === 'In Progress' && (
                                                    <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(req.id, 'Completed')}><FileUp className="mr-2 h-4 w-4"/> Upload Result</Button>
                                                )}
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
