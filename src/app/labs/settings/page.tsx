
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";

export default function LabSettingsPage() {
    return (
        <div className="p-6">
            <header className="py-6">
                <h1 className="text-3xl font-bold flex items-center gap-3"><Settings className="w-8 h-8"/> Settings</h1>
                <p className="text-muted-foreground">Manage your lab profile and preferences.</p>
            </header>
            <Card>
                <CardHeader>
                    <CardTitle>Lab Settings</CardTitle>
                    <CardDescription>This page is under construction. Your lab-specific settings will appear here.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Coming soon...</p>
                </CardContent>
            </Card>
        </div>
    )
}
