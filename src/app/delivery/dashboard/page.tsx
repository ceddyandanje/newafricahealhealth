
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck } from "lucide-react";

export default function DeliveryDashboardPage() {
    return (
        <div className="p-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Truck className="w-6 h-6" />
                        Delivery Dashboard
                    </CardTitle>
                    <CardDescription>
                        This page is under construction. Your delivery routes and tasks will appear here.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Coming soon...</p>
                </CardContent>
            </Card>
        </div>
    )
}
