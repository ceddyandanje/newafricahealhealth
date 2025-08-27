
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRequests, updateRequestStatus } from '@/lib/refillRequests';
import { Loader2, Pill, Check, X, User, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/hooks/use-auth';
import { addLog } from '@/lib/logs';
import { addNotification } from '@/lib/notifications';

const statusVariant = {
    Pending: 'secondary',
    Approved: 'default',
    Rejected: 'destructive',
    Completed: 'outline',
} as const;

export default function DoctorPrescriptionsPage() {
    const { user } = useAuth();
    const { requests, isLoading } = useRequests(); // This fetches ALL requests
    const { toast } = useToast();
    const [isUpdating, setIsUpdating] = useState<string | null>(null);

    const handleUpdateStatus = async (requestId: string, patientId: string, medicationName: string, status: 'Approved' | 'Rejected') => {
        if (!user) return;
        setIsUpdating(requestId);

        try {
            await updateRequestStatus(requestId, status, user.id, user.name);

            addLog("INFO", `Doctor ${user.name} ${status.toLowerCase()} refill request for ${medicationName} (ID: ${requestId})`);
            addNotification({
                recipientId: patientId,
                type: "info",
                title: `Refill Request ${status}`,
                description: `Your request for ${medicationName} has been ${status.toLowerCase()} by your doctor.`
            });

            toast({
                title: `Request ${status}`,
                description: `The refill request for ${medicationName} has been ${status.toLowerCase()}.`
            });

        } catch (error) {
            console.error("Failed to update request:", error);
            toast({ variant: 'destructive', title: "Update Failed", description: "Could not update the request status." });
        } finally {
            setIsUpdating(null);
        }
    };

    return (
        <div className="p-6">
            <header className="py-6">
                 <h1 className="text-3xl font-bold flex items-center gap-3"><Pill className="w-8 h-8"/> Prescription Refills</h1>
                <p className="text-muted-foreground">Manage and approve pending refill requests from your patients.</p>
            </header>
            <Card>
                <CardHeader>
                    <CardTitle>Pending Refill Requests</CardTitle>
                    <CardDescription>Review the requests below and take action.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center items-center h-48">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : requests.filter(r => r.status === 'Pending').length > 0 ? (
                        <div className="space-y-4">
                            {requests.filter(r => r.status === 'Pending').map(req => (
                                <div key={req.id} className="border p-4 rounded-lg flex items-center justify-between hover:bg-muted/50 transition-colors">
                                    <div>
                                        <p className="font-semibold text-base">{req.medicationName}</p>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                            <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> {req.patientName}</span>
                                            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {new Date(req.requestDate).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button 
                                            size="sm" 
                                            className="bg-green-600 hover:bg-green-700" 
                                            onClick={() => handleUpdateStatus(req.id, req.patientId, req.medicationName, 'Approved')}
                                            disabled={isUpdating === req.id}
                                        >
                                            {isUpdating === req.id ? <Loader2 className="h-4 w-4 animate-spin"/> : <Check className="w-4 h-4"/>}
                                            Approve
                                        </Button>
                                         <Button 
                                            size="sm" 
                                            variant="destructive"
                                            onClick={() => handleUpdateStatus(req.id, req.patientId, req.medicationName, 'Rejected')}
                                            disabled={isUpdating === req.id}
                                        >
                                            {isUpdating === req.id ? <Loader2 className="h-4 w-4 animate-spin"/> : <X className="w-4 h-4"/>}
                                            Reject
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                         <div className="text-center py-12 text-muted-foreground">
                            <Pill className="mx-auto h-12 w-12 mb-4" />
                            <p>No pending refill requests.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
