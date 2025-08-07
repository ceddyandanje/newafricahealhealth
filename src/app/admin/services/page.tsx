
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { ShoppingBag, PlusCircle, Search, Edit, Trash2 } from "lucide-react";
import { serviceCategories as initialServices } from "@/lib/serviceCategories";
import { type ServiceCategory } from '@/lib/serviceCategories';

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceCategory[]>(initialServices);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <ShoppingBag className="w-8 h-8" />
          Services Management
        </h1>
        <Button><PlusCircle className="mr-2 h-4 w-4" /> Add Service</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Medical Services</CardTitle>
          <CardDescription>Manage the medical services offered on the platform.</CardDescription>
          <div className="pt-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input placeholder="Search services..." className="pl-10 max-w-sm" />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service Name</TableHead>
                <TableHead>Service ID</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell>
                    <div className="flex items-center gap-3 font-semibold">
                      <service.icon className="w-5 h-5 text-primary" />
                      {service.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-sm bg-muted px-2 py-1 rounded">{service.id}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
