
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell } from "lucide-react";

export default function EmergencyAlertsPage() {
    return (
        <div className="p-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bell className="w-6 h-6" />
                        Active Emergency Alerts
                    </CardTitle>
                    <CardDescription>
                        This page is under construction. A detailed list of all active and acknowledged alerts will appear here.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Coming soon...</p>
                </CardContent>
            </Card>
        </div>
    )
}
