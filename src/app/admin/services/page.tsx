
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { ShoppingBag, PlusCircle, Search, Edit, Trash2, LucideIcon } from "lucide-react";
import { serviceCategories as initialServices, serviceCategories } from "@/lib/serviceCategories";
import { type ServiceCategory } from '@/lib/serviceCategories';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { addLog } from '@/lib/logs';
import { addNotification } from '@/lib/notifications';

const serviceSchema = z.object({
  id: z.string().min(2, 'ID is required').regex(/^[a-z0-9-]+$/, 'ID must be lowercase with dashes only'),
  name: z.string().min(3, 'Name is required'),
});

function ServiceForm({ service, onSave, onOpenChange }: { service?: ServiceCategory, onSave: (data: ServiceCategory) => void, onOpenChange: (open: boolean) => void }) {
  const form = useForm<z.infer<typeof serviceSchema>>({
    resolver: zodResolver(serviceSchema),
    defaultValues: service || { id: '', name: '' },
  });

  const handleSubmit = (values: z.infer<typeof serviceSchema>) => {
    // Note: Icon selection is not implemented in this form. Defaulting to a generic icon.
    onSave({ ...values, icon: service?.icon || ShoppingBag });
    onOpenChange(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField control={form.control} name="id" render={({ field }) => (
          <FormItem>
            <FormLabel>Service ID</FormLabel>
            <FormControl><Input {...field} disabled={!!service} placeholder="e.g. custom-service" /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem>
            <FormLabel>Service Name</FormLabel>
            <FormControl><Input {...field} placeholder="e.g. Custom Service" /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <DialogFooter>
          <Button type="submit">Save Service</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceCategory[]>(initialServices);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceCategory | undefined>(undefined);
  const [deletingService, setDeletingService] = useState<ServiceCategory | undefined>(undefined);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const { toast } = useToast();


  const handleSaveService = (service: ServiceCategory) => {
    const isEditing = !!editingService;
    if (isEditing) {
      setServices(services.map(s => s.id === service.id ? service : s));
      addLog('INFO', `Service "${service.name}" was updated.`);
      addNotification({ type: 'system_update', title: 'Service Updated', description: `The service "${service.name}" has been successfully updated.` });
      toast({ title: "Service Updated", description: "The service has been saved." });
    } else {
      setServices([...services, service]);
      addLog('INFO', `New service "${service.name}" was created.`);
      addNotification({ type: 'system_update', title: 'Service Added', description: `A new service, "${service.name}", is now available.` });
      toast({ title: "Service Added", description: "The new service has been added." });
    }
    setEditingService(undefined);
  };

  const handleDeleteService = (service: ServiceCategory) => {
    setServices(services.filter(s => s.id !== service.id));
    addLog('WARN', `Service "${service.name}" was deleted.`);
    addNotification({ type: 'system_update', title: 'Service Deleted', description: `The service "${service.name}" has been removed.` });
    toast({ variant: 'destructive', title: "Service Deleted", description: "The service has been removed." });
    setDeletingService(undefined);
    setIsDeleteConfirmOpen(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <ShoppingBag className="w-8 h-8" />
          Services Management
        </h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
                <Button onClick={() => setEditingService(undefined)}><PlusCircle className="mr-2 h-4 w-4" /> Add Service</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader><DialogTitle>{editingService ? 'Edit Service' : 'Add New Service'}</DialogTitle></DialogHeader>
                <ServiceForm service={editingService} onSave={handleSaveService} onOpenChange={setIsFormOpen} />
            </DialogContent>
        </Dialog>
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
                    <Button variant="ghost" size="icon" onClick={() => { setEditingService(service); setIsFormOpen(true); }}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => { setDeletingService(service); setIsDeleteConfirmOpen(true); }}><Trash2 className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Are you sure?</DialogTitle>
                <DialogDescription>
                    This action cannot be undone. This will permanently delete the service: {deletingService?.name}.
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>Cancel</Button>
                <Button variant="destructive" onClick={() => handleDeleteService(deletingService!)}>Delete</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
