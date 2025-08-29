
'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FlaskConical, Beaker, FileCheck2, Clock, FileText, User } from "lucide-react";
import { useLabRequests } from '@/lib/lab';
import { type LabRequest } from '@/lib/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

const StatCard = ({ icon: Icon, value, label }: { icon: React.ElementType, value: string | number, label: string }) => (
    <Card className="bg-background">
        <CardContent className="p-4 flex items-center gap-4">
            <Icon className="h-8 w-8 text-primary" />
            <div>
                <p className="text-3xl font-bold">{value}</p>
                <p className="text-sm text-muted-foreground">{label}</p>
            </div>
        </CardContent>
    </Card>
);

const RecentRequestRow = ({ request }: { request: LabRequest }) => (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50">
        <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-muted-foreground"/>
            <div>
                <p className="font-semibold">{request.testName}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1.5"><User className="h-4 w-4"/>{request.patientName}</p>
            </div>
        </div>
        <div className="text-right">
            <p className="text-sm font-medium">{request.status}</p>
            <p className="text-xs text-muted-foreground">{new Date(request.requestedAt).toLocaleDateString()}</p>
        </div>
    </div>
);

function RecentActivitySkeleton() {
    return (
        <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-2">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2 flex-grow">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                    </div>
                </div>
            ))}
        </div>
    )
}

export default function LabDashboardPage() {
    const { requests, isLoading } = useLabRequests();

    const stats = useMemo(() => {
        const newRequests = requests.filter(r => r.status === 'Pending').length;
        const pendingResults = requests.filter(r => r.status === 'In Progress').length;
        const today = new Date().toDateString();
        const completedToday = requests.filter(r => r.status === 'Completed' && r.completedAt && new Date(r.completedAt).toDateString() === today).length;
        return { newRequests, pendingResults, completedToday };
    }, [requests]);

    const recentRequests = useMemo(() => {
        return requests.slice(0, 5);
    }, [requests]);

    return (
        <div className="p-6 h-full flex flex-col gap-6">
            <header>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <FlaskConical className="w-8 h-8 text-primary" />
                    Laboratory Dashboard
                </h1>
                <p className="text-muted-foreground">Overview of test requests and results.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard icon={Beaker} value={isLoading ? '...' : stats.newRequests} label="New Requests" />
                <StatCard icon={Clock} value={isLoading ? '...' : stats.pendingResults} label="Pending Results" />
                <StatCard icon={FileCheck2} value={isLoading ? '...' : stats.completedToday} label="Completed Today" />
            </div>

            <Card className="flex-grow">
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>The latest test requests received by the lab.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <RecentActivitySkeleton />
                    ) : (
                        <>
                           <div className="space-y-2">
                                {recentRequests.length > 0 ? (
                                    recentRequests.map(req => <RecentRequestRow key={req.id} request={req} />)
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <p>No recent activity.</p>
                                        <p className="text-xs">New test requests will appear here as they arrive.</p>
                                    </div>
                                )}
                            </div>
                            <div className="text-center mt-6">
                                <Button asChild variant="outline">
                                    <Link href="/labs/requests">View All Requests</Link>
                                </Button>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
