
'use client';

import { useState, useEffect } from 'react';
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type EmergencyRequest, type EmergencyUnit } from '@/lib/types';
import { User, MapPin, Clock, Info, Send, Check, Siren, Sparkles, Loader2, Ambulance, Plane, HeartPulse } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { cn } from '@/lib/utils';
import { suggestEmergencyResponse } from '@/ai/flows/suggest-emergency-response-flow';

// Mock data, in a real app this would come from a data source
const availableUnits: EmergencyUnit[] = [
    { id: 'G-01', type: 'Ground', status: 'Available', currentLocation: { latitude: 0, longitude: 0 } },
    { id: 'A-01', type: 'Air', status: 'Available', currentLocation: { latitude: 0, longitude: 0 } },
    { id: 'G-02', type: 'Ground', status: 'Available', currentLocation: { latitude: 0, longitude: 0 } },
];

const serviceIcons: { [key in EmergencyRequest['serviceType']]: React.ElementType } = {
    'First Aid': HeartPulse,
    'Ground Ambulance': Ambulance,
    'Air Ambulance': Plane,
};

export default function AlertDetailsDialog({ alerts }: { alerts: EmergencyRequest[] }) {
    const [selectedAlert, setSelectedAlert] = useState<EmergencyRequest | null>(null);
    const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
    const [isAiLoading, setIsAiLoading] = useState(false);

    useEffect(() => {
        if (selectedAlert) {
            setIsAiLoading(true);
            setAiSuggestion(null);
            suggestEmergencyResponse({ 
                serviceType: selectedAlert.serviceType,
                location: selectedAlert.location 
            }).then(response => {
                setAiSuggestion(response.suggestion);
                setIsAiLoading(false);
            }).catch(error => {
                console.error("AI suggestion failed:", error);
                setAiSuggestion("Could not load AI suggestion.");
                setIsAiLoading(false);
            });
        }
    }, [selectedAlert]);

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <DialogContent className="sm:max-w-4xl h-[80vh]">
            <DialogHeader>
                <DialogTitle className="font-headline text-2xl flex items-center gap-2">
                    <Siren className="text-destructive"/> AI Dispatch Center
                </DialogTitle>
                <DialogDescription>
                    Select an incoming alert to view details and AI-powered dispatch recommendations.
                </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-grow overflow-hidden pt-2">
                {/* Left Pane: Alert List */}
                <ScrollArea className="md:col-span-1 h-full bg-muted/50 rounded-lg border">
                    <div className="p-2 space-y-2">
                        {alerts.map(alert => {
                            const Icon = serviceIcons[alert.serviceType];
                            return (
                                <button
                                    key={alert.id}
                                    className={cn(
                                        "w-full text-left p-3 rounded-md border transition-colors",
                                        selectedAlert?.id === alert.id
                                            ? 'bg-primary/10 border-primary shadow-md'
                                            : 'bg-background hover:bg-primary/5'
                                    )}
                                    onClick={() => setSelectedAlert(alert)}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-2 font-semibold">
                                            <Icon className="h-5 w-5"/>
                                            {alert.serviceType}
                                        </div>
                                        <span className="text-xs text-muted-foreground">{formatTime(alert.createdAt)}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">For: {alert.requestor}</p>
                                </button>
                            );
                        })}
                    </div>
                </ScrollArea>
                
                {/* Right Pane: Details View */}
                <div className="md:col-span-2 h-full flex flex-col gap-4">
                    {selectedAlert ? (
                        <ScrollArea className="h-full">
                           <div className="space-y-4 pr-4">
                             <div className="p-4 border rounded-lg">
                                <h3 className="font-semibold text-lg mb-2">{selectedAlert.serviceType} Request</h3>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <p className="flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground"/> <strong>For:</strong> {selectedAlert.requestor}</p>
                                    <p className="flex items-center gap-2"><Clock className="h-4 w-4 text-muted-foreground"/> <strong>Time:</strong> {formatTime(selectedAlert.createdAt)}</p>
                                    <p className="col-span-2 flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground"/> <strong>Location:</strong> {`Lat: ${selectedAlert.location.latitude}, Lon: ${selectedAlert.location.longitude}`}</p>
                                </div>
                             </div>

                             <div className="p-4 border rounded-lg bg-primary/5">
                                 <h3 className="font-semibold mb-2 flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary"/> AI Recommendation</h3>
                                 {isAiLoading ? (
                                    <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin"/> Generating suggestion...</div>
                                 ) : (
                                    <p className="text-sm font-medium whitespace-pre-wrap">{aiSuggestion}</p>
                                 )}
                             </div>

                             <div className="p-4 border rounded-lg">
                                <h3 className="font-semibold mb-2">Actions</h3>
                                {selectedAlert.serviceType !== 'First Aid' ? (
                                    <div className="flex flex-col gap-2">
                                        <Select>
                                            <SelectTrigger><SelectValue placeholder="Assign Unit..." /></SelectTrigger>
                                            <SelectContent>
                                                {availableUnits.map(unit => (
                                                    <SelectItem key={unit.id} value={unit.id}>{unit.id} ({unit.type}) - {unit.status}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Button size="sm"><Send className="h-4 w-4 mr-2"/> Dispatch Unit</Button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-2">
                                         <Button variant="outline" size="sm">Open First Aid Protocol</Button>
                                         <Button size="sm">Mark as Resolved</Button>
                                    </div>
                                )}
                             </div>
                           </div>
                        </ScrollArea>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground bg-muted/30 rounded-lg">
                            <Siren className="h-12 w-12 mb-4" />
                            <p className="font-semibold">Select an alert to view details</p>
                            <p className="text-sm">Details and AI suggestions will appear here.</p>
                        </div>
                    )}
                </div>
            </div>
        </DialogContent>
    );
}
