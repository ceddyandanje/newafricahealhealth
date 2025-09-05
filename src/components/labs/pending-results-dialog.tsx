
'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { type LabRequest, LabRequestStatus } from '@/lib/types';
import { User, FlaskConical, Calendar, Clock, CheckCircle, Info, Beaker, Package, Check, FileUp } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { Card, CardContent, CardHeader } from '../ui/card';
import { updateLabRequestStatus } from '@/lib/lab';
import { useToast } from '@/hooks/use-toast';
import { addLog } from '@/lib/logs';

interface PendingResultsDialogProps {
    requests: LabRequest[];
    isOpen: boolean;
    onClose: () => void;
}

const statusVariant: { [key in LabRequestStatus]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
    'Pending': 'secondary',
    'In Progress': 'default',
    'Completed': 'outline',
    'Cancelled': 'destructive',
};

export default function PendingResultsDialog({ requests, isOpen, onClose }: PendingResultsDialogProps) {
    const { toast } = useToast();

    const handleUpdateStatus = async (id: string, newStatus: LabRequestStatus, testName: string) => {
        try {
            await updateLabRequestStatus(id, newStatus);
            addLog("INFO", `Lab request for ${testName} (ID: ${id}) updated to ${newStatus}.`);
            toast({ title: 'Status Updated', description: `Request for ${testName} is now ${newStatus}.` });
        } catch (error) {
            toast({ variant: 'destructive', title: 'Update Failed', description: 'Could not update request status.' });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 font-headline text-2xl">
                        <Clock /> Pending Results
                    </DialogTitle>
                    <DialogDescription>
                        These tests are currently in progress. Upload results when complete.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[60vh] -mx-6 px-6">
                    <div className="py-4 space-y-4">
                        {requests.length > 0 ? requests.map(request => (
                           <Card key={request.id} className="overflow-hidden">
                                <CardHeader className="p-3 bg-muted/50 flex flex-row justify-between items-center">
                                    <div>
                                        <p className="font-semibold text-lg">{request.testName}</p>
                                        <p className="text-sm text-muted-foreground flex items-center gap-2"><User className="h-4 w-4" /> {request.patientName}</p>
                                    </div>
                                    <Badge variant={statusVariant[request.status]}>{request.status}</Badge>
                                </CardHeader>
                                <CardContent className="p-4 space-y-3">
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-4 text-sm">
                                        <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground" /> <span>{new Date(request.requestedAt).toLocaleDateString()}</span></div>
                                        <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-muted-foreground" /> <span>{new Date(request.requestedAt).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</span></div>
                                        <div className="flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground" /> Requested by: {request.requestedBy}</div>
                                        <div className="flex items-center gap-2"><Beaker className="h-4 w-4 text-muted-foreground" /> Sample: {request.sampleType}</div>
                                        <div className="flex items-center gap-2"><Package className="h-4 w-4 text-muted-foreground" /> Sample Status: {request.sampleStatus}</div>
                                        <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-muted-foreground" /> Type: {request.requestType}</div>
                                    </div>
                                     {request.reason && <div className="flex items-start gap-2 text-sm pt-2 border-t"><Info className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" /> <p><strong>Reason:</strong> {request.reason}</p></div>}

                                    <div className="flex gap-2 pt-3 border-t">
                                        <Button size="sm" className="flex-1" onClick={() => handleUpdateStatus(request.id, 'Completed', request.testName)}>
                                            <FileUp className="mr-2 h-4 w-4" /> Upload Result & Complete
                                        </Button>
                                    </div>
                                </CardContent>
                           </Card>
                        )) : (
                            <div className="text-center text-muted-foreground py-16">
                                <p className="font-semibold">No tests are currently in progress.</p>
                                <p className="text-sm">Start a test from the 'New Requests' panel.</p>
                            </div>
                        )}
                    </div>
                </ScrollArea>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
