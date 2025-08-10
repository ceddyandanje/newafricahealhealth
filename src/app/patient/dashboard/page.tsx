
'use client';

import {
  Pill,
  Droplets,
  Video,
  ChevronRight,
  Flag,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart as LineChartComponent, Pie, PieChart as PieChartComponent, Cell } from "recharts"
import { cn } from '@/lib/utils';

const dailyGlanceItems = [
    { icon: Pill, title: "Take Metformin", time: "8:00 AM", status: "Done" },
    { icon: Droplets, title: "Log Blood Sugar", time: "8:05 AM", status: "Due" },
    { icon: Video, title: "Dr. Chen's Appointment", time: "11:00 AM", status: "Upcoming" },
];

const subscriptionData = [
  { name: 'Active', value: 3, fill: 'hsl(var(--primary))' },
  { name: 'Paused', value: 1, fill: 'hsl(var(--muted))' },
];

const healthTrendData = [
  { day: 'Mon', value: 140 },
  { day: 'Tue', value: 135 },
  { day: 'Wed', value: 150 },
  { day: 'Thu', value: 142 },
  { day: 'Fri', value: 160 },
  { day: 'Sat', value: 155 },
  { day: 'Sun', value: 148 },
];

export default function PatientDashboardPage() {
    return (
        <div className="bg-muted/40 p-6 min-h-screen">
            <header className="py-6">
                <h1 className="text-3xl font-bold">Good morning, Sarah</h1>
                <p className="text-muted-foreground">Here’s what your day looks like.</p>
            </header>

            <section>
                <h2 className="text-xl font-semibold mb-4">Your day at a glance</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   {dailyGlanceItems.map(item => {
                       const statusColor = item.status === "Done" ? "text-green-500" : item.status === "Due" ? "text-orange-500" : "text-blue-500";
                       return (
                        <Card key={item.title} className="bg-background">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="bg-primary/10 text-primary p-3 rounded-lg">
                                        <item.icon className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">{item.title}</p>
                                        <p className="text-sm text-muted-foreground">{item.time}</p>
                                    </div>
                                </div>
                                <span className={cn("text-sm font-bold", statusColor)}>{item.status}</span>
                            </CardContent>
                        </Card>
                       )
                   })}
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-6">
                <Card className="lg:col-span-3 bg-background">
                    <CardHeader>
                        <CardTitle>Health Trends</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={{}} className="h-[250px] w-full">
                            <LineChartComponent data={healthTrendData}>
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4, fill: 'hsl(var(--primary))' }} />
                            </LineChartComponent>
                        </ChartContainer>
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
