
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ListChecks, Loader2 } from "lucide-react";
import { useIncidentHistory } from "@/lib/emergency";
import { useAuth } from "@/hooks/use-auth";
import IncidentHistoryCard from "@/components/emergency/incident-history-card";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function IncidentHistoryPage() {
    const { user } = useAuth();
    const { incidents, isLoading } = useIncidentHistory(user?.id);

    return (
        <div className="p-6 h-full flex flex-col">
            <Card className="flex-grow flex flex-col">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ListChecks className="w-6 h-6" />
                        Incident History
                    </CardTitle>
                    <CardDescription>
                        A log of all incidents that you have handled.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col overflow-hidden">
                   {isLoading ? (
                        <div className="flex-grow flex items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                   ) : incidents.length > 0 ? (
                        <ScrollArea className="flex-grow -mx-6 px-6">
                             <div className="space-y-4 pb-4">
                                {incidents.map(incident => (
                                    <IncidentHistoryCard key={incident.id} incident={incident} />
                                ))}
                            </div>
                        </ScrollArea>
                   ) : (
                        <div className="flex-grow flex items-center justify-center text-center text-muted-foreground">
                            <div>
                                <ListChecks className="mx-auto h-12 w-12 mb-4" />
                                <p className="font-semibold">No History Found</p>
                                <p className="text-sm">You have not handled any incidents yet.</p>
                            </div>
                        </div>
                   )}
                </CardContent>
            </Card>
        </div>
    )
}
