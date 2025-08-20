
'use client';

import { useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, PackageX, AlertTriangle, PackageCheck, PieChart as PieChartIcon, List } from 'lucide-react';
import { type Product } from '@/lib/types';
import { ScrollArea } from '../ui/scroll-area';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Pie, PieChart, Cell } from 'recharts';


interface InventoryStatusDialogProps {
    products: Product[];
    isOpen: boolean;
    onClose: () => void;
}

const StatCard = ({ icon: Icon, value, label, variant }: { icon: React.ElementType, value: string | number, label: string, variant: 'destructive' | 'warning' | 'default' }) => (
    <div className={cn(
        "flex items-center gap-3 p-3 rounded-lg",
        variant === 'destructive' && 'bg-destructive/10 text-destructive',
        variant === 'warning' && 'bg-orange-500/10 text-orange-600',
        variant === 'default' && 'bg-green-500/10 text-green-600'
    )}>
        <Icon className="h-6 w-6" />
        <div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm font-semibold">{label}</p>
        </div>
    </div>
);

function StockStatusTable({ products }: { products: Product[] }) {
    return (
        <ScrollArea className="h-[300px]">
            <Table>
                <TableHeader className="sticky top-0 bg-muted">
                    <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.map(p => {
                        const isLowStock = p.stock > 0 && p.stock <= 10;
                        const isOutOfStock = p.stock === 0;

                        return (
                            <TableRow key={p.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Image src={p.image} alt={p.name} width={40} height={40} className="rounded-md" />
                                        <p className="font-medium">{p.name}</p>
                                    </div>
                                </TableCell>
                                <TableCell>{p.stock}</TableCell>
                                <TableCell>
                                    {isOutOfStock ? (
                                        <Badge variant="destructive">Out of Stock</Badge>
                                    ) : isLowStock ? (
                                        <Badge variant="secondary" className="bg-orange-500/80 text-white">Low Stock</Badge>
                                    ) : (
                                        <Badge>In Stock</Badge>
                                    )}
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </ScrollArea>
    )
}

function InventoryChartView({ data }: { data: { name: string, value: number, fill: string }[] }) {
     return (
        <div className="h-[300px] w-full flex flex-col items-center justify-center">
            <ChartContainer config={{}} className="h-[200px] w-full">
                <PieChart>
                    <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                    <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} labelLine={false}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} stroke={entry.fill} />
                        ))}
                    </Pie>
                </PieChart>
            </ChartContainer>
            <div className="flex flex-wrap justify-center gap-4 mt-4 text-sm">
                {data.map(item => (
                    <div key={item.name} className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full" style={{backgroundColor: item.fill}}></span>
                        <span>{item.name} ({item.value})</span>
                    </div>
                ))}
            </div>
        </div>
    );
}


export default function InventoryStatusDialog({ products, isOpen, onClose }: InventoryStatusDialogProps) {
    const [viewMode, setViewMode] = useState<'table' | 'chart'>('table');

    const { outOfStock, lowStock, inStock, outOfStockCount, lowStockCount, inStockCount } = useMemo(() => {
        const outOfStock: Product[] = [];
        const lowStock: Product[] = [];
        const inStock: Product[] = [];

        products.forEach(p => {
            if (p.stock === 0) {
                outOfStock.push(p);
            } else if (p.stock > 0 && p.stock <= 10) {
                lowStock.push(p);
            } else {
                inStock.push(p);
            }
        });
        return {
            outOfStock,
            lowStock,
            inStock,
            outOfStockCount: outOfStock.length,
            lowStockCount: lowStock.length,
            inStockCount: inStock.length
        }

    }, [products]);
    
    const chartData = [
        { name: 'Out of Stock', value: outOfStockCount, fill: 'hsl(var(--destructive))' },
        { name: 'Low Stock', value: lowStockCount, fill: 'hsl(var(--primary))' },
        { name: 'In Stock', value: inStockCount, fill: 'hsl(var(--chart-2))' }, // Using a chart color
    ];
    
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 font-headline text-2xl">
                        <Package /> Inventory Status
                    </DialogTitle>
                    <DialogDescription>
                        An overview of product stock levels across your inventory.
                    </DialogDescription>
                </DialogHeader>
                
                <div className="py-4 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <StatCard icon={PackageX} value={outOfStockCount} label="Out of Stock" variant="destructive" />
                        <StatCard icon={AlertTriangle} value={lowStockCount} label="Low Stock" variant="warning" />
                        <StatCard icon={PackageCheck} value={inStockCount} label="In Stock" variant="default" />
                    </div>

                     <div className="flex items-center justify-end gap-2">
                        <p className="text-sm font-medium text-muted-foreground mr-2">View:</p>
                        <Button size="icon" variant={viewMode === 'table' ? 'secondary' : 'ghost'} onClick={() => setViewMode('table')}>
                            <List className="h-5 w-5"/>
                        </Button>
                         <Button size="icon" variant={viewMode === 'chart' ? 'secondary' : 'ghost'} onClick={() => setViewMode('chart')}>
                            <PieChartIcon className="h-5 w-5"/>
                        </Button>
                    </div>

                    {viewMode === 'table' ? (
                        <Tabs defaultValue="all">
                            <TabsList className="grid w-full grid-cols-4">
                                <TabsTrigger value="all">All ({products.length})</TabsTrigger>
                                <TabsTrigger value="low">Low Stock ({lowStockCount})</TabsTrigger>
                                <TabsTrigger value="out">Out of Stock ({outOfStockCount})</TabsTrigger>
                                <TabsTrigger value="in">In Stock ({inStockCount})</TabsTrigger>
                            </TabsList>
                            <TabsContent value="all">
                                <StockStatusTable products={products} />
                            </TabsContent>
                            <TabsContent value="low">
                                <StockStatusTable products={lowStock} />
                            </TabsContent>
                            <TabsContent value="out">
                                <StockStatusTable products={outOfStock} />
                            </TabsContent>
                            <TabsContent value="in">
                                <StockStatusTable products={inStock} />
                            </TabsContent>
                        </Tabs>
                    ) : (
                        <InventoryChartView data={chartData} />
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Close</Button>
                     <Button onClick={() => window.location.href = '/admin/products'}>Manage Products</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

