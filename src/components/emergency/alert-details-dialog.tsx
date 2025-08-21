
'use client';

import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { type EmergencyRequest, type EmergencyUnit } from '@/lib/types';
import { User, MapPin, Clock, Info, Send, Check, MessageSquare } from 'lucide-react';

interface AlertDetailsDialogProps {
  alert: EmergencyRequest;
}

// Mock data, in a real app this would come from a data source
const availableUnits: EmergencyUnit[] = [
    { id: 'G-01', type: 'Ground', status: 'Available', currentLocation: { latitude: 0, longitude: 0 } },
    { id: 'A-01', type: 'Air', status: 'Available', currentLocation: { latitude: 0, longitude: 0 } },
];

export default function AlertDetailsDialog({ alert }: AlertDetailsDialogProps) {

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  return (
    <DialogContent className="sm:max-w-2xl">
      <DialogHeader>
        <DialogTitle className="font-headline text-2xl">Incident Details: {alert.id}</DialogTitle>
        <DialogDescription>
            Dispatching for a <span className="font-semibold text-destructive">{alert.serviceType}</span> request.
        </DialogDescription>
      </DialogHeader>

      <div className="grid md:grid-cols-2 gap-6 py-4">
        {/* Left column: Incident info */}
        <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Incident Information</h3>
            <div className="text-sm space-y-3">
                 <p className="flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground"/> <strong>Request For:</strong> {alert.requestor}</p>
                 <p className="flex items-center gap-2"><Clock className="h-4 w-4 text-muted-foreground"/> <strong>Time:</strong> {formatTime(alert.createdAt)}</p>
                 <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground"/> <strong>Location:</strong> {`Lat: ${alert.location.latitude}, Lon: ${alert.location.longitude}`}</p>
            </div>
            
            <div className="space-y-2 pt-2">
                 <Label htmlFor="patient-notes" className="font-semibold">Patient Notes (from call)</Label>
                 <Textarea id="patient-notes" placeholder="No notes available for this incident." readOnly />
            </div>
        </div>

        {/* Right column: Dispatch actions */}
        <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Dispatch Actions</h3>
            <div className="space-y-2">
                <Label htmlFor="unit-select">Assign Unit</Label>
                <Select>
                    <SelectTrigger id="unit-select">
                        <SelectValue placeholder="Select available unit..." />
                    </SelectTrigger>
                    <SelectContent>
                       {availableUnits.map(unit => (
                        <SelectItem key={unit.id} value={unit.id}>
                            {unit.id} ({unit.type}) - {unit.status}
                        </SelectItem>
                       ))}
                    </SelectContent>
                </Select>
            </div>
             <div className="space-y-2">
                <Label htmlFor="dispatch-notes">Dispatch Notes</Label>
                <Textarea id="dispatch-notes" placeholder="Add notes for the responding unit..." />
             </div>
             <div className="space-y-2">
                 <Label>Quick Actions</Label>
                 <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1"><MessageSquare className="h-4 w-4 mr-2"/>Message Patient</Button>
                    <Button variant="outline" size="sm" className="flex-1"><Info className="h-4 w-4 mr-2"/>View History</Button>
                 </div>
             </div>
        </div>
      </div>
      
      <DialogFooter className="grid grid-cols-2 gap-2 pt-4">
        <Button variant="secondary" className="w-full"><Check className="h-4 w-4 mr-2"/> Acknowledge</Button>
        <Button className="w-full bg-red-600 hover:bg-red-700"><Send className="h-4 w-4 mr-2"/> Dispatch Unit</Button>
      </DialogFooter>
    </DialogContent>
  );
}
