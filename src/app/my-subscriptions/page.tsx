
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Repeat, Package, Calendar, RefreshCcw } from "lucide-react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

// This is still placeholder data. In a real app, this would come from Firestore.
const subscriptions = [
    {
        id: 'sub1',
        productName: 'Digital Blood Pressure Monitor',
        productImage: 'https://images.unsplash.com/photo-1616027393583-1d625346e92b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxibG9vJTIwcHJlc3N1cmUlMjBtb25pdG9yfGVufDB8fHx8MTc1NDE5NDQzOHww&ixlib=rb-4.1.0&q=80&w=1080',
        dataAiHint: 'blood pressure monitor',
        status: 'Active',
        deliveryInterval: 'Every 3 months',
        nextDelivery: '2024-10-15',
    },
    {
        id: 'sub2',
        productName: 'Tacrolimus (Immunosuppressant)',
        productImage: 'https://images.unsplash.com/photo-1584308666744-8480404b63ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxwcmVzY3JpcHRpb24lMjBtZWRpY2luZSUyMGJvdHRsZXxlbnwwfHx8fDE3NTQxOTQ0NDh8MA&ixlib=rb-4.1.0&q=80&w=1080',
        dataAiHint: 'prescription medicine bottle',
        status: 'Paused',
        deliveryInterval: 'Every 1 month',
        nextDelivery: 'N/A',
    },
];


export default function MySubscriptionsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
             <header className="text-center mb-8">
                <h1 className="text-4xl font-bold font-headline flex items-center justify-center gap-3"><Repeat /> My Subscriptions</h1>
                <p className="text-muted-foreground mt-2">Manage your recurring deliveries and automated refills.</p>
            </header>
             {subscriptions.length > 0 ? (
                <div className="space-y-6">
                    {subscriptions.map(sub => (
                        <Card key={sub.id} className="glassmorphic overflow-hidden">
                            <CardContent className="p-4 flex items-center gap-4">
                                 <Image src={sub.productImage} alt={sub.productName} width={100} height={100} className="rounded-md" data-ai-hint={sub.dataAiHint}/>
                                <div className="flex-grow">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-semibold">{sub.productName}</h3>
                                        <Badge variant={sub.status === 'Active' ? 'default' : 'secondary'}>{sub.status}</Badge>
                                    </div>
                                    <div className="text-sm text-muted-foreground space-y-1 mt-2">
                                        <p className="flex items-center gap-2"><Package className="w-4 h-4"/> {sub.deliveryInterval}</p>
                                        <p className="flex items-center gap-2"><Calendar className="w-4 h-4"/> Next delivery: {sub.status === 'Active' ? new Date(sub.nextDelivery).toLocaleDateString() : 'N/A'}</p>
                                    </div>
                                </div>
                            </CardContent>
                            <div className="bg-muted/30 px-4 py-2 flex justify-end gap-2">
                                <Button variant="ghost" size="sm">Manage</Button>
                                <Button variant="outline" size="sm">Skip Next</Button>
                            </div>
                        </Card>
                    ))}
                </div>
             ) : (
                <Card className="glassmorphic">
                    <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                        <Repeat className="w-16 h-16 text-muted-foreground mb-4"/>
                        <h2 className="text-xl font-semibold">No Active Subscriptions</h2>
                        <p className="text-muted-foreground mt-2 mb-6">You can create a subscription for eligible products from the product page.</p>
                        <Button asChild><Link href="/products">Browse Products</Link></Button>
                    </CardContent>
                </Card>
             )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
