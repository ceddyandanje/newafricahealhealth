
'use client';

import { useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BarChart as BarChartIcon, Users, UserPlus, MapPin, TrendingUp, CalendarDays, LineChart as LineChartIcon } from 'lucide-react';
import { type User } from '@/lib/types';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { format, subDays, startOfDay, startOfWeek } from 'date-fns';
import { cn } from '@/lib/utils';

interface PatientInsightsDialogProps {
    patients: User[];
    isOpen: boolean;
    onClose: () => void;
}

const StatCard = ({ icon: Icon, value, label }: { icon: React.ElementType, value: string | number, label: string }) => (
    <div className="flex items-center gap-3 bg-muted/50 p-3 rounded-lg">
        <Icon className="h-6 w-6 text-primary" />
        <div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
        </div>
    </div>
);

export default function PatientInsightsDialog({ patients, isOpen, onClose }: PatientInsightsDialogProps) {
    const [chartType, setChartType] = useState<'bar' | 'line'>('bar');
    
    const sortedPatients = useMemo(() => {
        return [...patients].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [patients]);
    
    const recentSignups = useMemo(() => {
        return sortedPatients.slice(0, 5);
    }, [sortedPatients]);

    const newThisMonth = useMemo(() => {
        const oneMonthAgo = subDays(new Date(), 30);
        return patients.filter(p => new Date(p.createdAt) >= oneMonthAgo).length;
    }, [patients]);

    const locationCounts = useMemo(() => {
        const counts = patients.reduce((acc, patient) => {
            const loc = patient.location || "Unknown";
            acc[loc] = (acc[loc] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        
        return Object.entries(counts)
            .sort(([, a], [, b]) => b - a)[0] || ["N/A", 0];
    }, [patients]);

    const growthChartData = useMemo(() => {
        // Aggregate by week for the last 8 weeks
        const last8Weeks = Array.from({ length: 8 }, (_, i) => {
            const weekStart = startOfWeek(subDays(new Date(), (7 - i) * 7), { weekStartsOn: 1 });
            return { date: format(weekStart, 'MMM d'), weekId: format(weekStart, 'yyyy-ww'), count: 0 };
        });
        
        patients.forEach(patient => {
            const joinDate = new Date(patient.createdAt);
            const weekStart = startOfWeek(joinDate, { weekStartsOn: 1 });
            const weekId = format(weekStart, 'yyyy-ww');
            const weekData = last8Weeks.find(d => d.weekId === weekId);
            if (weekData) {
                weekData.count++;
            }
        });

        return last8Weeks;
    }, [patients]);
    
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 font-headline text-2xl">
                        <Users /> Patient Insights
                    </DialogTitle>
                    <DialogDescription>
                        An overview of your patient user base and growth trends.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid md:grid-cols-2 gap-6 py-4 max-h-[70vh] overflow-y-auto pr-4">
                    {/* Left Column: Stats & Recent */}
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <StatCard icon={Users} value={patients.length} label="Total Patients" />
                            <StatCard icon={UserPlus} value={newThisMonth} label="New This Month" />
                            <StatCard icon={MapPin} value={locationCounts[0]} label="Top Location" />
                             <StatCard icon={TrendingUp} value={growthChartData.slice(-4).reduce((acc, d) => acc + d.count, 0)} label="Last 4 Weeks" />
                        </div>
                        
                        <div>
                           <h3 className="font-semibold mb-3 flex items-center gap-2"><CalendarDays className="h-5 w-5 text-muted-foreground"/> Recent Signups</h3>
                            <div className="space-y-3">
                                {recentSignups.map(p => (
                                    <div key={p.id} className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage src={p.avatarUrl} alt={p.name} />
                                            <AvatarFallback>{p.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-semibold">{p.name}</p>
                                            <p className="text-xs text-muted-foreground">{p.email}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    {/* Right Column: Chart */}
                    <div>
                         <div className="flex justify-between items-center mb-3">
                            <h3 className="font-semibold flex items-center gap-2"><BarChartIcon className="h-5 w-5 text-muted-foreground"/> Weekly Sign-up Growth</h3>
                             <div className="flex items-center rounded-md bg-muted p-0.5 text-sm font-medium">
                                <Button size="icon" variant={chartType === 'bar' ? 'secondary' : 'ghost'} className="h-7 w-7" onClick={() => setChartType('bar')}>
                                    <BarChartIcon className="h-4 w-4"/>
                                </Button>
                                <Button size="icon" variant={chartType === 'line' ? 'secondary' : 'ghost'} className="h-7 w-7" onClick={() => setChartType('line')}>
                                    <LineChartIcon className="h-4 w-4"/>
                                </Button>
                            </div>
                         </div>
                         <div className="h-64 w-full">
                            <ChartContainer config={{}} className="h-full w-full">
                                {chartType === 'bar' ? (
                                    <BarChart data={growthChartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="date" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                        <Bar dataKey="count" name="New Patients" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                ) : (
                                    <LineChart data={growthChartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                                         <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                         <XAxis dataKey="date" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={false} tickLine={false} />
                                         <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                                         <RechartsTooltip content={<ChartTooltipContent />} />
                                         <Line type="monotone" dataKey="count" name="New Patients" stroke="hsl(var(--primary))" strokeWidth={2} />
                                    </LineChart>
                                )}
                            </ChartContainer>
                         </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
