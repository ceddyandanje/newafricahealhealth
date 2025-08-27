
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { type EmergencyRequest } from '@/lib/types';
import { Ambulance, Plane, HeartPulse, User, MapPin, Clock, Info, Droplets, FlaskConical, CalendarCheck } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '../ui/badge';

const serviceIcons: { [key in EmergencyRequest['serviceType']]: React.ElementType } = {
    'First Aid': HeartPulse,
    'Ground Ambulance': Ambulance,
    'Air Ambulance': Plane,
};

const statusVariant = {
    'Pending': 'destructive',
    'Acknowledged': 'default',
    'Unit Dispatched': 'default',
    'On Scene': 'default',
    'Resolved': 'outline',
    'Cancelled': 'destructive',
} as const;


interface IncidentHistoryCardProps {
    incident: EmergencyRequest;
}

export default function IncidentHistoryCard({ incident }: IncidentHistoryCardProps) {
    const Icon = serviceIcons[incident.serviceType];
    
    return (
        <Card>
            <CardHeader className="flex flex-row justify-between items-start bg-muted/30 p-4">
                <div className="flex items-center gap-3">
                    <Icon className="h-6 w-6 text-primary" />
                    <div>
                        <CardTitle className="text-lg">{incident.serviceType} Request</CardTitle>
                        <CardDescription>Patient: {incident.patientName}</CardDescription>
                    </div>
                </div>
                 <div className="text-xs text-muted-foreground text-right">
                    <p>Received: {new Date(incident.createdAt).toLocaleString()}</p>
                    {incident.resolvedAt && <p>Resolved: {new Date(incident.resolvedAt).toLocaleString()}</p>}
                </div>
            </CardHeader>
            <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-muted-foreground"/> <strong>Status:</strong> <Badge variant={statusVariant[incident.status] || 'secondary'}>{incident.status}</Badge></div>
                 <div className="flex items-center gap-2"><Droplets className="h-4 w-4 text-muted-foreground"/> <strong>Blood Group:</strong> {incident.bloodGroup || 'N/A'}</div>
                 <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground"/> <strong>Location:</strong> {`${incident.location.latitude.toFixed(4)}, ${incident.location.longitude.toFixed(4)}`}</div>
                 <div className="flex items-center gap-2"><FlaskConical className="h-4 w-4 text-muted-foreground"/> <strong>Allergies:</strong> {incident.allergies || 'None'}</div>
                 <p className="md:col-span-2 flex items-start gap-2"><Info className="h-4 w-4 text-muted-foreground mt-0.5"/> <strong>Situation:</strong> {incident.situationDescription || 'No details provided.'}</p>
            </CardContent>
            {incident.resolvedAt && (
                <CardFooter className="p-4 pt-0 text-xs text-muted-foreground">
                    <p>This incident was closed {formatDistanceToNow(new Date(incident.resolvedAt), { addSuffix: true })}.</p>
                </CardFooter>
            )}
        </Card>
    )
}
