
'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type RefillRequest } from '@/lib/refillRequests';
import { User, Pill, Calendar, Shield, DollarSign, Check, X, Circle } from 'lucide-react';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { cn } from '@/lib/utils';


interface RefillRequestDialogProps {
    requests: RefillRequest[];
    isOpen: boolean;
    onClose: () => void;
    // onUpdate: (id: string, updates: Partial<RefillRequest>) => void; // For future implementation
}

const statusVariant = {
    Pending: 'secondary',
    Approved: 'default',
    Rejected: 'destructive',
    Completed: 'outline',
} as const;


export default function RefillRequestDialog({ requests, isOpen, onClose }: RefillRequestDialogProps) {

    const handleUpdateStatus = (requestId: string, newStatus: 'Approved' | 'Rejected') => {
        // In a real app, you would call an update function passed via props
        console.log(`Updating request ${requestId} to ${newStatus}`);
        onClose(); // This would be more complex in a real app
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 font-headline text-2xl">
                        <Pill /> Pending Refill Requests
                    </DialogTitle>
                    <DialogDescription>
                        Review and process outstanding medication refill requests from patients.
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="max-h-[60vh] -mx-6 px-6">
                    <div className="py-4 space-y-4">
                        {requests.length > 0 ? requests.map(request => (
                           <Card key={request.id} className="overflow-hidden">
                                <CardHeader className="p-3 bg-muted/50 flex flex-row justify-between items-center">
                                    <div>
                                        <p className="font-semibold">{request.medicationName}</p>
                                        <p className="text-xs text-muted-foreground">For: {request.patientName}</p>
                                    </div>
                                    <Badge variant={statusVariant[request.status]}>{request.status}</Badge>
                                </CardHeader>
                                <CardContent className="p-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <span>{new Date(request.requestDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                                         <Badge variant={request.paymentStatus === 'Paid' ? 'default' : 'secondary'}>{request.paymentStatus}</Badge>
                                    </div>
                                    <div className="col-span-2 flex items-center gap-2">
                                        <div className="flex items-center gap-1.5">
                                            <span className={cn("h-2.5 w-2.5 rounded-full bg-slate-400 animate-pulse")}></span>
                                            <span className="text-xs text-muted-foreground">Chemist Offline</span>
                                        </div>
                                    </div>
                                    <div className="col-span-2 pt-2 border-t mt-1 flex gap-2">
                                        <Button size="sm" className="flex-1" onClick={() => handleUpdateStatus(request.id, 'Approved')}><Check className="mr-2 h-4 w-4"/>Approve</Button>
                                        <Button size="sm" className="flex-1" variant="destructive" onClick={() => handleUpdateStatus(request.id, 'Rejected')}><X className="mr-2 h-4 w-4"/>Reject</Button>
                                    </div>
                                </CardContent>
                           </Card>
                        )) : (
                            <div className="text-center text-muted-foreground py-10">
                                <p>No pending requests at the moment.</p>
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
