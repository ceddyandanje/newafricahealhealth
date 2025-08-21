
'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ClipboardList, BarChart3, LineChart as LineChartIcon, CheckCircle, Package, ListOrdered, Users } from "lucide-react";
import Link from "next/link";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart as BarChartComponent, CartesianGrid, XAxis, YAxis, Pie, PieChart as PieChartComponent, Cell, Line, LineChart as LineChartComponent, Area } from "recharts"
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRequests, type RefillRequest } from "@/lib/refillRequests";
import RefillRequestDialog from "@/components/admin/refill-request-dialog";
import { useUsers, type User } from "@/lib/users";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import UserInsightsDialog from "@/components/admin/patient-insights-dialog";
import { useProducts } from "@/hooks/use-products";
import InventoryStatusDialog from "@/components/admin/inventory-status-dialog";
import { useOrdersForAdmin as useOrders, OrderStatus } from "@/lib/orders";
import { useRouter } from "next/navigation";
import OrdersOverviewDialog from "@/components/admin/orders-overview-dialog";


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

const statusColors: { [key in OrderStatus]: string } = {
    'Pending Verification': 'hsl(var(--chart-5))',
    'Processing': 'hsl(var(--chart-4))',
    'Shipped': 'hsl(var(--chart-2))',
    'Delivered': 'hsl(var(--chart-1))',
    'Cancelled': 'hsl(var(--destructive))',
    'On Hold': 'hsl(var(--muted-foreground))',
};


export default function AdminDashboardPage() {
    const [isClient, setIsClient] = useState(false);
    const { requests } = useRequests();
    const { users } = useUsers();
    const { products } = useProducts();
    const { orders } = useOrders();
    const router = useRouter();

    const [isRequestsDialogOpen, setIsRequestsDialogOpen] = useState(false);
    const [isPatientInsightsOpen, setIsPatientInsightsOpen] = useState(false);
    const [isInventoryDialogOpen, setIsInventoryDialogOpen] = useState(false);
    const [isOrdersOverviewOpen, setIsOrdersOverviewOpen] = useState(false);
    const [chartType, setChartType] = useState<'bar' | 'line'>('bar');

    const pendingRequests = requests.filter(r => r.status === 'Pending');
    const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= 10).length;

    const summaryData = [
        { title: "Total Users", value: users.length.toString(), icon: Users, color: "text-pink-500", bgColor: "bg-pink-100 dark:bg-pink-900/50", clickable: true },
        { title: "Pending Requests", value: pendingRequests.length.toString(), icon: ClipboardList, color: "text-orange-500", bgColor: "bg-orange-100 dark:bg-orange-900/50", clickable: true },
        { title: "Inventory Low Stock", value: lowStockCount.toString(), icon: Package, color: "text-purple-500", bgColor: "bg-purple-100 dark:bg-purple-900/50", clickable: true },
        { title: "Total Orders", value: orders.length.toString(), icon: ListOrdered, color: "text-blue-500", bgColor: "bg-blue-100 dark:bg-blue-900/50", clickable: true },
    ];
    
    const orderStatusDistribution = Object.entries(
        orders.reduce((acc, order) => {
            acc[order.status] = (acc[order.status] || 0) + 1;
            return acc;
        }, {} as Record<OrderStatus, number>)
    ).map(([name, value]) => ({ name, value, fill: statusColors[name as OrderStatus] }));
  
    useEffect(() => {
        setIsClient(true)
    }, [])

    const handleCardClick = (itemTitle: string) => {
        if (itemTitle === "Pending Requests") {
            setIsRequestsDialogOpen(true);
        }
        if (itemTitle === "Total Users") {
            setIsPatientInsightsOpen(true);
        }
        if (itemTitle === "Inventory Low Stock") {
            setIsInventoryDialogOpen(true);
        }
        if (itemTitle === "Total Orders") {
            setIsOrdersOverviewOpen(true);
        }
    }

    const renderCard = (item: typeof summaryData[0]) => {
        const isLowStockCard = item.title === 'Inventory Low Stock';
        const isLowStockZero = isLowStockCard && item.value === '0';

        const cardContent = (
             <CardContent className="p-4 flex items-center justify-between">
                <div>
                    <p className="text-sm text-muted-foreground">{item.title}</p>
                    {isLowStockZero ? (
                        <CheckCircle className="h-8 w-8 text-green-500 mt-1" />
                    ) : (
                        <p className="text-2xl font-bold">{item.value}</p>
                    )}
                </div>
                <div className={`p-3 rounded-full ${item.bgColor} ${item.color}`}>
                    <item.icon className="h-6 w-6"/>
                </div>
            </CardContent>
        );
        
        return (
            <Card key={item.title} onClick={() => item.clickable && handleCardClick(item.title)} className={cn("cursor-pointer hover:shadow-lg transition-shadow h-full", !item.clickable && "pointer-events-none")}>
               {cardContent}
            </Card>
        );
    }

    return (
        <div className="p-4 md:p-6 space-y-6">
            {/* Top Row: Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {summaryData.map(renderCard)}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Middle Row: Charts */}
                <Card className="lg:col-span-1 flex flex-col">
                    <CardHeader>
                        <CardTitle>Order Status Funnel</CardTitle>
                        <CardDescription>A real-time overview of the order fulfillment process.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow flex flex-col items-center justify-center">
                        {!isClient ? <Skeleton className="w-[200px] h-[200px] rounded-full" /> :
                        <>
                            <ChartContainer config={{}} className="h-[200px] w-full">
                                <PieChartComponent>
                                    <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                                    <Pie data={orderStatusDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} startAngle={90} endAngle={450}>
                                        {orderStatusDistribution.map((entry) => (
                                            <Cell key={`cell-${entry.name}`} fill={entry.fill} stroke={entry.fill} />
                                        ))}
                                    </Pie>
                                </PieChartComponent>
                            </ChartContainer>
                            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4 text-sm">
                                {orderStatusDistribution.map(item => (
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
                    <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-2">
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
                        <div key={chartType} className="relative">
                             <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-4 text-center rounded-lg">
                                <h3 className="font-bold text-lg mb-2 text-foreground">Coming Soon: Live Revenue Tracking</h3>
                                <p className="text-sm text-muted-foreground max-w-sm">
                                    This chart will display live data from your orders, including daily income vs. expenses, to give you a clear view of your financial performance.
                                </p>
                            </div>
                            <ChartContainer config={{}} className="h-[250px] w-full blur-sm">
                               {chartType === 'bar' ? (
                                    <BarChartComponent data={revenueChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false}/>
                                        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                                        <Bar key="income-bar" dataKey="income" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={10} />
                                        <Bar key="expense-bar" dataKey="expense" fill="hsl(var(--secondary-foreground))" radius={[4, 4, 0, 0]} barSize={10} />
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
                            <div className="flex justify-center items-center gap-6 mt-4 text-sm blur-sm">
                                <div className="flex items-center gap-2"><span className="h-3 w-3 bg-primary"></span>Income</div>
                                <div className="flex items-center gap-2"><span className="h-3 w-3" style={{backgroundColor: 'hsl(var(--secondary-foreground))'}}></span>Expense</div>
                            </div>
                        </div>
                        }
                    </CardContent>
                </Card>
            </div>

             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                    <CardContent className="flex flex-col sm:flex-row items-center justify-around text-center sm:text-left gap-4">
                        <div className="text-center">
                            <Avatar className="h-24 w-24 mx-auto mb-2 border-4 border-white">
                                <AvatarImage src="https://i.pravatar.cc/150?u=doc-month" />
                                <AvatarFallback>DM</AvatarFallback>
                            </Avatar>
                            <p className="font-bold">Dr. Tobey Doo</p>
                            <p className="text-sm opacity-80">Cardiologist</p>
                        </div>
                        <div className="w-full sm:w-px sm:bg-white/30 sm:self-stretch h-px sm:h-auto bg-white/30 mx-4"></div>
                        <div className="space-y-2">
                            <p className="font-bold">Total Appointments</p>
                            <p className="text-4xl font-bold">124</p>
                            <p className="text-xs opacity-80">+12% from last month</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
            {isRequestsDialogOpen && <RefillRequestDialog requests={pendingRequests} isOpen={isRequestsDialogOpen} onClose={() => setIsRequestsDialogOpen(false)} />}
            {isPatientInsightsOpen && <UserInsightsDialog users={users} isOpen={isPatientInsightsOpen} onClose={() => setIsPatientInsightsOpen(false)} />}
            {isInventoryDialogOpen && <InventoryStatusDialog products={products} isOpen={isInventoryDialogOpen} onClose={() => setIsInventoryDialogOpen(false)} />}
            {isOrdersOverviewOpen && <OrdersOverviewDialog orders={orders} isOpen={isOrdersOverviewOpen} onClose={() => setIsOrdersOverviewOpen(false)} />}
        </div>
    );
}
