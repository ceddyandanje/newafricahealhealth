
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const logs = [
  { level: 'INFO', timestamp: '2023-10-27 10:05:12', message: 'User admin@example.com logged in successfully.' },
  { level: 'WARN', timestamp: '2023-10-27 10:15:34', message: 'API response time for /api/products exceeded 500ms.' },
  { level: 'ERROR', timestamp: '2023-10-27 10:20:05', message: 'Failed to process payment for order #ORD123. Gateway error: Insufficient funds.' },
  { level: 'INFO', timestamp: '2023-10-27 10:30:45', message: 'New user registered: test@example.com.' },
  { level: 'DEBUG', timestamp: '2023-10-27 10:32:19', message: 'Running database query for patient records.' },
  { level: 'INFO', timestamp: '2023-10-27 11:00:00', message: 'Admin dashboard accessed by admin@example.com.' },
  { level: 'ERROR', timestamp: '2023-10-27 11:05:21', message: 'Unhandled exception in notification service: TypeError: Cannot read properties of null.' },
];

const levelVariant = {
    'INFO': 'default',
    'WARN': 'secondary',
    'ERROR': 'destructive',
    'DEBUG': 'outline'
} as const;

export default function LogsPage() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <FileText className="w-8 h-8" />
          System Logs
        </h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Real-time Log Stream</CardTitle>
          <CardDescription>
            Monitor system events, errors, and activities as they happen.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96 w-full rounded-md border">
            <div className="p-4 font-mono text-sm">
              {logs.reverse().map((log, index) => (
                <div key={index} className="flex items-start gap-4 mb-2">
                  <span className="text-muted-foreground">{log.timestamp}</span>
                  <Badge variant={levelVariant[log.level as keyof typeof levelVariant]} className="w-16 justify-center">{log.level}</Badge>
                  <p className="flex-1 whitespace-pre-wrap">{log.message}</p>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
