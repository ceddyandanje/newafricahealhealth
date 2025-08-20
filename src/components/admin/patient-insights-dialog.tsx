
'use client';

import { useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BarChart as BarChartIcon, Users, UserPlus, CalendarDays, LineChart as LineChartIcon, ArrowUp, ArrowDown, Minus, HeartPulse, Truck, FlaskConical, Shield, Ambulance } from 'lucide-react';
import { type User, type UserRole } from '@/lib/types';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart, Tooltip as RechartsTooltip } from 'recharts';
import { format, subDays, startOfWeek } from 'date-fns';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';

interface PatientInsightsDialogProps {
    users: User[];
    isOpen: boolean;
    onClose: () => void;
}

const roleConfig: { [key in UserRole]: { icon: React.ElementType, color: string } } = {
    'user': { icon: Users, color: 'text-blue-500' },
    'doctor': { icon: HeartPulse, color: 'text-green-500' },
    'admin': { icon: Shield, color: 'text-red-500' },
    'delivery-driver': { icon: Truck, color: 'text-orange-500' },
    'lab-technician': { icon: FlaskConical, color: 'text-purple-500' },
    'emergency-services': { icon: Ambulance, color: 'text-yellow-500' },
}

const RoleCard = ({ role, count }: { role: UserRole, count: number }) => {
    const config = roleConfig[role];
    return (
        <div className={cn("flex items-center gap-3 p-3 rounded-lg bg-muted/50", config.color)}>
            <config.icon className="h-6 w-6" />
            <div>
                <p className="text-2xl font-bold">{count}</p>
                <p className="text-sm font-semibold capitalize">{role.replace('-', ' ')}s</p>
            </div>
        </div>
    )
};

const StatCard = ({ icon: Icon, value, label, percentage, trend }: { icon: React.ElementType, value: string | number, label: string, percentage: number, trend: 'up' | 'down' | 'same' }) => {
    const TrendIcon = trend === 'up' ? ArrowUp : trend === 'down' ? ArrowDown : Minus;
    const trendColor = trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-muted-foreground';

    return (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <Icon className="h-8 w-8 text-muted-foreground" />
            <div className="flex-grow">
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="text-3xl font-bold">{value}</p>
            </div>
            {percentage !== 0 && (
                <div className={cn("flex items-center text-sm font-semibold", trendColor)}>
                    <TrendIcon className="h-4 w-4" />
                    <span>{percentage.toFixed(1)}%</span>
                </div>
            )}
        </div>
    );
};


export default function UserInsightsDialog({ users, isOpen, onClose }: PatientInsightsDialogProps) {
    const [chartType, setChartType] = useState<'bar' | 'line'>('bar');
    
    const sortedUsers = useMemo(() => {
        return [...users].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [users]);
    
    const recentSignups = useMemo(() => {
        return sortedUsers.slice(0, 5);
    }, [sortedUsers]);
    
    const roleCounts = useMemo(() => {
       return users.reduce((acc, user) => {
            acc[user.role] = (acc[user.role] || 0) + 1;
            return acc;
        }, {} as Record<UserRole, number>);
    }, [users]);

    const growthChartData = useMemo(() => {
        // Aggregate by week for the last 8 weeks
        const last8Weeks = Array.from({ length: 8 }, (_, i) => {
            const weekStart = startOfWeek(subDays(new Date(), (7 - i) * 7), { weekStartsOn: 1 });
            return { date: format(weekStart, 'MMM d'), weekId: format(weekStart, 'yyyy-ww'), count: 0 };
        });
        
        users.forEach(user => {
            const joinDate = new Date(user.createdAt);
            const weekStart = startOfWeek(joinDate, { weekStartsOn: 1 });
            const weekId = format(weekStart, 'yyyy-ww');
            const weekData = last8Weeks.find(d => d.weekId === weekId);
            if (weekData) {
                weekData.count++;
            }
        });

        return last8Weeks;
    }, [users]);

    const growthStats = useMemo(() => {
        const currentPeriodSignups = growthChartData.slice(-4).reduce((acc, d) => acc + d.count, 0);
        const previousPeriodSignups = growthChartData.slice(0, 4).reduce((acc, d) => acc + d.count, 0);

        let percentageChange = 0;
        if (previousPeriodSignups > 0) {
            percentageChange = ((currentPeriodSignups - previousPeriodSignups) / previousPeriodSignups) * 100;
        } else if (currentPeriodSignups > 0) {
            percentageChange = 100; // If previous was 0 and current is > 0, growth is effectively infinite, show 100%
        }
        
        let trend: 'up' | 'down' | 'same' = 'same';
        if (percentageChange > 0) trend = 'up';
        if (percentageChange < 0) trend = 'down';

        return {
            currentPeriod: currentPeriodSignups,
            percentage: percentageChange,
            trend
        };
    }, [growthChartData]);
    
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-4xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 font-headline text-2xl">
                        <Users /> User Insights
                    </DialogTitle>
                    <DialogDescription>
                        An overview of your user base and growth trends.
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="max-h-[70vh] -mx-6 px-6">
                    <div className="py-4 space-y-6">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {Object.entries(roleConfig).map(([role, config]) => (
                                <RoleCard key={role} role={role as UserRole} count={roleCounts[role as UserRole] || 0} />
                            ))}
                        </div>
                        
                        <div className="grid md:grid-cols-3 gap-6 pt-4">
                             {/* Left Column: Chart */}
                             <div className="md:col-span-2">
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
                                <div className="h-56 w-full">
                                    <ChartContainer config={{}} className="h-full w-full">
                                        {chartType === 'bar' ? (
                                            <BarChart data={growthChartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                <XAxis dataKey="date" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={false} tickLine={false} />
                                                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                                                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                                <Bar dataKey="count" name="New Users" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                                            </BarChart>
                                        ) : (
                                            <LineChart data={growthChartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                <XAxis dataKey="date" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={false} tickLine={false} />
                                                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                                                <RechartsTooltip content={<ChartTooltipContent />} />
                                                <Line type="monotone" dataKey="count" name="New Users" stroke="hsl(var(--primary))" strokeWidth={2} />
                                            </LineChart>
                                        )}
                                    </ChartContainer>
                                </div>
                             </div>

                             {/* Right Column: Recent Signups */}
                            <div className="space-y-4">
                                <StatCard icon={UserPlus} value={growthStats.currentPeriod} label="Last 4 Weeks" percentage={growthStats.percentage} trend={growthStats.trend} />
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
                        </div>
                    </div>
                </ScrollArea>
                <DialogFooter className="pt-4 border-t">
                    <Button variant="outline" onClick={onClose}>Close</Button>
                     <Button onClick={() => window.location.href = '/admin/users'}>Manage Users</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
