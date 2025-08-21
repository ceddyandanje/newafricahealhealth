
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Siren } from "lucide-react";

export default function EmergencyDashboardPage() {
    return (
        <div className="p-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Siren className="w-6 h-6 text-destructive" />
                        Emergency Dashboard
                    </CardTitle>
                    <CardDescription>
                        This page is under construction. Your assigned emergency alerts and tasks will appear here.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Coming soon...</p>
                </CardContent>
            </Card>
        </div>
    )
}
