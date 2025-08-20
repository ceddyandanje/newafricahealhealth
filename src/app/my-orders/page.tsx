
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useOrders } from '@/lib/orders';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ListOrdered, Loader2, Package, CheckCircle, RefreshCw, Truck, XCircle, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { type Order, OrderStatus } from '@/lib/types';
import Image from 'next/image';

const formatPrice = (priceInCents: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(priceInCents / 100);
};

const statusConfig: { [key in OrderStatus]: { icon: React.ElementType, color: string, description: string } } = {
    'Pending Verification': { icon: RefreshCw, color: 'text-yellow-600', description: 'We are confirming your M-Pesa payment.' },
    'Processing': { icon: Package, color: 'text-blue-600', description: 'Your order is being prepared for shipment.' },
    'Shipped': { icon: Truck, color: 'text-indigo-600', description: 'Your order is on its way to you.' },
    'Delivered': { icon: CheckCircle, color: 'text-green-600', description: 'Your order has been delivered. Thank you!' },
    'Cancelled': { icon: XCircle, color: 'text-red-600', description: 'This order has been cancelled.' },
    'On Hold': { icon: AlertCircle, color: 'text-orange-600', description: 'There is an issue with your order. Please contact support.' },
};

function OrderItem({ order }: { order: Order }) {
    const config = statusConfig[order.status];
    return (
        <Card className="glassmorphic overflow-hidden">
            <CardHeader className="flex flex-row justify-between items-center bg-muted/30 p-4">
                <div>
                    <p className="font-bold">Order ID: {order.orderId}</p>
                    <p className="text-sm text-muted-foreground">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                 <Badge variant={order.status === 'Cancelled' ? 'destructive' : 'default'} className="capitalize">{order.status}</Badge>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-3">
                     <config.icon className={`h-5 w-5 ${config.color}`} />
                     <p className={`text-sm font-semibold ${config.color}`}>{config.description}</p>
                </div>
                <div className="space-y-2">
                    {order.items.map(item => (
                        <div key={item.product.id} className="flex items-center gap-3 text-sm">
                            <Image src={item.product.image} alt={item.product.name} width={50} height={50} className="rounded-md" />
                            <div className="flex-grow">
                                <p>{item.product.name}</p>
                                <p className="text-muted-foreground">Qty: {item.quantity}</p>
                            </div>
                            <p>{formatPrice(item.product.price * item.quantity)}</p>
                        </div>
                    ))}
                </div>
                <div className="text-right font-bold border-t pt-2">
                    Total: {formatPrice(order.totalPrice)}
                </div>
            </CardContent>
        </Card>
    );
}

export default function MyOrdersPage() {
    const { user } = useAuth();
    const { orders, isLoading } = useOrders(user?.id);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient || isLoading) {
        return (
            <div className="flex h-[50vh] w-full items-center justify-center">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        )
    }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
         <header className="text-center mb-8">
            <h1 className="text-4xl font-bold font-headline flex items-center justify-center gap-3"><ListOrdered /> My Orders</h1>
            <p className="text-muted-foreground mt-2">Track your current and past orders.</p>
         </header>
         {orders.length > 0 ? (
            <div className="space-y-6">
                {orders.map(order => <OrderItem key={order.id} order={order} />)}
            </div>
         ) : (
             <div className="text-center glassmorphic p-12">
                <p className="text-xl text-muted-foreground">You haven't placed any orders yet.</p>
             </div>
         )}
      </div>
    </div>
  );
}
