
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { BarChart, Bell, Calendar, DollarSign, Expand, FileText, Folder, HeartPulse, Home, Hospital, Inbox, Menu, PieChart, Search, Settings, Shield, ShoppingBag, Truck, Users, Video } from "lucide-react";
import Link from "next/link";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart as BarChartComponent, CartesianGrid, XAxis, YAxis, Pie, PieChart as PieChartComponent, Cell } from "recharts"

const summaryData = [
    { title: "Patients", value: "1,421", icon: Users, color: "text-pink-500", bgColor: "bg-pink-100 dark:bg-pink-900/50" },
    { title: "Staffs", value: "1,521", icon: Users, color: "text-yellow-500", bgColor: "bg-yellow-100 dark:bg-yellow-900/50" },
    { title: "Rooms", value: "2,415", icon: Hospital, color: "text-blue-500", bgColor: "bg-blue-100 dark:bg-blue-900/50" },
    { title: "Ambulance", value: "15", icon: Truck, color: "text-cyan-500", bgColor: "bg-cyan-100 dark:bg-cyan-900/50" },
];

const patientsChartData = [
    { name: 'Total', value: 145212, fill: '#6B7280' },
    { name: 'New', value: 64, fill: '#3B82F6' },
    { name: 'Recovered', value: 73, fill: '#F59E0B' },
    { name: 'In Treatment', value: 48, fill: '#EF4444' },
];
const a_patientsChartData = [
    { name: 'New', value: 64, fill: '#3B82F6' },
    { name: 'Recovered', value: 73, fill: '#F59E0B' },
    { name: 'In Treatment', value: 48, fill: '#EF4444' },
    { name: 'Other', value: 145212 - 64 - 73 - 48, fill: '#e5e7eb' },
];


const revenueChartData = [
    { name: '10 May', income: 80, expense: 40 },
    { name: '11 May', value: 300, income: 90, expense: 55 },
    { name: '12 May', value: 200, income: 75, expense: 60 },
    { name: '13 May', value: 278, income: 100, expense: 50 },
    { name: '14 May', value: 189, income: 85, expense: 62 },
    { name: '15 May', value: 239, income: 110, expense: 45 },
    { name: '16 May', value: 349, income: 90, expense: 65 },
];

const availableDoctors = [
    { name: "Dr. Jaylon Stanton", specialty: "Dentist", avatar: "https://i.pravatar.cc/150?u=doc1" },
    { name: "Dr. Carla Schleifer", specialty: "Oculist", avatar: "https://i.pravatar.cc/150?u=doc2" },
    { name: "Dr. Hanna Geidt", specialty: "Surgeon", avatar: "https://i.pravatar.cc/150?u=doc3" },
];

const sidebarNavItems = [
    { href: "/admin", icon: Home, label: "Dashboard" },
    { href: "/admin/appointments", icon: Calendar, label: "Appointments" },
    { href: "/admin/patients", icon: Users, label: "Patients" },
    { href: "/admin/doctors", icon: HeartPulse, label: "Doctors" },
    { href: "/admin/features", icon: Folder, label: "Features" },
    { href: "/admin/forms-tables-charts", icon: FileText, label: "Forms, Tables & Charts" },
    { href: "/admin/apps-widgets", icon: ShoppingBag, label: "Apps & Widgets" },
    { href: "/admin/authentication", icon: Shield, label: "Authentication" },
    { href: "/admin/miscellaneous", icon: Inbox, label: "Miscellaneous" },
]

export default function AdminDashboardPage() {
    return (
        <div className="min-h-screen bg-admin-background text-admin-foreground flex">
            {/* Sidebar */}
            <aside className="w-64 bg-admin-sidebar-bg text-admin-sidebar-foreground flex flex-col">
                <div className="p-6 flex items-center gap-2">
                    <HeartPulse className="h-8 w-8 text-red-500" />
                    <h1 className="text-xl font-bold">Rhythm Admin</h1>
                </div>
                <div className="p-4">
                    <button className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2">
                        <Video className="h-5 w-5"/> Emergency help
                    </button>
                </div>
                <nav className="flex-grow p-4 space-y-2">
                    {sidebarNavItems.map(item => (
                        <Link key={item.label} href={item.href} className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${item.href === '/admin' ? 'bg-admin-accent text-admin-accent-foreground' : 'hover:bg-admin-accent/50'}`}>
                            <item.icon className="h-5 w-5" />
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="bg-admin-sidebar-bg flex items-center justify-between p-4 shadow-md">
                    <div className="flex items-center gap-4">
                        <button className="p-2 rounded-md hover:bg-admin-accent/50"><Menu /></button>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
                            <Input placeholder="Search" className="bg-admin-background pl-10 w-64"/>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-2 rounded-md hover:bg-admin-accent/50"><Expand /></button>
                        <button className="p-2 rounded-md hover:bg-admin-accent/50"><Bell /></button>
                        <button className="p-2 rounded-md hover:bg-admin-accent/50"><Settings /></button>
                        <Separator orientation="vertical" className="h-8 bg-gray-600"/>
                        <div className="flex items-center gap-2">
                            <Avatar>
                                <AvatarImage src="https://i.pravatar.cc/150?u=admin" />
                                <AvatarFallback>JD</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold text-sm">John Doe</p>
                                <p className="text-xs text-gray-400">ADMIN</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dashboard Grid */}
                <main className="flex-grow p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Top Row: Summary Cards */}
                    <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {summaryData.map(item => (
                            <Card key={item.title} className="bg-admin-card-bg border-admin-border">
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-400">{item.title}</p>
                                        <p className="text-2xl font-bold">{item.value}</p>
                                    </div>
                                    <div className={`p-3 rounded-full ${item.bgColor} ${item.color}`}>
                                        <item.icon className="h-6 w-6"/>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Middle Row: Charts */}
                    <Card className="lg:col-span-1 bg-admin-card-bg border-admin-border flex flex-col">
                        <CardHeader>
                            <CardTitle>Patients</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow flex flex-col items-center justify-center">
                            <div className="relative">
                                <PieChartComponent width={200} height={200}>
                                    <Pie data={a_patientsChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} startAngle={90} endAngle={450}>
                                        {a_patientsChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} stroke={entry.fill} />
                                        ))}
                                    </Pie>
                                </PieChartComponent>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <p className="text-gray-400 text-sm">Total</p>
                                    <p className="font-bold text-2xl">145,212</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap justify-center gap-4 mt-4 text-sm">
                                {patientsChartData.slice(1).map(item => (
                                     <div key={item.name} className="flex items-center gap-2">
                                        <span className="h-3 w-3 rounded-full" style={{backgroundColor: item.fill}}></span>
                                        <span>{item.name}: {item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="lg:col-span-2 bg-admin-card-bg border-admin-border flex flex-col">
                        <CardHeader>
                            <CardTitle>Daily Revenue Report</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow">
                             <div className="flex justify-end items-center gap-2 mb-4">
                                <p className="text-2xl font-bold text-blue-400">$32,485</p>
                                <p className="text-sm text-gray-500 line-through">$12,458</p>
                            </div>
                            <ChartContainer config={{}} className="h-[250px] w-full">
                                <BarChartComponent data={revenueChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.1)"/>
                                    <XAxis dataKey="name" tick={{ fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fill: '#9CA3AF' }} axisLine={false} tickLine={false}/>
                                    <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                                    <Bar dataKey="income" fill="#EF4444" radius={[4, 4, 0, 0]} barSize={10} />
                                    <Bar dataKey="expense" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={10} />
                                </BarChartComponent>
                            </ChartContainer>
                             <div className="flex justify-center items-center gap-6 mt-4 text-sm">
                                <div className="flex items-center gap-2"><span className="h-3 w-3 bg-red-500"></span>Income</div>
                                <div className="flex items-center gap-2"><span className="h-3 w-3 bg-blue-500"></span>Expense</div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Bottom Row: Doctors */}
                    <div className="lg:col-span-3 grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card className="lg:col-span-1 bg-admin-card-bg border-admin-border">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Available Doctors</CardTitle>
                                <Link href="#" className="text-sm text-gray-400 hover:underline">Today</Link>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-4">
                                    {availableDoctors.map(doc => (
                                        <li key={doc.name} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Avatar>
                                                    <AvatarImage src={doc.avatar} />
                                                    <AvatarFallback>{doc.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-semibold text-sm">{doc.name}</p>
                                                    <p className="text-xs text-gray-400">{doc.specialty}</p>
                                                </div>
                                            </div>
                                            <button className="text-gray-400 hover:text-white">...</button>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                         <Card className="lg:col-span-2 bg-blue-600 text-white border-0">
                            <CardHeader>
                                <CardTitle>Doctor of the Month</CardTitle>
                            </CardHeader>
                            <CardContent className="flex items-center justify-around">
                                <div className="text-center">
                                    <Avatar className="h-24 w-24 mx-auto mb-2 border-4 border-white">
                                        <AvatarImage src="https://i.pravatar.cc/150?u=doc-month" />
                                        <AvatarFallback>DM</AvatarFallback>
                                    </Avatar>
                                    <p className="font-bold">Dr. Tobey Doo</p>
                                    <p className="text-sm opacity-80">Cardiologist</p>
                                </div>
                                <div className="w-px bg-white/30 self-stretch mx-4"></div>
                                <div className="space-y-2">
                                    <p className="font-bold">Total Appointments</p>
                                    <p className="text-4xl font-bold">124</p>
                                    <p className="text-xs opacity-80">+12% from last month</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    );
}
