
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Siren, Ambulance, Plane, Clock, HeartPulse } from "lucide-react";
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import AlertDetailsDialog from '@/components/emergency/alert-details-dialog';
import { type EmergencyRequest } from '@/lib/types';
import { useEmergencyRequests } from '@/lib/emergency';

// Mock Data - In a real app, this would come from a real-time Firestore stream
const unitStatuses = [
    { id: 'G-01', type: 'Ground', status: 'Available', location: 'HQ' },
    { id: 'G-02', type: 'Ground', status: 'En Route', assignedTo: 'INC-001' },
    { id: 'A-01', type: 'Air', status: 'Available', location: 'Wilson Airport' },
    { id: 'M-01', type: 'Medevac', status: 'Unavailable', location: 'Maintenance' },
    { id: 'G-03', type: 'Ground', status: 'At Scene', assignedTo: 'INC-000' },
];

const statusVariant = {
    'Available': 'default',
    'En Route': 'secondary',
    'At Scene': 'destructive',
    'Unavailable': 'outline',
} as const;

const serviceIcons: { [key in EmergencyRequest['serviceType']]: React.ElementType } = {
    'First Aid': HeartPulse,
    'Ground Ambulance': Ambulance,
    'Air Ambulance': Plane,
};

const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};


const StatCard = ({ icon: Icon, value, label, variant }: { icon: React.ElementType, value: string | number, label: string, variant: 'default' | 'destructive' }) => (
    <Card className={cn('bg-background', variant === 'destructive' && 'bg-destructive/10')}>
        <CardContent className="p-4 flex items-center gap-4">
            <Icon className={cn("h-8 w-8", variant === 'destructive' ? 'text-destructive' : 'text-primary')} />
            <div>
                <p className="text-3xl font-bold">{value}</p>
                <p className="text-sm text-muted-foreground">{label}</p>
            </div>
        </CardContent>
    </Card>
);

export default function EmergencyDashboardPage() {
    const { requests: incomingAlerts, isLoading } = useEmergencyRequests();
    const [isAlertsDialogOpen, setIsAlertsDialogOpen] = useState(false);
    
    const alertCounts = incomingAlerts.reduce((acc, alert) => {
        acc[alert.serviceType] = (acc[alert.serviceType] || 0) + 1;
        return acc;
    }, {} as Record<EmergencyRequest['serviceType'], number>);

    return (
        <Dialog open={isAlertsDialogOpen} onOpenChange={setIsAlertsDialogOpen}>
            <div className="p-6 h-full flex flex-col gap-6">
                <header>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Siren className="w-8 h-8 text-destructive" />
                        Emergency Command Center
                    </h1>
                    <p className="text-muted-foreground">Live overview of incidents and unit availability.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard icon={Siren} value={incomingAlerts.length} label="Active Incidents" variant="destructive" />
                    <StatCard icon={Ambulance} value={unitStatuses.filter(u => u.status === 'Available' && u.type === 'Ground').length} label="Available Ground Units" variant="default" />
                    <StatCard icon={Plane} value={unitStatuses.filter(u => u.status === 'Available' && u.type === 'Air').length} label="Available Air Units" variant="default" />
                    <StatCard icon={Clock} value="7m 32s" label="Avg. Response Time" variant="default" />
                </div>

                <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-6">
                     <div className="md:col-span-1 h-[55vh] flex flex-col">
                         <Tabs defaultValue="alerts" className="flex-grow flex flex-col h-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="alerts" className="flex items-center gap-2">
                                    Incoming Alerts 
                                    <Badge className="bg-destructive/80 text-white">{incomingAlerts.length}</Badge>
                                </TabsTrigger>
                                <TabsTrigger value="units" className="flex items-center gap-2">
                                    Unit Status
                                    <Badge variant="secondary">{unitStatuses.length}</Badge>
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="alerts" className="flex-grow overflow-hidden mt-2">
                                <DialogTrigger asChild>
                                    <Card className="h-full flex flex-col cursor-pointer hover:bg-muted/50 transition-colors">
                                        <CardHeader className="p-4 border-b">
                                            <CardTitle className="text-base">Incoming Alerts</CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-2 flex-grow overflow-y-auto space-y-2">
                                            {incomingAlerts.map(alert => {
                                                const Icon = serviceIcons[alert.serviceType];
                                                const count = alertCounts[alert.serviceType] || 0;
                                                return (
                                                    <div key={alert.id} className="p-2 border rounded-md bg-background/50 relative">
                                                        <div className="flex justify-between items-center text-sm font-semibold">
                                                            <div className="flex items-center gap-2">
                                                                <Icon className="h-4 w-4"/>
                                                                {alert.serviceType}
                                                            </div>
                                                            <span className="text-xs text-muted-foreground">{formatTime(alert.createdAt)}</span>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground mt-1">For: {alert.patientName}</p>
                                                        {count > 0 && (
                                                            <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 justify-center p-0">{count}</Badge>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </CardContent>
                                    </Card>
                                </DialogTrigger>
                            </TabsContent>
                            <TabsContent value="units" className="flex-grow overflow-hidden mt-2">
                                <Card className="h-full flex flex-col">
                                     <CardHeader className="p-4">
                                        <CardTitle className="text-base">Unit Status</CardTitle>
                                     </CardHeader>
                                    <CardContent className="p-0 flex-grow overflow-y-auto">
                                        <div className="space-y-0">
                                            {unitStatuses.map(unit => (
                                                <div key={unit.id} className="flex items-center justify-between p-3 border-b last:border-b-0">
                                                    <div className="flex items-center gap-3">
                                                        {unit.type === 'Ground' ? <Ambulance className="h-5 w-5"/> : <Plane className="h-5 w-5"/>}
                                                        <p className="font-semibold">{unit.id}</p>
                                                    </div>
                                                    <Badge variant={statusVariant[unit.status as keyof typeof statusVariant]}>{unit.status}</Badge>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>

                    <Card className="md:col-span-2 h-[55vh] flex flex-col">
                        <CardHeader>
                            <CardTitle>Live Incident Map</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow relative p-0">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4081395.0993356823!2d35.24233191564264!3d-0.02279185433246275!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182780aa73dcf839%3A0x8634440b87c6f09!2sKenya!5e0!3m2!1sen!2sus!4v1754589984922"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen={false}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="rounded-b-lg"
                            ></iframe>
                            {/* Placeholder for map markers */}
                            {incomingAlerts.map(alert => (
                                <div key={alert.id} className="absolute" style={{ top: `${50 + (alert.location.latitude * 2)}%`, left: `${50 + (alert.location.longitude * 2)}%` }}>
                                    <Siren className="h-8 w-8 text-white bg-red-600 p-1.5 rounded-full animate-pulse" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
            {<AlertDetailsDialog alerts={incomingAlerts} />}
        </Dialog>
    );
}
