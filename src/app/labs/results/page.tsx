
'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileText, Search, Loader2, Download, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useLabRequests } from '@/lib/lab';
import { type LabRequest } from '@/lib/types';

export default function LabResultsPage() {
    const { requests, isLoading } = useLabRequests();

    const completedRequests = useMemo(() => {
        return requests.filter(req => req.status === 'Completed');
    }, [requests]);

    return (
        <div className="p-6">
            <header className="py-6">
                <h1 className="text-3xl font-bold flex items-center gap-3"><FileText className="w-8 h-8"/> Results History</h1>
                <p className="text-muted-foreground">A log of all completed lab tests.</p>
            </header>
            <Card>
                <CardHeader>
                    <CardTitle>Completed Tests</CardTitle>
                    <CardDescription>Archive of all finalized test results.</CardDescription>
                     <div className="pt-4 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input placeholder="Search by patient or test..." className="pl-10 max-w-sm" />
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
                                        <TableHead>Date Completed</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {completedRequests.map((req) => (
                                        <TableRow key={req.id}>
                                            <TableCell className="font-medium">{req.testName}</TableCell>
                                            <TableCell>{req.patientName}</TableCell>
                                            <TableCell>{req.completedAt ? new Date(req.completedAt).toLocaleDateString() : 'N/A'}</TableCell>
                                            <TableCell className="text-right">
                                                <Button size="sm" variant="ghost"><Download className="mr-2 h-4 w-4"/> Download Result</Button>
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
