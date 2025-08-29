
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

export default function LabDashboardPage() {
    const { requests, isLoading } = useLabRequests();

    const stats = useMemo(() => {
        const newRequests = requests.filter(r => r.status === 'Pending').length;
        const pendingResults = requests.filter(r => r.status === 'In Progress').length;
        const today = new Date().toDateString();
        const completedToday = requests.filter(r => r.status === 'Completed' && r.completedAt && new Date(r.completedAt).toDateString() === today).length;
        return { newRequests, pendingResults, completedToday };
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
                    <CardTitle>Results Status</CardTitle>
                    <CardDescription>The status of ongoing and completed tests will appear here.</CardDescription>
                </CardHeader>
                <CardContent>
                    {/* This section is intentionally left empty as requested */}
                </CardContent>
            </Card>
        </div>
    )
}
