
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
import { Check, Clock, PlusCircle, Trash2 } from 'lucide-react';

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
  const [selectedDates, setSelectedDates] = useState<DateRange | undefined>();
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([{ id: 1, start: '09:00', end: '17:00' }]);
  const [breaks, setBreaks] = useState<TimeSlot[]>([]);
  const [isAllDay, setIsAllDay] = useState(false);
  const [applyRecurring, setApplyRecurring] = useState(false);
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


  const handleSave = () => {
    // In a real app, you would save this data to Firestore
    console.log({
      dates: selectedDates,
      isAllDay,
      timeSlots,
      breaks,
      applyRecurring,
    });
    toast({
      title: 'Availability Updated',
      description: 'Your schedule has been saved successfully.',
    });
    onOpenChange(false);
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
                    {timeSlots.map((slot, index) => (
                         <div key={slot.id} className="flex items-center gap-2">
                            <Input type="time" defaultValue={slot.start} />
                            <span>-</span>
                            <Input type="time" defaultValue={slot.end} />
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
                    {breaks.map((slot, index) => (
                         <div key={slot.id} className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground"/>
                            <Input type="time" defaultValue={slot.start} />
                            <span>-</span>
                            <Input type="time" defaultValue={slot.end} />
                            <Button variant="ghost" size="icon" onClick={() => removeBreak(slot.id)}>
                                <Trash2 className="h-4 w-4 text-destructive"/>
                            </Button>
                        </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={addBreak}><PlusCircle className="mr-2"/> Add Break</Button>
                </div>
              )}

            <div>
              <Label className="font-semibold mb-2 block">3. Recurring (Optional)</Label>
              <div className="flex items-center space-x-2">
                <Switch id="recurring" checked={applyRecurring} onCheckedChange={setApplyRecurring} />
                <Label htmlFor="recurring">Apply to all future selected weekdays</Label>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}><Check className="mr-2"/> Save Availability</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
