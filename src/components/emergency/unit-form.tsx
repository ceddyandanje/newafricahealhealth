
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { type EmergencyUnit } from '@/lib/types';

const formSchema = z.object({
  type: z.enum(['Ground', 'Air', 'Motorbike Medic', 'Other']),
  licensePlate: z.string().min(2, "License plate is required"),
  capacity: z.coerce.number().min(1, "Capacity must be at least 1"),
  responseTime: z.coerce.number().min(1, "Response time must be positive"),
  hasLifeSupport: z.boolean(),
  status: z.enum(['Available', 'En Route', 'At Scene', 'Transporting', 'At Hospital', 'Unavailable']),
  stationedLocation: z.string().min(3, "Station location is required"),
});

interface UnitFormProps {
    unit?: EmergencyUnit;
    onSave: (data: Omit<EmergencyUnit, 'id' | 'providerId' | 'createdAt' | 'updatedAt'>) => void;
    onCancel: () => void;
}

export default function UnitForm({ unit, onSave, onCancel }: UnitFormProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: unit || {
            type: 'Ground',
            licensePlate: '',
            capacity: 1,
            responseTime: 15,
            hasLifeSupport: false,
            status: 'Available',
            stationedLocation: ''
        },
    });

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        onSave(values);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto p-1">
                <div className="grid grid-cols-2 gap-4">
                     <FormField control={form.control} name="type" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Unit Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                <SelectContent>
                                    <SelectItem value="Ground">Ground</SelectItem>
                                    <SelectItem value="Air">Air</SelectItem>
                                    <SelectItem value="Motorbike Medic">Motorbike Medic</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )} />
                     <FormField control={form.control} name="licensePlate" render={({ field }) => (
                        <FormItem><FormLabel>License Plate / ID</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
                
                 <FormField control={form.control} name="stationedLocation" render={({ field }) => (
                    <FormItem><FormLabel>Stationed Location</FormLabel><FormControl><Input {...field} placeholder="e.g. HQ, Wilson Airport" /></FormControl><FormMessage /></FormItem>
                )} />

                 <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="capacity" render={({ field }) => (
                        <FormItem><FormLabel>Patient Capacity</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="responseTime" render={({ field }) => (
                        <FormItem><FormLabel>Avg. Response (mins)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>

                <FormField control={form.control} name="status" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Current Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                                {['Available', 'En Route', 'At Scene', 'Transporting', 'At Hospital', 'Unavailable'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )} />

                 <FormField control={form.control} name="hasLifeSupport" render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                        <div className="space-y-1 leading-none">
                            <FormLabel>Advanced Life Support</FormLabel>
                            <FormMessage />
                        </div>
                    </FormItem>
                )} />
                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                    <Button type="submit">Save Unit</Button>
                </div>
            </form>
        </Form>
    );
}
