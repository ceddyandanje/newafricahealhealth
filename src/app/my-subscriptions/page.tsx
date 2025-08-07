
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Repeat } from "lucide-react";

export default function MySubscriptionsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Card className="glassmorphic">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
                <Repeat className="w-8 h-8" />
                My Subscriptions
            </CardTitle>
            <CardDescription>
              This page is under construction. Your active subscriptions will appear here soon.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center p-8 text-center">
                <p className="text-muted-foreground">Thank you for your patience!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
