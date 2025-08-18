
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { type HealthMetric, type HealthMetricType } from '@/lib/types';
import { metricOptions } from '@/app/patient/dashboard/page';
import { useToast } from '@/hooks/use-toast';

interface AddMetricDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  metricType: HealthMetricType;
  onSave: (metricData: Omit<HealthMetric, 'id' | 'timestamp'>) => Promise<void>;
  userId: string;
}

const getMetricSchema = (metricType: HealthMetricType) => {
  const baseSchema = {
    value: z.coerce.number().min(1, 'Please enter a valid number.'),
  };
  if (metricType === 'bloodPressure') {
    return z.object({
      ...baseSchema,
      value2: z.coerce.number().min(1, 'Please enter a valid number.'),
    });
  }
  return z.object(baseSchema);
};


export default function AddMetricDialog({ isOpen, onOpenChange, metricType, onSave, userId }: AddMetricDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const metricInfo = metricOptions.find(m => m.value === metricType);
  const metricSchema = getMetricSchema(metricType);

  const form = useForm<z.infer<typeof metricSchema>>({
    resolver: zodResolver(metricSchema),
    defaultValues: metricType === 'bloodPressure' ? { value: undefined, value2: undefined } : { value: undefined },
    // We reset the form on type change
    values: metricType === 'bloodPressure' ? { value: undefined, value2: undefined } : { value: undefined },
  });
  
  const handleSubmit = async (values: z.infer<typeof metricSchema>) => {
    setIsSubmitting(true);
    try {
        const payload: Omit<HealthMetric, 'id' | 'timestamp'> = {
            type: metricType,
            value: values.value,
        };
        if (metricType === 'bloodPressure') {
            payload.value2 = values.value2;
        }

        await onSave(payload);
        toast({ title: 'Metric Saved', description: `${metricInfo?.label} has been logged successfully.` });
        onOpenChange(false);
        form.reset();

    } catch (error) {
        console.error("Failed to save metric:", error);
        toast({ variant: 'destructive', title: 'Save Failed', description: 'Could not save the metric. Please try again.' });
    } finally {
        setIsSubmitting(false);
    }
  };

  if (!metricInfo) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) form.reset();
      onOpenChange(open);
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New {metricInfo.label} Reading</DialogTitle>
          <DialogDescription>
            Enter your latest measurement below. This will be added to your health trends.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-4">
            {metricType === 'bloodPressure' ? (
                <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="value" render={({ field }) => (
                        <FormItem><FormLabel>Systolic (Top #)</FormLabel><FormControl><Input type="number" {...field} placeholder="e.g. 120" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="value2" render={({ field }) => (
                        <FormItem><FormLabel>Diastolic (Bottom #)</FormLabel><FormControl><Input type="number" {...field} placeholder="e.g. 80" /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
            ) : (
                <FormField control={form.control} name="value" render={({ field }) => (
                    <FormItem><FormLabel>Value</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
            )}
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Metric
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

