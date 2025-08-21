
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Siren, Ambulance, Plane, Clock, MapPin, User, Check, X, Send } from "lucide-react";
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

// Mock Data - In a real app, this would come from a real-time Firestore stream
const incomingAlerts = [
    { id: 'INC-001', type: 'Ground Ambulance', location: 'Lat: -1.28, Lon: 36.82', for: 'Someone Else', time: '2m ago' },
    { id: 'INC-002', type: 'First Aid', location: 'Lat: -1.31, Lon: 36.80', for: 'Me', time: '5m ago' },
];

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

const StatCard = ({ icon: Icon, value, label, variant }: { icon: React.ElementType, value: string | number, label: string, variant: 'default' | 'destructive' }) => (
    <Card className={variant === 'destructive' ? 'bg-destructive/10' : 'bg-background'}>
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
    return (
        <div className="p-6 h-screen flex flex-col gap-6">
            <header>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Siren className="w-8 h-8 text-destructive" />
                    Emergency Command Center
                </h1>
                <p className="text-muted-foreground">Live overview of incidents and unit availability.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={Siren} value={3} label="Active Incidents" variant="destructive" />
                <StatCard icon={Ambulance} value={1} label="Available Ground Units" variant="default" />
                <StatCard icon={Plane} value={1} label="Available Air Units" variant="default" />
                <StatCard icon={Clock} value="7m 32s" label="Avg. Response Time" variant="default" />
            </div>

            <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
                <div className="lg:col-span-2 flex flex-col h-full">
                    <Card className="flex-grow flex flex-col">
                        <CardHeader>
                            <CardTitle>Live Incident Map</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow relative p-0">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d8167982.724280536!2d33.56150249609376!3d0.023559!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182780aa73dcf839%3A0x8634440b87c6f09!2sKenya!5e0!3m2!1sen!2sus!4v1754555852465"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen={false}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="rounded-b-lg"
                            ></iframe>
                            {/* Placeholder for map markers */}
                            <div className="absolute top-1/4 left-1/3">
                                <Siren className="h-8 w-8 text-white bg-red-600 p-1.5 rounded-full animate-pulse" />
                            </div>
                             <div className="absolute bottom-1/2 right-1/4">
                                <Siren className="h-8 w-8 text-white bg-red-600 p-1.5 rounded-full animate-pulse" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex flex-col h-full overflow-hidden">
                     <Tabs defaultValue="alerts" className="flex-grow flex flex-col">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="alerts">Incoming Alerts ({incomingAlerts.length})</TabsTrigger>
                            <TabsTrigger value="units">Unit Status ({unitStatuses.length})</TabsTrigger>
                        </TabsList>
                        <TabsContent value="alerts" className="flex-grow overflow-hidden mt-2">
                            <Card className="h-full flex flex-col">
                                <CardHeader className="p-4">
                                    <CardTitle>Incoming Alerts</CardTitle>
                                </CardHeader>
                                <CardContent className="p-0 flex-grow overflow-y-auto">
                                    <div className="space-y-3 p-4">
                                        {incomingAlerts.map(alert => (
                                            <div key={alert.id} className="border p-3 rounded-lg bg-background">
                                                <div className="flex justify-between items-start">
                                                    <Badge variant="destructive">{alert.type}</Badge>
                                                    <span className="text-xs text-muted-foreground">{alert.time}</span>
                                                </div>
                                                <p className="text-sm my-2 flex items-center gap-2"><MapPin className="h-4 w-4"/> {alert.location}</p>
                                                <p className="text-sm text-muted-foreground flex items-center gap-2"><User className="h-4 w-4"/> For: {alert.for}</p>
                                                <div className="flex gap-2 mt-3">
                                                    <Button size="sm" variant="outline" className="flex-1"><Check className="h-4 w-4 mr-1"/> Acknowledge</Button>
                                                    <Button size="sm" className="flex-1"><Send className="h-4 w-4 mr-1"/> Dispatch Unit</Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="units" className="flex-grow overflow-hidden mt-2">
                            <Card className="h-full flex flex-col">
                                 <CardHeader className="p-4">
                                    <CardTitle>Unit Status</CardTitle>
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
            </div>
        </div>
    );
}
