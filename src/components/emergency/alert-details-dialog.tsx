
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type EmergencyRequest, type EmergencyUnit } from '@/lib/types';
import { User, MapPin, Clock, Info, Send, Check, Siren, Sparkles, Loader2, Ambulance, Plane, HeartPulse, Droplets, FlaskConical, Hospital, Shield, Pill } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { cn } from '@/lib/utils';
import { suggestEmergencyResponse } from '@/ai/flows/suggest-emergency-response-flow';
import { formatDistanceToNow } from 'date-fns';

const serviceIcons: { [key in EmergencyRequest['serviceType']]: React.ElementType } = {
    'First Aid': HeartPulse,
    'Ground Ambulance': Ambulance,
    'Air Ambulance': Plane,
};

interface AlertDetailsDialogProps {
    alerts: EmergencyRequest[];
    availableUnits: EmergencyUnit[];
    isOpen: boolean;
    onClose: () => void;
}

export default function AlertDetailsDialog({ alerts, availableUnits, isOpen, onClose }: AlertDetailsDialogProps) {
    const [selectedAlert, setSelectedAlert] = useState<EmergencyRequest | null>(null);
    const [suggestions, setSuggestions] = useState<Map<string, any>>(new Map());
    const [isLoading, setIsLoading] = useState(false);

    const timeSinceRequest = useMemo(() => {
        if (!selectedAlert) return '';
        return formatDistanceToNow(new Date(selectedAlert.createdAt), { addSuffix: true });
    }, [selectedAlert]);

    useEffect(() => {
        if (isOpen && alerts.length > 0 && !suggestions.size) {
            setIsLoading(true);
            const fetchSuggestions = async () => {
                const newSuggestions = new Map<string, any>();
                try {
                    await Promise.all(alerts.map(async (alert) => {
                        const response = await suggestEmergencyResponse({
                            serviceType: alert.serviceType,
                            location: alert.location,
                            patientName: alert.patientName,
                            situationDescription: alert.situationDescription,
                            bloodGroup: alert.bloodGroup,
                            allergies: alert.allergies,
                            timeSinceRequest: formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true }),
                        });
                        newSuggestions.set(alert.id, response);
                    }));
                } catch (error) {
                    console.error("AI suggestion failed for one or more alerts:", error);
                    alerts.forEach(alert => {
                        if (!newSuggestions.has(alert.id)) {
                             newSuggestions.set(alert.id, { summary: "Could not load AI summary.", lawEnforcementNeeded: false, nearestHospital: "N/A" });
                        }
                    });
                }
                setSuggestions(newSuggestions);
                setIsLoading(false);
            };
            fetchSuggestions();
        }
    }, [isOpen, alerts, suggestions.size]);

    useEffect(() => {
        if (isOpen) {
             if (!selectedAlert && alerts.length > 0) {
                setSelectedAlert(alerts[0]);
            } else if (alerts.length === 0) {
                setSelectedAlert(null);
            }
        }
    }, [isOpen, alerts, selectedAlert])

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const currentSuggestion = selectedAlert ? suggestions.get(selectedAlert.id) : null;

    if (!isOpen) return null;

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
                                    <p className="text-xs text-muted-foreground mt-1">For: {alert.patientName}</p>
                                </button>
                            );
                        })}
                    </div>
                </ScrollArea>
                
                {/* Right Pane: Details View */}
                <div className="md:col-span-2 h-full flex flex-col gap-4">
                    {selectedAlert ? (
                        <ScrollArea className="h-full pr-4">
                           <div className="space-y-4">
                             <div className="p-4 border rounded-lg">
                                <h3 className="font-semibold text-lg mb-2">{selectedAlert.serviceType} Request</h3>
                                <div className="grid grid-cols-2 gap-y-1 gap-x-4 text-sm">
                                    <p className="flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground"/> <strong>Patient:</strong> {selectedAlert.patientName}</p>
                                    <p className="flex items-center gap-2"><Clock className="h-4 w-4 text-muted-foreground"/> <strong>Time:</strong> {formatTime(selectedAlert.createdAt)}</p>
                                    <p className="flex items-center gap-2"><Droplets className="h-4 w-4 text-muted-foreground"/> <strong>Blood:</strong> {selectedAlert.bloodGroup || 'N/A'}</p>
                                    <p className="flex items-center gap-2"><FlaskConical className="h-4 w-4 text-muted-foreground"/> <strong>Allergies:</strong> {selectedAlert.allergies || 'None'}</p>
                                    <p className="col-span-2 flex items-start gap-2"><Info className="h-4 w-4 text-muted-foreground mt-0.5"/> <strong>Situation:</strong> {selectedAlert.situationDescription || 'No details provided.'}</p>
                                    <p className="col-span-2 flex items-start gap-2"><MapPin className="h-4 w-4 text-muted-foreground mt-0.5"/> <strong>Location:</strong> {`Lat: ${selectedAlert.location.latitude}, Lon: ${selectedAlert.location.longitude}`}</p>
                                </div>
                             </div>

                             <div className="p-4 border rounded-lg bg-primary/5">
                                 <h3 className="font-semibold mb-2 flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary"/> AI Summary & Recommendation</h3>
                                 {isLoading ? (
                                    <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin"/> Generating suggestions for all alerts...</div>
                                 ) : (
                                     <div className="space-y-3">
                                        <p className="text-sm font-medium whitespace-pre-wrap">{currentSuggestion?.summary}</p>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div className="flex items-start gap-2 p-2 bg-background/50 rounded-md">
                                                <Hospital className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5"/>
                                                <div>
                                                    <p className="font-semibold">Nearest Hospital</p>
                                                    <p>{currentSuggestion?.nearestHospital}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-2 p-2 bg-background/50 rounded-md">
                                                <Shield className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5"/>
                                                 <div>
                                                    <p className="font-semibold">Police Needed?</p>
                                                    <p>{currentSuggestion?.lawEnforcementNeeded ? "Yes, Recommended" : "No"}</p>
                                                </div>
                                            </div>
                                        </div>
                                     </div>
                                 )}
                             </div>

                             <div className="p-4 border rounded-lg">
                                <h3 className="font-semibold mb-3">Actions</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Select>
                                            <SelectTrigger><SelectValue placeholder="Assign Available Unit..." /></SelectTrigger>
                                            <SelectContent>
                                                {availableUnits.filter(u => u.status === 'Available').map(unit => (
                                                    <SelectItem key={unit.id} value={unit.id}>{unit.id} ({unit.type}) - {unit.licensePlate}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Button className="bg-red-600 hover:bg-red-700 flex-shrink-0"><Send className="h-4 w-4 mr-2"/> Dispatch</Button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Button variant="outline"><Hospital className="h-4 w-4 mr-2"/> Notify Hospital</Button>
                                        <Button variant="outline"><Shield className="h-4 w-4 mr-2"/> Notify Police</Button>
                                        <Button variant="outline"><Pill className="h-4 w-4 mr-2"/> Request Meds</Button>
                                        <Button variant="outline" className="text-muted-foreground">Mark as Resolved</Button>
                                    </div>
                                </div>
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
            <DialogFooter className="border-t pt-4">
                 <Button variant="outline" onClick={onClose}>Close</Button>
            </DialogFooter>
        </DialogContent>
    );
}
