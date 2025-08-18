
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
  GitGraph,
  Thermometer,
  Gauge,
  LineChart as LineChartIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart as LineChartComponent, Pie, PieChart as PieChartComponent, Cell, Bar, BarChart as BarChartComponent, XAxis, YAxis, CartesianGrid, Legend, Line } from "recharts"
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useEvents, type DayEvent } from '@/lib/events';
import Link from 'next/link';
import { useHealthMetrics, addHealthMetric, getMedicalProfile } from '@/lib/healthMetrics';
import { format, startOfWeek, startOfMonth, parseISO, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval } from 'date-fns';
import { type HealthMetric, type HealthMetricType, type MedicalProfile } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AddMetricDialog from '@/components/patient/add-metric-dialog';

const subscriptionData = [
  { name: 'Active', value: 3, fill: 'hsl(var(--primary))' },
  { name: 'Paused', value: 1, fill: 'hsl(var(--muted))' },
];

const iconMap: { [key in DayEvent['type']]: React.ElementType } = {
    medication: Pill,
    measurement: Droplets,
    appointment: Video,
};

export const metricOptions: { value: HealthMetricType, label: string, icon: React.ElementType, isCalculated?: boolean }[] = [
    { value: 'weight', label: 'Weight', icon: Weight },
    { value: 'heartRate', label: 'Heart Rate', icon: HeartPulse },
    { value: 'bloodSugar', label: 'Blood Sugar', icon: Droplets },
    { value: 'bloodPressure', label: 'Blood Pressure', icon: Heart },
    { value: 'oxygenSaturation', label: 'Oxygen Saturation', icon: Thermometer },
    { value: 'bmi', label: 'BMI (Calculated)', icon: Gauge, isCalculated: true },
];

type TimeRange = 'daily' | 'weekly' | 'monthly';


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
    const [selectedMetric, setSelectedMetric] = useState<HealthMetricType>('weight');
    const [chartType, setChartType] = useState<'line' | 'bar'>('line');
    const [timeRange, setTimeRange] = useState<TimeRange>('daily');
    const [isAddMetricOpen, setIsAddMetricOpen] = useState(false);
    const [medicalProfile, setMedicalProfile] = useState<MedicalProfile | null>(null);
    
    useEffect(() => {
        if (!isAuthLoading && !user) {
          router.push("/login");
        } else if (user) {
            getMedicalProfile(user.id).then(setMedicalProfile);
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
        let relevantMetrics = metrics;
        if (selectedMetric === 'bmi') {
            relevantMetrics = metrics.filter(m => m.type === 'weight');
        } else {
            relevantMetrics = metrics.filter(m => m.type === selectedMetric);
        }

        if (relevantMetrics.length === 0) return [];

        const sortedMetrics = relevantMetrics.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        const firstDate = parseISO(sortedMetrics[0].timestamp);
        const lastDate = new Date();
        
        let intervalGenerator;
        let formatLabel: (date: Date) => string;
        let getGroupId: (date: Date) => string;

        switch (timeRange) {
            case 'monthly':
                intervalGenerator = eachMonthOfInterval({ start: firstDate, end: lastDate });
                formatLabel = (d) => format(d, 'MMM yy');
                getGroupId = (d) => format(startOfMonth(d), 'yyyy-MM');
                break;
            case 'weekly':
                intervalGenerator = eachWeekOfInterval({ start: firstDate, end: lastDate }, { weekStartsOn: 1 });
                formatLabel = (d) => format(d, 'dd MMM');
                getGroupId = (d) => format(startOfWeek(d, { weekStartsOn: 1 }), 'yyyy-ww');
                break;
            case 'daily':
            default:
                intervalGenerator = eachDayOfInterval({ start: firstDate, end: lastDate });
                formatLabel = (d) => format(d, 'MMM d');
                getGroupId = (d) => format(d, 'yyyy-MM-dd');
        }

        const groupedMetrics = sortedMetrics.reduce((acc, metric) => {
            const groupId = getGroupId(parseISO(metric.timestamp));
            if (!acc[groupId]) {
                acc[groupId] = [];
            }
            acc[groupId].push(metric);
            return acc;
        }, {} as Record<string, HealthMetric[]>);

        return intervalGenerator.map(intervalDate => {
            const groupId = getGroupId(intervalDate);
            const dayMetrics = groupedMetrics[groupId] || [];

            if (dayMetrics.length === 0) {
                return { date: formatLabel(intervalDate), value: null, value2: null };
            }

            const totalValue = dayMetrics.reduce((sum, m) => sum + m.value, 0);
            const totalValue2 = selectedMetric === 'bloodPressure' ? dayMetrics.reduce((sum, m) => sum + (m.value2 || 0), 0) : 0;
            const count = dayMetrics.length;
            
            let finalValue = totalValue / count;
            if (selectedMetric === 'bmi') {
                 const heightM = (medicalProfile?.height || 0) / 100;
                 finalValue = heightM > 0 ? (totalValue / count) / (heightM * heightM) : 0;
            }

            return {
                date: formatLabel(intervalDate),
                value: parseFloat(finalValue.toFixed(2)),
                value2: selectedMetric === 'bloodPressure' ? parseFloat((totalValue2 / count).toFixed(2)) : null,
            };
        });

    }, [metrics, selectedMetric, medicalProfile, timeRange]);
    
    const hasChartData = useMemo(() => {
        if (selectedMetric === 'bmi') {
            return metrics.some(m => m.type === 'weight') && !!medicalProfile?.height;
        }
        return metrics.some(m => m.type === selectedMetric);
    }, [metrics, selectedMetric, medicalProfile]);


    const handleAddMetric = async (metricData: Omit<HealthMetric, 'id' | 'timestamp'>) => {
        if (!user) return;
        
        const payload: Omit<HealthMetric, 'id'> = {
            ...metricData,
            timestamp: new Date().toISOString()
        };
        
        await addHealthMetric(user.id, payload);
    };

    const isMetricCalculated = metricOptions.find(opt => opt.value === selectedMetric)?.isCalculated || false;

    const isLoading = isAuthLoading || isEventsLoading || isMetricsLoading;

    if (isLoading || !user) {
        return (
          <div className="flex h-screen w-full items-center justify-center bg-background">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
          </div>
        );
    }

    return (
        <>
            <AddMetricDialog 
                isOpen={isAddMetricOpen}
                onOpenChange={setIsAddMetricOpen}
                metricType={selectedMetric}
                onSave={handleAddMetric}
                userId={user.id}
            />
            <div className="p-6 bg-gradient-to-br from-green-50/50 via-slate-50/50 to-green-50/50 dark:from-green-900/10 dark:via-slate-900/10">
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
                                <div className="flex items-center rounded-md bg-muted p-0.5 text-sm font-medium">
                                    {(['daily', 'weekly', 'monthly'] as TimeRange[]).map(range => (
                                        <Button key={range} size="sm" variant={timeRange === range ? 'secondary': 'ghost'} className="h-7 capitalize" onClick={() => setTimeRange(range)}>{range}</Button>
                                    ))}
                                </div>
                                <div className="flex items-center rounded-md bg-muted p-0.5 text-sm font-medium">
                                    <Button size="icon" variant={chartType === 'line' ? 'secondary' : 'ghost'} className="h-7 w-7" onClick={() => setChartType('line')}>
                                        <LineChartIcon className="h-4 w-4"/>
                                    </Button>
                                    <Button size="icon" variant={chartType === 'bar' ? 'secondary' : 'ghost'} className="h-7 w-7" onClick={() => setChartType('bar')}>
                                        <BarChart3 className="h-4 w-4"/>
                                    </Button>
                                </div>
                                {!isMetricCalculated && (
                                    <Button size="sm" onClick={() => setIsAddMetricOpen(true)}><Plus className="mr-2 h-4 w-4"/> Add</Button>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            {isMetricsLoading ? (
                                <div className="h-[250px] w-full flex items-center justify-center"><Loader2 className="animate-spin" /></div>
                            ) : hasChartData ? (
                                <ChartContainer config={{}} className="h-[250px] w-full">
                                    {chartType === 'line' ? (
                                        <LineChartComponent data={healthTrendData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="date" tick={{ fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                                            <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false}/>
                                            <ChartTooltip content={<ChartTooltipContent />} />
                                            <Legend />
                                            <Line dataKey="value" name={selectedMetric === 'bloodPressure' ? 'Systolic' : 'Value'} type="monotone" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4, fill: 'hsl(var(--primary))' }} connectNulls={false} />
                                            {selectedMetric === 'bloodPressure' && <Line dataKey="value2" name="Diastolic" type="monotone" stroke="hsl(var(--secondary-foreground))" strokeWidth={2} dot={{ r: 4 }} connectNulls={false} />}
                                        </LineChartComponent>
                                    ) : (
                                        <BarChartComponent data={healthTrendData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="date" tick={{ fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                                            <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false}/>
                                            <ChartTooltip content={<ChartTooltipContent />} />
                                            <Legend />
                                            <Bar dataKey="value" name={selectedMetric === 'bloodPressure' ? 'Systolic' : 'Value'} fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                                            {selectedMetric === 'bloodPressure' && <Bar dataKey="value2" name="Diastolic" fill="hsl(var(--secondary-foreground))" radius={[4, 4, 0, 0]} />}
                                        </BarChartComponent>
                                    )}
                                </ChartContainer>
                            ) : (
                                <div className="h-[250px] w-full rounded-lg bg-muted/50 flex flex-col items-center justify-center text-center text-foreground p-4">
                                    <GitGraph className="h-12 w-12 mx-auto mb-2 text-primary"/>
                                    <h3 className="font-semibold">Track Your Health</h3>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        {isMetricCalculated ? "Add required data like weight and height to see this trend." : `Fill in metrics to see your ${metricOptions.find(m => m.value === selectedMetric)?.label.toLowerCase()} trends visualized here.`}
                                    </p>
                                    <Button onClick={() => isMetricCalculated ? router.push('/patient/settings') : setIsAddMetricOpen(true)}>
                                        <Plus className="mr-2 h-4 w-4"/>
                                        {isMetricCalculated ? "Update Profile" : "Add Your First Metric"}
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
        </>
    );
}
