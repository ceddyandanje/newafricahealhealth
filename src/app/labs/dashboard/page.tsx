
'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FlaskConical, Beaker, FileCheck2, Clock } from "lucide-react";
import { useLabRequests, type LabRequest } from '@/lib/lab';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import NewRequestsDialog from '@/components/labs/new-requests-dialog';
import PendingResultsDialog from '@/components/labs/pending-results-dialog';

const StatCard = ({ icon: Icon, value, label, ...props }: { icon: React.ElementType, value: string | number, label: string, [key: string]: any }) => (
    <Card className="bg-background cursor-pointer hover:shadow-lg transition-shadow" {...props}>
        <CardContent className="p-4 flex items-center gap-4">
            <Icon className="h-8 w-8 text-primary" />
            <div>
                <p className="text-3xl font-bold">{value}</p>
                <p className="text-sm text-muted-foreground">{label}</p>
            </div>
        </CardContent>
    </Card>
);

export default function LabDashboardPage() {
    const { requests, isLoading } = useLabRequests();
    const [isNewRequestsOpen, setIsNewRequestsOpen] = useState(false);
    const [isPendingResultsOpen, setIsPendingResultsOpen] = useState(false);

    const { newRequests, pendingResults, completedToday } = useMemo(() => {
        const newRequests = requests.filter(r => r.status === 'Pending');
        const pendingResults = requests.filter(r => r.status === 'In Progress');
        const today = new Date().toDateString();
        const completedToday = requests.filter(r => r.status === 'Completed' && r.completedAt && new Date(r.completedAt).toDateString() === today).length;
        return { newRequests, pendingResults, completedToday };
    }, [requests]);

    return (
        <>
            <NewRequestsDialog 
                requests={newRequests} 
                isOpen={isNewRequestsOpen} 
                onClose={() => setIsNewRequestsOpen(false)} 
            />
            <PendingResultsDialog
                requests={pendingResults}
                isOpen={isPendingResultsOpen}
                onClose={() => setIsPendingResultsOpen(false)}
            />
            <div className="p-6 h-full flex flex-col gap-6">
                <header>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <FlaskConical className="w-8 h-8 text-primary" />
                        Laboratory Dashboard
                    </h1>
                    <p className="text-muted-foreground">Overview of test requests and results.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard 
                        icon={Beaker} 
                        value={isLoading ? '...' : newRequests.length} 
                        label="New Requests" 
                        onClick={() => newRequests.length > 0 && setIsNewRequestsOpen(true)}
                    />
                    <StatCard 
                        icon={Clock} 
                        value={isLoading ? '...' : pendingResults.length} 
                        label="Pending Results" 
                        onClick={() => pendingResults.length > 0 && setIsPendingResultsOpen(true)}
                    />
                    <StatCard icon={FileCheck2} value={isLoading ? '...' : completedToday} label="Completed Today" />
                </div>

                <Card className="flex-grow">
                    <CardHeader>
                        <CardTitle>Results Status</CardTitle>
                        <CardDescription>The status of ongoing and completed tests will appear here.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* This section is intentionally left empty as requested */}
                    </CardContent>
                </Card>
            </div>
        </>
    )
}
