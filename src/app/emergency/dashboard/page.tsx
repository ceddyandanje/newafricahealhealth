
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Siren, Ambulance, Plane, Clock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import AlertDetailsDialog from '@/components/emergency/alert-details-dialog';
import { type EmergencyRequest, type EmergencyUnit } from '@/lib/types';
import { useEmergencyRequests } from '@/lib/emergency';
import { useFleet } from '@/lib/fleet';
import { useAuth } from '@/hooks/use-auth';

const StatCard = ({ icon: Icon, value, label, variant, asChild, ...props }: { icon: React.ElementType, value: string | number, label: string, variant: 'default' | 'destructive', asChild?: boolean, [key: string]: any }) => (
    <Card className={`bg-background ${variant === 'destructive' ? 'bg-destructive/10' : ''}`} {...props}>
        <CardContent className="p-4 flex items-center gap-4">
            <Icon className={`h-8 w-8 ${variant === 'destructive' ? 'text-destructive' : 'text-primary'}`} />
            <div>
                <p className="text-3xl font-bold">{value}</p>
                <p className="text-sm text-muted-foreground">{label}</p>
            </div>
        </CardContent>
    </Card>
);

export default function EmergencyDashboardPage() {
    const { user } = useAuth();
    const { requests: incomingAlerts } = useEmergencyRequests();
    const { units } = useFleet(user?.id);
    const [isAlertsDialogOpen, setIsAlertsDialogOpen] = useState(false);
    
    const availableGroundUnits = units.filter(u => u.type === 'Ground' && u.status === 'Available').length;
    const availableAirUnits = units.filter(u => u.type === 'Air' && u.status === 'Available').length;

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
                     <DialogTrigger asChild>
                       <button className="w-full text-left">
                         <StatCard icon={Siren} value={incomingAlerts.length} label="Active Incidents" variant="destructive" className="cursor-pointer hover:shadow-lg w-full"/>
                       </button>
                    </DialogTrigger>
                    <StatCard icon={Ambulance} value={availableGroundUnits} label="Available Ground Units" variant="default" />
                    <StatCard icon={Plane} value={availableAirUnits} label="Available Air Units" variant="default" />
                    <StatCard icon={Clock} value="7m 32s" label="Avg. Response Time" variant="default" />
                </div>

                <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-6">
                     <div className="md:col-span-1 h-[55vh] flex flex-col">
                         <Tabs defaultValue="alerts" className="flex-grow flex flex-col h-full">
                            <TabsList className="grid w-full grid-cols-1">
                                <TabsTrigger value="alerts" className="flex items-center gap-2">
                                    Incoming Alerts 
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="alerts" className="flex-grow overflow-hidden mt-2">
                                <AlertsList alerts={incomingAlerts} onAlertClick={() => setIsAlertsDialogOpen(true)} />
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
                            {incomingAlerts.map(alert => (
                                <div key={alert.id} className="absolute" style={{ top: `${50 + (alert.location.latitude * 2)}%`, left: `${50 + (alert.location.longitude * 2)}%` }}>
                                    <Siren className="h-8 w-8 text-white bg-red-600 p-1.5 rounded-full animate-pulse" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
            {isAlertsDialogOpen && <AlertDetailsDialog alerts={incomingAlerts} availableUnits={units} isOpen={isAlertsDialogOpen} onClose={() => setIsAlertsDialogOpen(false)} />}
        </Dialog>
    );
}


function AlertsList({ alerts, onAlertClick }: { alerts: EmergencyRequest[], onAlertClick: () => void }) {
    const alertCounts = alerts.reduce((acc, alert) => {
        acc[alert.serviceType] = (acc[alert.serviceType] || 0) + 1;
        return acc;
    }, {} as Record<EmergencyRequest['serviceType'], number>);
    
    return (
        <DialogTrigger asChild>
            <Card className="h-full flex flex-col cursor-pointer hover:bg-muted/50 transition-colors" onClick={onAlertClick}>
                <CardHeader className="p-4 border-b">
                    <CardTitle className="text-base">Incoming Alerts ({alerts.length})</CardTitle>
                </CardHeader>
                <CardContent className="p-2 flex-grow overflow-y-auto space-y-2">
                    {Object.entries(alertCounts).map(([serviceType, count]) => {
                        const Icon = serviceIcons[serviceType as keyof typeof serviceIcons];
                        return (
                            <div key={serviceType} className="p-2 border rounded-md bg-background/50 relative">
                                <div className="flex justify-between items-center text-sm font-semibold">
                                    <div className="flex items-center gap-2">
                                        <Icon className="h-4 w-4"/>
                                        {serviceType}
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                        {new Date(alerts.find(a => a.serviceType === serviceType)!.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">Requester: {alerts.find(a => a.serviceType === serviceType)?.userName}</p>
                                {count > 0 && (
                                     <div className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-destructive text-white text-xs flex items-center justify-center">{count}</div>
                                )}
                            </div>
                        )
                    })}
                </CardContent>
            </Card>
        </DialogTrigger>
    )
}

const serviceIcons: { [key in EmergencyRequest['serviceType']]: React.ElementType } = {
    'First Aid': HeartPulse,
    'Ground Ambulance': Ambulance,
    'Air Ambulance': Plane,
};
