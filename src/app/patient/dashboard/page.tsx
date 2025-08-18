
'use client';

import {
  Pill,
  Droplets,
  Video,
  ChevronRight,
  Flag,
  CalendarPlus,
  UploadCloud,
  MessageSquare,
  Plus,
  Heart,
  Weight,
  HeartPulse,
  BarChart3,
  LineChart,
  GitGraph,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, LineChart as LineChartComponent, Pie, PieChart as PieChartComponent, Cell, Bar, BarChart as BarChartComponent, XAxis, YAxis, CartesianGrid, Legend } from "recharts"
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useEvents, type DayEvent } from '@/lib/events';
import Link from 'next/link';
import { useHealthMetrics, addHealthMetric } from '@/lib/healthMetrics';
import { format, subDays } from 'date-fns';
import { type HealthMetricType } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Image from 'next/image';

const subscriptionData = [
  { name: 'Active', value: 3, fill: 'hsl(var(--primary))' },
  { name: 'Paused', value: 1, fill: 'hsl(var(--muted))' },
];

const iconMap: { [key in DayEvent['type']]: React.ElementType } = {
    medication: Pill,
    measurement: Droplets,
    appointment: Video,
};

const metricOptions: { value: HealthMetricType, label: string, icon: React.ElementType }[] = [
    { value: 'bloodSugar', label: 'Blood Sugar', icon: Droplets },
    { value: 'bloodPressure', label: 'Blood Pressure', icon: Heart },
    { value: 'weight', label: 'Weight', icon: Weight },
    { value: 'heartRate', label: 'Heart Rate', icon: HeartPulse },
];


function EmptyState() {
    return (
        <Card className="bg-background">
            <CardHeader>
                 <CardTitle>Welcome to Your Dashboard!</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
                <p className="text-muted-foreground mb-4">Your daily plan will appear here once you get started.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button asChild variant="outline">
                        <Link href="/patient/appointments"><CalendarPlus className="mr-2"/> Book an Appointment</Link>
                    </Button>
                    <Button asChild variant="outline">
                       <Link href="/upload-prescription"><UploadCloud className="mr-2"/> Upload a Prescription</Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

function DailyGlance({ events }: { events: DayEvent[] }) {
    if (events.length === 0) {
        return <EmptyState />;
    }
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           {events.map(item => {
               const Icon = iconMap[item.type];
               const statusColor = item.status === "Done" ? "text-green-500" : item.status === "Due" ? "text-orange-500" : "text-blue-500";
               return (
                <Card key={item.title} className="bg-background">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="bg-primary/10 text-primary p-3 rounded-lg">
                                <Icon className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="font-semibold">{item.title}</p>
                                <p className="text-sm text-muted-foreground">{new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                        </div>
                        <span className={cn("text-sm font-bold", statusColor)}>{item.status}</span>
                    </CardContent>
                </Card>
               )
           })}
        </div>
    );
}

export default function PatientDashboardPage() {
    const { user, isLoading: isAuthLoading } = useAuth();
    const { events, isLoading: isEventsLoading } = useEvents(user?.id);
    const { metrics, isLoading: isMetricsLoading } = useHealthMetrics(user?.id);
    const router = useRouter();
    const [greeting, setGreeting] = useState('Good morning');
    const [selectedMetric, setSelectedMetric] = useState<HealthMetricType>('bloodSugar');
    const [chartType, setChartType] = useState<'line' | 'bar'>('line');
    
    useEffect(() => {
        if (!isAuthLoading && !user) {
          router.push("/login");
        }
    }, [user, isAuthLoading, router]);

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) {
            setGreeting('Good morning');
        } else if (hour < 17) {
            setGreeting('Good afternoon');
        } else {
            setGreeting('Good evening');
        }
    }, []);

    const healthTrendData = useMemo(() => {
        const last7Days = Array.from({ length: 7 }, (_, i) => subDays(new Date(), i)).reverse();
        const filteredMetrics = metrics.filter(m => m.type === selectedMetric);

        return last7Days.map(day => {
            const dayString = format(day, 'yyyy-MM-dd');
            const dayMetrics = filteredMetrics.filter(m => format(new Date(m.timestamp), 'yyyy-MM-dd') === dayString);
            
            if (dayMetrics.length === 0) {
                return { date: format(day, 'MMM d'), value: null, value2: null };
            }

            const avgValue = dayMetrics.reduce((sum, m) => sum + m.value, 0) / dayMetrics.length;
            const avgValue2 = selectedMetric === 'bloodPressure' ? dayMetrics.reduce((sum, m) => sum + (m.value2 || 0), 0) / dayMetrics.length : null;

            return {
                date: format(day, 'MMM d'),
                value: avgValue > 0 ? avgValue : null,
                value2: avgValue2 && avgValue2 > 0 ? avgValue2 : null,
            };
        });
    }, [metrics, selectedMetric]);
    
    const hasChartData = useMemo(() => {
        return metrics.some(m => m.type === selectedMetric);
    }, [metrics, selectedMetric]);


    const handleAddMetric = async () => {
        if (!user) return;
        
        let randomValue: number;
        let metricPayload: { type: HealthMetricType; value: number; value2?: number; };

        switch(selectedMetric) {
            case 'bloodSugar':
                randomValue = Math.floor(Math.random() * (180 - 80 + 1)) + 80;
                metricPayload = { type: selectedMetric, value: randomValue };
                break;
            case 'weight':
                randomValue = Math.floor(Math.random() * (100 - 60 + 1)) + 60;
                metricPayload = { type: selectedMetric, value: randomValue };
                break;
            case 'heartRate':
                 randomValue = Math.floor(Math.random() * (100 - 60 + 1)) + 60;
                 metricPayload = { type: selectedMetric, value: randomValue };
                 break;
            case 'bloodPressure':
                 const systolic = Math.floor(Math.random() * (140 - 110 + 1)) + 110;
                 const diastolic = Math.floor(Math.random() * (90 - 70 + 1)) + 70;
                 metricPayload = { type: selectedMetric, value: systolic, value2: diastolic };
                 break;
            default:
                return;
        }
        
        const finalPayload: any = {
            type: metricPayload.type,
            value: metricPayload.value,
            timestamp: new Date().toISOString()
        };

        if (metricPayload.type === 'bloodPressure' && metricPayload.value2 !== undefined) {
            finalPayload.value2 = metricPayload.value2;
        }

        await addHealthMetric(user.id, finalPayload);
    };

    const isLoading = isAuthLoading || isEventsLoading || isMetricsLoading;

    if (isLoading || !user) {
        return (
          <div className="flex h-screen w-full items-center justify-center bg-background">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
          </div>
        );
    }

    return (
        <div className="p-6 bg-gradient-to-br from-green-50/50 via-slate-50/50 to-green-50/50 dark:from-green-900/10 dark:via-slate-900/10 dark:to-green-900/10">
            <header className="py-6">
                <h1 className="text-3xl font-bold">{greeting}, {user?.name.split(' ')[0]}</h1>
                <p className="text-muted-foreground">Here’s what your day looks like.</p>
            </header>

            <section>
                <h2 className="text-xl font-semibold mb-4">Your day at a glance</h2>
                {isEventsLoading ? <Loader2 className="animate-spin" /> : <DailyGlance events={events} />}
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-6">
                <Card className="lg:col-span-3 bg-background">
                    <CardHeader className="flex flex-row justify-between items-center flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                            <CardTitle>Health Trends</CardTitle>
                             <Select value={selectedMetric} onValueChange={(val) => setSelectedMetric(val as HealthMetricType)}>
                                <SelectTrigger className="w-[180px] h-9">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {metricOptions.map(opt => (
                                        <SelectItem key={opt.value} value={opt.value}>
                                            <div className="flex items-center gap-2">
                                                <opt.icon className="w-4 h-4"/>
                                                {opt.label}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center rounded-md bg-muted p-0.5">
                                <Button size="icon" variant={chartType === 'line' ? 'secondary': 'ghost'} className="h-7 w-7" onClick={() => setChartType('line')}><LineChart className="h-4 w-4"/></Button>
                                <Button size="icon" variant={chartType === 'bar' ? 'secondary': 'ghost'} className="h-7 w-7" onClick={() => setChartType('bar')}><BarChart3 className="h-4 w-4"/></Button>
                            </div>
                            <Button size="sm" onClick={handleAddMetric}><Plus className="mr-2 h-4 w-4"/> Add Metric</Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                         {isMetricsLoading ? (
                            <div className="h-[250px] w-full flex items-center justify-center"><Loader2 className="animate-spin" /></div>
                         ) : hasChartData ? (
                            <ChartContainer config={{}} className="h-[250px] w-full">
                                {chartType === 'line' ? (
                                    <LineChartComponent data={healthTrendData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                        <defs>
                                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                                            </linearGradient>
                                            <linearGradient id="colorValue2" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="hsl(var(--secondary-foreground))" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="hsl(var(--secondary-foreground))" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="date" tick={{ fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false}/>
                                        <ChartTooltip content={<ChartTooltipContent />} />
                                        <Area dataKey="value" name={selectedMetric === 'bloodPressure' ? 'Systolic' : 'Value'} type="monotone" fill="url(#colorValue)" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4, fill: 'hsl(var(--primary))' }} connectNulls={false} />
                                        {selectedMetric === 'bloodPressure' && <Area dataKey="value2" name="Diastolic" type="monotone" fill="url(#colorValue2)" stroke="hsl(var(--secondary-foreground))" strokeWidth={2} dot={{ r: 4 }} connectNulls={false} />}
                                        <Legend />
                                    </LineChartComponent>
                                ) : (
                                    <BarChartComponent data={healthTrendData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="date" tick={{ fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false}/>
                                        <ChartTooltip content={<ChartTooltipContent />} />
                                        <Bar dataKey="value" name={selectedMetric === 'bloodPressure' ? 'Systolic' : 'Value'} fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                                        {selectedMetric === 'bloodPressure' && <Bar dataKey="value2" name="Diastolic" fill="hsl(var(--secondary-foreground))" radius={[4, 4, 0, 0]} />}
                                        <Legend />
                                    </BarChartComponent>
                                )}
                            </ChartContainer>
                         ) : (
                            <div className="h-[250px] w-full rounded-lg bg-muted/50 flex flex-col items-center justify-center text-center text-foreground p-4">
                                <GitGraph className="h-12 w-12 mx-auto mb-2 text-primary"/>
                                <h3 className="font-semibold">Track Your Health</h3>
                                <p className="text-sm text-muted-foreground mb-4">Fill in metrics to see your trends visualized here.</p>
                                <Button onClick={handleAddMetric}>
                                    <Plus className="mr-2 h-4 w-4"/> Add Your First Metric
                                </Button>
                            </div>
                         )}
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2 bg-background flex flex-col">
                    <CardHeader>
                        <CardTitle>Your Subscription</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow flex items-center justify-center">
                         <ChartContainer config={{}} className="h-[200px] w-full">
                            <PieChartComponent>
                            <Pie
                                data={subscriptionData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                dataKey="value"
                            >
                                {subscriptionData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} stroke={entry.fill} />
                                ))}
                            </Pie>
                            <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                            </PieChartComponent>
                        </ChartContainer>
                    </CardContent>
                    <div className="flex justify-center gap-4 p-4 text-sm">
                        <div className="flex items-center gap-2">
                            <span className="h-3 w-3 rounded-full bg-primary"></span>
                            <span>Active ({subscriptionData[0].value})</span>
                        </div>
                         <div className="flex items-center gap-2">
                            <span className="h-3 w-3 rounded-full bg-muted"></span>
                            <span>Paused ({subscriptionData[1].value})</span>
                        </div>
                    </div>
                </Card>
            </div>

            <section className="mt-6">
                <Card className="bg-background">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Your Care Team</CardTitle>
                         <Button variant="ghost" size="sm">View All</Button>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-500/20 text-red-500 rounded-full">
                                    <Flag className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-semibold text-red-600">Open Issue</p>
                                    <p className="text-sm text-red-500">Your latest lab results are ready for review.</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon"><ChevronRight/></Button>
                        </div>
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}
