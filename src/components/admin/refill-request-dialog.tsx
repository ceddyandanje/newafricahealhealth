
'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type RefillRequest } from '@/lib/refillRequests';
import { User, Pill, Calendar, Shield, DollarSign, Check, X } from 'lucide-react';

interface RefillRequestDialogProps {
    request: RefillRequest;
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

export default function RefillRequestDialog({ request, isOpen, onClose }: RefillRequestDialogProps) {

    const handleUpdateStatus = (newStatus: 'Approved' | 'Rejected') => {
        // In a real app, you would call an update function passed via props
        console.log(`Updating request ${request.id} to ${newStatus}`);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Pill /> Refill Request Details
                    </DialogTitle>
                    <DialogDescription>
                        Review and process the medication refill request.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <div className="flex items-center gap-2">
                        <User className="text-muted-foreground" /> 
                        <div>
                            <p className="text-sm font-semibold">{request.patientName}</p>
                            <p className="text-xs text-muted-foreground">Patient ID: {request.patientId}</p>
                        </div>
                    </div>
                     <div className="flex items-center gap-2">
                        <Pill className="text-muted-foreground" />
                         <div>
                            <p className="text-sm font-semibold">{request.medicationName}</p>
                            <p className="text-xs text-muted-foreground">Prescription ID: {request.prescriptionId}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="text-muted-foreground" />
                        <div>
                             <p className="text-sm font-semibold">{new Date(request.requestDate).toLocaleString()}</p>
                             <p className="text-xs text-muted-foreground">Request Date</p>
                        </div>
                    </div>
                     <div className="flex items-center gap-2">
                        <Shield className="text-muted-foreground" />
                        <Badge variant={statusVariant[request.status]}>{request.status}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                        <DollarSign className="text-muted-foreground" />
                        <Badge variant={request.paymentStatus === 'Paid' ? 'default' : 'secondary'}>{request.paymentStatus}</Badge>
                    </div>
                     <div>
                        <Label htmlFor="approver" className="text-xs font-semibold">Assign Approver</Label>
                        <Select>
                            <SelectTrigger id="approver">
                                <SelectValue placeholder="Select Pharmacist..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="doc1">Dr. Jaylon Stanton</SelectItem>
                                <SelectItem value="doc2">Dr. Carla Schleifer</SelectItem>
                                <SelectItem value="doc3">Dr. Hanna Geidt</SelectItem>
                            </SelectContent>
                        </Select>
                     </div>
                </div>
                <DialogFooter className="grid grid-cols-2 gap-2">
                    <Button variant="destructive" onClick={() => handleUpdateStatus('Rejected')}>
                        <X className="mr-2" /> Reject
                    </Button>
                    <Button onClick={() => handleUpdateStatus('Approved')}>
                        <Check className="mr-2" /> Approve
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
