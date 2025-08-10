

'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Hospital, Truck, Users, ClipboardList, BarChart3, LineChart as LineChartIcon, ListChecks } from "lucide-react";
import Link from "next/link";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart as BarChartComponent, CartesianGrid, XAxis, YAxis, Pie, PieChart as PieChartComponent, Cell, Line, LineChart as LineChartComponent, Area } from "recharts"
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRequests, type RefillRequest } from "@/lib/refillRequests";
import RefillRequestDialog from "@/components/admin/refill-request-dialog";
import { useUsers } from "@/lib/users";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRoadmapTasks } from "@/lib/roadmap";

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


export default function AdminDashboardPage() {
    const [isClient, setIsClient] = useState(false);
    const [requests] = useRequests();
    const { users } = useUsers();
    const { tasks } = useRoadmapTasks();
    const [selectedRequest, setSelectedRequest] = useState<RefillRequest | null>(null);
    const [chartType, setChartType] = useState<'bar' | 'line'>('bar');

    const pendingRequests = requests.filter(r => r.status === 'Pending');
    const patients = users.filter(u => u.role === 'user');
    const patientCount = patients.length;
    const pendingTasksCount = tasks.filter(t => t.status === 'Todo' || t.status === 'In Progress').length;

    const summaryData = [
        { title: "Patients", value: patientCount.toString(), icon: Users, color: "text-pink-500", bgColor: "bg-pink-100 dark:bg-pink-900/50" },
        { title: "Pending Requests", value: pendingRequests.length.toString(), icon: ClipboardList, color: "text-orange-500", bgColor: "bg-orange-100 dark:bg-orange-900/50", clickable: true },
        { title: "Pending Tasks", value: pendingTasksCount.toString(), icon: ListChecks, color: "text-purple-500", bgColor: "bg-purple-100 dark:bg-purple-900/50", href: "/admin/roadmap" },
        { title: "Staff", value: (users.length - patientCount).toString(), icon: Users, color: "text-blue-500", bgColor: "bg-blue-100 dark:bg-blue-900/50" },
    ];
    
    // Note: The breakdown is illustrative. In a real app, this would come from patient status data.
    const newPatients = Math.round(patientCount * 0.1);
    const recoveredPatients = Math.round(patientCount * 0.6);
    const inTreatmentPatients = patientCount - newPatients - recoveredPatients > 0 ? patientCount - newPatients - recoveredPatients : 0;

    const patientsChartData = [
        { name: 'Total', value: patientCount, fill: '#6B7280' },
        { name: 'New', value: newPatients, fill: '#3B82F6' },
        { name: 'Recovered', value: recoveredPatients, fill: '#10B981' },
        { name: 'In Treatment', value: inTreatmentPatients, fill: '#F59E0B' },
    ];
    const a_patientsChartData = [
        { name: 'New', value: newPatients, fill: '#3B82F6' },
        { name: 'Recovered', value: recoveredPatients, fill: '#10B981' },
        { name: 'In Treatment', value: inTreatmentPatients, fill: '#F59E0B' },
        { name: 'Other', value: Math.max(0, patientCount - newPatients - recoveredPatients - inTreatmentPatients), fill: '#e5e7eb' },
    ];
  
    useEffect(() => {
        setIsClient(true)
    }, [])

    const handleCardClick = (itemTitle: string) => {
        if (itemTitle === "Pending Requests" && pendingRequests.length > 0) {
            setSelectedRequest(pendingRequests[0]);
        }
    }

    const renderCard = (item: typeof summaryData[0]) => {
        const cardContent = (
             <CardContent className="p-4 flex items-center justify-between">
                <div>
                    <p className="text-sm text-muted-foreground">{item.title}</p>
                    <p className="text-2xl font-bold">{item.value}</p>
                </div>
                <div className={`p-3 rounded-full ${item.bgColor} ${item.color}`}>
                    <item.icon className="h-6 w-6"/>
                </div>
            </CardContent>
        );

        if (item.href) {
            return (
                <Link href={item.href} key={item.title}>
                    <Card className="hover:shadow-lg transition-shadow h-full">{cardContent}</Card>
                </Link>
            )
        }

        return (
            <Card key={item.title} onClick={() => item.clickable && handleCardClick(item.title)} className={item.clickable ? "cursor-pointer hover:shadow-lg transition-shadow h-full" : "h-full"}>
               {cardContent}
            </Card>
        );
    }

    return (
        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Top Row: Summary Cards */}
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {summaryData.map(renderCard)}
            </div>

            {/* Middle Row: Charts */}
            <Card className="lg:col-span-1 flex flex-col">
                <CardHeader>
                    <CardTitle>Patients</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col items-center justify-center">
                    {!isClient ? <Skeleton className="w-[200px] h-[200px] rounded-full" /> :
                    <>
                        <div className="relative">
                            <PieChartComponent width={200} height={200}>
                                <Pie data={a_patientsChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} startAngle={90} endAngle={450}>
                                    {a_patientsChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} stroke={entry.fill} />
                                    ))}
                                </Pie>
                            </PieChartComponent>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <p className="text-muted-foreground text-sm">Total</p>
                                <p className="font-bold text-2xl">{patientCount}</p>
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
                    </>
                    }
                </CardContent>
            </Card>

            <Card className="lg:col-span-2 flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Daily Revenue Report</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => setChartType('bar')} className={cn(chartType === 'bar' && 'bg-accent')}>
                            <BarChart3 className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setChartType('line')} className={cn(chartType === 'line' && 'bg-accent')}>
                            <LineChartIcon className="h-5 w-5" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="flex-grow">
                     <div className="flex justify-end items-center gap-2 mb-4">
                        <p className="text-2xl font-bold text-blue-500">$32,485</p>
                        <p className="text-sm text-muted-foreground line-through">$12,458</p>
                    </div>
                    {!isClient ? <Skeleton className="h-[250px] w-full" /> :
                    <>
                        <ChartContainer config={{}} className="h-[250px] w-full">
                           {chartType === 'bar' ? (
                                <BarChartComponent data={revenueChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false}/>
                                    <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                                    <Bar dataKey="income" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={10} />
                                    <Bar dataKey="expense" fill="hsl(var(--secondary-foreground))" radius={[4, 4, 0, 0]} barSize={10} />
                                </BarChartComponent>
                            ) : (
                                <LineChartComponent data={revenueChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                     <defs>
                                        <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--secondary-foreground))" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="hsl(var(--secondary-foreground))" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false}/>
                                    <ChartTooltip cursor={true} content={<ChartTooltipContent />} />
                                    <Area type="monotone" dataKey="income" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorIncome)" />
                                    <Area type="monotone" dataKey="expense" stroke="hsl(var(--secondary-foreground))" strokeWidth={2} fillOpacity={1} fill="url(#colorExpense)" />
                                </LineChartComponent>
                            )}
                        </ChartContainer>
                        <div className="flex justify-center items-center gap-6 mt-4 text-sm">
                            <div className="flex items-center gap-2"><span className="h-3 w-3 bg-primary"></span>Income</div>
                            <div className="flex items-center gap-2"><span className="h-3 w-3" style={{backgroundColor: 'hsl(var(--secondary-foreground))'}}></span>Expense</div>
                        </div>
                    </>
                    }
                </CardContent>
            </Card>

             <div className="lg:col-span-3 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Available Doctors</CardTitle>
                        <Link href="#" className="text-sm text-muted-foreground hover:underline">Today</Link>
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
                                            <p className="text-xs text-muted-foreground">{doc.specialty}</p>
                                        </div>
                                    </div>
                                    <button className="text-muted-foreground hover:text-foreground">...</button>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
                 <Card className="lg:col-span-2 bg-primary/80 text-primary-foreground border-0">
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
             {selectedRequest && <RefillRequestDialog request={selectedRequest} isOpen={!!selectedRequest} onClose={() => setSelectedRequest(null)} />}
        </div>
    );
}
