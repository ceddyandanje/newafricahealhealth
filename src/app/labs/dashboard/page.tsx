
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FlaskConical } from "lucide-react";

export default function LabDashboardPage() {
    return (
        <div className="p-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FlaskConical className="w-6 h-6" />
                        Lab Dashboard
                    </CardTitle>
                    <CardDescription>
                        This page is under construction. Your lab requests and results management will appear here.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Coming soon...</p>
                </CardContent>
            </Card>
        </div>
    )
}
