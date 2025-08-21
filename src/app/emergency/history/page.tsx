
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ListChecks } from "lucide-react";

export default function IncidentHistoryPage() {
    return (
        <div className="p-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ListChecks className="w-6 h-6" />
                        Incident History
                    </CardTitle>
                    <CardDescription>
                        This page is under construction. A searchable and filterable log of all past incidents will appear here.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Coming soon...</p>
                </CardContent>
            </Card>
        </div>
    )
}
