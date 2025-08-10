
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, RefreshCw } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getAllLogs, type Log } from '@/lib/logs';
import { Button } from '@/components/ui/button';

const levelVariant = {
    'INFO': 'default',
    'WARN': 'secondary',
    'ERROR': 'destructive',
    'DEBUG': 'outline'
} as const;

export default function LogsPage() {
    const [logs, setLogs] = useState<Log[]>([]);

    const fetchLogs = () => {
        const sortedLogs = getAllLogs().sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setLogs(sortedLogs);
    }
    
    useEffect(() => {
        fetchLogs();
    }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <FileText className="w-8 h-8" />
          System Logs
        </h1>
        <Button variant="outline" onClick={fetchLogs}><RefreshCw className="mr-2 h-4 w-4"/> Refresh</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Real-time Log Stream</CardTitle>
          <CardDescription>
            Monitor system events, errors, and activities as they happen.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96 w-full rounded-md border bg-muted/50">
            <div className="p-4 font-mono text-sm">
              {logs.length > 0 ? logs.map((log) => (
                <div key={log.id} className="flex items-start gap-4 mb-2">
                  <span className="text-muted-foreground whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</span>
                  <Badge variant={levelVariant[log.level as keyof typeof levelVariant]} className="w-16 justify-center">{log.level}</Badge>
                  <p className="flex-1 whitespace-pre-wrap">{log.message}</p>
                </div>
              )) : (
                <div className="text-center py-8 text-muted-foreground">No logs found.</div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
