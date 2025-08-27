
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Loader2 } from "lucide-react";
import { useEmergencyRequests } from "@/lib/emergency";
import AlertHistoryCard from "@/components/emergency/incident-history-card";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function EmergencyAlertsPage() {
    const { requests, isLoading } = useEmergencyRequests(true); // Pass true to fetch all active alerts

    return (
        <div className="p-6 h-full flex flex-col">
            <Card className="flex-grow flex flex-col">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bell className="w-6 h-6" />
                        Active & Acknowledged Alerts
                    </CardTitle>
                    <CardDescription>
                        A real-time list of all ongoing incidents that have not been resolved.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col overflow-hidden">
                   {isLoading ? (
                        <div className="flex-grow flex items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                   ) : requests.length > 0 ? (
                        <ScrollArea className="flex-grow -mx-6 px-6">
                             <div className="space-y-4 pb-4">
                                {requests.map(request => (
                                    <AlertHistoryCard key={request.id} incident={request} />
                                ))}
                            </div>
                        </ScrollArea>
                   ) : (
                        <div className="flex-grow flex items-center justify-center text-center text-muted-foreground">
                            <div>
                                <Bell className="mx-auto h-12 w-12 mb-4" />
                                <p className="font-semibold">No Active Incidents</p>
                                <p className="text-sm">All incidents are currently resolved.</p>
                            </div>
                        </div>
                   )}
                </CardContent>
            </Card>
        </div>
    )
}
