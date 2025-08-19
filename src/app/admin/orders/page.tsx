
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { ListOrdered, Search, Loader2, Filter, Package, User, Clipboard, Check, X, Truck } from "lucide-react";
import { useOrders, updateOrderStatus } from "@/lib/orders";
import { type Order, OrderStatus } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { addLog } from '@/lib/logs';
import { addNotification } from '@/lib/notifications';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';


const formatPrice = (priceInCents: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(priceInCents / 100);
};

const statusVariant = {
  'Pending Verification': 'secondary',
  'On Hold': 'secondary',
  'Processing': 'default',
  'Shipped': 'outline',
  'Delivered': 'outline',
  'Cancelled': 'destructive',
} as const;


function OrderDetailsDialog({ order, onOpenChange }: { order: Order; onOpenChange: (open: boolean) => void }) {
    const { toast } = useToast();

    const handleUpdateStatus = async (status: OrderStatus) => {
        try {
            await updateOrderStatus(order.id, status);
            addLog("INFO", `Order ${order.orderId} status updated to ${status}.`);
            addNotification({
                recipientId: order.userId,
                type: 'info',
                title: 'Order Status Updated',
                description: `The status of your order #${order.orderId} is now: ${status}.`
            });
            toast({ title: "Status Updated", description: `Order ${order.orderId} is now ${status}.`});
            onOpenChange(false);
        } catch (error) {
            console.error("Failed to update status:", error);
            toast({ variant: 'destructive', title: "Update Failed", description: "Could not update order status."});
        }
    };

    return (
        <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
                <DialogTitle>Order Details: {order.orderId}</DialogTitle>
            </DialogHeader>
            <div className="grid md:grid-cols-2 gap-6 py-4 max-h-[70vh] overflow-y-auto">
                <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2"><User/> Customer Details</h3>
                    <p className="text-sm"><strong>Name:</strong> {order.name}</p>
                    <p className="text-sm"><strong>Email:</strong> {order.email}</p>
                    <p className="text-sm"><strong>Address:</strong> {order.address}, {order.city}</p>
                    
                    <h3 className="font-semibold flex items-center gap-2 pt-4"><Package/> Items Ordered</h3>
                    <div className="space-y-2">
                        {order.items.map(item => (
                            <div key={item.product.id} className="flex items-center gap-2 text-sm">
                                <Image src={item.product.image} alt={item.product.name} width={40} height={40} className="rounded" />
                                <span className="flex-grow">{item.product.name} x {item.quantity}</span>
                                <span className="font-mono">{formatPrice(item.product.price * item.quantity)}</span>
                            </div>
                        ))}
                    </div>
                     <p className="text-sm font-bold text-right pt-2">Total: {formatPrice(order.totalPrice)}</p>
                </div>
                 <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2"><Clipboard/> Payment & Status</h3>
                    <div className="flex items-center gap-2">
                        <Label>Current Status:</Label>
                        <Badge variant={statusVariant[order.status]}>{order.status}</Badge>
                    </div>
                     <div className="text-sm">
                        <Label>M-Pesa Code:</Label>
                        <p className="font-mono bg-muted p-2 rounded-md">{order.mpesaCode}</p>
                    </div>
                    <div>
                        <Label htmlFor="status-update">Update Status</Label>
                        <div className="flex gap-2">
                            <Select onValueChange={(value) => handleUpdateStatus(value as OrderStatus)}>
                                <SelectTrigger id="status-update"><SelectValue placeholder="Change status..." /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Processing"><Check className="mr-2 h-4 w-4 text-green-500" /> Mark as Verified & Processing</SelectItem>
                                    <SelectItem value="On Hold"><X className="mr-2 h-4 w-4 text-orange-500" /> Place On Hold</SelectItem>
                                    <SelectItem value="Shipped"><Truck className="mr-2 h-4 w-4 text-blue-500"/> Mark as Shipped</SelectItem>
                                    <SelectItem value="Delivered"><Check className="mr-2 h-4 w-4 text-primary" /> Mark as Delivered</SelectItem>
                                    <SelectItem value="Cancelled"><X className="mr-2 h-4 w-4 text-red-500"/> Cancel Order</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
            </DialogFooter>
        </DialogContent>
    )
}

export default function OrdersPage() {
    const { orders, isLoading } = useOrders();
    const [selectedOrder, setSelectedOrder] = useState<Order | undefined>(undefined);
    
    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <ListOrdered className="w-8 h-8" />
                    Order Management
                </h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>All Orders</CardTitle>
                    <CardDescription>Verify payments and manage order fulfillment.</CardDescription>
                    <div className="pt-4 flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input placeholder="Search by Order ID or Patient..." className="pl-10 max-w-sm" />
                        </div>
                         <Button variant="outline"><Filter className="mr-2 h-4 w-4" /> Filter by Status</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex items-center justify-center h-48">
                           <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order ID</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Total</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.map((order) => (
                                    <TableRow key={order.id} onClick={() => setSelectedOrder(order)} className="cursor-pointer">
                                        <TableCell className="font-mono font-semibold">{order.orderId}</TableCell>
                                        <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell>{order.name}</TableCell>
                                        <TableCell>{formatPrice(order.totalPrice)}</TableCell>
                                        <TableCell><Badge variant={statusVariant[order.status]}>{order.status}</Badge></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            <Dialog open={!!selectedOrder} onOpenChange={(isOpen) => !isOpen && setSelectedOrder(undefined)}>
                {selectedOrder && <OrderDetailsDialog order={selectedOrder} onOpenChange={(isOpen) => !isOpen && setSelectedOrder(undefined)} />}
            </Dialog>
        </div>
    );
}
