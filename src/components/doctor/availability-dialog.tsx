
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { type DateRange } from 'react-day-picker';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Check, Clock, PlusCircle, Trash2, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { saveAvailability } from '@/lib/availability';

interface AvailabilityDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

interface TimeSlot {
  id: number;
  start: string;
  end: string;
}

export default function AvailabilityDialog({ isOpen, onOpenChange }: AvailabilityDialogProps) {
  const { user } = useAuth();
  const [selectedDates, setSelectedDates] = useState<DateRange | undefined>();
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([{ id: 1, start: '09:00', end: '17:00' }]);
  const [breaks, setBreaks] = useState<TimeSlot[]>([{ id: Date.now(), start: '12:00', end: '13:00' }]);
  const [isAllDay, setIsAllDay] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const addTimeSlot = () => {
    setTimeSlots([...timeSlots, { id: Date.now(), start: '', end: '' }]);
  };

  const removeTimeSlot = (id: number) => {
    setTimeSlots(timeSlots.filter(slot => slot.id !== id));
  };

  const addBreak = () => {
    setBreaks([...breaks, { id: Date.now(), start: '12:00', end: '13:00' }]);
  };

  const removeBreak = (id: number) => {
    setBreaks(breaks.filter(b => b.id !== id));
  };

  const handleSave = async () => {
    if (!user || !selectedDates?.from) {
        toast({
            variant: 'destructive',
            title: 'Incomplete Information',
            description: 'Please select at least one date to set your availability.',
        });
        return;
    }

    setIsSubmitting(true);
    try {
        await saveAvailability({
            doctorId: user.id,
            dateRange: selectedDates,
            isAllDay,
            timeSlots: timeSlots.map(t => ({ startTime: t.start, endTime: t.end })),
            breaks: breaks.map(b => ({ startTime: b.start, endTime: b.end })),
        });

        toast({
            title: 'Availability Updated',
            description: 'Your schedule has been saved successfully.',
        });
        onOpenChange(false);
    } catch (error) {
        console.error("Failed to save availability:", error);
        toast({
            variant: 'destructive',
            title: 'Save Failed',
            description: 'Could not save your availability. Please try again.',
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Set Your Availability</DialogTitle>
          <DialogDescription>
            Select dates and define your working hours. Patients will only be able to book you during these times.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div>
            <Label className="font-semibold mb-2 block text-center">1. Select Date(s)</Label>
            <Calendar
              mode="range"
              selected={selectedDates}
              onSelect={setSelectedDates}
              className="rounded-md border mx-auto"
              disabled={{ before: new Date() }}
            />
          </div>
          <div className="space-y-4">
            <div>
              <Label className="font-semibold mb-2 block">2. Define Hours</Label>
              <div className="flex items-center space-x-2 mb-4">
                <Switch id="all-day" checked={isAllDay} onCheckedChange={setIsAllDay} />
                <Label htmlFor="all-day">I'm unavailable for the entire day(s)</Label>
              </div>

              {!isAllDay && (
                <div className="space-y-2">
                    <Label className="text-sm font-medium">Working Hours</Label>
                    {timeSlots.map((slot) => (
                         <div key={slot.id} className="flex items-center gap-2">
                            <Input type="time" defaultValue={slot.start} onChange={e => slot.start = e.target.value} />
                            <span>-</span>
                            <Input type="time" defaultValue={slot.end} onChange={e => slot.end = e.target.value} />
                            <Button variant="ghost" size="icon" onClick={() => removeTimeSlot(slot.id)} disabled={timeSlots.length <= 1}>
                                <Trash2 className="h-4 w-4 text-destructive"/>
                            </Button>
                        </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={addTimeSlot}><PlusCircle className="mr-2"/> Add Slot</Button>
                </div>
              )}
            </div>

             {!isAllDay && (
                <div className="space-y-2">
                    <Label className="text-sm font-medium">Breaks</Label>
                    {breaks.map((slot) => (
                         <div key={slot.id} className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground"/>
                            <Input type="time" defaultValue={slot.start} onChange={e => slot.start = e.target.value} />
                            <span>-</span>
                            <Input type="time" defaultValue={slot.end} onChange={e => slot.end = e.target.value} />
                            <Button variant="ghost" size="icon" onClick={() => removeBreak(slot.id)}>
                                <Trash2 className="h-4 w-4 text-destructive"/>
                            </Button>
                        </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={addBreak}><PlusCircle className="mr-2"/> Add Break</Button>
                </div>
              )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 animate-spin"/> : <Check className="mr-2"/>} 
            Save Availability
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
