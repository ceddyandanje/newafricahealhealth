
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
  Thermometer,
  Gauge,
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
import { useHealthMetrics, addHealthMetric, getMedicalProfile } from '@/lib/healthMetrics';
import { format, subDays } from 'date-fns';
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
    const [chartType, setChartType] = useState&lt;'line' | 'bar'&gt;('line');
    const [isAddMetricOpen, setIsAddMetricOpen] = useState(false);
    const [medicalProfile, setMedicalProfile] = useState&lt;MedicalProfile | null&gt;(null);
    
    useEffect(() => {
        if (!isAuthLoading &amp;&amp; !user) {
          router.push("/login");
        } else if (user) {
            getMedicalProfile(user.id).then(setMedicalProfile);
        }
    }, [user, isAuthLoading, router]);

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour &lt; 12) {
            setGreeting('Good morning');
        } else if (hour &lt; 17) {
            setGreeting('Good afternoon');
        } else {
            setGreeting('Good evening');
        }
    }, []);

    const healthTrendData = useMemo(() => {
        const last7Days = Array.from({ length: 7 }, (_, i) => subDays(new Date(), i)).reverse();
        
        if (selectedMetric === 'bmi') {
            const heightM = (medicalProfile?.height || 0) / 100;
            if (heightM === 0) return [];
            
            const weightMetrics = metrics.filter(m => m.type === 'weight');

            return last7Days.map(day => {
                const dayString = format(day, 'yyyy-MM-dd');
                const dayMetrics = weightMetrics.filter(m => format(new Date(m.timestamp), 'yyyy-MM-dd') === dayString);
                
                if (dayMetrics.length === 0) return { date: format(day, 'MMM d'), value: null };

                const avgWeight = dayMetrics.reduce((sum, m) => sum + m.value, 0) / dayMetrics.length;
                const bmi = avgWeight / (heightM * heightM);
                return { date: format(day, 'MMM d'), value: parseFloat(bmi.toFixed(2)) };
            });
        }
        
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
                value: avgValue &gt; 0 ? avgValue : null,
                value2: avgValue2 &amp;&amp; avgValue2 &gt; 0 ? avgValue2 : null,
            };
        });
    }, [metrics, selectedMetric, medicalProfile]);
    
    const hasChartData = useMemo(() => {
        if (selectedMetric === 'bmi') {
            return metrics.some(m => m.type === 'weight') &amp;&amp; !!medicalProfile?.height;
        }
        return metrics.some(m => m.type === selectedMetric);
    }, [metrics, selectedMetric, medicalProfile]);


    const handleAddMetric = async (metricData: Omit&lt;HealthMetric, 'id' | 'timestamp'&gt;) => {
        if (!user) return;
        
        await addHealthMetric(user.id, {
            ...metricData,
            timestamp: new Date().toISOString()
        });
    };

    const isMetricCalculated = metricOptions.find(opt => opt.value === selectedMetric)?.isCalculated || false;

    const isLoading = isAuthLoading || isEventsLoading || isMetricsLoading;

    if (isLoading || !user) {
        return (
          &lt;div className="flex h-screen w-full items-center justify-center bg-background"&gt;
            &lt;Loader2 className="h-16 w-16 animate-spin text-primary" /&gt;
          &lt;/div&gt;
        );
    }

    return (
        &lt;&gt;
            &lt;AddMetricDialog 
                isOpen={isAddMetricOpen}
                onOpenChange={setIsAddMetricOpen}
                metricType={selectedMetric}
                onSave={handleAddMetric}
                userId={user.id}
            /&gt;
            &lt;div className="p-6 bg-gradient-to-br from-green-50/50 via-slate-50/50 to-green-50/50 dark:from-green-900/10 dark:via-slate-900/10 dark:to-green-900/10"&gt;
                &lt;header className="py-6"&gt;
                    &lt;h1 className="text-3xl font-bold"&gt;{greeting}, {user?.name.split(' ')[0]}&lt;/h1&gt;
                    &lt;p className="text-muted-foreground"&gt;Here’s what your day looks like.&lt;/p&gt;
                &lt;/header&gt;

                &lt;section&gt;
                    &lt;h2 className="text-xl font-semibold mb-4"&gt;Your day at a glance&lt;/h2&gt;
                    {isEventsLoading ? &lt;Loader2 className="animate-spin" /&gt; : &lt;DailyGlance events={events} /&gt;}
                &lt;/section&gt;

                &lt;div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-6"&gt;
                    &lt;Card className="lg:col-span-3 bg-background"&gt;
                        &lt;CardHeader className="flex flex-row justify-between items-center flex-wrap gap-2"&gt;
                            &lt;div className="flex items-center gap-2"&gt;
                                &lt;CardTitle&gt;Health Trends&lt;/CardTitle&gt;
                                &lt;Select value={selectedMetric} onValueChange={(val) =&gt; setSelectedMetric(val as HealthMetricType)}&gt;
                                    &lt;SelectTrigger className="w-[180px] h-9"&gt;
                                        &lt;SelectValue /&gt;
                                    &lt;/SelectTrigger&gt;
                                    &lt;SelectContent&gt;
                                        {metricOptions.map(opt =&gt; (
                                            &lt;SelectItem key={opt.value} value={opt.value}&gt;
                                                &lt;div className="flex items-center gap-2"&gt;
                                                    &lt;opt.icon className="w-4 h-4"/&gt;
                                                    {opt.label}
                                                &lt;/div&gt;
                                            &lt;/SelectItem&gt;
                                        ))}
                                    &lt;/SelectContent&gt;
                                &lt;/Select&gt;
                            &lt;/div&gt;
                            &lt;div className="flex items-center gap-2"&gt;
                                &lt;div className="flex items-center rounded-md bg-muted p-0.5"&gt;
                                    &lt;Button size="icon" variant={chartType === 'line' ? 'secondary': 'ghost'} className="h-7 w-7" onClick={() =&gt; setChartType('line')}&gt;&lt;LineChart className="h-4 w-4"/&gt;&lt;/Button&gt;
                                    &lt;Button size="icon" variant={chartType === 'bar' ? 'secondary': 'ghost'} className="h-7 w-7" onClick={() =&gt; setChartType('bar')}&gt;&lt;BarChart3 className="h-4 w-4"/&gt;&lt;/Button&gt;
                                &lt;/div&gt;
                                {!isMetricCalculated &amp;&amp; (
                                    &lt;Button size="sm" onClick={() =&gt; setIsAddMetricOpen(true)}&gt;&lt;Plus className="mr-2 h-4 w-4"/&gt; Add Metric&lt;/Button&gt;
                                )}
                            &lt;/div&gt;
                        &lt;/CardHeader&gt;
                        &lt;CardContent&gt;
                            {isMetricsLoading ? (
                                &lt;div className="h-[250px] w-full flex items-center justify-center"&gt;&lt;Loader2 className="animate-spin" /&gt;&lt;/div&gt;
                            ) : hasChartData ? (
                                &lt;ChartContainer config={{}} className="h-[250px] w-full"&gt;
                                    {chartType === 'line' ? (
                                        &lt;LineChartComponent data={healthTrendData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}&gt;
                                            &lt;CartesianGrid strokeDasharray="3 3" vertical={false} /&gt;
                                            &lt;XAxis dataKey="date" tick={{ fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} /&gt;
                                            &lt;YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false}/&gt;
                                            &lt;ChartTooltip content={&lt;ChartTooltipContent /&gt;} /&gt;
                                            &lt;Line dataKey="value" name={selectedMetric === 'bloodPressure' ? 'Systolic' : 'Value'} type="monotone" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4, fill: 'hsl(var(--primary))' }} connectNulls={false} /&gt;
                                            {selectedMetric === 'bloodPressure' &amp;&amp; &lt;Line dataKey="value2" name="Diastolic" type="monotone" stroke="hsl(var(--secondary-foreground))" strokeWidth={2} dot={{ r: 4 }} connectNulls={false} /&gt;}
                                            &lt;Legend /&gt;
                                        &lt;/LineChartComponent&gt;
                                    ) : (
                                        &lt;BarChartComponent data={healthTrendData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}&gt;
                                            &lt;CartesianGrid strokeDasharray="3 3" vertical={false} /&gt;
                                            &lt;XAxis dataKey="date" tick={{ fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} /&gt;
                                            &lt;YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false}/&gt;
                                            &lt;ChartTooltip content={&lt;ChartTooltipContent /&gt;} /&gt;
                                            &lt;Bar dataKey="value" name={selectedMetric === 'bloodPressure' ? 'Systolic' : 'Value'} fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} /&gt;
                                            {selectedMetric === 'bloodPressure' &amp;&amp; &lt;Bar dataKey="value2" name="Diastolic" fill="hsl(var(--secondary-foreground))" radius={[4, 4, 0, 0]} /&gt;}
                                            &lt;Legend /&gt;
                                        &lt;/BarChartComponent&gt;
                                    )}
                                &lt;/ChartContainer&gt;
                            ) : (
                                &lt;div className="h-[250px] w-full rounded-lg bg-muted/50 flex flex-col items-center justify-center text-center text-foreground p-4"&gt;
                                    &lt;GitGraph className="h-12 w-12 mx-auto mb-2 text-primary"/&gt;
                                    &lt;h3 className="font-semibold"&gt;Track Your Health&lt;/h3&gt;
                                    &lt;p className="text-sm text-muted-foreground mb-4"&gt;
                                        {isMetricCalculated ? "Add required data like weight and height to see this trend." : `Fill in metrics to see your ${metricOptions.find(m =&gt; m.value === selectedMetric)?.label.toLowerCase()} trends visualized here.`}
                                    &lt;/p&gt;
                                    &lt;Button onClick={() =&gt; isMetricCalculated ? router.push('/patient/settings') : setIsAddMetricOpen(true)}&gt;
                                        &lt;Plus className="mr-2 h-4 w-4"/&gt;
                                        {isMetricCalculated ? "Update Profile" : "Add Your First Metric"}
                                    &lt;/Button&gt;
                                &lt;/div&gt;
                            )}
                        &lt;/CardContent&gt;
                    &lt;/Card&gt;

                    &lt;Card className="lg:col-span-2 bg-background flex flex-col"&gt;
                        &lt;CardHeader&gt;
                            &lt;CardTitle&gt;Your Subscription&lt;/CardTitle&gt;
                        &lt;/CardHeader&gt;
                        &lt;CardContent className="flex-grow flex items-center justify-center"&gt;
                            &lt;ChartContainer config={{}} className="h-[200px] w-full"&gt;
                                &lt;PieChartComponent&gt;
                                &lt;Pie
                                    data={subscriptionData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    dataKey="value"
                                &gt;
                                    {subscriptionData.map((entry, index) =&gt; (
                                    &lt;Cell key={`cell-${index}`} fill={entry.fill} stroke={entry.fill} /&gt;
                                    ))}
                                &lt;/Pie&gt;
                                &lt;ChartTooltip content={&lt;ChartTooltipContent nameKey="name" /&gt;} /&gt;
                                &lt;/PieChartComponent&gt;
                            &lt;/ChartContainer&gt;
                        &lt;/CardContent&gt;
                        &lt;div className="flex justify-center gap-4 p-4 text-sm"&gt;
                            &lt;div className="flex items-center gap-2"&gt;
                                &lt;span className="h-3 w-3 rounded-full bg-primary"&gt;&lt;/span&gt;
                                &lt;span&gt;Active ({subscriptionData[0].value})&lt;/span&gt;
                            &lt;/div&gt;
                            &lt;div className="flex items-center gap-2"&gt;
                                &lt;span className="h-3 w-3 rounded-full bg-muted"&gt;&lt;/span&gt;
                                &lt;span&gt;Paused ({subscriptionData[1].value})&lt;/span&gt;
                            &lt;/div&gt;
                        &lt;/div&gt;
                    &lt;/Card&gt;
                &lt;/div&gt;

                &lt;section className="mt-6"&gt;
                    &lt;Card className="bg-background"&gt;
                        &lt;CardHeader className="flex flex-row items-center justify-between"&gt;
                            &lt;CardTitle&gt;Your Care Team&lt;/CardTitle&gt;
                            &lt;Button variant="ghost" size="sm"&gt;View All&lt;/Button&gt;
                        &lt;/CardHeader&gt;
                        &lt;CardContent&gt;
                            &lt;div className="flex items-center justify-between p-4 rounded-lg bg-red-500/10 border border-red-500/20"&gt;
                                &lt;div className="flex items-center gap-3"&gt;
                                    &lt;div className="p-2 bg-red-500/20 text-red-500 rounded-full"&gt;
                                        &lt;Flag className="h-5 w-5" /&gt;
                                    &lt;/div&gt;
                                    &lt;div&gt;
                                        &lt;p className="font-semibold text-red-600"&gt;Open Issue&lt;/p&gt;
                                        &lt;p className="text-sm text-red-500"&gt;Your latest lab results are ready for review.&lt;/p&gt;
                                    &lt;/div&gt;
                                &lt;/div&gt;
                                &lt;Button variant="ghost" size="icon"&gt;&lt;ChevronRight/&gt;&lt;/Button&gt;
                            &lt;/div&gt;
                        &lt;/CardContent&gt;
                    &lt;/Card&gt;
                &lt;/section&gt;
            &lt;/div&gt;
        &lt;/&gt;
    );
}

    