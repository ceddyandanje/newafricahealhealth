
'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowRight } from 'lucide-react';
import { type User } from '@/lib/types';
import { type Availability, getDoctorAvailability } from '@/lib/availability';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { type ServiceCategory } from '@/lib/serviceCategories';

interface AppointmentDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  doctors: User[];
  initialSpecialty?: ServiceCategory | null;
}

export default function AppointmentDialog({ isOpen, onOpenChange, doctors, initialSpecialty }: AppointmentDialogProps) {
  const [step, setStep] = useState(1);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [availability, setAvailability] = useState<Availability | null>(null);
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const { toast } = useToast();

  const filteredDoctors = initialSpecialty 
    ? doctors.filter(d => d.specialty === initialSpecialty.name)
    : doctors;

  useEffect(() => {
    // Reset state when dialog is closed or specialty changes
    if (!isOpen) {
      setStep(1);
      setSelectedDoctorId(null);
      setSelectedDate(new Date());
      setAvailability(null);
      setSelectedTime(null);
    } else {
        // If an initial specialty is provided, start at step 2 if there's only one doctor
        if (initialSpecialty && filteredDoctors.length === 1) {
            setSelectedDoctorId(filteredDoctors[0].id);
            setStep(2);
        } else {
            setStep(1);
        }
    }
  }, [isOpen, initialSpecialty, filteredDoctors]);

  useEffect(() => {
    if (selectedDoctorId && selectedDate) {
      setIsLoadingAvailability(true);
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      getDoctorAvailability(selectedDoctorId, formattedDate)
        .then(availData => {
          setAvailability(availData);
          setIsLoadingAvailability(false);
        })
        .catch(err => {
          console.error("Failed to fetch availability", err);
          setIsLoadingAvailability(false);
        });
    }
  }, [selectedDoctorId, selectedDate]);


  const handleSubmit = () => {
    // In a real app, this would create the appointment in Firestore
    console.log({
      doctorId: selectedDoctorId,
      date: selectedDate,
      time: selectedTime,
    });
    toast({
      title: 'Appointment Booked!',
      description: 'Your appointment has been successfully scheduled.',
    });
    onOpenChange(false);
  };

  const doctorName = doctors.find(d => d.id === selectedDoctorId)?.name;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">Book an Appointment</DialogTitle>
          <DialogDescription>
            {initialSpecialty ? `Booking for ${initialSpecialty.name}. ` : ''}
            {step === 1 ? "Select a doctor to see their schedule." : `Booking with ${doctorName}.`}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {step === 1 && (
            <div>
              <Label htmlFor="doctor-select" className="font-semibold mb-2 block">1. Choose your Doctor</Label>
               {filteredDoctors.length > 0 ? (
                    <Select onValueChange={setSelectedDoctorId}>
                        <SelectTrigger id="doctor-select">
                        <SelectValue placeholder="Select a doctor..." />
                        </SelectTrigger>
                        <SelectContent>
                        {filteredDoctors.map(doctor => (
                            <SelectItem key={doctor.id} value={doctor.id}>{doctor.name}</SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
               ) : (
                <div className="text-center text-muted-foreground p-4 border rounded-md">
                    No doctors are available for this specialty right now. Please check back later.
                </div>
               )}
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <Label className="font-semibold mb-2 block text-center">2. Select a Date</Label>
                     <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        className="rounded-md border mx-auto"
                        disabled={{ before: new Date() }}
                    />
                </div>
                 <div className="space-y-2">
                    <Label className="font-semibold mb-2 block text-center">3. Select a Time</Label>
                    {isLoadingAvailability ? (
                        <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin" /></div>
                    ) : availability && availability.isAvailable ? (
                        <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                            {availability.slots.map(slot => (
                                <Button 
                                    key={slot} 
                                    variant={selectedTime === slot ? 'default' : 'outline'}
                                    onClick={() => setSelectedTime(slot)}
                                >
                                    {slot}
                                </Button>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-muted-foreground pt-10">No available slots for this day. Please select another date.</div>
                    )}
                 </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          {step === 1 && <Button onClick={() => setStep(2)} disabled={!selectedDoctorId || filteredDoctors.length === 0}>Next <ArrowRight className="ml-2"/></Button>}
          {step === 2 && (filteredDoctors.length > 1 || !initialSpecialty) && <Button onClick={() => setStep(1)} variant="outline">Back</Button>}
          {step === 2 && <Button onClick={handleSubmit} disabled={!selectedTime || !selectedDate}>Confirm Appointment</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
