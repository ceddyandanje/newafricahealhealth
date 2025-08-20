
'use client';

import { useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BarChart as BarChartIcon, Users, UserPlus, MapPin, TrendingUp, CalendarDays } from 'lucide-react';
import { type User } from '@/lib/types';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { format, subDays, startOfDay } from 'date-fns';

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
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const d = subDays(new Date(), 6 - i);
            return { date: format(d, 'MMM d'), day: format(d, 'yyyy-MM-dd'), count: 0 };
        });
        
        patients.forEach(patient => {
            const joinDate = format(startOfDay(new Date(patient.createdAt)), 'yyyy-MM-dd');
            const dayData = last7Days.find(d => d.day === joinDate);
            if (dayData) {
                dayData.count++;
            }
        });

        return last7Days;
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
                            <StatCard icon={TrendingUp} value={growthChartData.reduce((acc, d) => acc + d.count, 0)} label="Last 7 Days" />
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
                         <h3 className="font-semibold mb-3 flex items-center gap-2"><BarChartIcon className="h-5 w-5 text-muted-foreground"/> Sign-up Growth (Last 7 Days)</h3>
                         <div className="h-64 w-full">
                            <ChartContainer config={{}} className="h-full w-full">
                                <BarChart data={growthChartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="date" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                    <Bar dataKey="count" name="New Patients" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                                </BarChart>
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
