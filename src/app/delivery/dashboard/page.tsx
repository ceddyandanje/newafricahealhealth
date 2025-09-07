
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, MapPin, Package, CheckCircle, Clock, ListOrdered, ArrowRight } from "lucide-react";
import { useOrdersForAdmin as useOrders } from '@/lib/orders';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';
import { type Order } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

const StatCard = ({ icon: Icon, value, label, variant }: { icon: React.ElementType, value: string | number, label: string, variant: 'default' | 'success' | 'warning' }) => (
    <Card className={`bg-background`}>
        <CardContent className="p-4 flex items-center gap-4">
            <Icon className={`h-8 w-8 ${
                variant === 'success' ? 'text-green-500' :
                variant === 'warning' ? 'text-orange-500' : 'text-primary'
            }`} />
            <div>
                <p className="text-3xl font-bold">{value}</p>
                <p className="text-sm text-muted-foreground">{label}</p>
            </div>
        </CardContent>
    </Card>
);

const OrderItem = ({ order, onDetailsClick }: { order: Order; onDetailsClick: () => void }) => (
    <div className="border p-4 rounded-lg flex items-center justify-between hover:bg-muted/50 transition-colors">
        <div>
            <p className="font-semibold text-base flex items-center gap-2"><Package className="w-4 h-4"/> Order #{order.orderId}</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {order.city}</span>
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
        </div>
        <Button size="sm" variant="outline" onClick={onDetailsClick}>View Details <ArrowRight className="ml-2 h-4 w-4"/></Button>
    </div>
);


export default function DeliveryDashboardPage() {
    const { user } = useAuth();
    const { orders, isLoading } = useOrders(); // This hook fetches all orders, we filter client-side

    const myDeliveries = useMemo(() => {
        // In a real app, orders would have a 'driverId' field. We simulate this for now.
        // Let's assume some orders are assigned to this driver for demonstration.
        // A real implementation would filter `where('driverId', '==', user?.id)` in the hook.
        return orders.filter(o => o.status === 'Shipped' || o.status === 'Processing');
    }, [orders]);

    const upcomingDeliveries = myDeliveries.filter(o => o.status === 'Processing');
    const outForDelivery = myDeliveries.filter(o => o.status === 'Shipped');
    const completedToday = myDeliveries.filter(o => o.status === 'Delivered' && new Date(o.updatedAt).toDateString() === new Date().toDateString()).length;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="p-6 h-full flex flex-col gap-6">
            <header>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Truck className="w-8 h-8 text-primary" />
                    Delivery Dashboard
                </h1>
                <p className="text-muted-foreground">Welcome, {user?.name.split(' ')[0]}. Here are your tasks for today.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard icon={ListOrdered} value={upcomingDeliveries.length} label="Upcoming Pickups" variant="warning" />
                <StatCard icon={Truck} value={outForDelivery.length} label="Out for Delivery" variant="default" />
                <StatCard icon={CheckCircle} value={completedToday} label="Completed Today" variant="success" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow">
                 <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle>Upcoming Pickups</CardTitle>
                        <CardDescription>Orders ready to be collected for delivery.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-3 overflow-y-auto">
                        {upcomingDeliveries.length > 0 ? (
                             upcomingDeliveries.map(order => <OrderItem key={order.id} order={order} onDetailsClick={() => {}}/>)
                        ) : (
                            <div className="text-center text-muted-foreground pt-10">No upcoming pickups.</div>
                        )}
                    </CardContent>
                </Card>
                 <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle>Active Route</CardTitle>
                        <CardDescription>Your current delivery route and stops.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow relative">
                         <div className="absolute inset-0 bg-muted/50 flex items-center justify-center text-center p-4 rounded-b-lg">
                            <div>
                                <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2"/>
                                <h3 className="font-semibold">Live Map Not Available</h3>
                                <p className="text-sm text-muted-foreground">Map integration is coming soon to visualize your route.</p>
                            </div>
                         </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
