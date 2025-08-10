
'use client';

import { useState } from 'react';
import { Pill, RefreshCcw, Filter, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { addLog } from '@/lib/logs';
import { addNotification } from '@/lib/notifications';
import { useAuth } from '@/hooks/use-auth';
import { addRequest } from '@/lib/refillRequests';

type Prescription = {
    id: string;
    name: string;
    date: string;
    refillsLeft: number;
    daysSupply: number;
    daysLeft: number;
    status: 'Active' | 'Needs Refill' | 'Expired' | 'Refill Requested';
    isRequesting?: boolean;
};

const initialPrescriptions: Prescription[] = [
    { id: 'RX78901', name: 'Metformin 500mg', date: 'August 15, 2024', refillsLeft: 2, daysSupply: 30, daysLeft: 12, status: 'Active' },
    { id: 'RX78902', name: 'Lisinopril 10mg', date: 'August 15, 2024', refillsLeft: 5, daysSupply: 90, daysLeft: 72, status: 'Active' },
    { id: 'RX65432', name: 'Atorvastatin 20mg', date: 'May 10, 2024', refillsLeft: 0, daysSupply: 90, daysLeft: 0, status: 'Needs Refill' },
    { id: 'RX12345', name: 'Amoxicillin 500mg', date: 'April 01, 2024', refillsLeft: 0, daysSupply: 10, daysLeft: 0, status: 'Expired' },
];

const statusVariant = {
    Active: 'default',
    'Needs Refill': 'destructive',
    Expired: 'secondary',
    'Refill Requested': 'outline',
} as const;


export default function PatientPrescriptionsPage() {
    const [prescriptions, setPrescriptions] = useState<Prescription[]>(initialPrescriptions);
    const { toast } = useToast();
    const { user } = useAuth();

    const handleRequestRefill = async (rxId: string) => {
        setPrescriptions(prev => prev.map(rx => rx.id === rxId ? { ...rx, isRequesting: true } : rx));

        const prescription = prescriptions.find(rx => rx.id === rxId);
        if (!prescription || !user) {
             setPrescriptions(prev => prev.map(rx => rx.id === rxId ? { ...rx, isRequesting: false } : rx));
            return;
        };

        try {
            // Create a structured request in Firestore
            await addRequest({
                patientId: user.id,
                patientName: user.name,
                prescriptionId: prescription.id,
                medicationName: prescription.name,
            });

            // Update local UI state
            setPrescriptions(prev => prev.map(rx => rx.id === rxId ? { ...rx, status: 'Refill Requested', isRequesting: false } : rx));

            // Show confirmation toast
            toast({
                title: "Refill Requested",
                description: `Your request for ${prescription.name} has been sent.`,
            });
            
            // Add a generic log and notification for system-wide visibility
            addLog('INFO', `Patient ${user.name} requested refill for ${prescription.name} (ID: ${prescription.id})`);
            addNotification({
                type: 'info',
                title: 'Refill Request',
                description: `A new refill request from ${user.name} is pending approval.`,
            });

        } catch (error) {
             console.error("Failed to request refill:", error);
             toast({
                variant: 'destructive',
                title: "Request Failed",
                description: "There was a problem submitting your request. Please try again.",
            });
             setPrescriptions(prev => prev.map(rx => rx.id === rxId ? { ...rx, isRequesting: false } : rx));
        }
    }

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
                                        <Badge variant={statusVariant[rx.status]}>{rx.status}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Progress value={(rx.daysLeft / rx.daysSupply) * 100} className="w-24"/>
                                            <span className="text-xs text-muted-foreground">{rx.daysLeft > 0 ? `${rx.daysLeft} days left` : '-'}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button 
                                            disabled={rx.status !== 'Needs Refill' || rx.isRequesting}
                                            onClick={() => handleRequestRefill(rx.id)}
                                        >
                                            {rx.isRequesting ? (
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                            ) : (
                                                <RefreshCcw className="mr-2 h-4 w-4"/>
                                            )}
                                            {rx.status === 'Refill Requested' ? 'Requested' : 'Request Refill'}
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
