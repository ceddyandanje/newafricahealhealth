
'use client';

import { useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { type Order, OrderStatus } from '@/lib/types';
import { ScrollArea } from '../ui/scroll-area';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Pie, PieChart, Cell, Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip } from 'recharts';
import { ListOrdered, DollarSign, CalendarDays, TrendingUp, PieChart as PieChartIcon, LineChart as LineChartIcon } from 'lucide-react';
import { subDays, format, startOfDay } from 'date-fns';

interface OrdersOverviewDialogProps {
    orders: Order[];
    isOpen: boolean;
    onClose: () => void;
}

const formatPrice = (priceInCents: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(priceInCents / 100);
};

const StatCard = ({ icon: Icon, value, label, subtext }: { icon: React.ElementType, value: string | number, label: string, subtext?: string }) => (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
        <Icon className="h-8 w-8 text-muted-foreground" />
        <div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
            {subtext && <p className="text-xs text-muted-foreground">{subtext}</p>}
        </div>
    </div>
);

const statusColors: { [key in OrderStatus]: string } = {
    'Pending Verification': 'hsl(var(--chart-5))',
    'Processing': 'hsl(var(--chart-4))',
    'Shipped': 'hsl(var(--chart-2))',
    'Delivered': 'hsl(var(--chart-1))',
    'Cancelled': 'hsl(var(--destructive))',
    'On Hold': 'hsl(var(--muted-foreground))',
};

export default function OrdersOverviewDialog({ orders, isOpen, onClose }: OrdersOverviewDialogProps) {
    
    const { totalRevenue, averageOrderValue, ordersToday, statusDistribution, revenueTrend } = useMemo(() => {
        const completedOrders = orders.filter(o => o.status === 'Delivered');
        const totalRevenue = completedOrders.reduce((sum, o) => sum + o.totalPrice, 0);
        const averageOrderValue = completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;

        const today = startOfDay(new Date());
        const ordersToday = orders.filter(o => startOfDay(new Date(o.createdAt)) >= today).length;

        const statusDistribution = Object.entries(
            orders.reduce((acc, order) => {
                acc[order.status] = (acc[order.status] || 0) + 1;
                return acc;
            }, {} as Record<OrderStatus, number>)
        ).map(([name, value]) => ({ name, value, fill: statusColors[name as OrderStatus] }));
        
        const last30Days = Array.from({ length: 30 }, (_, i) => {
            const date = subDays(new Date(), 29 - i);
            return { date: format(date, 'MMM d'), revenue: 0 };
        });

        completedOrders.forEach(order => {
            const orderDateStr = format(new Date(order.createdAt), 'MMM d');
            const dayData = last30Days.find(d => d.date === orderDateStr);
            if (dayData) {
                dayData.revenue += order.totalPrice / 100;
            }
        });

        return {
            totalRevenue,
            averageOrderValue,
            ordersToday,
            statusDistribution,
            revenueTrend: last30Days
        };

    }, [orders]);

    const router = useRouter();
    const handleViewAll = () => {
        onClose();
        router.push('/admin/orders');
    };
    
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-4xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 font-headline text-2xl">
                        <ListOrdered /> Orders Overview
                    </DialogTitle>
                    <DialogDescription>
                        A summary of sales performance and order fulfillment status.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[70vh] -mx-6 px-6">
                    <div className="py-4 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <StatCard icon={DollarSign} value={formatPrice(totalRevenue)} label="Total Revenue" />
                            <StatCard icon={TrendingUp} value={formatPrice(averageOrderValue)} label="Avg. Order Value" />
                            <StatCard icon={CalendarDays} value={ordersToday} label="Orders Today" />
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-6 pt-4">
                            <div>
                                <h3 className="font-semibold flex items-center gap-2 mb-2"><PieChartIcon className="h-5 w-5 text-muted-foreground"/> Order Status Distribution</h3>
                                <div className="h-60 w-full">
                                    <ChartContainer config={{}} className="h-full w-full">
                                        <PieChart>
                                            <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                                            <Pie data={statusDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} labelLine={false} label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                                                 {statusDistribution.map((entry) => (
                                                    <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    </ChartContainer>
                                </div>
                            </div>
                             <div>
                                <h3 className="font-semibold flex items-center gap-2 mb-2"><LineChartIcon className="h-5 w-5 text-muted-foreground"/> Revenue Trend (Last 30 Days)</h3>
                                <div className="h-60 w-full">
                                    <ChartContainer config={{}} className="h-full w-full">
                                        <LineChart data={revenueTrend} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="date" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} axisLine={false} tickLine={false} />
                                            <YAxis tickFormatter={(val) => formatPrice(val * 100).replace(/\.00$/, '')} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} axisLine={false} tickLine={false} />
                                            <RechartsTooltip content={<ChartTooltipContent formatter={(value) => formatPrice(value as number * 100)} />} />
                                            <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                                        </LineChart>
                                    </ChartContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollArea>
                <DialogFooter className="pt-4 border-t">
                    <Button variant="outline" onClick={onClose}>Close</Button>
                    <Button onClick={handleViewAll}>Manage All Orders</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
