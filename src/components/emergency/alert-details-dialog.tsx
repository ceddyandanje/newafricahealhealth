
'use client';

import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { type EmergencyRequest, type EmergencyUnit } from '@/lib/types';
import { User, MapPin, Clock, Info, Send, Check, MessageSquare, Siren, Badge } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { Card, CardContent, CardHeader } from '../ui/card';

interface AlertDetailsDialogProps {
  alerts: EmergencyRequest[];
}

// Mock data, in a real app this would come from a data source
const availableUnits: EmergencyUnit[] = [
    { id: 'G-01', type: 'Ground', status: 'Available', currentLocation: { latitude: 0, longitude: 0 } },
    { id: 'A-01', type: 'Air', status: 'Available', currentLocation: { latitude: 0, longitude: 0 } },
];

export default function AlertDetailsDialog({ alerts }: AlertDetailsDialogProps) {

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  return (
    <DialogContent className="sm:max-w-3xl">
      <DialogHeader>
        <DialogTitle className="font-headline text-2xl">Incoming Emergency Alerts</DialogTitle>
        <DialogDescription>
            Review and dispatch units for all active incidents.
        </DialogDescription>
      </DialogHeader>

      <ScrollArea className="max-h-[60vh] -mx-6 px-6">
        <div className="py-4 space-y-4">
            {alerts.map(alert => (
                <Card key={alert.id} className="bg-background">
                    <CardHeader className="flex flex-row justify-between items-center p-3">
                         <div className="flex items-center gap-3">
                             <Siren className="h-5 w-5 text-destructive"/>
                             <p className="font-semibold text-lg">{alert.serviceType}</p>
                         </div>
                         <span className="text-xs text-muted-foreground">{formatTime(alert.createdAt)}</span>
                    </CardHeader>
                    <CardContent className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="text-sm space-y-2">
                             <p className="flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground"/> <strong>For:</strong> {alert.requestor}</p>
                             <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground"/> <strong>Loc:</strong> {`Lat: ${alert.location.latitude}, Lon: ${alert.location.longitude}`}</p>
                        </div>
                         <div className="flex flex-col gap-2">
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Assign Unit..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableUnits.map(unit => (
                                        <SelectItem key={unit.id} value={unit.id}>
                                            {unit.id} ({unit.type})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="flex-1"><Check className="h-4 w-4 mr-1"/> Ack</Button>
                                <Button size="sm" className="flex-1"><Send className="h-4 w-4 mr-1"/> Dispatch</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
      </ScrollArea>
      
      <DialogFooter className="pt-4">
        <Button variant="outline">Close</Button>
      </DialogFooter>
    </DialogContent>
  );
}

