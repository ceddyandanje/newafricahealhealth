
'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Calendar,
  Mail,
  FileText,
  User,
  Settings,
  Bell,
  MessageSquare,
  HelpCircle,
  Pill,
  Droplets,
  Video,
  ChevronRight,
  MoreVertical,
  Flag,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Pie, PieChart, Cell, Line, LineChart, ResponsiveContainer } from "recharts"
import { cn } from '@/lib/utils';
import './patient.css';

const sidebarNavItems = [
  { href: '#', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '#', icon: Calendar, label: 'Appointments' },
  { href: '#', icon: Mail, label: 'Messages' },
  { href: '#', icon: FileText, label: 'Prescriptions' },
  { href: '#', icon: User, label: 'Profile' },
];

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
    const [activeNav, setActiveNav] = useState('Dashboard');

    return (
        <div className="patient-dashboard-layout bg-muted/40">
            {/* Left Sidebar */}
            <aside className="patient-sidebar">
                <div className="flex flex-col items-center h-full bg-background border-r py-4">
                    <Avatar className="h-12 w-12 mb-8">
                        <AvatarFallback>AHH</AvatarFallback>
                    </Avatar>
                    <nav className="flex flex-col items-center gap-4 flex-grow">
                        {sidebarNavItems.map(item => (
                             <button 
                                key={item.label}
                                onClick={() => setActiveNav(item.label)}
                                className={cn(
                                    "p-3 rounded-lg transition-colors relative",
                                    activeNav === item.label ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                                )}
                                title={item.label}
                            >
                                <item.icon className="h-6 w-6" />
                                 {activeNav === item.label && <div className="absolute left-full top-1/2 -translate-y-1/2 h-6 w-1.5 bg-primary rounded-r-full ml-2" />}
                            </button>
                        ))}
                    </nav>
                    <div className="mt-auto">
                        <button className="p-3 rounded-lg hover:bg-accent">
                            <Settings className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="patient-main-content">
                <header className="py-6">
                    <h1 className="text-3xl font-bold">Good morning, Sarah</h1>
                    <p className="text-muted-foreground">Here’s what your day looks like.</p>
                </header>

                {/* Your Day at a Glance */}
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
                    {/* Health Trends */}
                    <Card className="lg:col-span-3 bg-background">
                        <CardHeader>
                            <CardTitle>Health Trends</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={250}>
                                <LineChart data={healthTrendData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="day" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4, fill: 'hsl(var(--primary))' }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Subscription */}
                    <Card className="lg:col-span-2 bg-background flex flex-col">
                        <CardHeader>
                            <CardTitle>Your Subscription</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow flex items-center justify-center">
                             <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
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
                                </PieChart>
                            </ResponsiveContainer>
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

                {/* Care Team */}
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
            </main>

            {/* Right Action Bar */}
            <aside className="patient-actions">
                <div className="flex flex-col h-full bg-background border-l p-4">
                     <div className="flex items-center justify-between mb-6">
                        <Avatar>
                            <AvatarImage src="https://i.pravatar.cc/150?u=sarah" alt="Sarah" />
                            <AvatarFallback>S</AvatarFallback>
                        </Avatar>
                        <Button variant="ghost" size="icon">
                            <Bell className="h-5 w-5"/>
                        </Button>
                     </div>
                     <Card className="flex-grow">
                         <CardHeader>
                             <CardTitle className="text-lg">Quick Actions</CardTitle>
                         </CardHeader>
                         <CardContent className="space-y-3">
                             <Button variant="outline" className="w-full justify-start"><MessageSquare className="mr-2 h-4 w-4"/> Message Doctor</Button>
                             <Button variant="outline" className="w-full justify-start"><FileText className="mr-2 h-4 w-4"/> Upload Document</Button>
                             <Button variant="outline" className="w-full justify-start"><HelpCircle className="mr-2 h-4 w-4"/> Help & Support</Button>
                         </CardContent>
                     </Card>
                </div>
            </aside>
        </div>
    );
}
